import {TagReference} from './tags.service';
import {TagsValidator} from "./tags.validator";

export class TagsController {
  static $inject = ['$scope', 'TribeTagsService'];

  constructor($scope, tagService) {
    $scope.self = $scope; // this is weird right but then we reference with a dot and binding works cause angular doesn't copy it all

    $scope.validationErrorMessage = TagsValidator.errorMessage;

    $scope.stringToTagReference = name => {
      const found = $scope.availableTags.filter(t => t.name === name);
      var tag = !!found.length ? found[0] : new TagReference(null, name, null);

      tag['$$invalid'] = !TagsValidator.isValid(name);

      return tag;
    };

    $scope.groupSuggestions = item => {
      return 'Suggestions';
    };

    $scope.availableTags = [];
    // load them remotely, todo: error handling
    tagService.findTags()
      .then(data => $scope.availableTags = data.map(p => new TagReference(p.name, p.displayName, p.description)));
  }
}
