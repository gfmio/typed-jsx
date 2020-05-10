/** Returns true if `child` is a sub-class of `parent` */
export default function isSubClass(child: Function, parent: Function) {
  return child.prototype instanceof parent;
}
