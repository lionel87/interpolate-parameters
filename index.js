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
}

module.exports = interpolate;
