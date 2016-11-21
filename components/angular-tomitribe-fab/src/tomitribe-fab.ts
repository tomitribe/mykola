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
        .directive('tribeFab', tribeFab)
        .directive('tribeFabTrigger', tribeFabTrigger)
        .directive('tribeFabActions', tribeFabActions);

    function tribeFab()
    {
        return {
            restrict: 'E',
            template: require('./tomitribe-fab.jade'),
            scope: true,
            link: link,
            controller: ['$scope', tribeFabController],
            controllerAs: 'tribeFab',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.fabClick = false;
            scope.fabOver = false;
            scope.dynamicClass = 'closed';
            scope.hideTrigger = false;

            attrs.$observe('fabDirection', function(newDirection)
            {
                ctrl.setFabDirection(newDirection);
            });

            attrs.$observe('fabTrigger', function(newTrigger)
            {
                ctrl.setFabTrigger(newTrigger);
            });

            if(attrs.triggerHide) {
                scope.hideTrigger = true;
            }
        }
    }

    function tribeFabController($scope)
    {
        var tribeFab = this;

        tribeFab.setFabDirection = setFabDirection;

        function setFabDirection(_direction)
        {
            if(typeof _direction !== "string") return;
            tribeFab.fabDirection = _direction;
        }

        tribeFab.setFabTrigger = setFabTrigger;

        function setFabTrigger(_newTrigger){
            if(typeof _newTrigger !== "string") return;
            if(!!$scope.trigger) $scope.trigger();
            $scope.trigger = $scope.$watch(_newTrigger, function(newVal)
            {
                if(newVal){
                    $scope.opened = true;
                    $scope.dynamicClass = 'open';
                } else {
                    $scope.opened = false;
                    $scope.dynamicClass = 'closed';
                }
            });
        }
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