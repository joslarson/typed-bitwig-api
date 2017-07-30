const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawnSync;
const prettier = require('prettier');

const pkg = require('./package.json');
const tspkg = require('typescript/package.json');

const API_VERSION = parseInt(String(fs.readFileSync('API_VERSION')));

fs.removeSync('interfaces');

function downloadApiSource(version) {
    return download(
        `https://maven.bitwig.com/com/bitwig/extension-api/${version}/extension-api-${version}-sources.jar`,
        'interfaces',
        { extract: true }
    );
}

function buildTypesDefinition() {
    // replace API Java source files
    fs.removeSync(path.join('jsweet-project', 'src', 'main', 'java', 'com'));
    fs.copySync(path.join('interfaces'), path.join('jsweet-project', 'src', 'main', 'java'));

    // rebuild d.ts file
    process.chdir('jsweet-project');
    spawn('mvn', ['generate-sources'], { stderr: 'inherit' });
    process.chdir('../');

    // cleanup uneeded namespacing
    let types = String(fs.readFileSync(path.join('jsweet-project', 'target', 'dts', 'bundle.d.ts')))
        .replace(/com\.bitwig\.extension[a-z\.]*\.([A-Z])/g, (match, p1) => p1)
        .replace(/com\.bitwig\.extension[a-z\.]*/g, 'API')
        .replace(/declare namespace API \{/g, '')
        .replace(/\n}/gm, '')
        .trim();

    types = `\
// Type definitions for Bitwig Studio ${pkg.version
        .split('.')
        .splice(0, 2)
        .join('.')} Control Surface Scripting API 
// Project: https://bitwig.com
// Definitions by: Joseph Larson <https://github.com/joslarson/>
// TypeScript Version: ${tspkg.version}

declare namespace API {
    ${types}
}

declare const host: API.ControllerHost;
declare const loadAPI: typeof host.loadAPI;
declare const load: typeof host.load;
declare const println: typeof host.println;
declare const errorln: typeof host.errorln;
declare function dump(obj: any): void;
`;

    // format using prettier
    types = prettier.format(types, {
        parser: 'typescript',
        printWidth: 100,
        tabWidth: 4,
        singleQuote: true,
        trailingComma: 'es5',
    });

    // write the modified types to the output file
    fs.writeFileSync('bitwig-api.d.ts', types);
}

downloadApiSource(API_VERSION + 1)
    .then(() => {
        fs.writeFileSync('API_VERSION', `${API_VERSION + 1}`);
    })
    .catch(() =>
        downloadApiSource(API_VERSION).then(() => {
            console.log('API_VERSION', API_VERSION);
        })
    )
    .then(() => {
        buildTypesDefinition();
        console.log('done.');
    });
