import {TaggingValidator} from "./tagging.validator";
export class TaggingValidatorDirective implements ng.IDirective {
    require = "ngModel";

    constructor() {
    }

    link: ng.IDirectiveLinkFn = (scope, el: angular.IAugmentedJQuery, attrs: any, ctrl: any): void => {
        ctrl.$validators.tagging = function (modelValue, viewValue) {
            if (modelValue) {
                for (let model of modelValue) {
                    if (!TaggingValidator.isValid(model[attrs.displayedProperty])) return false;
                }
            }

            return true;
        };
    }
}