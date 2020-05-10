import { Element, JSXElement } from './types';

/** Returns true if an object is a JSX element */
export default function isJSXElement(value: any): value is JSXElement {
  return value instanceof Element;
}
