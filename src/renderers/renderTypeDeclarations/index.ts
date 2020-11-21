import {
  ConstructorDeclarationCstNode,
  InterfaceMethodDeclarationCstNode,
  MethodDeclarationCstNode,
  ResultCtx,
  TypeDeclarationCstNode,
} from 'java-parser';
import { AnyCstNode } from '../../types';
import { visit } from '../../visit';
import { getTypeArgs, typeOverrides } from '../util';
import { renderUnannType } from './renderUnannType';

const getTypeKind = (
  node: TypeDeclarationCstNode
): 'interface' | 'class' | 'enum' => {
  if (node.children.interfaceDeclaration) {
    return 'interface';
  } else if (
    node.children.classDeclaration?.[0].children.normalClassDeclaration
  ) {
    return 'class';
  } else if (node.children.classDeclaration?.[0].children.enumDeclaration) {
    return 'enum';
  } else {
    throw new Error('Unhandled type kind');
  }
};

const getTypeDocstring = (node: TypeDeclarationCstNode) => {
  return node.leadingComments?.[0]?.image as string | undefined;
};

const getTypeParams = (node: AnyCstNode): string => {
  const typeParams = visit(node, 'typeParameter');
  const params = typeParams
    .map((tp) => {
      const paramName = tp.typeIdentifier?.[0].children.Identifier?.[0].image;
      const extendsName =
        tp.typeBound?.[0].children.classOrInterfaceType?.[0].children
          .classType?.[0].children.Identifier?.[0].image;
      const extendsArgs = extendsName
        ? getTypeArgs(
            tp.typeBound?.[0].children.classOrInterfaceType?.[0].children
              .classType?.[0]!
          )
        : '';

      return `${paramName}${
        extendsName
          ? ` extends ${extendsName}${extendsArgs} = ${extendsName}${extendsArgs}`
          : ''
      }`;
    })
    .join(', ');

  return params ? `<${params}>` : '';
};

const getTypeName = (node: TypeDeclarationCstNode) => {
  const typeName = (
    visit(node, 'normalInterfaceDeclaration')?.[0] ||
    visit(node, 'normalClassDeclaration')?.[0] ||
    visit(node, 'enumDeclaration')?.[0]
  )?.typeIdentifier?.[0].children.Identifier?.[0].image;

  const typeParams = getTypeParams(node);

  if (!typeName) {
    throw new Error('Failed to get type name');
  }

  return `${typeName}${typeParams}`;
};

const getTypeParents = (node: TypeDeclarationCstNode): string[] => {
  const interfaceParents = node.children.interfaceDeclaration?.[0].children?.normalInterfaceDeclaration?.[0].children.extendsInterfaces?.[0].children.interfaceTypeList?.[0].children.interfaceType?.map(
    (extInt) => {
      const name = extInt.children.classType[0].children.Identifier[0].image;
      const typeArgs = getTypeArgs(extInt);

      return `${name}${typeArgs}`;
    }
  );
  const classParent =
    node.children?.classDeclaration?.[0]?.children.normalClassDeclaration?.[0]
      .children?.superclass?.[0].children.classType?.[0].children
      .Identifier?.[0].image;
  const classParentArgs = getTypeArgs(
    node.children?.classDeclaration?.[0]?.children.normalClassDeclaration?.[0]
      .children?.superclass?.[0].children.classType?.[0]
  );
  if (interfaceParents?.[0] === 'ObjectProxy<ChannelType>') {
    console.log('test');
  }
  return interfaceParents
    ? interfaceParents
    : classParent
    ? [`${classParent}${classParentArgs}`]
    : [];
};

const getResultType = (node: ResultCtx) => {
  if (node.Void) {
    return 'void';
  } else if (node.unannType?.[0]) {
    return renderUnannType(node.unannType?.[0]);
  } else {
    throw new Error('Unhandled result type');
  }
};

const renderMethodDeclaration = (
  node?: InterfaceMethodDeclarationCstNode | MethodDeclarationCstNode,
  isCallback?: boolean
) => {
  if (!node) return '';
  const isStatic =
    'methodModifier' in node.children &&
    !!node.children.methodModifier?.find((n) => n.children.Static);
  const name =
    node.children.methodHeader?.[0].children.methodDeclarator?.[0].children
      .Identifier?.[0].image;
  const result = getResultType(
    node.children.methodHeader?.[0].children.result?.[0].children
  );
  const args = visit(node, 'formalParameter')
    .map((ctx) => {
      const isArityType = !!ctx.variableArityParameter;
      let name =
        ctx.variableParaRegularParameter?.[0].children.variableDeclaratorId?.[0]
          .children.Identifier?.[0].image ||
        ctx.variableArityParameter?.[0].children.Identifier?.[0].image;
      if (name === 'function') name = 'func';
      const type = renderUnannType(
        ctx.variableParaRegularParameter?.[0].children.unannType?.[0] ||
          ctx.variableArityParameter?.[0]?.children?.unannType?.[0]!
      );
      return `${isArityType ? '...' : ''}${name}: ${type}${
        isArityType ? '[]' : ''
      }`;
    })
    .join(', ');

  return `${isStatic ? 'static ' : ''}${
    isCallback ? '' : name
  }(${args}): ${result}\n`;
};

const renderConstructorDeclaration = (node?: ConstructorDeclarationCstNode) => {
  if (!node) return '';
  const args = visit(node, 'variableParaRegularParameter')
    .map((ctx) => {
      const name = ctx.variableDeclaratorId?.[0].children.Identifier?.[0].image;
      const type = renderUnannType(ctx.unannType?.[0]);
      return `${name}: ${type}`;
    })
    .join(', ');

  return `constructor(${args})\n`;
};

const renderTypeBody = (node: TypeDeclarationCstNode, isCallback?: boolean) => {
  const interfaceBody = visit(node, 'interfaceBody')?.[0]
    ?.interfaceMemberDeclaration;
  const classBody = visit(node, 'classBody')?.[0]?.classBodyDeclaration;

  const members: string[] = [];
  if (interfaceBody) {
    interfaceBody.forEach((member) => {
      if (member.children.interfaceMethodDeclaration?.[0]) {
        // handle methods
        // @ts-ignore
        const docstring = member?.leadingComments?.[0].image;
        const method = renderMethodDeclaration(
          member.children.interfaceMethodDeclaration[0],
          isCallback
        );

        members.push([docstring, method].filter((m) => m).join('\n'));
      } else if (member.children.constantDeclaration?.[0]) {
        const docstring = member?.leadingComments?.[0].image;
        const name = visit(member, 'variableDeclaratorId')?.[0].Identifier?.[0]
          .image;
        const type = renderUnannType(
          visit(member, 'constantDeclaration')?.[0].unannType?.[0]
        );
        const isStatic = !!visit(
          member,
          'constantDeclaration'
        )?.[0].constantModifier?.find((n) => n.children.Static);
        members.push(
          `${isStatic ? 'static ' : ''}${
            docstring ? `${docstring}\n` : ''
          }${name}: ${type};\n`
        );
      } else if (member.children.classDeclaration) {
        if (
          member.children.classDeclaration?.[0].children.normalClassDeclaration
        ) {
          console.warn('Warning: Skipped inner class declaration.');
        }
      } else if (member.children.interfaceDeclaration) {
        console.warn('Warning: Skipped inner interface declaration.');
      } else if (
        Object.keys(member.children).length === 1 &&
        member.children.Semicolon
      ) {
        return '';
      } else {
        console.log(node);
        throw new Error('Unhandled interface member type');
      }
    });
  } else if (classBody) {
    classBody.map((member) => {
      if (
        member.children.classMemberDeclaration?.[0].children
          .methodDeclaration?.[0]
      ) {
        // handle methods
        // @ts-ignore
        const docstring = member?.leadingComments?.[0].image;
        const method = renderMethodDeclaration(
          member.children.classMemberDeclaration[0].children
            .methodDeclaration[0],
          isCallback
        );

        members.push([docstring, method].filter((m) => m).join('\n'));
      } else if (member.children.constructorDeclaration?.[0]) {
        const docstring = member?.leadingComments?.[0].image;
        const constructor = renderConstructorDeclaration(
          member.children.constructorDeclaration?.[0]
        );
        members.push([docstring, constructor].filter((m) => m).join('\n'));
      } else if (
        member.children.classMemberDeclaration?.[0].children.fieldDeclaration
      ) {
        const docstring = member?.leadingComments?.[0].image;
        const name = visit(member, 'variableDeclaratorId')?.[0].Identifier?.[0]
          .image;
        const isStatic = !!visit(
          member,
          'fieldDeclaration'
        )?.[0].fieldModifier?.find((n) => n.children.Static);

        const type = renderUnannType(
          visit(member, 'fieldDeclaration')?.[0].unannType?.[0]
        );
        members.push(
          `${isStatic ? 'static ' : ''}${
            docstring ? `${docstring}\n` : ''
          }${name}: ${type};\n`
        );
      } else {
        throw new Error('Unhandled class member type');
      }
    });
  }

  return members.join('\n');
};

const renderTypeDeclaration = (node: TypeDeclarationCstNode) => {
  if (
    node.children.interfaceDeclaration?.[0].children.annotationTypeDeclaration
  ) {
    console.warn('Warning: Skipping annotation type.');
    return '';
  }
  const type = {
    kind: getTypeKind(node),
    docstring: getTypeDocstring(node),
    name: getTypeName(node),
    parents: getTypeParents(node),
  };

  // handle enums separately
  if (type.kind === 'enum') return '';

  const isCallback =
    type.name.endsWith('Callback') || type.name.includes('Callback<');

  return `${type.docstring ? `${type.docstring}\n` : ''}${type.kind} ${
    type.name
  }${
    type.parents.length ? ` extends ${type.parents.join(',')}` : ''
  } {\n${renderTypeBody(node, isCallback)}}\n`;
};

export function renderTypeDeclarations(nodes?: TypeDeclarationCstNode[]) {
  if (!nodes) return '';

  const types = nodes.map(renderTypeDeclaration);

  return types.join('\n');
}
