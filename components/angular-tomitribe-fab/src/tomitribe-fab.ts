/**
 * @ngdoc directive
 * @name angular-diff.directive:tribeButton
 * @function
 *
 * @description
 * Create a button with styles
 *
 * @example

 */

module tomitribe_fab {
    require('./tomitribe-fab.sass');
    angular
        .module('tomitribe-fab', [])
        .directive('tribeFab', ['$timeout', tribeFab])
        .directive('tribeFabTrigger', tribeFabTrigger)
        .directive('tribeFabActions', tribeFabActions);

    function tribeFab($timeout)
    {
        return {
            restrict: 'E',
            template: require('./tomitribe-fab.jade'),
            scope: {
                fabTrigger: '@?',
                fabDirection: '@?',
                opened: '=?openedStatus',
                triggerHide: '@?'
            },
            link: link,
            controller: ['$scope', '$timeout', tribeFabController],
            controllerAs: 'tribeFab',
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.fabClick = false;
            scope.fabOver = false;
            scope.dynamicClass = 'closed';
            scope.triggerHide = !!scope.triggerHide || false;
            scope.opened = scope.opened || false;

            ctrl.init(scope.fabDirection, scope.fabTrigger);
            ctrl.toggleOpen(scope.opened);
        }
    }

    function tribeFabController($scope, $timeout)
    {
        var tribeFab = this;

        tribeFab.init = init;

        function init(_direction, _trigger)
        {
            if(typeof _direction !== "string") _direction = "down";
            tribeFab.fabDirection = _direction;

            if(typeof _trigger !== "string") _trigger = "favClick";
            if(!!$scope.trigger) $scope.trigger();
            $scope.trigger = $scope.$watch(_trigger, _checkStatus);

            let _toggleOpen = (_opened)=> {$scope[_trigger] = _opened};
            $scope.$watch('opened', _toggleOpen);
            tribeFab.toggleOpen = _toggleOpen;
        }

        function _checkStatus(newVal)
        {
            if(!!newVal){
                $scope.opened = true;
                $scope.dynamicClass = 'open';
            } else {
                $scope.opened = false;
                $scope.dynamicClass = 'closed';
            }
        }

        var timer;
        $scope.showIt = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $scope.fabOver = true;
            }, 200);
        };

        $scope.hideIt = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $scope.fabOver = false;
            }, 200);
        };
    }

    function tribeFabTrigger()
    {
        return {
            restrict: 'E',
            require: '^tribeFab',
            template: require('./tomitribe-fab-trigger.jade'),
            transclude: true,
            replace: true
        };
    }

    function tribeFabActions()
    {
        return {
            restrict: 'E',
            require: '^tribeFab',
            template: require('./tomitribe-fab-actions.jade'),
            link: link,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.parentCtrl = ctrl;
        }
    }
}