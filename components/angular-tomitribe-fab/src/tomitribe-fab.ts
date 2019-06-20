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

    function tribeFab($timeout) {
        return {
            restrict: 'E',
            template: require('./tomitribe-fab.jade'),
            scope: {
                fabTrigger: '@?',
                fabDirection: '@?',
                opened: '=?openedStatus',
                triggerHide: '@?',
                autoClose: '@?',
                closeSelector: '@?',
                fabTabindex: '=?',
                openOnFocus: '=?'
            },
            link: link,
            controller: ['$scope', '$timeout', '$document', '$rootScope', tribeFabController],
            controllerAs: 'tribeFab',
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl) {
            scope.fabClick = false;
            scope.fabOver = false;
            scope.dynamicClass = 'closed';
            scope.triggerHide = !!scope.triggerHide || false;
            scope.opened = scope.opened || false;
            scope.selectedIndex = 0;

            scope.openOnFocus = scope.openOnFocus !== undefined ? scope.openOnFocus : true;

            if (scope.autoClose === 'true') {
                //if 'true' use our default styles
                scope.ignoreSelector = 'body.modal-open, .modal-backdrop, .modal';
            } else {
                //if not string or string is empty(or not exist) make it false
                if (typeof scope.autoClose !== 'string' || !scope.autoClose) {
                    scope.ignoreSelector = '';
                } else {
                    scope.ignoreSelector = scope.autoClose;
                }
            }

            scope.closeSelector = scope.closeSelector || '.closeFab,.cancel';

            ctrl.init(scope.fabDirection, scope.fabTrigger, element);
            ctrl.toggleOpen(scope.opened);

            scope.onFocus = function () {
                scope.opened = true;
            };

            //When we hover into an element, we fire focus
            $timeout(()=> {
                element.find('.fab-primary a').on('click', ($event)=> {
                    //trigger
                    setInitialState(true);
                });
                element.find('.fab-actions a').on('mouseover', ($event)=> {
                    //Get the element index
                    var index = findOptionIndex($event.currentTarget);
                    if (index >= 0) {
                        //update selected index
                        scope.selectedIndex = index;
                        //focus the element
                        getFocusableElement(scope.selectedIndex).focus();
                    }
                });
            });

            //Keyboard navigation
            if (scope.fabTrigger) {
                if (!scope.opened) {
                    //Remove options tabindex if closed
                    $timeout(()=> element.find('.fab-actions a').attr('tabindex', -1));
                }

                //Remove tabindex from fab-primary
                element.find('.fab-primary a').attr("tabindex", -1);

                scope.keyDown = function ($event, preventFocus?) {
                    if (($event.keyCode === 40 && !isOpen()) || ($event.keyCode === 39 && !isOpen()) || ($event.keyCode === 13 && isFocusOnTrigger())) {
                        //Arrow down || Arrow right || Enter -> Open
                        setMenuStatus(true, $event);

                    } else if (isOpen() && (($event.keyCode === 40) || ($event.keyCode === 9 && !$event.shiftKey))) {
                        //Arrow down || TAB -> Navigate down through menu items
                        if(isFocusOnTrigger() || hasNextFocusableElement()) {
                            if (isFocusOnTrigger()) {
                                //reset index
                                scope.selectedIndex = 0;
                            }
                            moveDown($event);
                        } else {
                            //Going to exit
                            if(scope.openOnFocus) {
                                setMenuStatus(false, $event, true);
                            }
                        }
                    } else if (($event.keyCode === 38 && isOpen()) || $event.shiftKey && $event.keyCode === 9) {
                        //Arrow up Shift-TAB -> Navigate up through menu items
                        if(scope.selectedIndex === 0) {
                            //Going to exit
                            if(scope.openOnFocus) {
                                scope.opened = false;
                            }
                        } else {
                            moveUp($event);
                        }

                    } else if ($event.keyCode === 37 || $event.keyCode === 38 || $event.keyCode === 27) {
                        //Arrow left || Arrow Up || ESC  -> Close
                        setMenuStatus(false, $event, preventFocus);

                    } else if ($event.keyCode === 13 && !isFocusOnTrigger()) {
                        //Enter->  "click" in a menu option
                        clickElement($event);
                    }
                };
            }

            function findOptionIndex(target): number {
                let elements = element.find('.fab-actions a');

                var index = 1;
                for (let currentElement of elements) {
                    if (currentElement === target) {
                        return index;
                    }
                    index++;
                }
                return -1;
            }

            function getFocusableElement(index) {
                return element.find('.fab-actions a:nth-child(' + index + ')');
            }

            function isFocusOnTrigger() {
                return element.is(':focus');
            }

            function setInitialState(focus) {
                element.focus();
                if (focus) scope.selectedIndex = 0;
            }

            function hasNextFocusableElement() {
                return getFocusableElement(scope.selectedIndex + 1).length;
            }

            function moveDown($event) {
                if (hasNextFocusableElement()) {
                    scope.selectedIndex++;
                    getFocusableElement(scope.selectedIndex).focus();
                }
                $event.preventDefault();
            }

            function moveUp($event) {
                if (scope.selectedIndex !== 1) {
                    if(!isFocusOnTrigger()) {
                        scope.selectedIndex--;
                    }
                    getFocusableElement(scope.selectedIndex).focus();
                } else {
                    //Focus trigger
                    setInitialState(true);
                }

                $event.preventDefault();
            }

            function setMenuStatus(opened, $event, preventFocus = false) {
                scope.opened = opened;
                if(!preventFocus) {
                    setInitialState(true);
                }
                $event.preventDefault();
            }

            function isOpen() {
                return scope.opened;
            }

            function clickElement($event) {
                $timeout(()=>getFocusableElement(scope.selectedIndex).click());
                $event.preventDefault();
            }
        }
    }

    function tribeFabController($scope, $timeout, $document, $rootScope) {
        var tribeFab = this;

        tribeFab.init = init;

        function init(_direction, _trigger, el) {
            if (typeof _direction !== "string") _direction = "down";
            tribeFab.fabDirection = _direction;

            if (typeof _trigger !== "string") _trigger = "favClick";
            if (!!$scope.trigger) $scope.trigger();
            $scope.trigger = $scope.$watch(_trigger, _checkStatus);

            $scope.toggleActive = false;
            let _toggleOpen = (_opened)=> {
                if($scope.toggleActive) return;

                $scope.toggleActive = true;
                $timeout(() => {
                    $scope[_trigger] = _opened;
                    el.find('.fab-actions a').attr("tabindex", _opened ? 0 : -1);
                    $scope.toggleActive = false;
                })
            };

            $scope.$watch('opened', _toggleOpen);
            tribeFab.toggleOpen = _toggleOpen;

            function handler(event) {
                let els = $scope.ignoreSelector
                        && document.querySelectorAll($scope.ignoreSelector)
                        || [],
                    cls = $scope.closeSelector
                        && document.querySelectorAll($scope.closeSelector)
                        || [],
                    toStay = el[0].contains(event.target),
                    toClose = false;

                // if target is inside one of ignore elements toStay becomes true
                if (event.target) {
                    // don't close if targets are removed or dettached from body
                    if (!document.body.contains(event.target)) {
                        toStay = true;
                    }
                    // don't close if target is inside one of ignore elements
                    if ($scope.ignoreSelector && els) {
                        for (let i = 0; i < els.length; ++i) {
                            toStay = toStay || els[i].contains(event.target);
                        }
                    }
                    // close if target is inside one of close elements
                    // (higher priority)
                    if ($scope.closeSelector && cls) {
                        for (let i = 0; i < cls.length; ++i) {
                            toClose = toClose || cls[i].contains(event.target);
                        }
                        toStay = toStay && !toClose;
                    }
                }
                if (!toStay) {
                    closeFab();
                    $scope.$apply();
                }
            }

            $scope.handler = handler;

            function closeFab() {
                $scope[_trigger] = false;
            }

            tribeFab.close = closeFab;

            if ($scope.autoClose) {
                $scope.$on('$destroy', function () {
                    $document.off('click', $scope.handler);
                });
            }

            let keyDownWatcher = $rootScope.$on('angular-tomitribe-fab.keyDown', (e, d) => $scope.keyDown(d, true));
            $scope.$on('$destroy', () => keyDownWatcher());
        }

        function _checkStatus(newVal) {
            if (!!newVal) {
                $scope.opened = true;
                $scope.dynamicClass = 'open';
                if ($scope.autoClose) {
                    $document.on('click', $scope.handler);
                }
            } else {
                $scope.opened = false;
                $scope.dynamicClass = 'closed';
                if ($scope.autoClose) {
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

    function tribeFabTrigger() {
        return {
            restrict: 'E',
            require: '^tribeFab',
            template: require('./tomitribe-fab-trigger.jade'),
            transclude: true,
            replace: true
        };
    }

    function tribeFabActions() {
        return {
            restrict: 'E',
            require: '^tribeFab',
            template: require('./tomitribe-fab-actions.jade'),
            link: link,
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl) {
            scope.parentCtrl = ctrl;
        }
    }
}
