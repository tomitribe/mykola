/**
 * @ngdoc directive
 * @name tomitribe-tags.directive:tribeTags
 * @function
 *
 * @description
 * Represent an input allowing to bind multiple values.
 *
 */
export class TagsDirective {
  restrict = 'E';
  template = require('./tags.view.pug');
  controller = 'TribeTagsController';
  scope = { ngModel: '=' }
}
