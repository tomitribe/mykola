/**
 * @ngdoc directive
 * @name tomitribe-bulkedit.directive:tribeBulkedit
 *
 * @restrict 'E'
 *
 * @param {(Object[]|Object)}   listItems                       List of all items (could be array(list) of objects(items) or object with different lists in properties)
 * @param {String[]}            [listProp=[]]                   List of properties if listItems is an object
 *
 * @param {Object[]}            operatorItems                   Operation used for each selected item
 * @property {string=}          operatorItems[].itemClass      Operation item classes
 * @property {string=}          operatorItems[].iconClass      Operation icon classes
 * @property {string=}          operatorItems[].tooltip        Operation item tooltip
 * @property {function}         operatorItems[].invoke          Operation function which will be invoked
 * @property {boolean=}         operatorItems[].applyAll        Operation function apply all items at once
 *
 * @param {boolean=}            [allChecked=false]              All checked two way flag
 * @param {string=}             [selectField='$$selected']      Field that is used as select property
 * @param {string=}             [multiField='$$type']           Field that is used as additional multiField property
 * @param {string=}             [itemsName='Items']             Field that is used in counter in bulk bar
 *
 * @description
 * Create bulk edit bar, used for applying operator actions on selected items
 *
 * @scope
 *
 * @example
 * <example module="tribeBulkeditEx">
     <file name="index.html">
         <div ng-controller="TribeBulkeditCtrl">
            <ul class="items-list">
                <li class="item" ng-repeat="item in listItems" ng-click="item.$$selected = !item.$$selected" ng-class="{selected: item.$$selected}">
                    {{item.name}}, {{item.rate}}, {{item.$$selected | json}}
                </li>
            </ul>
            <tribe-bulkedit list-items="listItems" operator-items="operatorItems" select-field="$$selected" all-checked="allChecked">
            </tribe-bulkedit>
         </div>
     </file>
     <file name="script.js">
    angular.module('tribeBulkeditEx', ['tomitribe-bulkedit', 'tomitribe-tooltip'])
        .controller('TribeBulkeditCtrl', ['$scope', function($scope){
            $scope.listItems = [{
                    name: 'FirstApp',
                    rate: 5
                },
                {
                    name: 'SecondApp',
                    rate: 3
                },
                {
                    name: 'SecondApp',
                    rate: 4
                },
                {
                    name: 'SecondApp',
                    rate: 5
                }];
            $scope.listItems[0].$$selected = true;
            $scope.operatorItems = [
                {
                    iconClass: "fa-share",
                    itemClass: "class1",
                    invoke: function(items){console.log(items)},
                    tooltip: "share"
                },
                {
                    iconClass:"fa-inbox",
                    itemClass:"class2",
                    invoke: function(items){console.log(items)},
                    tooltip: "archive"
                },
                {
                    iconClass:"fa-trash",
                    invoke: function(items){console.log(items)},
                    applyAll: true,
                    tooltip: "delete"
                },
            ];
            $scope.allChecked = false;
      }]);
     </file>
   </example>
 */
module tomitribe_bulkbar {
    require('./tomitribe-bulkedit.sass');

    angular
        .module('tomitribe-bulkedit', [])
        .directive('tribeBulkedit', tribebulkbar);

    function tribebulkbar() {
        return {
            restrict: 'E',
            template: require('./tomitribe-bulkedit.jade'),
            controller: ['$scope', '$document', bulkEditController],
            scope: {
                operatorItems: '=',
                allChecked: '=?',
                listItems: '=',
                listProp: '=?',
                selectField: '@?',
                multiField: '@?',
                itemsName: '@?'
            },
            link: link
        };
        function link(scope) {
            if (!scope.allChecked) scope.allChecked = false;
            if (!scope.listItems) scope.listItems = [];
            if (!scope.listProp) scope.listProp = [];
            if (!scope.selectField) scope.selectField = "$$selected";
            if (!scope.multiField) scope.multiField = "$$type";
            if (!scope.itemsName) scope.itemsName = "Items";
            scope.selectState = false;
            scope.showAllChecker = true;
            scope.itemsCount = 0;
        }

        function bulkEditController($scope, $document) {
            $scope.$watchCollection(
                function () {
                    var selectedItems = [];
                    if (!!$scope.listItems) {
                        if ($scope.listItems.length > 0 || (angular.isArray($scope.listProp) && !angular.isArray($scope.listItems))) {
                            if ($scope.listProp.length) {
                                $scope.itemsCount = 0;
                                angular.forEach($scope.listProp, function (prop) {
                                    if ($scope.listItems[prop] && angular.isArray($scope.listItems[prop])) {
                                        $scope.listItems[prop].map(function (item) {
                                            if ($scope.multiField) item[$scope.multiField] = prop;
                                            if (item[$scope.selectField]) selectedItems.push(item);
                                        });
                                        $scope.itemsCount += $scope.listItems[prop].length;
                                    }
                                });
                            } else {
                                angular.forEach($scope.listItems, function (item) {
                                    if (item[$scope.selectField]) selectedItems.push(item);
                                });
                                $scope.itemsCount = $scope.listItems.length;
                            }
                        }
                    }
                    return selectedItems;
                }, function (data) {
                    $scope.selectedCount = data.length;
                    $scope.selectedItems = data;
                    if ($scope.itemsCount > 0) {
                        $scope.allChecked = (data.length === $scope.itemsCount);
                    }
                }, true);

            $scope.checkAll = function (state) {
                if (typeof state === "boolean") {
                    $scope.selectState = state;
                } else {
                    $scope.selectState = !$scope.selectState;
                }
                if ($scope.listProp.length) {
                    angular.forEach($scope.listProp, function (prop) {
                        if ($scope.listItems[prop] && angular.isArray($scope.listItems[prop])) {
                            angular.forEach($scope.listItems[prop], function (item) {
                                item[$scope.selectField] = state;
                            });
                        }
                    });
                } else {
                    angular.forEach($scope.listItems, function (item) {
                        item[$scope.selectField] = state;
                    });
                }
            };

            $scope.applyBulk = function (operator) {
                if (!operator) return;
                var items = $scope.selectedItems,
                    applyAll = operator.applyAll || false;
                if (!!items && items.length > 0) {
                    if (applyAll) {
                        operator.invoke(items);
                    } else {
                        angular.forEach($scope.selectedItems, function (item) {
                            operator.invoke(item);
                        });
                    }
                }
            };

            $document.on('keyup', function (e) {
                if (e.keyCode === 27) {
                    $scope.checkAll(false);
                    $scope.$apply();
                }
            });
        }
    }

}