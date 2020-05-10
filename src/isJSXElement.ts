import { Element, JSXElement } from './types';

export default function isJSXElement(value: any): value is JSXElement {
  return value instanceof Element;
}
