appModule.factory('uploadFactory', uploadFactory);

function uploadFactory(apiRouter, Upload, wwtEnv) {

    function getUrl() {
       return wwtEnv.getApiForwardUrl();
    }

    return {
        getUrl: getUrl
    };
}