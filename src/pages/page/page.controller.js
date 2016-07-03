angular
	.module('pages.page')
	.controller('PageCtrl', PageController);

/**
 * @ngdoc controller
 * @name pages.page:PageCtrl
 *
 * @requires $scope
 *
 * @description
 * This is an example page
 */
PageController.$inject = [
	'$scope'
];

function PageController($scope) {
}