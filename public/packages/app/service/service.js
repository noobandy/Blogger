"user strict"

var bloggerAppService = angular.module("bloggerApp.service",[]);

bloggerAppService.service("PostService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var dataUrl = APP_DATA.BASE_URL+"/blog/"+APP_DATA.BLOG._id+"/post";

		this.list = function(params)
		{
			return $http({
				method : "GET",
				url : dataUrl,
				params : params
			});
		}

		this.get = function(postId)
		{
			return $http.get(dataUrl + "/" + postId);
		}

		this.delete = function(postId)
		{
			return $http.delete(dataUrl + "/" + postId);
		}

		this.add = function(post)
		{
			return $http.post(dataUrl, post);
		}

		this.update = function(post)
		{
			return $http.put( dataUrl + "/" + post._id, post);
		}

	}]);


bloggerAppService.service("ArchiveService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var dataUrl = APP_DATA.BASE_URL+"/blog/"+APP_DATA.BLOG._id+"/archive";

		this.list = function()
		{
			return $http.get(dataUrl);
		}

	}]);



bloggerAppService.service("TagService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var dataUrl = APP_DATA.BASE_URL+"/blog/"+APP_DATA.BLOG._id+"/tag";

		this.list = function()
		{
			return $http.get(dataUrl);
		}

	}]);


bloggerAppService.service("CommentService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var dataUrl = APP_DATA.BASE_URL+"/blog/"+APP_DATA.BLOG._id+"/post";

		this.list = function(postId, params)
		{
			return $http({
				method : "GET",
				url : dataUrl + "/" + postId +"/comment",
				params : params
			});
		}

		this.get = function(postId, commentId)
		{
			return $http.get(dataUrl + "/" + postId +"/comment/" + commentId);
		}

		this.delete = function(postId, commentId)
		{
			return $http.delete(dataUrl + "/" + postId + "/comment/" + commentId);
		}

		this.add = function(comment)
		{
			return $http.post(dataUrl + "/" + comment.post_id + "/comment", post);
		}

		this.update = function(comment)
		{
			return $http.put( dataUrl + "/" + comment.post_id + "/comment/", post);
		}

	}]);