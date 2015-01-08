"use strict"

var bloggerAppService = angular.module("bloggerApp.service",[]);

bloggerAppService.factory('loadingInerceptor', [function(ProgressDialog) {
    var loadingInerceptor = {
        request: function(config) {
        	console.log("loading begin");
            return config;
        },
        response: function(response) {
        	console.log("loading done");
            return response;
        }
    };
    return loadingInerceptor;
}]);

bloggerAppService.service("LoginService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var loginUrl = APP_DATA.BASE_URL + "/login";
		var logoutUrl = APP_DATA.BASE_URL + "/logout";

		this.login = function(username, password)
		{
			return $http.post(loginUrl, {
				username : username,
				password : password
			});
		}

		this.logout = function()
		{
			return $http.post(logoutUrl,{});
		}

	}
	]);
bloggerAppService.service("UserService", [
	"$http", "APP_DATA",
	function($http, APP_DATA)
	{
		var dataUrl = APP_DATA.BASE_URL + "/user";
		this.getUser = function(username)
		{
			return $http.get(dataUrl + "/" + username);
		}
	}
	]);


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

		this.get = function(slug)
		{
			return $http.get(dataUrl + "/" + slug);
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

		this.list = function(postSlug, params)
		{
			return $http({
				method : "GET",
				url : dataUrl + "/" + postSlug +"/comment",
				params : params
			});
		}

		this.count = function(slug)
		{
			return $http.get(dataUrl + "/" + slug +"/commentCount");
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
			return $http.post(dataUrl + "/" + comment.post_id + "/comment", comment);
		}

		this.update = function(comment)
		{
			return $http.put( dataUrl + "/" + comment.post_id + "/comment/", comment);
		}

		this.upvote = function(postId, commentId)
		{
			return $http.put( dataUrl + "/" + postId + "/comment/" + commentId + "/upvote");
		}

		this.downvote = function(postId, commentId)
		{
			return $http.put( dataUrl + "/" + postId + "/comment/" + commentId + "/downvote");
		}

		this.report = function(postId, commentId)
		{
			return $http.put( dataUrl + "/" + postId + "/comment/" + commentId + "/report");
		}

	}]);