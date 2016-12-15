/**
 * @ngdoc directive
 * @name tomitribe-sortlist.directive:tribeSortable
 * @function
 *
 * @description
 * Create a dragndrop sorting list
 *
 * @example

 */

module tomitribe_fab {
    let sortable = require('html5sortable');

    angular
        .module('tomitribe-sortable', [])
        .directive('tribeSortable', tribeSortable);

    function tribeSortable() {
        return {
            restrict: 'A',
            scope: {
                tribeSortableOptions: '=?',
                tribeSortableCallback: '&?',
                ngModel: '=?',
            },
            controller: ['$scope', '$timeout', tribeSortableController],
            controllerAs: 'tribeFab',
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            var defOpt = {
                placeholderClass: 'item item-placeholder'
            }, opts = angular.extend(defOpt, scope.tribeSortableOptions || {});
            if (element && element.length > 0) {
                ctrl.init(element[0], opts);
            }
        }

        function tribeSortableController($scope, $timeout) {
            var tribeSortable = this;

            function replace(from, to, model) {
                return model.splice(to, 0, model.splice(from, 1)[0]);
            }

            tribeSortable.replace = replace;

            function init(element, opts) {
                sortable(element, opts);

                tribeSortable.reloadelements = function () {
                    $timeout(function () {
                        sortable(element, 'reload'); // jshint ignore:line
                    }, 50);
                };

                if ($scope.ngModel) {
                    $scope.ngModel['$render'] = tribeSortable.reloadelements;
                    $scope.$watch('ngModel', tribeSortable.reloadelements);

                    element.addEventListener('sortupdate', function (e) {
                        var data = e['detail'];

                        var from = data.oldElementIndex;
                        var to = data.elementIndex;
                        if ($scope.tribeSortableCallback) {
                            $scope.tribeSortableCallback({from: from, to: to, model: $scope.ngModel, replaceFn: tribeSortable.replace});
                        } else {
                            tribeSortable.replace(from, to, $scope.ngModel);
                        }
                        $scope.$apply();
                    })
                }
            }
            tribeSortable.init = init;
        }
    }
}