describe('TitleBarCtrl', function () {

    var user = {fullName: 'Fingal, Aram', userName: 'fingala'};

    beforeEach(fragrance.testForController({
        module: 'item-upload-ui',
        subject: 'TitleBarCtrl',
        setup: function() {
            $ff.mocks.wwtUser.getCurrentUser.and.returnValue(fragrance.q.when({data: user}));
        }
    }));

    describe('on load, ', function () {
        it('retrieves the current user from wwtUser', function () {
            expect($ff.subject.user).toEqual(user);
        });
    });
});
