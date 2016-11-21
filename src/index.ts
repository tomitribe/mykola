import "angular";
import "angular-route";
import "angular-cookies";
import "angular-resource";
//import "angular-tomitribe-button";
require("../components/angular-tomitribe-button/index");
require("../components/angular-tomitribe-fab/index");
require("../components/angular-tomitribe-tooltip/index");

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "./styles/app.sass";
module index {
    var threeDots = require('file-loader!./images/threeDots-icon.png');
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
                            $scope.threeDots = threeDots;
                        }]
                    })
                    .otherwise({
                        controller: ['$scope', '$location', ($scope, $location) => {
                            $scope.path = $location.path();
                            $scope.threeDots = threeDots;
                        }],
                        template: require('./templates/main.jade')
                    });
            }
        ])
        .run(['$rootScope', function ($rootScope) {
            $rootScope.baseFullPath = angular.element('head base').first().attr('href');
        }]);
}