appModule.factory('apiRouter', function (Restangular, wwtEnv) {
    return Restangular.withConfig(function (RestangularProvider) {
        /*
         * Configure base Restangular properties, like URL
         */
        RestangularProvider.setBaseUrl(wwtEnv.getApiForwardUrl());

        RestangularProvider.setDefaultHttpFields({
            withCredentials: true
        });
    });
});
