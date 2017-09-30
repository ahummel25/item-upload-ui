appModule.directive('loadingSpinner', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            indicator: '='
        },
        template: '<div ng-show="indicator" class="loading center wide"><i class="fa fa-spinner fa-spin fa-4x"></i></div>'
    };
});