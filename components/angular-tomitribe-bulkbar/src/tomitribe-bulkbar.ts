module tomitribe_bulkbar {
    require('./tomitribe-bulkbar.sass');

    angular
        .module('tomitribe-bulkbar', [])
        .directive('tribeBulkbar', tribebulkbar);

    function tribebulkbar() {
        return {
            restrict: 'E',
            template: require('./tomitribe-bulkbar.jade'),
            replace: true,
            transclude: true,
            link: link
        }

        function link(scope) {
            scope.isChecked = false;
        }
    }
}