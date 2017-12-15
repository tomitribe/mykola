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

import './tomitribe-select.scss';

module tomitribe_select {
    let _ = require('underscore');

    angular
        .module('tomitribe-select', [])
        .directive('tribeActivateHover', ['$timeout', tribeActivateHover])
        .directive('tribeSelectOpenOnFocus', ['$timeout', tribeSelectOpenOnFocus])
        .directive('tribeSelectPreventTab', ['$timeout', tribeSelectPreventTab])
        .directive('tribeSelectFetchOnOpen', tribeSelectFetchOnOpen)
        .directive('tribeSelectPaginationLoader', tribeSelectPaginationLoader)
        .directive('tribeSelectSaveSearch', tribeSelectSaveSearch)
        .directive('tribeSelectMaxLength', tribeSelectMaxLength)
        .directive('tribeSelectRedrawOnTagging', tribeSelectRedrawOnTagging)
        .directive('tribeSelectDontCloseOnClick', tribeSelectDontCloseOnClick)
        .directive('tribeSelectFetchOnSelect', tribeSelectFetchOnSelect)
        .directive('tribeSelectOnTab', ['$timeout', tribeSelectOnTab])
        .directive('tribeSelectOnEsc', ['$document', tribeSelectOnEsc]);

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

            const activateWithDelay = (activate: () => void, delay: number, once: boolean) => {
                return $timeout(activate, (delay && (!once || !runCounter)) ? delay : 0);
            }

            const focusHandler = () => {
                destroyTimer();
                if (autoOpen && angular.isNumber(scope.openOnFocusDelay)) {
                    timer = activateWithDelay(uiSelect.activate, scope.openOnFocusDelay, scope.openOnFocusDelayOnce);
                    runCounter++;
                }
            }

            // multiple selects have no focusser
            if (uiSelect.multiple) {
                angular.element(uiSelect.focusInput).on('focus', focusHandler);
            } else {
                angular.element(uiSelect.focusser).on('focus', focusHandler);
            }

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
                   },
                   scope.openOnFocusDelay + 250 // https://github.com/angular-ui/ui-select/issues/428#issuecomment-206684328
                );
            });

            scope.$on('$destroy', () => {
                destroyTimer();
            });
        }
    }

    function tribeSelectFetchOnOpen() {
        return {
            restrict: 'A',
            require: '^uiSelect',
            replace: false,
            link: link,
        };

        function link(scope, element, attrs, uiSelectCtrl) {
            scope.$on('uis:activate', ()=> {
                if(attrs['refresh']) {
                    uiSelectCtrl.refresh(attrs['refresh']);
                }
            });
        }
    }

    function tribeSelectSaveSearch() {
        return {
            require: '^uiSelect',
            replace: false,
            link: link
        };
        function link(scope, element, attrs, uiSelect) {
            // let default key be id
            const key = attrs.tribeSelectSaveSearch || 'id';
            // prevent input clear on select
            uiSelect.resetSearchInput = false;
            // copy selected attr to search field
            const choiceToSearch = () => {
                let search = angular.isObject(uiSelect.selected) ? uiSelect.selected[key] : uiSelect.selected;
                if(search) {
                    uiSelect.search = search
                }
            };
            scope.$on('uis:select', choiceToSearch);
            scope.$on('uis:close', choiceToSearch);
        }
    }

    function tribeSelectPaginationLoader() {
        return {
            restrict: 'E',
            replace: false,
            template: require('./tomitribe-pagination-loader.jade'),
            require: '^uiSelect',
            scope: {
                pagingState: '=',
                pagingBusy: '=',
                refresh: '&'
            },
            link: link
        };

        function link(scope, element, attrs, ctrl) {
            scope.$select = ctrl;
            scope.collectionContainer = element.parents('.ui-select-choices-content')[0];
        }
    }

    function tribeSelectMaxLength() {
        return {
            restrict: 'A',
            replace: false,
            require: 'uiSelect',
            link: link
        };

        function link(scope, element, attrs, uiSelectCtrl) {
            if (uiSelectCtrl.searchInput && uiSelectCtrl.searchInput.length > 0) {
                uiSelectCtrl.searchInput.attr("maxlength", attrs.tribeSelectMaxLength);
            }
        }
    }

    function tribeSelectRedrawOnTagging() {
      return {
        restrict: 'A',
        replace: false,
        require: '^uiSelect',
        link: link
      };

      function link(scope, element, attrs, uiSelect) {
        scope.$watchCollection('$select.items', () => {
            if (scope.calculateDropdownPos) scope.calculateDropdownPos();
        })
      }
    }

    function tribeSelectOnTab($timeout) {
        return {
            restrict: 'A',
            require: 'uiSelect',
            replace: false,
            link: link
        };
        function link(scope, element, attrs, uiSelect) {
            if (uiSelect.searchInput) {
                uiSelect.searchInput.bindFirst('keydown', function (e) {
                    if (e.keyCode === 9) {
                        if (!uiSelect.multiple) {
                            uiSelect.selected = uiSelect.items[uiSelect.activeIndex];
                            uiSelect.search = uiSelect.items[uiSelect.activeIndex];
                            $timeout(() => {
                                uiSelect.select(uiSelect.items[uiSelect.activeIndex], true);
                            });
                        }
                    }
                });
            }
        }
    }

    function tribeSelectDontCloseOnClick() {
      return {
          restrict: 'A',
          require: 'uiSelect',
          replace: false,
          link: link
      };
      function link(scope, element, attrs, ctrl) {
          ctrl.searchInput.off('click').on('click', (event) => {
            if (ctrl.open) event.stopPropagation();
          })
      }
    }

    function tribeSelectFetchOnSelect() {
      return {
        restrict: 'A',
        replace: false,
        require: '^uiSelect',
        link: link
      };

      function link(scope, el, attrs, uiSelect) {
        const fetchItemsCount = parseInt(attrs.fetchItemsCount) || 10;

        if (!attrs.refresh) {
          console.warn('tribe-select-refresh-on-list-drain requires refresh attribute!')
          return;
        }

        scope.$on('uis:select', () => {
          if (uiSelect.items.length < fetchItemsCount) uiSelect.refresh(attrs.refresh);
        });
      }
    }

    function tribeSelectOnEsc($document) {
        return {
            restrict: 'A',
            require: 'uiSelect',
            replace: false,
            link: link
        };

        function link(scope, element, attrs, uiSelectCtrl) {
            if (attrs.tribeSelectOnEsc && document.querySelectorAll(attrs.tribeSelectOnEsc).length && uiSelectCtrl.searchInput) {
                uiSelectCtrl.searchInput.bindFirst('keydown', function (event) {
                    //we cannot trust in uiSelectCtrl.open: its only updated after this event
                    if (event.keyCode === 27 && element.find('.ui-select-choices').hasClass('ng-hide')) {
                        event.stopImmediatePropagation();
                        //Create new event and fire in $document
                        $document.trigger($.Event('keydown', {keyCode: 27, which: 27}));
                    }
                });
            }
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
