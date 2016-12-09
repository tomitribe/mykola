require('./vendors');

import "./styles/app.sass";

module index {
    angular.module("demo-app", ['ngRoute', 'tomitribe-button', 'tomitribe-fab', 'tomitribe-tooltip', 'tomitribe-dropdown', 'tomitribe-bulkedit', 'tomitribe-tags'])
        .config(['uiSelectConfig', function (uiSelectConfig) {
            uiSelectConfig.theme = 'selectize';
            uiSelectConfig.resetSearchInput = true;
        }])
        .config([
            '$locationProvider', '$routeProvider', '$httpProvider', '$logProvider',
            function ($locationProvider, $routeProvider, $httpProvider, $logProvider) {
                $logProvider.debugEnabled(false); // GUI is really too slow, let's use a debugger if needed

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: true
                });

                $routeProvider
                    .when('/', {
                        template: require('./templates/home.jade'),
                        controller: ['$scope', ($scope) => {

                        }]
                    })
                    .when('/plus', {
                        template: require('./templates/plus.jade'),
                        controller: ['$scope', ($scope) => {
                            $scope.menuOneStatus = true;
                            const onAction = a => $scope.selectedAction = a;
                            $scope.actions = ['pencil', 'remove'].map(n => {
                              return {icon: n, name: n, invoke: () => onAction(n)};
                            });
                        }]
                    })
                    .when('/bulk-edit', {
                        template: require('./templates/bulk-edit.jade'),
                        controller: ['$scope', ($scope) => {
                            const onAction = (items, action) => {
                              $scope.selectedAction = action;
                              $scope.selectedItems = items.constructor == Array ? items : [items];
                            };

                            $scope.items = [{
                                    name: 'First App',
                                    rate: 5
                                },
                                {
                                    name: 'Another App',
                                    rate: 3
                                },
                                {
                                    name: 'Second App',
                                    rate: 4
                                },
                                {
                                    name: 'Last App',
                                    rate: 5
                                }];
                            $scope.items[0].$$selected = true;
                            $scope.operatorItems = [
                                {
                                    iconClass: "fa-2x fa-share",
                                    itemClass: "class1",
                                    invoke: function(items){onAction(items, 'share');},
                                    tooltip: "share"
                                },
                                {
                                    iconClass:"fa-2x fa-inbox",
                                    itemClass:"class2",
                                    invoke: function(items){onAction(items, 'archive');},
                                    tooltip: "archive"
                                },
                                {
                                    iconClass:"fa-2x fa-trash",
                                    invoke: function(items){onAction(items, 'delete');},
                                    applyAll: true,
                                    tooltip: "delete"
                                },
                            ];
                            $scope.checkedStatus = false;
                        }]
                    })
                    .when('/dropdown', {
                        template: require('./templates/dropdown.jade'),
                        controller: ['$scope', ($scope) => {
                            $scope.dropDownStatus = true;
                            $scope.dropDownTwoStatus = true;
                        }]
                    })
                    .when('/tags', {
                        template: require('./templates/tags.jade'),
                        controller: ['$scope', ($scope) => {
                            $scope.tags = [];
                        }]
                    })
                    .otherwise({
                        controller: ['$scope', '$location', ($scope, $location) => {
                            $scope.path = $location.path();
                        }],
                        template: require('./templates/home.jade')
                    });
            }
        ])
        .run(['$rootScope', function ($rootScope) {
            $rootScope.baseFullPath = angular.element('head base').first().attr('href');
        }]);
}
