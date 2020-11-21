import { AnyCstNode } from '../types';
import { visit } from '../visit';

export function renderEnumDeclarations(node: AnyCstNode) {
  const enumDecs = visit(node, 'enumDeclaration');

  const enums = enumDecs
    .map((ed) => {
      const name = ed.typeIdentifier?.[0].children.Identifier?.[0].image;
      const body = ed.enumBody?.[0].children.enumConstantList?.[0].children.enumConstant
        ?.map((c, i) => `${c.children.Identifier?.[0].image} = ${i},`)
        .join('\n');
      return `enum ${name} {\n${body}\n}\n`;
    })
    .join('\n');

  return enums;
}
