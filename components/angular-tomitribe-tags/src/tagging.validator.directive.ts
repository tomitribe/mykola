let _ = require('underscore');

import {TagReference} from "./tags.service";
export class TaggingValidatorDirective implements ng.IDirective {
    restrict = 'A';
    require = ["ngModel", "uiSelect"];
    replace = false;
    constructor(private tagConfigurer,
                private $parse) {
    }

    link: ng.IDirectiveLinkFn = (scope, el: angular.IAugmentedJQuery, attrs: any, ctrls: Array<any>): void => {
        const validationKey = attrs.validationKey || 'name';
        const validationIgnore = attrs.validationIgnore && this.$parse(attrs.validationIgnore);
        const [ngModel, uiSelect] = ctrls;

        scope.$parent['applyTaggingValidation'] = (tag: TagReference, inputValdatorCheck:boolean = false) => {
            // check duplication on collection without this element
            const pureSelected = _.without(uiSelect.selected, tag);
            tag['$$invalid']   = !this.tagConfigurer.validation.default.isValid(tag.name, pureSelected, inputValdatorCheck, {scope, el, attrs, ctrls, $item: tag, validationIgnore});
            tag['$$duplicate'] = this.tagConfigurer.validation.default.isDuplicate(tag.name, pureSelected);
            return tag;
        };

        ngModel.$validators.tagging = (modelValue, viewValue) => {
            if (modelValue) {
                const allValid = modelValue.reduce( (acc, model) => {
                    return acc && this.tagConfigurer.validation.default.isValid(model[validationKey], modelValue, true, {scope, el, attrs, ctrls, $item: model, validationIgnore});
                }, true);
                return allValid
            }
            return true;
        };
    }
}
