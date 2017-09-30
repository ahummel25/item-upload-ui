// Declare app level module which depends on filters, and services

// Configure routing
appModule.config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
});

// Configure HTTP interceptors
appModule.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('wwtHttpErrorHandler');
    $httpProvider.defaults.withCredentials = true;
}]);

// Allows deep-linking
appModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

appModule.run(function (googleAnalytics, analyticsDriver, wwtUser) {
    // The user must be tracked before the page view or it won't show up in Google Analytics
    wwtUser.getCurrentUser().then(function (response) {
        var user = response.data;
        googleAnalytics.trackUser(user.fullName, user.userName);

        analyticsDriver.start({
            locationPrefix: '/item-upload-ui'
        });
    });
});

// Configure ng-animate to prevent it from trying to animate everything
appModule.config(['$animateProvider', function($animateProvider) {
    // restrict animation to elements with the allow-ng-animate css class.
    $animateProvider.classNameFilter(/allow-ng-animate/);
}]);
