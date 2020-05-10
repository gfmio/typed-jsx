/* @jsx jsx */

import { jsx, Component, visit, isClassComponent, isComponentInstance, FactoryComponent, JSXElement } from "../src";

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

const MyFactoryComponent: FactoryComponent<MyFactoryComponentProps> = ({ b }) => b ? new MyClassComponent({ s: "abc" }) : null;

console.log(<MyFactoryComponent b />);
// Will print:
// Element { element: [Function: MyFactoryComponent], props: { b: true } }

// isClassComponent

console.log('isClassComponent(MyFunctionComponent) =', isClassComponent(MyFunctionComponent))
// Prints isClassComponent(MyFunctionComponent) = false
console.log('isClassComponent(MyClassComponent) =', isClassComponent(MyClassComponent))
// Prints isClassComponent(MyClassComponent) = true
console.log('isClassComponent(MyFactoryComponent) =', isClassComponent(MyFactoryComponent))
// Prints isClassComponent(MyFactoryComponent) = false

// isComponentInstance

console.log('isComponentInstance(MyFunctionComponent({ n: 1 })) =', isComponentInstance(MyFunctionComponent({ n: 1 })))
// Prints isComponentInstance(MyFunctionComponent({ n: 1 })) = false
console.log('isComponentInstance(new MyClassComponent({ s: "abc" })) =', isComponentInstance(new MyClassComponent({ s: "abc" })));
// Prints isComponentInstance(new MyClassComponent({ s: "abc" })) = true
console.log('isComponentInstance(MyFactoryComponent({ b: true })) =', isComponentInstance(MyFactoryComponent({ b: true })))
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
    (element: any, parent: any) => console.log(element, parent)
)
// This will traverse the JSX and print each of the elements in a depth-first search
