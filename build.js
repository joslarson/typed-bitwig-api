const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawnSync;
const prettier = require('prettier');

const pkg = require('./package.json');
const tspkg = require('typescript/package.json');

const API_VERSION = 5;
const DTS_SRC = path.join('jsweet_project', 'target', 'dts', 'bundle.d.ts');

function downloadApiSource(version) {
    return download(
        `https://maven.bitwig.com/com/bitwig/extension-api/${version}/extension-api-${version}-sources.jar`,
        'java_source',
        { extract: true }
    );
}

function buildJsweet() {
    // replace API Java source files
    fs.removeSync(path.join('jsweet_project', 'src', 'main', 'java', 'com'));
    fs.copySync(path.join('java_source'), path.join('jsweet_project', 'src', 'main', 'java'));

    // rebuild d.ts file
    process.chdir('jsweet_project');
    spawn(
        'mvn',
        ['generate-sources']
        // { stdio: 'inherit' }
    );
    process.chdir('../');
}

function fixCallbacks(dtsString) {
    const callbackStart = /interface [A-Za-z]*?Callback(?:<[a-zA-Z\[\]]*>)? (?:extends [A-Za-z]+(?:<[a-zA-Z\[\]]*>)? ){$/;
    const methodSigniture = /^        [a-z][a-zA-z]+(\(.+;)/;

    let isCallback = false;

    return dtsString
        .split('\n')
        .map(line => {
            if (!isCallback && line.match(callbackStart)) isCallback = true;
            if (isCallback && line === '    }') isCallback = false;
            if (isCallback) {
                if (line.match(methodSigniture)) {
                    line = line.replace(methodSigniture, (match, p1) => `        ${p1}`);
                }
            }
            return line;
        })
        .join('\n');
}

function fixValueTypes(dtsString) {
    const valueTypeStart = /^    interface.+(?:extends )?Value\<([A-Z][a-zA-Z]+)/;

    let callbackType,
        isValueInterface = false;

    return dtsString
        .split('\n')
        .map(line => {
            const matches = valueTypeStart.exec(line);
            if (!isValueInterface && matches) {
                isValueInterface = true;
                callbackType = matches[1];
            }
            if (isValueInterface && line === '    }') isValueInterface = false;
            if (isValueInterface && line.indexOf('callback?: any') > -1) {
                line = line.replace('callback?: any', `callback: ${callbackType}`);
            }
            return line;
        })
        .join('\n');
}

function transformJsweetOutput(input) {
    // cleanup uneeded namespacing
    let result = input
        .replace(/com\.bitwig\.extension[a-z\.]*\.([A-Z])/g, (match, p1) => p1)
        .replace(/com\.bitwig\.extension[a-z\.]*/g, 'API')
        .replace(/declare namespace API \{/g, '')
        .replace(/\n}/gm, '')
        .trim();

    // fix callback signitures to be callable
    result = fixCallbacks(result);

    // fix value observer methods
    result = fixValueTypes(result);

    result = `\
// Type definitions for Bitwig Studio's Control Surface API v${API_VERSION}
// Project: https://bitwig.com
// Definitions by: Joseph Larson <https://github.com/joslarson/>
// TypeScript Version: ${tspkg.version}

declare namespace API {
    ${result}
}

declare const host: API.ControllerHost;
declare const loadAPI: typeof host.loadAPI;
declare const load: typeof host.load;
declare const println: typeof host.println;
declare const errorln: typeof host.errorln;
declare function dump(obj: any): void;
`;

    // format using prettier
    result = prettier.format(result, {
        parser: 'typescript',
        printWidth: 100,
        tabWidth: 4,
        singleQuote: true,
        trailingComma: 'es5',
    });

    return result;
}

async function build(fullBuild = true) {
    if (fullBuild) {
        console.log('full build...');

        fs.removeSync('java_source');

        try {
            await downloadApiSource(API_VERSION);
            fs.removeSync('java_source/com/bitwig/flt');
        } catch (e) {
            console.error(`Error: Unable to fetch API v${API_VERSION} source files.`);
            return;
        }

        buildJsweet();

        const result = transformJsweetOutput(String(fs.readFileSync(DTS_SRC)));
        fs.writeFileSync('bitwig-api.d.ts', result);
        console.log('done.');
    } else {
        console.log('minimal build...');
        const result = transformJsweetOutput(String(fs.readFileSync(DTS_SRC)));
        fs.writeFileSync('bitwig-api.d.ts', result);
        console.log('done.');
    }
}

build(process.argv.slice(2).indexOf('-t') === -1);
