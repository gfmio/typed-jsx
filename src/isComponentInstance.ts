import { ComponentInstance, Component } from './types';

/** Returns true if an object is a ClassElement */
export const isComponentInstance = (tag: any): tag is ComponentInstance => tag instanceof Component;

export default isComponentInstance;
