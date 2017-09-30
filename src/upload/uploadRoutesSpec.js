describe('upload routes', function () {

    var instance,
        rootScope,
        injector,
        state,
        testState = 'upload';

    beforeEach(function () {
        module("item-upload-ui");

        inject(function ($injector, $rootScope, $state) {
            rootScope = $rootScope;
            state = $state;
            injector = $injector;
        });
    });

    describe('on resolve,', function () {
        it('should resolve data', function () {
            state.go(testState);
            rootScope.$digest();
            expect(state.current.name).toBe(testState);

            // Test resolve ex:
            // var mockData = 'mock';
            // expect(injector.invoke(state.current.resolve.data)).toBe(mockData);
        });

    });
});
