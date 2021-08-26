"use strict";

const evaluate = (expr, ctx) => Function.call(null, "with(this)return (" + expr + ")").call(ctx);

const interpolate = (target, context, pattern = /\$\{(.*?[^\\]+?)\}/g) => {
    if (!context) {
        context = {};
    }
    if (typeof target === "string") {
        try {
            const match = pattern.exec(target);
            if (pattern.lastIndex) {
                pattern.lastIndex = 0; // reset last index if there is a g flag
            }
            if (match && match[0].length === target.length) { // eg. "${param}" and not "aaa${param}"
                return evaluate(match[1], context);
            }
            return target.replace(pattern, (_, expr) => evaluate(expr, context));
        } catch (ex) {
            throw `Could not interpolate string "${target}": ${ex}`;
        }
    } else if (Array.isArray(target)) {
        const a = [];
        for (let value of target) {
            a.push(interpolate(value, context, pattern));
        }
        return a;
    } else if (target && typeof target === "object") {
        const o = {};
        for (let p in target) {
            if (target.hasOwnProperty(p)) {
                o[p] = interpolate(target[p], context, pattern);
            }
        }
        return o;
    }
    return target;
};

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const asyncEvaluate = (expr, ctx) => AsyncFunction.call(null, "with(this)return (" + expr + ")").call(ctx);

async function asyncReplace(sourceString, regex, asyncReplacer) {
    regex.lastIndex = 0;

    let match;
    const matches = [];
    while ((match = regex.exec(sourceString)) != null) {
        matches.push(match);
    }

    const replacements = await Promise.all(matches.map(x => asyncReplacer.apply(null, x)));
    const sourceParts = sourceString.split(regex).filter((x, i) => i % 2 === 0);

    var result = [];
    result.push(sourceParts[0]);
    replacements.forEach((v, i) => {
        result.push(v);
        result.push(sourceParts[i + 1]);
    });

    return result.join('');
}

const asyncInterpolate = async (target, context, pattern = /\$\{(.*?[^\\]+?)\}/g) => {
    if (!context) {
        context = {};
    }
    if (typeof target === "string") {
        try {
            const match = pattern.exec(target);
            if (pattern.lastIndex) {
                pattern.lastIndex = 0; // reset last index if there is a g flag
            }
            if (match && match[0].length === target.length) { // eg. "${param}" and not "aaa${param}"
                return await asyncEvaluate(match[1], context);
            }
            return await asyncReplace(target, pattern, async (_, expr) => await asyncEvaluate(expr, context));
        } catch (ex) {
            throw `Could not (async) interpolate string "${target}": ${ex}`;
        }
    } else if (Array.isArray(target)) {
        const a = [];
        for (let value of target) {
            a.push(await asyncInterpolate(value, context, pattern));
        }
        return a;
    } else if (target && typeof target === "object") {
        const o = {};
        for (let p in target) {
            if (target.hasOwnProperty(p)) {
                o[p] = await asyncInterpolate(target[p], context, pattern);
            }
        }
        return o;
    }
    return target;
};

module.exports = {
    interpolate,
    asyncInterpolate,
};
