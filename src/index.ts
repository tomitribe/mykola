import "angular";
import "angular-route";
import "angular-cookies";
import "angular-resource";

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "./styles/app.sass";
module index {
    angular.module("demo-app", ['ngRoute'])
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
                        template: require('./templates/main.jade')
                    })
                    .otherwise({
                        controller: ['$scope', '$location', function ($scope, $location) {
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