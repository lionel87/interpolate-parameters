declare function interpolate(target: any, context?: { [key: string]: any }, pattern?: RegExp): any;
declare function asyncInterpolate(target: any, context?: { [key: string]: any }, pattern?: RegExp): Promise<any>;
export {
    interpolate,
    asyncInterpolate,
};
