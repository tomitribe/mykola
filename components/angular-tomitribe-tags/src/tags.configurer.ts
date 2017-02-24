export class TagsConfigurer {
    tagsEndpoint = 'api/label/available';

    /*
        TODO:
        If we add more validations, we might need to do something like this
        < ... tribe-tagging-validator ... > (meaning default)
        or < ... tribe-tagging-validator='numberPositive' ... > (meaning another future validation positive number)
     */

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
