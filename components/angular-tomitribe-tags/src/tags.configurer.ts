export class TagsConfigurer {
    tagsEndpoint = 'api/label/available';

    pattern: string = "^[A-Za-z0-9 ._-]*$";
    maxLength: number = 64;
    errorMessage: string = "Inputs must be alphanumeric, dot, space, scores and cannot exceed " + this.maxLength + " chars. Please remove invalid entry(s).";

    isValid(input: any): boolean {
        var regex = new RegExp(this.pattern);
        return (input && input.length <= this.maxLength && regex.test(input));
    }
}
