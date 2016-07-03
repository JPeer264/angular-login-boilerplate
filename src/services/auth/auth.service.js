/**
 * @ngdoc service
 * @name service.auth
 *
 * @requires $rootScope
 * @requires Restangular
 * @requires $state
 * @requires $window
 * @requires $cookies
 * @requires CONSTANT
 */
angular
    .module('service.auth')
    .service('auth', auth);

auth.$inject = [
    '$rootScope',
    '$state',
    '$window',
    '$cookies',
    'CONSTANT',
    'user',
    '$location',
    '$q',
];

function auth($rootScope, $state, $window, $cookies, CONSTANT, user, $location, $q) {
    var self = this;
    var deferred = $q.defer();

    /**
     * @ngdoc method
     * @name service.auth#authorize
     * @methodOf service.auth
     *
     * @description
     * Check if the token cookie isset and login the user on every request
     * Go to the right state and check if the user is allowed to see the
     * requested page/state.
     *
     * @returns {Promise} returns a promise
     */
    self.authorize = function() {
        if (!self.isCookieValid()) {
            var add;
            // user is not authenticated. stow the state they wanted before you
            // send them to the signin state, so you can return them when you're done
            $rootScope.returnToState = $rootScope.toState;
            $rootScope.returnToStateParams = $rootScope.toStateParams;

            deferred.resolve(self.isCookieValid);

            return deferred.promise.then(function() {
                $state.go('nologin-landing', {ref: $location.path()});
            });
        }

        return user.setCurrent().then(function() {
            var isAuthenticated = user.isAuthenticated();

            if ($rootScope.toState.data.role && !user.isRightRole($rootScope.toState.data.role)) {
                if (isAuthenticated) {
                    $state.go('secure.index'); // user is signed in but not authorized for desired state
                    $rootScope.toState = $state.current;
                } else {
                    // user is not authenticated. stow the state they wanted before you
                    // send them to the signin state, so you can return them when you're done
                    $rootScope.returnToState = $rootScope.toState;
                    $rootScope.returnToStateParams = $rootScope.toStateParams;

                    // now, send them to the signin state so they can log in
                    $state.go('nologin-landing');
                }
            }
        });
    }

    /**
     * @ngdoc method
     * @name service.auth#isCookieValid
     * @methodOf service.auth
     *
     * @description
     * Checks if the user is authorized to see a specific page
     * Get the cookie and validate the JWT token
     *
     * @returns {Boolean} if cookie is vali
     */
    self.isCookieValid = function() {

        var token        = $cookies.get(CONSTANT.COOKIE.TOKEN);
        var tokenUserId  = $cookies.get(CONSTANT.COOKIE.USER_ID);
        var timestampNow = Math.floor((new Date()).getTime() / 1000); // divided by 1000 since getTime() gives in ms
        var payload;

        if (!token) {
            user.setIdentity(undefined);
            user.setAuthenticated(false);
            return false;
        }

        payload = this.parseJwt(token);

        if (payload.exp > timestampNow) {
            return true;
        }

        return true; // @delete - mock token is already expired
        $cookies.remove(CONSTANT.COOKIE.TOKEN);
        user.setIdentity(undefined);
        user.setAuthenticated(false);
        return false;
    }

    /**
     * @ngdoc method
     * @name service.auth#login
     * @methodOf service.auth
     *
     * @description
     * Request a token and saves into $cookies if the token is valid
     * Redirect on successfully login to home
     *
     * @param {String} formData email and password for the requested user
     * @returns {Promise} Returns a promise with a token
     */
    self.login = function(formData) {
        // @delete
        var deferred = $q.defer();

        deferred.resolve({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
            user: {
                id: 1,
                name: 'Jan Peer',
                role: 'user'
            }
        });

        return deferred.promise;
        // @delete end

        // @exampleInstead - activate $http before use

        // return $http({
        //     method: 'POST',
        //     url: 'api.example.com/login',
        //     data: formData
        // });

        // @exampleInstead end
    }

    /**
     * @ngdoc method
     *
     * @name service.auth#logout
     *
     * @methodOf service.auth
     *
     * @description
     * Deletes the user token and return to the welcome page
     */
    self.logout = function() {
        $cookies.remove(CONSTANT.COOKIE.TOKEN);
        $cookies.remove(CONSTANT.COOKIE.USER_ID);

        $window.location.assign('/');
    }

    /**
     * @ngdoc method
     * @name service.auth#parseJwt
     * @methodOf service.auth
     *
     * @description
     * In case JWT is used
     * Converts the JWT into an object and returns the payload content
     *
     * @returns {Object} payload content from JWT
     */
    self.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');

        return JSON.parse($window.atob(base64));
    }
}
