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
	"$scope", "$http", "APP_DATA",
	function($scope, $http, APP_DATA)
	{
		$scope.posts = [];
		var dataUrl = APP_DATA.BASE_URL+"/blog/"+APP_DATA.BLOG._id+"/post";
		$http.get(dataUrl).success(function(data)
		{
			console.log(data);
			$scope.posts = data;
		});

		$scope.startDate = new Date(59859000);
		$scope.endDate = new Date();
		$scope.setPeriod = function(startDate, endDate)
		{
			$scope.startDate = new Date(startDate);
			$scope.endDate = new Date(endDate);
		}

		$scope.withinPeriod = function(post){
			var publishedAt = new Date(post.publishedAt);
			if(publishedAt.getTime() > $scope.startDate.getTime() 
				&& publishedAt.getTime() < $scope.endDate.getTime() )
			{
				return true;
			}else{
				return false;
			}
		}
	}
	]);