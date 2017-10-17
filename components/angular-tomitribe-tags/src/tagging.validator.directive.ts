export class TaggingValidatorDirective implements ng.IDirective {
    require = "ngModel";

    constructor(private tagConfigurer) {
    }

    link: ng.IDirectiveLinkFn = (scope, el: angular.IAugmentedJQuery, attrs: any, ctrl: any): void => {
        const validationKey = attrs.validationKey || 'name';

        ctrl.$validators.tagging = (modelValue, viewValue) => {
            if (modelValue) {
                for (let model of modelValue) {
                    if (!this.tagConfigurer.validation.default.isValid(model[validationKey])) return false;
                }
            }
            return true;
        };
    }
}
