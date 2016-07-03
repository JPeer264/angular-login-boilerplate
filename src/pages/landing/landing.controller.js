angular
	.module('pages.landing')
	.controller('LandingCtrl', LandingController);

/**
 * @ngdoc controller
 * @name pages.landing:LandingCtrl
 *
 * @requires $scope
 *
 * @description
 * LandingCtrl for the landing page
 */
LandingController.$inject = [
	'$scope'
];

function LandingController($scope) {
    console.log('landing page');
}