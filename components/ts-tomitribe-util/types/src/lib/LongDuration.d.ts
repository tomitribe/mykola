import { TimeUnit } from "./TimeUnit";
export declare class LongDuration {
    time: number;
    unit: TimeUnit;
    defaultErrorHandler: (p1: Error) => void;
    valueOf(): number;
    constructor(text?: any, consumer?: any);
    parseLongDuration(string: string, consumer?: any): void;
    getTime(unit: TimeUnit): number;
    /**
     *
     * @param {*} o
     * @return {boolean}
     */
    equals(o: any): boolean;
    /**
     *
     * @return {number}
     */
    hashCode(): number;
    add(that: LongDuration): LongDuration;
    subtract(that: LongDuration): LongDuration;
    invalidFormat(text: string, errorHandler: (p1: Error) => void): void;
    /**
     *
     * @return {string}
     */
    toString(): string;
    /**
     * Converts time to a human readable format within the specified range
     *
     * @param {TimeUnit} max      the highest time unit of interest
     * @return {string}
     */
    formatHighest(max?: TimeUnit): string;
    parseUnit(u: string, errorHandler: (p1: Error) => void): TimeUnit;
}
export declare namespace LongDuration {
    class Normalize {
        a: number;
        b: number;
        base: TimeUnit;
        constructor(a: LongDuration, b: LongDuration);
        static lowest(a: LongDuration, b: LongDuration): TimeUnit;
    }
}
declare const _default: {
    LongDuration: typeof LongDuration;
};
export default _default;
