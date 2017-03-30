/**
 * @ngdoc directive
 * @name tomitribe-select.directive:tribeActivateHover
 * @function
 *
 * @description
 * Set option active, onmouseenter event, in ui-select
 *
 */
module tomitribe_select {
    angular
        .module('tomitribe-select', [])
        .directive('tribeActivateHover', ['$timeout', tribeActivateHover]);

    function tribeActivateHover($timeout) {
        return {
            restrict: 'A',
            replace: false,
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            element.on("mouseenter", ()=> {
                $timeout(() => {
                    scope.$select.activeIndex = scope.$select.items.indexOf(scope.$parent[attrs.activateHover]);
                });
            });
        }
    }
}