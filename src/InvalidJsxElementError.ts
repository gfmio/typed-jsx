import ExtendableError from 'ts-error';

/** An error indicating an invalid JSX element */
export default class InvalidJsxElementError extends ExtendableError {
  constructor(public readonly element: any) {
    super(`Invalid JSX element: ${element}`);
  }
}
