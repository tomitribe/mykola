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
            controller: tribeFabController,
            controllerAs: 'tribeFab',
            bindToController: true,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            attrs.$observe('fabDirection', function(newDirection)
            {
                ctrl.setFabDirection(newDirection);
            });
        }
    }

    function tribeFabController()
    {
        var tribeFab = this;

        tribeFab.setFabDirection = setFabDirection;

        function setFabDirection(_direction)
        {
            tribeFab.fabDirection = _direction;
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