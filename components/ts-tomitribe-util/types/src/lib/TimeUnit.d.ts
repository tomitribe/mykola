export declare type ITimeUnit = "NANOSECONDS" | "MICROSECONDS" | "MILLISECONDS" | "SECONDS" | "MINUTES" | "HOURS" | "DAYS";
export declare enum TimeUnitEnum {
    NANOSECONDS = 0,
    MICROSECONDS = 1,
    MILLISECONDS = 2,
    SECONDS = 3,
    MINUTES = 4,
    HOURS = 5,
    DAYS = 6
}
export declare enum TimeUnitValue {
    NANOSECONDS = 1,
    MICROSECONDS = 1000,
    MILLISECONDS = 1000000,
    SECONDS = 1000000000,
    MINUTES = 60000000000,
    HOURS = 3600000000000,
    DAYS = 86400000000000
}
export declare class TimeUnit {
    constructor(timeOrdinal: any);
    timeUnit: ITimeUnit;
    timeOrdinal: number;
    static NANOSECONDS: TimeUnit;
    static MICROSECONDS: TimeUnit;
    static MILLISECONDS: TimeUnit;
    static SECONDS: TimeUnit;
    static MINUTES: TimeUnit;
    static HOURS: TimeUnit;
    static DAYS: TimeUnit;
    name(): ITimeUnit;
    readonly ordinal: number;
    static ordinals(): number[];
    static values(): TimeUnit[];
    valueOf(): number;
    toNanos(duration: number): number;
    toMicros(duration: number): number;
    toMillis(duration: number): number;
    toSeconds(duration: number): number;
    toMinutes(duration: number): number;
    toHours(duration: number): number;
    toDays(duration: number): number;
    convert(duration: number, sourceUnit: TimeUnit): number;
}
declare const _default: {
    TimeUnitEnum: typeof TimeUnitEnum;
    TimeUnitValue: typeof TimeUnitValue;
    TimeUnit: typeof TimeUnit;
};
export default _default;
