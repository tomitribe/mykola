export class TaggingValidatorDirective implements ng.IDirective {
    require = "ngModel";

    constructor(private tagConfigurer) {
    }

    link: ng.IDirectiveLinkFn = (scope, el: angular.IAugmentedJQuery, attrs: any, ctrl: any): void => {
        var me = this;

        ctrl.$validators.tagging = function (modelValue, viewValue) {
            if (modelValue) {
                for (let model of modelValue) {
                    if (!me.tagConfigurer.validation.default.isValid(model[attrs.displayedProperty])) return false;
                }
            }

            return true;
        };
    }
}