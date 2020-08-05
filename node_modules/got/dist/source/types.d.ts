/// <reference types="node" />
import { URL } from 'url';
import { CancelError } from 'p-cancelable';
import { CancelableRequest, Response, Options, NormalizedOptions, Defaults as DefaultOptions, PaginationOptions, ParseError, RequestError, CacheError, ReadError, HTTPError, MaxRedirectsError, TimeoutError } from './as-promise';
import Request from './core';
declare type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;
declare type Merge<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;
export interface InstanceDefaults {
    options: DefaultOptions;
    handlers: HandlerFunction[];
    mutableDefaults: boolean;
    _rawHandlers?: HandlerFunction[];
}
export declare type GotReturn = Request | CancelableRequest;
export declare type HandlerFunction = <T extends GotReturn>(options: NormalizedOptions, next: (options: NormalizedOptions) => T) => T | Promise<T>;
export interface ExtendOptions extends Options {
    handlers?: HandlerFunction[];
    mutableDefaults?: boolean;
}
export declare type OptionsOfTextResponseBody = Merge<Options, {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType?: 'text';
}>;
export declare type OptionsOfJSONResponseBody = Merge<Options, {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType?: 'json';
}>;
export declare type OptionsOfBufferResponseBody = Merge<Options, {
    isStream?: false;
    resolveBodyOnly?: false;
    responseType: 'buffer';
}>;
export declare type OptionsOfUnknownResponseBody = Merge<Options, {
    isStream?: false;
    resolveBodyOnly?: false;
}>;
export declare type StrictOptions = Except<Options, 'isStream' | 'responseType' | 'resolveBodyOnly'>;
export declare type StreamOptions = Merge<Options, {
    isStream?: true;
}>;
declare type ResponseBodyOnly = {
    resolveBodyOnly: true;
};
export declare type OptionsWithPagination<T = unknown, R = unknown> = Merge<Options, PaginationOptions<T, R>>;
export interface GotPaginate {
    each: (<T, R = unknown>(url: string | URL, options?: OptionsWithPagination<T, R>) => AsyncIterableIterator<T>) & (<T, R = unknown>(options?: OptionsWithPagination<T, R>) => AsyncIterableIterator<T>);
    all: (<T, R = unknown>(url: string | URL, options?: OptionsWithPagination<T, R>) => Promise<T[]>) & (<T, R = unknown>(options?: OptionsWithPagination<T, R>) => Promise<T[]>);
    <T, R = unknown>(url: string | URL, options?: OptionsWithPagination<T, R>): AsyncIterableIterator<T>;
    <T, R = unknown>(options?: OptionsWithPagination<T, R>): AsyncIterableIterator<T>;
}
export interface GotRequestFunction {
    (url: string | URL, options?: OptionsOfTextResponseBody): CancelableRequest<Response<string>>;
    <T>(url: string | URL, options?: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>;
    (url: string | URL, options?: OptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>;
    (url: string | URL, options?: OptionsOfUnknownResponseBody): CancelableRequest<Response>;
    (options: OptionsOfTextResponseBody): CancelableRequest<Response<string>>;
    <T>(options: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>;
    (options: OptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>;
    (options: OptionsOfUnknownResponseBody): CancelableRequest<Response>;
    (url: string | URL, options?: (Merge<OptionsOfTextResponseBody, ResponseBodyOnly>)): CancelableRequest<string>;
    <T>(url: string | URL, options?: (Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>)): CancelableRequest<T>;
    (url: string | URL, options?: (Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>)): CancelableRequest<Buffer>;
    (options: (Merge<OptionsOfTextResponseBody, ResponseBodyOnly>)): CancelableRequest<string>;
    <T>(options: (Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>)): CancelableRequest<T>;
    (options: (Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>)): CancelableRequest<Buffer>;
    (url: string | URL, options?: Merge<Options, {
        isStream: true;
    }>): Request;
    (options: Merge<Options, {
        isStream: true;
    }>): Request;
    (url: string | URL, options?: Options): CancelableRequest | Request;
    (options: Options): CancelableRequest | Request;
}
export declare type HTTPAlias = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete';
interface GotStreamFunction {
    (url: string | URL, options?: Merge<Options, {
        isStream?: true;
    }>): Request;
    (options?: Merge<Options, {
        isStream?: true;
    }>): Request;
}
export declare type GotStream = GotStreamFunction & Record<HTTPAlias, GotStreamFunction>;
export interface Got extends Record<HTTPAlias, GotRequestFunction>, GotRequestFunction {
    stream: GotStream;
    paginate: GotPaginate;
    defaults: InstanceDefaults;
    CacheError: typeof CacheError;
    RequestError: typeof RequestError;
    ReadError: typeof ReadError;
    ParseError: typeof ParseError;
    HTTPError: typeof HTTPError;
    MaxRedirectsError: typeof MaxRedirectsError;
    TimeoutError: typeof TimeoutError;
    CancelError: typeof CancelError;
    extend: (...instancesOrOptions: Array<Got | ExtendOptions>) => Got;
    mergeInstances: (parent: Got, ...instances: Got[]) => Got;
    mergeOptions: (...sources: Options[]) => NormalizedOptions;
}
export {};
