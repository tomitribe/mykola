import {TagsService} from './tags.service';
import {TagsConfigurer} from './tags.configurer';
import {TagsController} from './tags.controller';
import {TagsDirective} from './tags.directive';
import {TagsOnBlurDirective} from './tags-onblur.directive';

import * as angular from 'angular';
import {TagsValidatorDirective} from "./tags.validator.directive";

angular.module('tomitribe-tags', ['ui.select', 'ngSanitize'])
  .service('TribeTagsService', TagsService)
  .service('TribeTagsConfigurer', TagsConfigurer)
  .controller('TribeTagsController', TagsController)
  .directive('tribeTags', [function () { return new TagsDirective(); }])
  .directive('tribeTagsOnBlur', ['$timeout', t => new TagsOnBlurDirective(t)])
  .directive('tribeTagsValidator', [()=> { return new TagsValidatorDirective(); }]);
