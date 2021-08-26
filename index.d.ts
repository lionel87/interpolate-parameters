declare function interpolate(target: any, context?: { [key: string]: any }, pattern?: RegExp): any;
declare async function asyncInterpolate(target: any, context?: { [key: string]: any }, pattern?: RegExp): any;

export interpolate;
export asyncInterpolate;

