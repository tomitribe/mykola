import {TagReference} from './tags.service';

export class TagsController {
  static $inject = ['$scope', 'TribeTagsService', 'TribeTagsConfigurer'];

  constructor(private $scope, private tagService, private tagConfigurer) {
    $scope.self = $scope; // this is weird right but then we reference with a dot and binding works cause angular doesn't copy it all

    $scope.validationErrorMessage = tagConfigurer.validation.default.errorMessage();

    $scope.stringToTagReference = name => {
      const found = $scope.availableTags.filter(t => t.name === name);
      var tag = !!found.length ? found[0] : new TagReference(null, name, null);

      tag['$$invalid'] = !tagConfigurer.validation.default.isValid(name);

      return tag;
    };

    $scope.groupSuggestions = item => {
      return 'Suggestions';
    };

    $scope.availableTags = [];
    $scope.$on('tribe-tags:refresh', () => this.loadTags());
    this.loadTags();
  }

  private loadTags() {
    // load them remotely, todo: error handling
    this.tagService.findTags()
      .then(data => this.$scope.availableTags = data.map(p => new TagReference(p.name, p.displayName, p.description)));
  }
}
