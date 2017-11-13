import {TagReference} from "./tags.service";
export class TaggingValidatorDirective implements ng.IDirective {
    restrict = 'A';
    require = ["ngModel", "uiSelect"];
    replace = false;

    constructor(private tagConfigurer) {
    }

    link: ng.IDirectiveLinkFn = (scope, el: angular.IAugmentedJQuery, attrs: any, ctrls: Array<any>): void => {
        const validationKey = attrs.validationKey || 'name';
        const [ngModel, uiSelect] = ctrls;

        scope.$parent.setTagInvalid = (tag: TagReference, inputValdatorCheck:boolean = false) => {
            tag['$$invalid'] = !this.tagConfigurer.validation.default.isValid(tag.name, uiSelect.selected, inputValdatorCheck);
            return tag;
        }

        ngModel.$validators.tagging = (modelValue, viewValue) => {
            if (modelValue) {
              const allValid = modelValue.reduce( (acc, model) => {
                  return acc && this.tagConfigurer.validation.default.isValid(model[validationKey], modelValue, true);
              }, true);
              return allValid
            }
            return true;
        };
    }
}
