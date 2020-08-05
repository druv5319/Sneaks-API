"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisableRequest = void 0;
const events_1 = require("events");
const PCancelable = require("p-cancelable");
const calculate_retry_delay_1 = require("./calculate-retry-delay");
const types_1 = require("./types");
const core_1 = require("./core");
exports.PromisableRequest = core_1.default;
const proxy_events_1 = require("../core/utils/proxy-events");
const get_buffer_1 = require("../core/utils/get-buffer");
const proxiedRequestEvents = [
    'request',
    'response',
    'redirect',
    'uploadProgress',
    'downloadProgress'
];
function asPromise(options) {
    let retryCount = 0;
    let globalRequest;
    let globalResponse;
    const emitter = new events_1.EventEmitter();
    const promise = new PCancelable((resolve, _reject, onCancel) => {
        const makeRequest = () => {
            // Support retries
            // `options.throwHttpErrors` needs to be always true,
            // so the HTTP errors are caught and the request is retried.
            // The error is **eventually** thrown if the user value is true.
            const { throwHttpErrors } = options;
            if (!throwHttpErrors) {
                options.throwHttpErrors = true;
            }
            // Note from @szmarczak: I think we should use `request.options` instead of the local options
            const request = new core_1.default(options.url, options);
            request._noPipe = true;
            onCancel(() => request.destroy());
            const reject = (error) => {
                void (async () => {
                    try {
                        for (const hook of options.hooks.beforeError) {
                            // eslint-disable-next-line no-await-in-loop
                            error = await hook(error);
                        }
                    }
                    catch (error_) {
                        _reject(new types_1.RequestError(error_.message, error_, request));
                        return;
                    }
                    _reject(error);
                })();
            };
            globalRequest = request;
            const onResponse = async (response) => {
                var _a;
                response.retryCount = retryCount;
                if (response.request.aborted) {
                    // Canceled while downloading - will throw a `CancelError` or `TimeoutError` error
                    return;
                }
                const isOk = () => {
                    const { statusCode } = response;
                    const limitStatusCode = options.followRedirect ? 299 : 399;
                    return (statusCode >= 200 && statusCode <= limitStatusCode) || statusCode === 304;
                };
                // Download body
                let rawBody;
                try {
                    rawBody = await get_buffer_1.default(request);
                    response.rawBody = rawBody;
                }
                catch (_b) {
                    // The same error is caught below.
                    // See request.once('error')
                    return;
                }
                // Parse body
                const contentEncoding = ((_a = response.headers['content-encoding']) !== null && _a !== void 0 ? _a : '').toLowerCase();
                const isCompressed = ['gzip', 'deflate', 'br'].includes(contentEncoding);
                if (isCompressed && !options.decompress) {
                    response.body = rawBody;
                }
                else {
                    try {
                        response.body = core_1.parseBody(response, options.responseType, options.parseJson, options.encoding);
                    }
                    catch (error) {
                        // Fallback to `utf8`
                        response.body = rawBody.toString();
                        if (isOk()) {
                            // TODO: Call `request._beforeError`, see https://github.com/nodejs/node/issues/32995
                            reject(error);
                            return;
                        }
                    }
                }
                try {
                    for (const [index, hook] of options.hooks.afterResponse.entries()) {
                        // @ts-expect-error TS doesn't notice that CancelableRequest is a Promise
                        // eslint-disable-next-line no-await-in-loop
                        response = await hook(response, async (updatedOptions) => {
                            const typedOptions = core_1.default.normalizeArguments(undefined, {
                                ...updatedOptions,
                                retry: {
                                    calculateDelay: () => 0
                                },
                                throwHttpErrors: false,
                                resolveBodyOnly: false
                            }, options);
                            // Remove any further hooks for that request, because we'll call them anyway.
                            // The loop continues. We don't want duplicates (asPromise recursion).
                            typedOptions.hooks.afterResponse = typedOptions.hooks.afterResponse.slice(0, index);
                            for (const hook of typedOptions.hooks.beforeRetry) {
                                // eslint-disable-next-line no-await-in-loop
                                await hook(typedOptions);
                            }
                            const promise = asPromise(typedOptions);
                            onCancel(() => {
                                promise.catch(() => { });
                                promise.cancel();
                            });
                            return promise;
                        });
                    }
                }
                catch (error) {
                    // TODO: Call `request._beforeError`, see https://github.com/nodejs/node/issues/32995
                    reject(new types_1.RequestError(error.message, error, request));
                    return;
                }
                if (throwHttpErrors && !isOk()) {
                    reject(new types_1.HTTPError(response));
                    return;
                }
                globalResponse = response;
                resolve(options.resolveBodyOnly ? response.body : response);
            };
            const onError = async (error) => {
                if (promise.isCanceled) {
                    return;
                }
                if (!request.options) {
                    reject(error);
                    return;
                }
                request.off('response', onResponse);
                let gotUnexpectedError = false;
                const onUnexpectedError = (error) => {
                    gotUnexpectedError = true;
                    reject(error);
                };
                // If this is an HTTP error, then it can throw again with `ECONNRESET` or `Parse Error`
                request.once('error', onUnexpectedError);
                let backoff;
                retryCount++;
                try {
                    backoff = await options.retry.calculateDelay({
                        attemptCount: retryCount,
                        retryOptions: options.retry,
                        error,
                        computedValue: calculate_retry_delay_1.default({
                            attemptCount: retryCount,
                            retryOptions: options.retry,
                            error,
                            computedValue: 0
                        })
                    });
                }
                catch (error_) {
                    // Don't emit the `response` event
                    request.destroy();
                    reject(new types_1.RequestError(error_.message, error, request));
                    return;
                }
                // Another error was thrown already
                if (gotUnexpectedError) {
                    return;
                }
                request.off('error', onUnexpectedError);
                if (backoff) {
                    // Don't emit the `response` event
                    request.destroy();
                    const retry = async () => {
                        options.throwHttpErrors = throwHttpErrors;
                        try {
                            for (const hook of options.hooks.beforeRetry) {
                                // eslint-disable-next-line no-await-in-loop
                                await hook(options, error, retryCount);
                            }
                        }
                        catch (error_) {
                            // Don't emit the `response` event
                            request.destroy();
                            reject(new types_1.RequestError(error_.message, error, request));
                            return;
                        }
                        makeRequest();
                    };
                    setTimeout(retry, backoff);
                    return;
                }
                // The retry has not been made
                retryCount--;
                if (error instanceof types_1.HTTPError) {
                    // The error will be handled by the `response` event
                    void onResponse(request._response);
                    // Reattach the error handler, because there may be a timeout later.
                    request.once('error', onError);
                    return;
                }
                // Don't emit the `response` event
                request.destroy();
                reject(error);
            };
            request.once('response', onResponse);
            request.once('error', onError);
            proxy_events_1.default(request, emitter, proxiedRequestEvents);
        };
        makeRequest();
    });
    promise.on = (event, fn) => {
        emitter.on(event, fn);
        return promise;
    };
    const shortcut = (responseType) => {
        const newPromise = (async () => {
            // Wait until downloading has ended
            await promise;
            return core_1.parseBody(globalResponse, responseType, options.parseJson, options.encoding);
        })();
        Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
        return newPromise;
    };
    promise.json = () => {
        if (!globalRequest.writableFinished && options.headers.accept === undefined) {
            options.headers.accept = 'application/json';
        }
        return shortcut('json');
    };
    promise.buffer = () => shortcut('buffer');
    promise.text = () => shortcut('text');
    return promise;
}
exports.default = asPromise;
__exportStar(require("./types"), exports);
