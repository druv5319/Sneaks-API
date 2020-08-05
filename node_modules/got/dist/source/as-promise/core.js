"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = exports.knownBodyTypes = void 0;
const is_1 = require("@sindresorhus/is");
const types_1 = require("./types");
const core_1 = require("../core");
if (!core_1.knownHookEvents.includes('beforeRetry')) {
    core_1.knownHookEvents.push('beforeRetry', 'afterResponse');
}
exports.knownBodyTypes = ['json', 'buffer', 'text'];
exports.parseBody = (response, responseType, parseJson, encoding) => {
    const { rawBody } = response;
    try {
        if (responseType === 'text') {
            return rawBody.toString(encoding);
        }
        if (responseType === 'json') {
            return rawBody.length === 0 ? '' : parseJson(rawBody.toString());
        }
        if (responseType === 'buffer') {
            return Buffer.from(rawBody);
        }
        throw new types_1.ParseError({
            message: `Unknown body type '${responseType}'`,
            name: 'Error'
        }, response);
    }
    catch (error) {
        throw new types_1.ParseError(error, response);
    }
};
class PromisableRequest extends core_1.default {
    static normalizeArguments(url, nonNormalizedOptions, defaults) {
        const options = super.normalizeArguments(url, nonNormalizedOptions, defaults);
        if (is_1.default.null_(options.encoding)) {
            throw new TypeError('To get a Buffer, set `options.responseType` to `buffer` instead');
        }
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.encoding);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.resolveBodyOnly);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.methodRewriting);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.isStream);
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.responseType);
        // `options.responseType`
        if (options.responseType === undefined) {
            options.responseType = 'text';
        }
        // `options.retry`
        const { retry } = options;
        if (defaults) {
            options.retry = { ...defaults.retry };
        }
        else {
            options.retry = {
                calculateDelay: retryObject => retryObject.computedValue,
                limit: 0,
                methods: [],
                statusCodes: [],
                errorCodes: [],
                maxRetryAfter: undefined
            };
        }
        if (is_1.default.object(retry)) {
            options.retry = {
                ...options.retry,
                ...retry
            };
            options.retry.methods = [...new Set(options.retry.methods.map(method => method.toUpperCase()))];
            options.retry.statusCodes = [...new Set(options.retry.statusCodes)];
            options.retry.errorCodes = [...new Set(options.retry.errorCodes)];
        }
        else if (is_1.default.number(retry)) {
            options.retry.limit = retry;
        }
        if (is_1.default.undefined(options.retry.maxRetryAfter)) {
            options.retry.maxRetryAfter = Math.min(
            // TypeScript is not smart enough to handle `.filter(x => is.number(x))`.
            // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
            ...[options.timeout.request, options.timeout.connect].filter(is_1.default.number));
        }
        // `options.pagination`
        if (is_1.default.object(options.pagination)) {
            if (defaults) {
                options.pagination = {
                    ...defaults.pagination,
                    ...options.pagination
                };
            }
            const { pagination } = options;
            if (!is_1.default.function_(pagination.transform)) {
                throw new Error('`options.pagination.transform` must be implemented');
            }
            if (!is_1.default.function_(pagination.shouldContinue)) {
                throw new Error('`options.pagination.shouldContinue` must be implemented');
            }
            if (!is_1.default.function_(pagination.filter)) {
                throw new TypeError('`options.pagination.filter` must be implemented');
            }
            if (!is_1.default.function_(pagination.paginate)) {
                throw new Error('`options.pagination.paginate` must be implemented');
            }
        }
        // JSON mode
        if (options.responseType === 'json' && options.headers.accept === undefined) {
            options.headers.accept = 'application/json';
        }
        return options;
    }
    static mergeOptions(...sources) {
        let mergedOptions;
        for (const source of sources) {
            mergedOptions = PromisableRequest.normalizeArguments(undefined, source, mergedOptions);
        }
        return mergedOptions;
    }
    _beforeError(error) {
        if (this.destroyed) {
            return;
        }
        if (!(error instanceof core_1.RequestError)) {
            error = new core_1.RequestError(error.message, error, this);
        }
        // Let the promise decide whether to abort or not
        // It is also responsible for the `beforeError` hook
        this.emit('error', error);
    }
}
exports.default = PromisableRequest;
