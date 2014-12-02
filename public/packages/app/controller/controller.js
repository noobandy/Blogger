"user strict"

var bloggerAppController = angular.module("bloggerApp.controller",[]);

bloggerAppController.controller("NavController",[
	"$scope", "APP_DATA",
	function($scope,APP_DATA)
	{
		$scope.brand = APP_DATA.BLOG.name;
		$scope.username = APP_DATA.USER.username;
		$scope.homeUrl = APP_DATA.BASE_URL + "/blogger/" + $scope.username;
	}
	]);

bloggerAppController.controller("BlogController",[
	"$scope", "$http",
	function($http, $scope)
	{
	}
	]);