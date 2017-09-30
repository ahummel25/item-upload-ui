appModule.controller('UploadCtrl', function ($scope, Upload, wwtEnv) {
    var uc = this;
    var uploadPath = '/item-uploads';

    $scope.user = {};
    $scope.loading = false;
    $scope.submitResultsHidden = true;

    uc.uploadFile = uploadFile;
    uc.hideSubmitResults = hideSubmitResults;

    function uploadFile(file) {
        console.log(file);
        $scope.loading = true;
        var url = wwtEnv.getApiForwardUrl() + uploadPath;
        Upload.upload({
            method: 'POST',
            url: url,
            headers: {'Content-Type': file.type},
            file: file,
            withCredentials: true
        }).success(function (response) {
            $scope.loading = false;
            if (response.code !== 'S') {
                $scope.alertClass = "alert alert-danger";
                $scope.alertHeader = "Error";
                $scope.alertMessage = response.message;
                $scope.submitResultsHidden = false;
            }
            else {
                $scope.alertClass = "alert alert-success";
                $scope.alertHeader = "Success";
                $scope.alertMessage = response.message ? 'Some item(s) Created Successfully. These already exist: ' + response.message : 'Item(s) Created Successfully';
                $scope.submitResultsHidden = false;
            }
        }).catch(err => {
            $scope.loading = false;
            $scope.alertClass = "alert alert-error";
            $scope.alertHeader = "Error";
            $scope.alertMessage = err;
            $scope.submitResultsHidden = false;
        });
    }

    function hideSubmitResults() {
        $scope.submitResultsHidden = true;
    }
});


