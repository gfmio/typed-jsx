import {
  Element,
  ChildrenType,
  JSXIntrinsicElement,
  FunctionComponent,
  PropsOf,
  JSXIntrinsicElements,
  JSXFunctionElement,
  ClassComponent,
  JSXClassElement,
  FactoryComponent,
  JSXFactoryElement,
  ComponentType,
  JSXElement,
  ComponentInstance,
} from './types';
import mergeChildren from './mergeChildren';

/** Intrinsic component  */
function jsx<K extends keyof JSXIntrinsicElements>(
  tag: K,
  props: JSXIntrinsicElements[K],
  ...children: ChildrenType<JSXIntrinsicElements[K]>
): JSXIntrinsicElement<K>;
/** Function component  */
function jsx<F extends FunctionComponent>(
  fn: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): JSXFunctionElement<F>;
/** Class component  */
function jsx<C extends ClassComponent>(
  cls: C,
  props: PropsOf<C>,
  ...children: ChildrenType<PropsOf<C>>
): JSXClassElement<C>;
/** Factory component  */
function jsx<F extends FactoryComponent>(
  factory: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): JSXFactoryElement<F>;
function jsx<T extends keyof JSXIntrinsicElements | ComponentType>(
  element: T,
  props: PropsOf<T>,
  ...children: ChildrenType<PropsOf<T>>
) {
  return new Element(element, mergeChildren(props, children));
}

namespace jsx {
  export namespace JSX {
    /** A JSX element describes a function to execute or a class to instantiate and its parameters */
    export type Element = JSXElement;
    export type IntrinsicElements = JSXIntrinsicElements;
    export type ElementClass = ComponentInstance;
    // ElementAtrributesProperty is commented because we read the props type from the function / constructor arguments
    // export interface ElementAttributesProperty {}
    export interface IntrinsicAttributes {}
    export interface IntrinsicClassAttributes<T> {}
    export interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export default jsx;
