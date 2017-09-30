describe('app', function () {

    var googleAnalytics,
        analyticsDriver,
        user = {fullName: 'Fingal, Aram', userName: 'fingala'};

    beforeEach(function () {
        module('item-upload-ui');

        module({
            googleAnalytics: {
                trackUser: jasmine.createSpy('trackUser')
            },
            analyticsDriver: {
                start: jasmine.createSpy('start')
            },
            wwtUser: {
                getCurrentUser: function () {
                    return fragrance.q.when({data: user});
                }
            }
        });

        inject(function (_googleAnalytics_, _analyticsDriver_) {
            googleAnalytics = _googleAnalytics_;
            analyticsDriver = _analyticsDriver_;
        });
    });

    describe('run', function () {
        it('tracks user with Google analytics', function () {
            expect(googleAnalytics.trackUser).toHaveBeenCalledWith(user.fullName, user.userName);
        });
        it('starts the analytics driver', function () {
            expect(analyticsDriver.start).toHaveBeenCalledWith({locationPrefix: '/item-upload-ui'});
        });
    });
});
