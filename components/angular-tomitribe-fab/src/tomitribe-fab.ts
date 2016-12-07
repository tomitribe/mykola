/**
 * @ngdoc directive
 * @name tomitribe-fab.directive:tribeFab
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
                triggerHide: '@?',
                autoClose: '@?'
            },
            link: link,
            controller: ['$scope', '$timeout', '$document', tribeFabController],
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
            scope.autoClose = !!scope.autoClose || false;
            scope.opened = scope.opened || false;

            ctrl.init(scope.fabDirection, scope.fabTrigger, element);
            ctrl.toggleOpen(scope.opened);
        }
    }

    function tribeFabController($scope, $timeout, $document)
    {
        var tribeFab = this;

        tribeFab.init = init;

        function init(_direction, _trigger, el)
        {
            if(typeof _direction !== "string") _direction = "down";
            tribeFab.fabDirection = _direction;

            if(typeof _trigger !== "string") _trigger = "favClick";
            if(!!$scope.trigger) $scope.trigger();
            $scope.trigger = $scope.$watch(_trigger, _checkStatus);

            let _toggleOpen = (_opened)=> {$scope[_trigger] = _opened};
            $scope.$watch('opened', _toggleOpen);
            tribeFab.toggleOpen = _toggleOpen;

            function handler(event) {
                if (!el[0].contains(event.target)) {
                    closeFab();
                    $scope.$apply();
                }
            }
            $scope.handler = handler;

            function closeFab() {
                $scope[_trigger] = false;
            }
            tribeFab.close = closeFab;

            if($scope.autoClose){
                $scope.$on('$destroy', function() {
                    $document.off('click', $scope.handler);
                });
            }
        }

        function _checkStatus(newVal)
        {
            if(!!newVal){
                $scope.opened = true;
                $scope.dynamicClass = 'open';
                if($scope.autoClose){
                    $document.on('click', $scope.handler);
                }
            } else {
                $scope.opened = false;
                $scope.dynamicClass = 'closed';
                if($scope.autoClose){
                    $document.off('click', $scope.handler);
                }
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