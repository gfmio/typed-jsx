import { ComponentInstance, Component } from './types';

/** Returns true if an object is a ClassElement */
export default function isComponentInstance(value: any): value is ComponentInstance {
  return value instanceof Component;
}
