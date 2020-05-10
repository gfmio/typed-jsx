/** Returns true if `child` is a sub-class of `parent` */
const isSubClass = (child: Function, parent: Function) =>
  child.prototype instanceof parent;

export default isSubClass;
