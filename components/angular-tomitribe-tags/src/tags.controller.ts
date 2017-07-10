import {TagReference} from "./tags.service";
export class TagsController {
    static $inject = ['$scope', 'TribeTagsService', 'TribeTagsConfigurer'];

    constructor(private $scope, private tagService, private tagConfigurer) {
        $scope.self = $scope; // this is weird right but then we reference with a dot and binding works cause angular doesn't copy it all
        $scope.availableTags = [];

        $scope.validationErrorMessage = tagConfigurer.validation.default.errorMessage();

        $scope.stringToTagReference = name => {
            const found = $scope.availableTags.filter(t => t.name === name);
            var tag = !!found.length ? found[0] : new TagReference(null, name, {});

            tag['$$invalid'] = !tagConfigurer.validation.default.isValid(name);

            return tag;
        };

        $scope.groupSuggestions = item => {
            return 'Suggestions';
        };

        $scope.$on('tribe-tags:refresh', () => $scope.loadTagsProposals(''));

        $scope.loadTagsProposals = (query) => tagService.findTags(query).then(
            (data) => {
                $scope.availableTags = data.map(t => {
                    return new TagReference(t.id, t.name, {});
                })
                .sort((a,b) => a.name.localeCompare(b.name));
            }
        );
    }
}