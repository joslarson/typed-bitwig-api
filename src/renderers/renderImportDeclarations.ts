import { CstNode } from 'chevrotain';
import { ImportDeclarationCstNode } from 'java-parser';
import { visit } from '../visit';
import { ignoredImports } from './util';

export function renderImportDeclarations(nodes?: ImportDeclarationCstNode[]) {
  if (!nodes) return '';

  const imports = nodes.map((node) =>
    visit(node as CstNode, 'packageOrTypeName')[0].Identifier.map(
      (id) => id.image
    )
  );
  return imports
    .map((parts) => {
      const importPathString = parts.join('.').replace('.function.', '.func.');
      if (ignoredImports.includes(importPathString)) {
        return '';
      }
      return `import ${parts.slice(-1)[0]} = ${importPathString};\n`;
    })
    .join('');
}
