/// <reference types="node" />
import { URL } from 'url';
import { Options, NormalizedOptions, Defaults, ResponseType, Response } from './types';
import Request, { ParseJsonFunction } from '../core';
export declare const knownBodyTypes: string[];
export declare const parseBody: (response: Response, responseType: ResponseType, parseJson: ParseJsonFunction, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => unknown;
export default class PromisableRequest extends Request {
    ['constructor']: typeof PromisableRequest;
    options: NormalizedOptions;
    static normalizeArguments(url?: string | URL, nonNormalizedOptions?: Options, defaults?: Defaults): NormalizedOptions;
    static mergeOptions(...sources: Options[]): NormalizedOptions;
    _beforeError(error: Error): void;
}
