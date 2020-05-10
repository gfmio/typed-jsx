import {
  ChildrenType,
  FunctionComponent,
  PropsOf,
  ClassComponent,
  FactoryComponent,
  ComponentType,
  ComponentInstance,
  ReturnOf,
} from './types';
import isClassComponent from './isClassComponent';
import mergeChildren from './mergeChildren';

/** Function component  */
function data<F extends FunctionComponent>(
  fn: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): ReturnOf<F>;
/** Class component  */
function data<C extends ClassComponent>(cls: C, props: PropsOf<C>, ...children: ChildrenType<PropsOf<C>>): ReturnOf<C>;
/** Factory component  */
function data<F extends FactoryComponent>(
  factory: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): ReturnOf<F>;
function data<P extends object, R>(element: ComponentType<P, R>, props: P, ...children: ChildrenType<P>) {
  const p = mergeChildren(props, children);
  return isClassComponent(element) ? new (element as ClassComponent<P, R>)(p) : (element as FunctionComponent<P, R>)(p);
}

namespace data {
  export namespace JSX {
    /** A JSX element describes a function to execute or a class to instantiate and its parameters */
    export type Element = any;
    export type IntrinsicElements = {};
    export type ElementClass = ComponentInstance;
    export interface ElementAttributesProperty {}
    export interface IntrinsicAttributes {}
    export interface IntrinsicClassAttributes<T> {}
    export interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export default data;
