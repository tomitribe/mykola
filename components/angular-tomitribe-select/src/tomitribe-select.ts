/**
 * @ngdoc directive
 * @name tomitribe-select.directive
 * @function
 *
 * @description
 * tribeActivateHover: Set option active, onmouseenter event, in ui-select
 * tribeSelectOpenOnFocus: this directive set the select active, on focus (tab)
 * tribeSelectPreventTab: this directive prevent tab selection
 * tribeSelectFetchOnOpen: this directive refresh the list options, when the dropdown is opened
 *
 */
module tomitribe_select {
    let _ = require('underscore');

    angular
        .module('tomitribe-select', [])
        .directive('tribeActivateHover', ['$timeout', tribeActivateHover])
        .directive('tribeSelectOpenOnFocus', ['$timeout', tribeSelectOpenOnFocus])
        .directive('tribeSelectPreventTab', ['$timeout', tribeSelectPreventTab])
        .directive('tribeSelectFetchOnOpen', ['$timeout', tribeSelectFetchOnOpen]);

    function tribeSelectPreventTab($timeout) {
        return {
            restrict: 'A',
            require: ['uiSelect', 'ngModel'],
            replace: false,
            link: link
        };

        function link(scope, element, attrs, crtl) {
            let uiSelectCtrl = crtl[0];

            if (uiSelectCtrl.searchInput) {
                let ngModelCtrl = crtl[1], singleSelectInitialIndex;

                uiSelectCtrl.searchInput.bindFirst('keydown', function (e) {
                    if (e.keyCode === 9) {
                        if (!uiSelectCtrl.multiple) {
                            uiSelectCtrl.activeIndex = singleSelectInitialIndex;

                            if(uiSelectCtrl.tagging) {
                                uiSelectCtrl.close(true);
                            }
                        } else {
                            uiSelectCtrl.close();
                        }
                    }
                });

                scope.$on('uis:activate', ()=> {
                    $timeout(()=> {
                        if (!uiSelectCtrl.multiple) {
                            $timeout(()=> {
                                singleSelectInitialIndex = findIndex(ngModelCtrl.$viewValue, ngModelCtrl, uiSelectCtrl);
                            });
                        }
                    });
                });
            }
        }

        function findIndex (initial, ngModelCtrl, uiSelectCtrl) {
            if(!ngModelCtrl.$viewValue) {
                return -1;
            }

            if(initial.hasOwnProperty("id")) {
                return _.findIndex(uiSelectCtrl.items, {id: initial.id})
            } else {
                return _.indexOf(uiSelectCtrl.items, initial)
            }
        }
    }

    function tribeActivateHover($timeout) {
        return {
            restrict: 'A',
            replace: false,
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            if (attrs.tribeActivateHover && scope.$parent[attrs.tribeActivateHover]) {
                element.on("mouseenter", ()=> {
                    $timeout(() => {
                        scope.$select.activeIndex = scope.$select.items.indexOf(scope.$parent[attrs.tribeActivateHover]);
                    });
                });
            }
        }
    }

    function tribeSelectOpenOnFocus($timeout) {
        return {
            require: 'uiSelect',
            replace: false,
            link: link
        };

        function link(scope, element, attrs, uiSelect) {
            scope.openOnFocusDelay = angular.isDefined(attrs.openOnFocusDelay) ? parseInt(attrs.openOnFocusDelay) : 0;
            scope.openOnFocusDelayOnce = angular.isDefined(attrs.openOnFocusDelayOnce) ? attrs.openOnFocusDelayOnce : false;
            let timer = null;
            const destroyTimer = () => timer ? $timeout.cancel(timer) : {};

            let runCounter = 0;
            let autoOpen = true;

            function activateWithDelay(activate: () => void, delay: number, once: boolean) {
                return $timeout(activate, (delay && (!once || !runCounter)) ? delay : 0);
            }

            angular.element(uiSelect.focusInput).on('focus', function() {
                if (!uiSelect.open && autoOpen && angular.isNumber(scope.openOnFocusDelay)) {
                    timer = activateWithDelay(uiSelect.activate, scope.openOnFocusDelay, scope.openOnFocusDelayOnce);
                    runCounter++;
                }
            });

            angular.element(uiSelect.focusInput).on('blur', ()=> {
                destroyTimer();
                //On blur when we don't have element, we must force the uiSelect to close
                if (uiSelect.items && uiSelect.items.length === 0) uiSelect.close();
            });

            if (!uiSelect.multiple && uiSelect.tagging) {
                scope.$on('uis:activate', ()=> {
                    $timeout(()=> {
                        if(uiSelect.activeIndex === -1 && uiSelect.items && uiSelect.items.length >= 1) {
                            uiSelect.activeIndex = 0;
                        }
                    });
                });
            }

            // Re-enable the auto open after the select element has been closed
            scope.$on('uis:close', () => {
               autoOpen = false;
               $timeout(
                   () => {
                       autoOpen = true;
                       angular.element(uiSelect.focusInput).blur(); // IE continious open fix
                   },
                   scope.openOnFocusDelay
                );
            });

            scope.$on('$destroy', () => {
                destroyTimer();
            });
        }
    }

    function tribeSelectFetchOnOpen($timeout) {
        return {
            restrict: 'A',
            require: 'uiSelect',
            replace: false,
            link: link,
        };

        function link(scope, element, attrs, uiSelectCtrl) {
            scope.$on('uis:activate', ()=> {
                //Force dropdown to refresh
                let oldSearch = uiSelectCtrl.search;
                uiSelectCtrl.search = undefined;

                $timeout(()=> {
                    uiSelectCtrl.search = oldSearch;
                });
            });
        }
    }
    // todo: fix proper interfacing
    (<any>$).fn.bindFirst = function (name, fn) {
        this.on(name, fn);
        this.each(function () {
            var handlers = $["_data"](this, 'events')[name.split('.')[0]];
            var handler = handlers.pop();
            handlers.splice(0, 0, handler);
        });
    };
}