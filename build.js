const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawnSync;

const API_VERSION = parseInt(String(fs.readFileSync('API_VERSION')));

fs.removeSync('interfaces');

function downloadApiSource(version) {
    return download(
        `https://maven.bitwig.com/com/bitwig/extension-api/${version}/extension-api-${version}-sources.jar`,
        'interfaces',
        {
            extract: true,
        }
    );
}

function buildTypesDefinition(callback) {
    fs.removeSync(path.join('jsweet-project', 'src', 'main', 'java', 'com'));
    fs.copySync(path.join('interfaces'), path.join('jsweet-project', 'src', 'main', 'java'));
    process.chdir('jsweet-project');
    spawn('mvn', ['generate-sources'], { stdio: 'inherit' });
    process.chdir('../');
    fs.copySync(path.join('jsweet-project', 'target', 'dts', 'bundle.d.ts'), 'bitwig-api.d.ts');
    fs.writeFileSync(
        'bitwig-api.d.ts',
        `declare namespace API {${String(fs.readFileSync('bitwig-api.d.ts'))
            .replace(/com\.bitwig\.extension[a-z\.]*\.([A-Z])/g, (match, p1) => p1)
            .replace(/com\.bitwig\.extension[a-z\.]*/g, 'API')
            .replace(/declare namespace API \{/g, '')
            .replace(/\n}/gm, '')}}`
    );
    callback();
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
        buildTypesDefinition(() => console.log('done.'));
    });
