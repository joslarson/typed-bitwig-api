import download from 'download';
import fs from 'fs';
import path from 'path';
const spawn = require('child_process').spawnSync;

import pkg from '../package.json';
import { build } from './build';

const API_VERSION = parseInt(pkg.version.split('.')[0]);

function downloadApiSource(version: number) {
  return download(
    `https://maven.bitwig.com/com/bitwig/extension-api/${version}/extension-api-${version}-sources.jar`,
    'java_source',
    { extract: true }
  );
}

async function main(fullBuild = true) {
  if (fullBuild) {
    console.log('full build...');

    fs.rmSync('java_source', { recursive: true, force: true });

    try {
      await downloadApiSource(API_VERSION);
      fs.rmSync('java_source/com/bitwig/flt', { recursive: true, force: true });
    } catch (e) {
      console.error(`Error: Unable to fetch API v${API_VERSION} source files.`);
      return;
    }
  } else {
    console.log('minimal build...');
  }

  await build();

  console.log('done.');
}

main(process.argv.slice(2).indexOf('-t') === -1);
