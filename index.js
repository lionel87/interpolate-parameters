"use strict";

const interpolateString = require("interpolate-string");

const interpolate = (target, context, pattern = /\%(.+?)\%/g) => {
    if (typeof target === "string") {
        const match = pattern.exec(target);
        if (pattern.lastIndex) {
            pattern.lastIndex = 0; // reset last index if there is a g flag
        }
        if (match && match.index === 0 && match[0].length === target.length) { // eg. "%param%"
            let value = context;
            for (const p of match[1].split(".")) {
                value = value[p] || "";
            }
            return value;
        }
        return interpolateString(target, context, pattern);
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
