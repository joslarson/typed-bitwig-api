import { UnannTypeCstNode } from 'java-parser';
import { visit } from '../../visit';
import { getTypeArgs, typeOverrides } from '../util';

export const renderUnannType = (node: UnannTypeCstNode) => {
  if (node.children.unannPrimitiveType?.[0]) {
    return node.children.unannPrimitiveType[0].children.Boolean?.[0]
      ? 'boolean'
      : 'number';
  } else if (node.children.unannReferenceType?.[0]) {
    const name = visit(node, 'unannClassType')?.[0].Identifier?.[0].image;
    const typeArgs = getTypeArgs(node);
    const isArrayOfType = node.children.unannReferenceType?.[0].children.dims;

    if (!name) throw new Error('unann type name not found');

    return `${typeOverrides[name] || `${name}${typeArgs}`}${
      isArrayOfType ? '[]' : ''
    }`;
  } else {
    throw new Error('Unhandled unann type');
  }
};
