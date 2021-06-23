import { AnyCstNode } from '../types';
import { visit } from '../visit';

export const typeOverrides: { [javaType: string]: string } = {
  String: 'string',
  Byte: 'number',
  Short: 'number',
  Integer: 'number',
  Long: 'number',
  Float: 'number',
  Double: 'number',
  Boolean: 'boolean',
  BigDecimal: 'number',
  BigInteger: 'number',
  Number: 'number',
  Void: 'void',
  Object: 'object',
  Runnable: '() => void',
  JSObject: '() => void',
  Future: 'unknown',
};

export const ignoredImports = [
  'java.util.Collections',
  'java.util.ArrayList',
  'java.util.concurrent.Callable',
  'com.bitwig.extension.api.opensoundcontrol.OscNode',
  'com.bitwig.extension.api.opensoundcontrol.OscMethod',
  'java.util.concurrent.Future',
  'java.io.IOException',
  'java.lang.annotation.Retention',
  'java.lang.annotation.RetentionPolicy',
  'java.nio.charset.StandardCharsets',
  'java.util.Arrays',
  'jdk.nashorn.api.scripting.JSObject',
];

export const getTypeArgs = (node?: AnyCstNode): string => {
  if (!node) return '';
  const typeArguments = visit(node, 'typeArgument', 'referenceType');
  const args = typeArguments
    .map((ta) => {
      // @ts-ignore
      const isArrayOfType = ta.dims;
      const classType = ta.classOrInterfaceType?.[0].children.classType?.[0];
      const name = classType?.children.Identifier?.[0].image!;

      if (typeOverrides[name])
        return `${typeOverrides[name]}${isArrayOfType ? '[]' : ''}`;

      const args = classType?.children.typeArguments
        ? getTypeArgs(classType?.children.typeArguments?.[0])
        : '';

      return `${name}${args}${isArrayOfType ? '[]' : ''}`;
    })
    .join(', ');

  return args ? `<${args}>` : '';
};
