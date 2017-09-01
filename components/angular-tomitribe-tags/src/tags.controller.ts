let _ = require('underscore');

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

        $scope.loadTagsProposals = (query) => {
            if ($scope.$$pagingBusy) return;

            if (query !== $scope.$$pagingQuery) {
                $scope.$$pagingQuery = query;
                $scope.$$pagingState = undefined;
            }

            // we started our request (busy)
            $scope.$$pagingBusy = true;

            let params = {
                "pagingState": $scope.$$pagingState || undefined,
                "query": query || undefined,
                "size": 20
            };

            tagService.findTags(params).then(
                (data) => {
                    let tagsFromServer = data.items.map(t => {
                        return new TagReference(t.id, t.name, {});
                    });

                    const previousArray = $scope.availableTags && $scope.$$pagingState ? $scope.availableTags : [];

                    $scope.availableTags = _.union(previousArray, tagsFromServer).sort((a:any,b:any) => a.name.localeCompare(b.name));
                    $scope.$$total = data.total;

                    // prerequisite to pagination
                    $scope.$$pagingState = data.pagingState;
                    $scope.$$pagingBusy = false;
                }
            );
        }


    }
}