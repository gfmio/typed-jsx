import { ChildrenType } from './types';

export default function mergeChildren<P extends object>(props: P, children: ChildrenType<P>): P;
export default function mergeChildren<P, K extends keyof P>(props: P, children: ChildrenType<P, K>, childrenKey: K): P;
export default function mergeChildren<P, K extends string | number | symbol = 'children'>(
  props: P,
  children: ChildrenType<P, K>,
  childrenKey: K = 'children' as K,
) {
  const copy = { ...props };
  if (children && children.length > 0) {
    (copy as any)[childrenKey] = children;
  }
  return copy;
}
