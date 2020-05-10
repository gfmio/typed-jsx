/** Base class of JSX elements */
export class Element<T = any, P extends object = any> implements ElementType<T, P> {
  constructor(public readonly element: T, public readonly props: P) {}
}

/** Base interface of JSX Elements */
export interface ElementType<T = any, P extends object = any> extends Element<T, P> {
  readonly element: T;
  readonly props: P;
}

/** The map of supported intrinsic elements and their attributes */
export interface JSXIntrinsicElements {}

/** An intrinsic JSX element */
export interface JSXIntrinsicElement<K extends keyof JSXIntrinsicElements = keyof JSXIntrinsicElements>
  extends ElementType<K, JSXIntrinsicElements[K]> {}

/** A function component */
export type FunctionComponent<P extends object = any, R = any> = (props: P) => R;

/** A JSX function element */
export interface JSXFunctionElement<F extends FunctionComponent = FunctionComponent>
  extends ElementType<F, PropsOf<F>> {}

/** Base class of all class components */
export abstract class Component implements ComponentInstance {}

/** The instance type of class components and return type of factory components */
export interface ComponentInstance extends Component {}

/** A class component */
export type ClassComponent<P extends object = any, R extends ComponentInstance = any> = new (props: P) => R;

/** A JSX class element */
export interface JSXClassElement<C extends ClassComponent = ClassComponent> extends ElementType<C, PropsOf<C>> {}

/** A factory component */
export type FactoryComponent<P extends object = any, R extends ComponentInstance = any> = (props: P) => R;

/** A JSX factory element */
export interface JSXFactoryElement<F extends FactoryComponent = FactoryComponent> extends ElementType<F, PropsOf<F>> {}

/** The sum type of all component types */
export type ComponentType<P extends object = any, R = any> =
  | FunctionComponent<P, R>
  | ClassComponent<P, R>
  | FactoryComponent<P, R>;

/** Sum type of intrinsic and component JSX elements */
export type JSXElement = JSXIntrinsicElement | JSXFunctionElement | JSXClassElement | JSXFactoryElement;

/** Returns the type of the props argument for T */
export type PropsOf<T> = T extends keyof JSXIntrinsicElements
  ? JSXIntrinsicElements[T]
  : T extends FunctionComponent<infer P, any>
  ? P
  : T extends ClassComponent<infer P, any>
  ? P
  : T extends FactoryComponent<infer P, any>
  ? P
  : never;

/** Returns the return type `R` of a component */
export type ReturnOf<T> = T extends keyof JSXIntrinsicElements
  ? JSXIntrinsicElement<T>
  : T extends FunctionComponent<any, infer R>
  ? R
  : T extends ClassComponent<any, infer R>
  ? R
  : T extends FactoryComponent<any, infer R>
  ? R
  : never;

/** Returns the array representation of children of the props P */
export type ChildrenType<P, K extends string | number | symbol = 'children'> = P extends { [Key in K]: any[] }
  ? P[K]
  : P extends { [Key in K]: any }
  ? [P[K]]
  : [];
