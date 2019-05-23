import { TimeUnit } from "./TimeUnit";
export declare class TimeUtils {
    static formatNanos(duration: number, min?: TimeUnit, max?: TimeUnit): string;
    static formatMillis(duration: number, min?: TimeUnit, max?: TimeUnit): string;
    static format(duration: number, sourceUnit: TimeUnit, min?: TimeUnit, max?: TimeUnit): string;
    static formatHighest(duration: number, max: TimeUnit, min?: TimeUnit): string;
    static max(): TimeUnit;
    static min(): TimeUnit;
    private static abbreviateString;
    static abbreviate(duration: string | number, sourceUnit?: TimeUnit, min?: TimeUnit, max?: TimeUnit): string;
}
