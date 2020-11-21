import { CstNodeLocation } from 'chevrotain';

export type AnyCstNode = {
  name: string;
  children: any;
  location?: CstNodeLocation;
  fullName?: string;
};

declare module 'chevrotain/lib/chevrotain' {
  interface CstNode {
    leadingComments?: IToken[];
  }
}
