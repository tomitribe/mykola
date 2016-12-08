/**
 * @ngdoc directive
 * @name tomitribe-button.directive:tribeButton
 * @function
 *
 * @restrict 'E'
 *
 * @param {string=}  [tribeSize='m']   Size
 * @param {string=}  [tribeColor='primary']  Color
 * @param {string=}  [tribeType='raised']   Type
 *
 * @description
 * Create a button with styles
 *
 * @example

 */

module tomitribe_button {
    require('./tomitribe-button.sass');

    angular
        .module('tomitribe-button', [])
        .directive('tribeButton', tribeButton);

    function tribeButton() {
        var buttonClass;

        return {
            restrict: 'E',
            template: require('./tomitribe-button.jade'),
            compile: compile,
            replace: true,
            transclude: true
        };

        function compile(element, attrs) {
            setButtonStyle(element, attrs.tribeSize, attrs.tribeColor, attrs.tribeType);

            return function (scope, element, attrs) {
                attrs.$observe('tribeSize', function (tribeSize) {
                    setButtonStyle(element, tribeSize, attrs.tribeColor, attrs.tribeType);
                });

                attrs.$observe('tribeColor', function (tribeColor) {
                    setButtonStyle(element, attrs.tribeSize, tribeColor, attrs.tribeType);
                });

                attrs.$observe('tribeType', function (tribeType) {
                    setButtonStyle(element, attrs.tribeSize, attrs.tribeColor, tribeType);
                });

                element.on('click', function (event) {
                    if (attrs.disabled === true) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                });
            };
        }

        function setButtonStyle(element, size, color, type) {
            var buttonBase = 'btn';
            var buttonSize = angular.isDefined(size) ? size : 'm';
            var buttonColor = angular.isDefined(color) ? color : 'primary';
            var buttonType = angular.isDefined(type) ? type : 'raised';

            element.removeClass(buttonClass);

            buttonClass = buttonBase + ' btn-' + buttonSize + ' btn-' + buttonColor + ' btn-' + buttonType;

            element.addClass(buttonClass);
        }
    }
}