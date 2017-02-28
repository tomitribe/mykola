import {TagsService} from './tags.service';
import {TagsConfigurer} from './tags.configurer';
import {TagsController} from './tags.controller';
import {TagsDirective} from './tags.directive';
import {TagsOnBlurDirective} from './tags-onblur.directive';

import * as angular from 'angular';
import {TaggingValidatorDirective} from "./tagging.validator.directive";

angular.module('tomitribe-tags', ['ui.select', 'ngSanitize'])
  .service('TribeTagsService', TagsService)
  .service('TribeTagsConfigurer', TagsConfigurer)
  .controller('TribeTagsController', TagsController)
  .directive('tribeTags', [function () { return new TagsDirective(); }])
  .directive('tribeTagsOnBlur', ['$timeout', t => new TagsOnBlurDirective(t)])
  .directive('tribeTaggingValidator', ['TribeTagsConfigurer', t => new TaggingValidatorDirective(t)]);
