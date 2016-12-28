/**
 * @ngdoc directive
 * @name tomitribe-tags.directive:tribeTagsOnBlur
 * @function
 *
 * @description
 * Directive allowing to create a tag on blur event (like JIRA).
 *
 */
export class TagsOnBlurDirective {
  constructor(private $timeout) {
  }

  require = 'uiSelect';
  link = (scope, element, attributes, controller) => {
    controller.searchInput.on('blur', () => {
      this.$timeout(() => {
        let newItem = controller.search;
        if (newItem == '') {
          return;
        }
        controller.searchInput.triggerHandler('tagged');
        controller.tagging.fct && (newItem = controller.tagging.fct(newItem));
        newItem && controller.select(newItem, true);
      });
    });
  };
}
