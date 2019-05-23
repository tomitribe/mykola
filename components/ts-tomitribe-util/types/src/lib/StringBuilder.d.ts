export declare class StringBuilder {
    str: string;
    readonly length: number;
    toString(): string;
    toNumber(): number;
    lastIndexOf(str: string): number;
    append(str: any): StringBuilder;
    deleteCharAt(i: number): StringBuilder;
    insert(i: number, str: string): StringBuilder;
}
declare const _default: {
    StringBuilder: typeof StringBuilder;
};
export default _default;
