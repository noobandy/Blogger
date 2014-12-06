"user strict"

var bloggerAppService = angular.module("bloggerApp.service",[]);

bloggerAppService.service("PostService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var dataUrl = APP_DATA.BASE_URL+"/blog/"+APP_DATA.BLOG._id+"/post";

		this.list = function(params)
		{
			return $http.get(dataUrl,params);
		}

	}]);