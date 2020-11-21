import {
  JavaCstVisitorWithDefaults,
  BaseJavaCstVisitorWithDefaults,
} from 'java-parser';

import { AnyCstNode } from './types';

type Last<
  T extends (keyof JavaCstVisitorWithDefaults<any, any>)[]
> = T extends [...infer I, infer L] ? L : never;

type VisitorKey = Exclude<
  keyof JavaCstVisitorWithDefaults<any, any>,
  'visit' | 'validateVisitor'
>;

type CtxFromKey<K extends VisitorKey> = Parameters<
  JavaCstVisitorWithDefaults<any, any>[K]
>[0];

const isCstNode = (value: any): value is AnyCstNode =>
  typeof value === 'object' && 'name' in value && 'children' in value;

export const visit = <T extends [start: VisitorKey, ...rest: VisitorKey[]]>(
  node: AnyCstNode,
  ...path: T
): CtxFromKey<Last<T>>[] => {
  const result: CtxFromKey<VisitorKey>[] = [];

  class Collector extends BaseJavaCstVisitorWithDefaults {
    [path[0]](ctx: CtxFromKey<VisitorKey>) {
      result.push(ctx);
    }
  }

  const collector = new Collector();

  collector.visit(node);

  if (path.length === 1) {
    return result;
  }

  const cstList: AnyCstNode[] = [];
  for (const ctx of result) {
    for (const maybeCstList of Object.values(ctx)) {
      if (Array.isArray(maybeCstList)) {
        cstList.push(
          ...maybeCstList.filter((maybeCst: any) => isCstNode(maybeCst))
        );
      }
    }
  }

  // @ts-ignore
  return [].concat(...cstList.map((cst) => visit(cst, ...path.slice(1))));
};
