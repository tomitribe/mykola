export class TagsConfigurer {
    tagsEndpoint = 'api/label/available';

    validation = {
        default: {
            pattern: "^[A-Za-z0-9 ._-]*$",
            maxLength: 64,

            errorMessage(): string {
                return "Inputs must be alphanumeric, dot, space, scores and cannot exceed " + this.maxLength + " chars. Please remove invalid entry(s).";
            },
            isValid(input: any): boolean {
                var regex = new RegExp(this.pattern);
                return (input && input.length <= this.maxLength && regex.test(input));
            }
        }
    }
}
