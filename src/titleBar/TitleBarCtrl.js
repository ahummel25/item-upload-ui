appModule.controller('TitleBarCtrl', function (wwtUser) {
    var vm = this;

    wwtUser.getCurrentUser().then(function (response) {
        vm.user = response.data;
    });
});
