describe('NavCtrl', function () {

    beforeEach(fragrance.testForController({
        module: 'item-upload-ui',
        subject: 'NavCtrl'
    }));

    describe('on load, ', function () {
        it('has $location', function () {
            expect($ff.mocks.$location).toBeDefined();
        });
    });
});
