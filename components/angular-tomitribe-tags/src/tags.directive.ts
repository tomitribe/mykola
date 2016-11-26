/**
 * @ngdoc directive
 * @name tribe-tags
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
