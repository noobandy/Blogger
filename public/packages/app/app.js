"use strict"
var bloggerApp = angular.module("bloggerApp", [
	"ui.bootstrap",
	"ui.router",
	"angularBootstrapNavTree",
	"bloggerApp.controller",
	"bloggerApp.service",
	"bloggerApp.filter",
	"bloggerApp.directive"
	]);


bloggerApp.constant("APP_DATA", {
	"BASE_URL": BASE_URL,
	"USER": user,
	"BLOG": blog
});


bloggerApp.config([
	"$stateProvider", "$urlRouterProvider", "$httpProvider", "APP_DATA",
	function($stateProvider, $urlRouterProvider, $httpProvider, APP_DATA)
	{
		//default state when non matches
		$urlRouterProvider.otherwise("/");

		$stateProvider.state("home",
		{
			"url" : "/",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/home.html",
			"controller" : "HomeController"
		});

		$stateProvider.state("blog",
		{
			"url" : "/blog/{blogId}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/blog.html",
			"controller" : "BlogController"
		});

		$stateProvider.state("editBlog",
		{
			"url" : "/blog/{blogId}/edit",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/blogEditor.html",
			"controller" : "BlogController"
		});

		$stateProvider.state("newPost",
		{
			"url" : "/blog/{blogId}/post",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
			"controller" : "PostController"
		});

		$stateProvider.state("post",
		{
			"url" : "/blog/{blogId}/post/{postId}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/post.html",
			"controller" : "PostController"
		});

		$stateProvider.state("editPost",
		{
			"url" : "/blog/{blogId}/post/{postId}/edit",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
			"controller" : "PostController"
		});


		$stateProvider.state("textSearch",
		{
			"url" : "/search/{blogId}/text/{searchText}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/textSearchResult.html",
			"controller" : "TextSearchController"
		});

		$stateProvider.state("tagSearch",
		{
			"url" : "/search/{blogId}/tag/{tag}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/tagSearchResult.html",
			"controller" : "TagSearchController"
		});

		$stateProvider.state("archiveSearch",
		{
			"url" : "/search/{blogId}/archive/{startDate}/{endDate}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/archiveSearchResult.html",
			"controller" : "ArchiveSearchController"
		});

	}
	]);

