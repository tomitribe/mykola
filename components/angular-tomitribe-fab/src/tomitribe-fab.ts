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
        .directive('tribeFabActions', ['$timeout', tribeFabActions]);

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

        // It checks if the fabAction has more than one action.
        // If it has only one action, the ellipsis aren't necessary.
        function checkOneAction() {
            if($scope.isOneAction && $scope.fabDirection === 'left') {
                $timeout(() => $scope.$apply(() => {
                    $scope.dynamicClass = 'open';
                }));
            }
        }

        function init(_direction, _trigger, el)
        {
            if(typeof _direction !== "string") _direction = "down";
            tribeFab.fabDirection = _direction;

            if(typeof _trigger !== "string") _trigger = "favClick";
            if(!!$scope.trigger) $scope.trigger();
            $scope.trigger = $scope.$watch(_trigger, _checkStatus);
            $scope.$watch('isOneAction', () => {
                checkOneAction();
            });
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
            checkOneAction();
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

        tribeFab.setIsOneAction = (isOneAction) => {
            $timeout(() => $scope.$apply(() => {
                $scope.isOneAction = isOneAction;
            }));
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

    function tribeFabActions($timeout)
    {
        return {
            restrict: 'E',
            require: '^tribeFab',
            template: require('./tomitribe-fab-actions.jade'),
            link: (scope, el, attrs, ctrl) => {
                link(scope, el, attrs, ctrl);
                $timeout(() => {
                    if(el.find('> a').length < 2) {
                        scope.parentCtrl.setIsOneAction(true);
                    }
                });
            },
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.parentCtrl = ctrl;
        }
    }
}