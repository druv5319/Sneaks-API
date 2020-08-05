import { NormalizedOptions, CancelableRequest } from './types';
import PromisableRequest from './core';
export default function asPromise<T>(options: NormalizedOptions): CancelableRequest<T>;
export * from './types';
export { PromisableRequest };
