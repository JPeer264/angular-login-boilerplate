angular
    .module('page.login')
    .controller('LoginCtrl', LoginController);

/**
 * @ngdoc controller
 * @name cmps.page:LoginCtrl
 *
 * @requires $scope
 * @requires service.auth
 * @requires $window
 * @requires $cookies
 * @requires CONSTANT
 * @requires $location
 *
 * @description
 * Hello App controller
 */
LoginController.$inject = [
    '$scope',
    'auth',
    '$window',
    '$cookies',
    'CONSTANT',
    '$location',
];

function LoginController($scope, auth, $window, $cookies, CONSTANT, $location) {
    var self = this;

    /**
     * @ngdoc method
     * @name login
     * @methodOf cmps.page:LoginCtrl
     *
     * @description
     * call the auth.login() service and set token if it not fail
     */
    self.login = function() {
        auth.login(self.user).then(function (data) {
            $cookies.put(CONSTANT.COOKIE.TOKEN, data.token);
            $cookies.put(CONSTANT.COOKIE.USER_ID, data.user.id);

            if ($location.search().ref) {
                $window.location.assign($location.search().ref);
                return;
            }

            $window.location.assign('/');
        });
    }
}
