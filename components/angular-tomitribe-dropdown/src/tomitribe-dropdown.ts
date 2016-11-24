module tomitribe_dropdown {
    require('./tomitribe-dropdown.sass');

    angular
        .module('tomitribe-dropdown', [])
        .directive('tribeDropdown', tribeDropdown)
        .directive('tribeDropdownTrigger', tribeDropdownTrigger)
        .directive('tribeDropdownList', tribeDropdownList);

    function tribeDropdown()
    {
        return {
            restrict: 'E',
            template: require('./tomitribe-dropdown.jade'),
            scope: {
                dropdownTrigger: '@?',
                dropdownDirection: '@?',
                pullDirection: '@?',
                opened: '=?openedStatus',
                triggerHide: '@?'
            },
            link: link,
            controller: ['$scope', '$timeout', tribeDropdownController],
            controllerAs: 'tribeDropdown',
            transclude: true,
            replace: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.dropdownClick = false;
            scope.dropdownOver = false;
            scope.dynamicClass = 'closed';
            scope.triggerHide = !!scope.triggerHide || false;
            scope.opened = scope.opened || false;

            ctrl.init(scope.dropdownDirection, scope.pullDirection, scope.dropdownTrigger);
            ctrl.dropdownOpen(scope.opened);
        }
    }

    function tribeDropdownController($scope, $timeout)
    {
        var tribeDropdown = this;
        tribeDropdown.init = init;

        function init(_dropDirection, _pullDirection, _trigger)
        {
            if(typeof _dropDirection !== "string") _dropDirection = "down";
            tribeDropdown.dropdownDirection = _dropDirection;

            if(typeof _pullDirection !== "string") _pullDirection = "down";
            tribeDropdown.pullDirection = _pullDirection;

            if(typeof _trigger !== "string") _trigger = "dropdownClick";
            if(!!$scope.trigger) $scope.trigger();
            $scope.trigger = $scope.$watch(_trigger, _checkStatus);

            let _dropdownOpen = (_opened)=> {$scope[_trigger] = _opened};
            $scope.$watch('opened', _dropdownOpen);
            tribeDropdown.dropdownOpen = _dropdownOpen;
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
                $scope.dropdownOver = true;
            }, 200);
        };

        $scope.hideIt = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $scope.dropdownOver = false;
            }, 200);
        };
    }

    function tribeDropdownTrigger()
    {
        return {
            restrict: 'E',
            require: '^tribeDropdown',
            template: require('./tomitribe-dropdown-trigger.jade'),
            transclude: true,
            replace: true
        };
    }

    function tribeDropdownList()
    {
        return {
            restrict: 'E',
            require: '^tribeDropdown',
            template: require('./tomitribe-dropdown-list.jade'),
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