# typed-jsx

This package provides utilities for strongly-typed, custom JSX implementations.

## Install

```sh
# With yarn
yarn add typed-jsx

# With NPM
npm install typed-jsx
```

## Usage

### For constructing XML-like hierarchies of elements

This package exposes utility functions and types for working with strongly-typed JSX.

The package exposes the JSX factory function `jsx` which simply converts your JSX into a traversable hierarchy of elements.

All JSX elements are instances of the class `Element`, which you can test for using the `isJSXElement` helper.

Class components must extend `Component`, which is simply an empty base class for tagging the objects.

You can check if a component is a class component using the `isClassComponent` and whether an object is an instance of a class component using the `isComponentInstance` helpers.

You can also define factory components, which return Component instances (but this is currently causing errors with the TypeScript compiler, despite being allowed in the spec) .

Finally, the `visit` function provides a utility for traversing the JSX elements.

```tsx
/* @jsx jsx */

import { jsx, Component, visit, isClassComponent, isComponentInstance, FactoryComponent, JSXElement } from '../src';

// Function component

interface MyFunctionComponentProps {
  n: number;
}

const MyFunctionComponent = ({ n }: MyFunctionComponentProps) => null;

console.log(<MyFunctionComponent n={1} />);
// Will print:
// Element { element: [Function: MyFunctionComponent], props: { n: 1 } }

// Class component

interface MyClassComponentProps {
  s: string;
  children?: JSXElement | JSXElement[];
}

class MyClassComponent extends Component {
  constructor(protected readonly props: MyClassComponentProps) {
    super();
  }
}

console.log(<MyClassComponent s="abc" />);
// Will print:
// Element { element: [Function: MyClassComponent], props: { s: 'abc' } }

// Factory component

interface MyFactoryComponentProps {
  b?: boolean;
}

const MyFactoryComponent: FactoryComponent<MyFactoryComponentProps> = ({ b }) =>
  b ? new MyClassComponent({ s: 'abc' }) : null;

console.log(<MyFactoryComponent b />);
// Will print:
// Element { element: [Function: MyFactoryComponent], props: { b: true } }

// isClassComponent

console.log('isClassComponent(MyFunctionComponent) =', isClassComponent(MyFunctionComponent));
// Prints isClassComponent(MyFunctionComponent) = false
console.log('isClassComponent(MyClassComponent) =', isClassComponent(MyClassComponent));
// Prints isClassComponent(MyClassComponent) = true
console.log('isClassComponent(MyFactoryComponent) =', isClassComponent(MyFactoryComponent));
// Prints isClassComponent(MyFactoryComponent) = false

// isComponentInstance

console.log('isComponentInstance(MyFunctionComponent({ n: 1 })) =', isComponentInstance(MyFunctionComponent({ n: 1 })));
// Prints isComponentInstance(MyFunctionComponent({ n: 1 })) = false
console.log(
  'isComponentInstance(new MyClassComponent({ s: "abc" })) =',
  isComponentInstance(new MyClassComponent({ s: 'abc' })),
);
// Prints isComponentInstance(new MyClassComponent({ s: "abc" })) = true
console.log(
  'isComponentInstance(MyFactoryComponent({ b: true })) =',
  isComponentInstance(MyFactoryComponent({ b: true })),
);
// Prints isComponentInstance(MyFactoryComponent({ b: true })) = true

// visit

visit(
  <MyClassComponent s="abc">
    <MyClassComponent s="xyz" />
    <MyClassComponent s="xyz">
      <MyFunctionComponent n={1} />
      <MyFactoryComponent b />
    </MyClassComponent>
    <MyFactoryComponent />
    <MyFunctionComponent n={1} />
  </MyClassComponent>,
  (element: any, parent: any) => console.log(element, parent),
);
// This will traverse the JSX and print each of the elements in a depth-first search
```

### For constructing hierarchical data structures

The package also exposes another JSX factory function `data`, which immediately invokes the "component" functions, class constructors and factory functions to create a nested hierarchy of objects, which allows for a terse and natural way of describing hierarchical data structures, for example file hierarchies.

```tsx
/* @jsx data */

import { data } from 'typed-jsx';

enum FileType {
  File = 'file',
  Directory = 'directory',
  SymbolicLink = 'symlink',
}

interface Directory {
  type: FileType.Directory;
  name: string;
  children: Array<File | Directory | SymbolicLink>;
}
const Directory = (props: Omit<Directory, 'type'>) => ({ type: FileType.Directory, ...props });

interface File {
  type: FileType.File;
  name: string;
  data: Buffer | string;
}
const File = (props: Omit<File, 'type'>) => ({ type: FileType.File, ...props });

interface SymbolicLink {
  type: FileType.SymbolicLink;
  name: string;
  target: string;
}
const SymbolicLink = (props: Omit<SymbolicLink, 'type'>) => ({ type: FileType.SymbolicLink, ...props });

const files = (
  <Directory name="root">
    <Directory name="sub">
      <File name="file1" data="..." />
    </Directory>
    <Directory name="sub2">
      <File name="file2" data="..." />
      <SymbolicLink name="file3" target="../sub/file1" />
    </Directory>
  </Directory>
);

console.log(JSON.stringify(files, undefined, 2));
// Will print:
//
// {
//   "type": "directory",
//   "name": "root",
//   "children": [
//     {
//       "type": "directory",
//       "name": "sub",
//       "children": [
//         {
//           "type": "file",
//           "name": "file1",
//           "data": "..."
//         }
//       ]
//     },
//     {
//       "type": "directory",
//       "name": "sub2",
//       "children": [
//         {
//           "type": "file",
//           "name": "file2",
//           "data": "..."
//         },
//         {
//           "type": "symlink",
//           "name": "file3",
//           "target": "../sub/file1"
//         }
//       ]
//     }
//   ]
// }
```

## Type reference

The package also provides a number of helper types for working with JSX. The following is a reference of all exported types:

```ts
import ExtendableError from 'ts-error';

/** Base class of JSX elements */
export declare class Element<T = any, P extends object = any> implements ElementType<T, P> {
  readonly element: T;
  readonly props: P;
  constructor(element: T, props: P);
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
export declare type FunctionComponent<P extends object = any, R = any> = (props: P) => R;

/** A JSX function element */
export interface JSXFunctionElement<F extends FunctionComponent = FunctionComponent>
  extends ElementType<F, PropsOf<F>> {}

/** Base class of all class components */
export declare abstract class Component implements ComponentInstance {}

/** The instance type of class components and return type of factory components */
export interface ComponentInstance extends Component {}

/** A class component */
export declare type ClassComponent<P extends object = any, R extends ComponentInstance = any> = new (props: P) => R;

/** A JSX class element */
export interface JSXClassElement<C extends ClassComponent = ClassComponent> extends ElementType<C, PropsOf<C>> {}

/** A factory component */
export declare type FactoryComponent<P extends object = any, R extends ComponentInstance = any> = (props: P) => R;

/** A JSX factory element */
export interface JSXFactoryElement<F extends FactoryComponent = FactoryComponent> extends ElementType<F, PropsOf<F>> {}

/** The sum type of all component types */
export declare type ComponentType<P extends object = any, R = any> =
  | FunctionComponent<P, R>
  | ClassComponent<P, R>
  | FactoryComponent<P, R>;

/** Sum type of intrinsic and component JSX elements */
export declare type JSXElement = JSXIntrinsicElement | JSXFunctionElement | JSXClassElement | JSXFactoryElement;

/** Returns the type of the props argument for T */
export declare type PropsOf<T> = T extends keyof JSXIntrinsicElements
  ? JSXIntrinsicElements[T]
  : T extends FunctionComponent<infer P, any>
  ? P
  : T extends ClassComponent<infer P, any>
  ? P
  : T extends FactoryComponent<infer P, any>
  ? P
  : never;

/** Returns the return type `R` of a component */
export declare type ReturnOf<T> = T extends keyof JSXIntrinsicElements
  ? JSXIntrinsicElement<T>
  : T extends FunctionComponent<any, infer R>
  ? R
  : T extends ClassComponent<any, infer R>
  ? R
  : T extends FactoryComponent<any, infer R>
  ? R
  : never;

/** Returns the array representation of children of the props P */
export declare type ChildrenType<P, K extends string | number | symbol = 'children'> = P extends {
  [Key in K]: any[];
}
  ? P[K]
  : P extends {
      [Key in K]: any;
    }
  ? [P[K]]
  : [];

/** Function component  */
export declare function data<F extends FunctionComponent>(
  fn: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): ReturnOf<F>;
/** Class component  */
export declare function data<C extends ClassComponent>(
  cls: C,
  props: PropsOf<C>,
  ...children: ChildrenType<PropsOf<C>>
): ReturnOf<C>;
/** Factory component  */
export declare function data<F extends FactoryComponent>(
  factory: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): ReturnOf<F>;
export declare namespace data {
  namespace JSX {
    type Element = any;
    type IntrinsicElements = {};
    type ElementClass = ComponentInstance;
    interface IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> {}
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

/** An error indicating an invalid JSX element */
export declare class InvalidJsxElementError extends ExtendableError {
  readonly element: any;
  constructor(element: any);
}

/** Returns true if a JSX component is a class (must inherit from Component) */
export function isClassComponent(element: ComponentType): element is ClassComponent;

/** Returns true if an object is a ClassElement */
export function isComponentInstance(value: any): value is ComponentInstance;

/** Returns true if an object is a JSX element */
export function isJSXElement(value: any): value is JSXElement;

/** Returns true if `child` is a sub-class of `parent` */
export function isSubClass(child: Function, parent: Function): boolean;

/** Intrinsic component  */
export declare function jsx<K extends keyof JSXIntrinsicElements>(
  tag: K,
  props: JSXIntrinsicElements[K],
  ...children: ChildrenType<JSXIntrinsicElements[K]>
): JSXIntrinsicElement<K>;
/** Function component  */
export declare function jsx<F extends FunctionComponent>(
  fn: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): JSXFunctionElement<F>;
/** Class component  */
export declare function jsx<C extends ClassComponent>(
  cls: C,
  props: PropsOf<C>,
  ...children: ChildrenType<PropsOf<C>>
): JSXClassElement<C>;
/** Factory component  */
export declare function jsx<F extends FactoryComponent>(
  factory: F,
  props: PropsOf<F>,
  ...children: ChildrenType<PropsOf<F>>
): JSXFactoryElement<F>;
export declare namespace jsx {
  namespace JSX {
    /** A JSX element describes a function to execute or a class to instantiate and its parameters */
    type Element = JSXElement;
    type IntrinsicElements = JSXIntrinsicElements;
    type ElementClass = ComponentInstance;
    interface IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> {}
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

/** Returns a copy of the props with the children property replaced by the children array, if it is non-empty */
export function mergeChildren<P extends object>(props: P, children: ChildrenType<P>): P;
export function mergeChildren<P, K extends keyof P>(props: P, children: ChildrenType<P, K>, childrenKey: K): P;
export declare type VisitorFunction = {
  <T extends JSXElement>(value: T, parent: JSXElement | null): void;
  <T extends unknown>(value: T, parent: JSXElement): void;
};

/** Traverses the hierarchy of JSX elements and calls them with the visitor */
export function visit(jsx: JSXElement, visitor: VisitorFunction): Promise<void>;
```

## License

[MIT](LICENSE)
