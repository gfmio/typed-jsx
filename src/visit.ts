import { JSXElement } from './types';
import isJSXElement from './isJSXElement';

export type VisitorFunction = {
  <T extends JSXElement>(value: T, parent: JSXElement | null): void;
  <T extends unknown>(value: T, parent: JSXElement): void;
};

async function visitInternal(jsx: any, parent: JSXElement | null, visitor: VisitorFunction) {
  // Handling nested array by "flattening" them during the visit
  if (Array.isArray(jsx)) {
    for (const item of jsx) {
      await visitInternal(item, parent, visitor);
    }
    return;
  }

  // Handling non-JSX elements, e.g. strings or numbers occurring as children
  if (!isJSXElement(jsx)) {
    await Promise.resolve(visitor(jsx, parent));
    return;
  }

  const { element, props } = jsx as JSXElement;

  await Promise.resolve(visitor(jsx, parent));

  if ('children' in props) {
    await visitInternal(props.children, jsx, visitor);
  }
}

/** Traverses the hierarchy of JSX elements and calls them with the visitor */
export default function visit(jsx: JSXElement, visitor: VisitorFunction) {
  return visitInternal(jsx, null, visitor);
}
