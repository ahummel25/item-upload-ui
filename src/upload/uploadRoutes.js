appModule.config(function ($stateProvider) {
    $stateProvider.state('upload', {
        url: '/',
        templateUrl: 'upload/upload.html',
        controller: 'UploadCtrl as uc',
        data: {
            pageName: 'UploadCtrl',
            browserTitle: 'upload'
        }
    });
});
