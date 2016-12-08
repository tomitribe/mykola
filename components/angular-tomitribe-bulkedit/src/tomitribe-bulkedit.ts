/**
 * @ngdoc directive
 * @name tomitribe-bulkedit.directive:tribeBulkedit
 *
 * @restrict 'E'
 *
 * @param {Object[]}    listItems                       List of all items that could be selected
 *
 * @param {Object[]}    operatorItems                   Operation used for each selected item
 * @property {string=}   operatorItems[].itemClass      Operation item classes
 * @property {string=}   operatorItems[].iconClass      Operation icon classes
 * @property {string=}   operatorItems[].tooltip        Operation item tooltip
 * @property {function} operatorItems[].invoke          Operation function which will be invoked
 * @property {boolean=} operatorItems[].applyAll        Operation function apply all items at once
 *
 * @param {boolean=}    [allChecked=false]              All checked two way flag
 * @param {string=}     [selectField='$$selected']      Field that is used as select property
 * @param {string=}     [itemsName='Items']             Field that is used in counter in bulk bar
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
                selectField: '@?',
                itemsName: '@?'
            },
            link:link
        };
        function link(scope)
        {
            scope.selectState = false;
            scope.showAllChecker = true;
            if(!scope.allChecked) scope.allChecked = false;
            if(!scope.listItems) scope.listItems = [];
            if(!scope.selectField) scope.selectField = "$$selected";
            if(!scope.itemsName) scope.itemsName = "Items";
        }

        function bulkEditController($scope, $document) {
            $scope.$watchCollection(
                function(){
                    var selectedItems = [];
                    if(!$scope.listItems) {
                        $scope.itemsCount = 0;
                        return selectedItems;
                    } else {
                        $scope.itemsCount = $scope.listItems.length;
                    }
                    if($scope.itemsCount > 0){
                        angular.forEach($scope.listItems, function(item){
                            if(item[$scope.selectField]) selectedItems.push(item);
                        });
                    }
                    return selectedItems;
                },function(data) {
                    $scope.selectedCount = data.length;
                    $scope.selectedItems = data;
                    if ($scope.itemsCount > 0) {
                        $scope.allChecked = (data.length === $scope.itemsCount);
                    }
                }, true);

            $scope.checkAll = function(state){
                if(typeof state === "boolean"){
                    $scope.selectState = state;
                } else {
                    $scope.selectState = !$scope.selectState;
                }
                angular.forEach($scope.listItems, function(item){
                    item[$scope.selectField] = state;
                });
            };

            $scope.applyBulk = function(operator){
                if(!operator) return;
                var items = $scope.selectedItems,
                    applyAll = operator.applyAll || false;
                if(!!items && items.length > 0) {
                    if(applyAll) {
                        operator.invoke(items);
                    }else{
                        angular.forEach($scope.selectedItems, function(item){
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