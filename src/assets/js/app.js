var CONSTANT = {
    "COOKIE": {
        "TOKEN": "tkn_u", // tkn_u = token_user
        "USER_ID": "u_i", // u_i = user_id
    }
};

angular.module('angularlogin', [
    'ui.router',
    'angularlogin.templates',
    'ngCookies',
    'pages',
    'service',
    'cmps',
]);

angular
    .module('angularlogin')
    .config(config)
    .run(run)
    .constant('CONSTANT', CONSTANT);

/**
 *
 */
config.$inject = [
    '$stateProvider',
    '$locationProvider',
    '$urlRouterProvider',
];

function config($stateProvider, $locationProvider, $urlRouterProvider) {
    // redirect to home state when we call the page without route information
    // activate in proudction and set mod_rewrite to index.html
    $locationProvider.html5Mode(true);

    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('secure', {
            abstract: true,
            resolve: {
                authorize: ['auth',
                    function(auth) {
                        return auth.authorize();
                    }
                ]
            },
            template: '<div data-ui-view="header"></div><div data-ui-view="main"></div>'
        })
        .state('secure.index', {
            url: '/',
            views: {
                header: {
                    template: '<div data-header></div>',
                },
                main: {
                    templateUrl: 'pages/home/home.html',
                    controller: 'HomeCtrl'
                },
            },
            data: {
                activetab: 'home',
                role: []
            },
        })
        .state('secure.page', {
            url: '/page',
            views: {
                header: {
                    template: '<div data-header></div>',
                },
                main: {
                    templateUrl: 'pages/page/page.html',
                    controller: 'PageCtrl'
                },
            },
            data: {
                activetab: 'page',
                role: ['admin'] // works for the example if 'user' is added
            },
        })
        .state('nologin-landing', {
            url: '/',
            views: {
                main: {
                    templateUrl: 'pages/landing/landing.html',
                    controller: 'LandingCtrl'
                },
            },
            params: {
                'ref': null
            }
        });
};

// run method
run.$inject = [
    '$rootScope',
    '$location',
    '$http',
    'auth',
    'user',
    '$stateParams',
    '$window',
    '$state'
];

function run($rootScope, $location, $http, auth, user, $stateParams, $window, $state) {
    $rootScope.isLoggedIn = function() {
        return user.isAuthenticated();
    }

    $rootScope.logout = function() {
        auth.logout();
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        // redirect to login page if not logged in and trying to access a restricted page
        if (user.isIdentityResolved()) {
            auth.authorize();
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(e, newUrl, oldUrl) {
        e.preventDefault();

        if (($state.current.name).indexOf('nologin') === 0 && !$rootScope.isLoggedIn()) {
            if ($state.params.ref) {

                if ($state.params.ref === '/') {
                    return;
                }

                $location.url('?ref=' + $state.params.ref);
                return;
            }
        }
    });
}

angular.element(document).ready(function() {
    angular.bootstrap(document, ['angularlogin']);
});
