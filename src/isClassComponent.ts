import { Component, ComponentType, ClassComponent } from './types';
import isSubClass from './isSubClass';

/** Returns true if a JSX component is a class (must inherit from Component) */
const isClassComponent = (element: ComponentType): element is ClassComponent => isSubClass(element, Component);

export default isClassComponent;
