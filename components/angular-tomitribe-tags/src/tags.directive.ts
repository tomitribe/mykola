/**
 * @ngdoc directive
 * @name tomitribe-tags.directive:tribeTags
 * @function
 *
 * @description
 * Represent an input allowing to bind multiple values.
 * If the directive has a form parent, will use the validation rules described in tags.validator.ts file
 *
 */
export class TagsDirective {
    restrict = 'E';
    replace = false;
    require = '?^form';
    template = require('./tags.view.pug');
    controller = 'TribeTagsController';
    scope = {
        ngModel: '=',
        position: '@?'
    };
    link: ng.IDirectiveLinkFn = (scope: any, el: any, attrs: any, ctrl: any): void => {
        scope.form = ctrl;
        scope.onOpenClose = (isOpen) => { if (!scope.domElem && isOpen) scope.domElem = el.find('.ui-select-choices-content')};
        if(!scope.position) {
            scope.position = 'auto';
        }
    };
}
