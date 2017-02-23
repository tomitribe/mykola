export class TagsValidator {
    private static pattern: string = "^[A-Za-z0-9 ._-]*$";
    private static maxLength: number = 64;

    static isValid(input: any): boolean {
        var regex = new RegExp(this.pattern);
        return (input && input.length <= this.maxLength && regex.test(input));
    }

    static get errorMessage(): string {
        return "Inputs must be alphanumeric, dot, space, scores and cannot exceed " + this.maxLength + " chars. Please remove the invalid entry."
    }
}
