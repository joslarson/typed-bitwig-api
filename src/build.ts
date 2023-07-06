import * as fs from 'fs';
import * as path from 'path';

import tspkg from 'typescript/package.json';
import { parse } from 'java-parser';
import prettier from 'prettier';

import pkg from '../package.json';
import { visit } from './visit';
import { renderTypeDeclarations } from './renderers/renderTypeDeclarations';
import { renderImportDeclarations } from './renderers/renderImportDeclarations';
import { applyMods } from './mods';
import { renderEnumDeclarations } from './renderers/renderEnumDeclarations';

const STD_OUT = Symbol('STD_OUT');

function convert(src: string, dest?: typeof STD_OUT | string) {
  const sourceCode = fs.readFileSync(src).toString();
  const rootNode = parse(sourceCode);
  const ordinaryCompilationUnits = visit(rootNode, 'ordinaryCompilationUnit');
  const { packageDeclaration, importDeclaration, typeDeclaration } =
    ordinaryCompilationUnits?.[0] || {};

  const namespace = packageDeclaration?.[0].children.Identifier?.map(
    (id) => id.image
  ).join('.');

  const children = [
    renderImportDeclarations(importDeclaration),
    renderEnumDeclarations(rootNode),
    renderTypeDeclarations(typeDeclaration),
  ]
    .filter((c) => c)
    .join('\n');

  let result = namespace
    ? `declare namespace ${namespace} {\n${children}}\n`
    : children;

  result = prettier.format(result, {
    parser: 'typescript',
    singleQuote: true,
  });

  if (dest) {
    if (dest === STD_OUT) {
      console.log(result);
    } else {
      fs.writeFileSync(dest, result);
    }
  }

  return result;
}

function convertAll(src: string, dest: string) {
  const files = fs.readdirSync(src);
  files.forEach(function (file) {
    const newSrc = path.join(src, file);
    const newDest = path.join(dest, file);
    if (fs.statSync(newSrc).isDirectory()) {
      convertAll(newSrc, newDest);
    } else {
      if (file.endsWith('.java')) {
        if (file.endsWith('Exception.java')) {
          return;
        }
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const from = newSrc;
        const to = newDest.replace('.java', '.d.ts');
        console.log(
          '◍ ./' +
            path.relative(path.join(__dirname, '..'), from) +
            '\n' +
            '┗━━━━►  ./' +
            path.relative(path.join(__dirname, '..'), to)
        );
        convert(newSrc, newDest.replace('.java', '.d.ts'));
        console.log('');
      }
    }
  });
}

type Declaration = {
  filename: string;
  filePath: string;
  namespace: string;
  declaration: string;
};

function getDeclarations(src: string): Declaration[] {
  const declarations: Declaration[] = [];

  for (const nodeName of fs.readdirSync(src)) {
    const nodePath = path.join(src, nodeName);
    if (fs.statSync(nodePath).isDirectory()) {
      declarations.push(...getDeclarations(nodePath));
    } else if (nodeName.endsWith('.d.ts')) {
      const fullDeclaration = fs.readFileSync(nodePath, 'utf-8');
      const namespace = fullDeclaration.match(/namespace (.+) {/m)?.[1];
      const declarationSansNamespace = fullDeclaration
        .trim()
        .split('\n')
        .slice(1, -1)
        .join('\n');
      if (!namespace) throw new Error('Unable to find namespace');
      declarations.push({
        filename: nodeName,
        filePath: nodePath.split(path.join(__dirname, '..', 'types') + '/')[1],
        namespace,
        declaration: declarationSansNamespace,
      });
    }
  }

  return declarations;
}

function bundleDeclarations(srcDir: string, outFile: string) {
  const declarations = getDeclarations(srcDir).reduce<{
    [namespace: string]: Declaration[];
  }>((acc, dec) => {
    if (!acc[dec.namespace]) acc[dec.namespace] = [];
    acc[dec.namespace].push(dec);
    return acc;
  }, {});

  const namespaces = Object.keys(declarations).sort();
  let result = `\
// Type definitions for Bitwig Studio Control Surface Scripting API v${
    pkg.version.split('.')[0]
  }
// Project: https://bitwig.com
// Definitions by: Joseph Larson <https://github.com/joslarson>
// TypeScript Version: ${tspkg.version}\n\n`;

  result += namespaces
    .map((ns) => {
      const nsDeclarations = declarations[ns]
        .sort((a, b) => a.filename.localeCompare(b.filename))
        .map((dec) => {
          const comment = `// source: ${dec.filePath.replace(
            '.d.ts',
            '.java'
          )}`;
          return `${comment}\n\n${dec.declaration}\n`;
        })
        .join('\n\n');

      // remove duplicate imports
      const imports = new Set<string>();
      const dedupedImports = nsDeclarations
        .split('\n')
        .filter((l) => {
          const trimmedL = l.trim();
          const importMatches = /^import \S+ = (\S+);/.exec(trimmedL);

          // skip non import lines
          if (!importMatches) return true;

          // Remove imports from the current namespace as they are not needed and conflict with the definition when bundling
          // Example: pulls 'com.bitwig.extension.api.graphics' out of
          // 'import GraphicsOutput = com.bitwig.extension.api.graphics.GraphicsOutput'
          const importNs = importMatches[1].split('.').slice(0, -1).join('.');
          if (importNs === ns) return false;

          // Remove duplicate imports within a namespace
          if (imports.has(trimmedL)) {
            return false;
          } else {
            imports.add(trimmedL);
            return true;
          }
        })
        .join('\n');

      return `declare namespace ${ns} {\n${dedupedImports}\n}\n`;
    })
    .join('\n');
  result =
    result +
    '\n' +
    fs.readFileSync(
      path.join(__dirname, '..', 'src', 'additional-types.d.ts.template'),
      'utf-8'
    );
  try {
    result = prettier.format(result, {
      parser: 'typescript',
      singleQuote: true,
    });
  } catch (e) {
    console.error('Failed to prettify:', e);
  }
  fs.writeFileSync(outFile, result);
}

const SRC_DIR = path.join(__dirname, '..', 'java_source');
const DEST_DIR = path.join(__dirname, '..', 'types');

export async function build() {
  convertAll(SRC_DIR, DEST_DIR);
  applyMods();
  bundleDeclarations(DEST_DIR, path.join(__dirname, '..', 'bitwig-api.d.ts'));
  fs.rmSync(DEST_DIR, { recursive: true });

  console.log('Bundled into bitwig-api.d.ts');
}

if (require.main === module) build();
