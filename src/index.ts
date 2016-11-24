import "angular";
import "angular-route";
import "angular-cookies";
import "angular-resource";
import "angular-tomitribe-common";

require("../components/angular-tomitribe-button/index");
require("../components/angular-tomitribe-fab/index");
require("../components/angular-tomitribe-tooltip/index");

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "./styles/app.sass";

module index {
    angular.module("demo-app", ['ngRoute', 'tomitribe-button', 'tomitribe-fab', 'tomitribe-tooltip'])
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
                        template: require('./templates/main.jade'),
                        controller: ['$scope', ($scope) =>{
                            $scope.menuOneStatus = true;
                        }]
                    })
                    .otherwise({
                        controller: ['$scope', '$location', ($scope, $location) => {
                            $scope.path = $location.path();
                        }],
                        template: require('./templates/main.jade')
                    });
            }
        ])
        .run(['$rootScope', function ($rootScope) {
            $rootScope.baseFullPath = angular.element('head base').first().attr('href');
        }]);
}