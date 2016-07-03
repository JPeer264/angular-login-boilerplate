/**
 * @ngdoc service
 * @name service.user
 *
 * @requires $rootScope
 * @requires $httpParamSerializer
 * @requires $cookies
 * @requires CONSTANT
 * @requires $q
 */
angular
    .module('service.user')
    .service('user', user);

user.$inject = [
    '$rootScope',
    '$httpParamSerializer',
    '$cookies',
    'CONSTANT',
    '$q',
    '$timeout'
];


function user($rootScope, $httpParamSerializer, $cookies, CONSTANT, $q, $timeout) {
    // cache all promises - private
    var self = this;
    var deferred        = $q.defer();
    var _identity       = undefined;
    var _authenticated  = false;
    var _promiseCache   = {
        get: {}, // saves the id of every saved person
    }

    /**
     * @ngdoc method
     * @name service.user#isIdentityResolved
     * @methodOf service.user
     *
     * @description
     * checks if _identity is already resolved - angular.isDefined
     *
     * @params {Boolean} angular.isDefined from _identity
     */
    self.isIdentityResolved = function() {
        return angular.isDefined(_identity);
    }

    /**
     * @ngdoc method
     * @name service.user#setIdentity
     * @methodOf service.user
     *
     * @description
     * sets the local variable _identity
     *
     * @params {Object} the user object, undefined if there is no identity
     */
    self.setIdentity = function(identity) {
        _identity = identity;
    }

    /**
     * @ngdoc method
     * @name service.user#isAuthenticated
     * @methodOf service.user
     *
     * @description
     * returns the _authenticated value
     * True if the user is authenticated
     *
     * @returns {Boolean} _authenticated
     */
    self.isAuthenticated = function() {
        return _authenticated;
    }

    /**
     * @ngdoc method
     * @name service.user#setAuthenticated
     * @methodOf service.user
     *
     * @description
     * set _authenticated
     *
     * @params {Boolean} the new value
     */
    self.setAuthenticated = function(boo) {
        _authenticated = boo;
    }

    /**
     * @ngdoc method
     * @name service.user#isRightRole
     * @methodOf service.user
     *
     * @description
     * Check if the user is allowed to see the current page
     *
     * @returns {Boolean} if the user is authorized
     */
    self.isRightRole = function(role) {
        var isInRole = false;

        if (!_authenticated || !_identity.role) return false;

        // should pass if there is no role defined
        if (role.length === 0) return true;


        for (var i = 0; i < role.length; i++) {
            if (_identity.role === role[i]) isInRole = true;
        }

        return isInRole;
    }

    /**
     * @ngdoc method
     * @name service.user#getCurrent
     * @methodOf service.user
     *
     * @description
     * Get the current logged in user via the Bearer token
     * Can be any logic - can also get the ID from the stored cookie
     *
     * @returns {Promise} promise for the current user
     */
    self.getCurrent = function() {
        if (!_promiseCache.current) {
            // @delete begin
            _promiseCache.current = $timeout(function () {
                return {
                    id: 1,
                    name: 'Jan Peer',
                    role: 'user'
                }
            }, 1000);
            // @delete end

            // @exampleInstead begin

            // _promiseCache.current = $http({
            //     method: 'GET',
            //     url: 'api.example.com/currentuser',
            //     headers: {
            //         'Authorization': 'Bearer ' + $cookies.get(CONSTANT.COOKIE.TOKEN)}
            //     }
            // });

            // @exampleInstead end
        }

        return _promiseCache.current;
    }

    /**
     * @ngdoc method
     * @name service.user#currentUser
     * @methodOf service.user
     *
     * @description
     * Data of the current user - run setCurrent() before use
     */
    /**
     * @ngdoc method
     * @name service.user#setCurrent
     * @methodOf service.user
     *
     * @description
     * Set the rootscope of currentUser
     */
    self.setCurrent = function() {
        return (self.getCurrent()).then(function(data) {
            var userdata = data;
            _identity = userdata;
            _authenticated = true;
        });
    }

    /**
     * @ngdoc method
     * @name service.user#resetCache
     * @methodOf service.user
     *
     * @description
     * Reset the cache to perform a new request
     *
     * @param {Object} key   - the key of the promiseCache
     * @param {Object} value - the value if the key is an object
     */
    self.resetCache = function (key, value) {
        if (!key) {
            _promiseCache = {
                get: {},
            };
            return;
        }

        if (value) {
            _promiseCache[key][value] = undefined;
            return;
        }

        _promiseCache[key] = undefined;
        return;
    }
}