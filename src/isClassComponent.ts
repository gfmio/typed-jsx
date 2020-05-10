import { Component, ComponentType, ClassComponent } from './types';
import isSubClass from './isSubClass';

/** Returns true if a JSX component is a class (must inherit from Component) */
export default function isClassComponent(element: ComponentType): element is ClassComponent {
  return isSubClass(element, Component);
}
