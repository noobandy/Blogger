"use strict"
var bloggerApp = angular.module("bloggerApp", [
	"ui.bootstrap",
	"ui.router",
	"angularBootstrapNavTree",
	"angularMoment",
	"bloggerApp.controller",
	"bloggerApp.service",
	"bloggerApp.filter",
	"bloggerApp.directive",
	"ui.codemirror"
	]);


bloggerApp.constant("APP_DATA", {
	"BASE_URL": BASE_URL,
	"BLOG": blog
});

bloggerApp.constant('angularMomentConfig', {
    preprocess: 'utc', // optional
    timezone: tzid // optional
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


		$stateProvider.state("editBlog",
		{
			"url" : "/blog/{blogId}/edit",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/blogEditor.html",
			"controller" : "BlogController"
		});

		$stateProvider.state("newPost",
		{
			"url" : "/post",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
			"controller" : "PostEditorController"
		});

		$stateProvider.state("post",
		{
			"url" : "/post/{slug}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/post.html",
			"controller" : "PostController"
		});

		$stateProvider.state("editPost",
		{
			"url" : "/post/{slug}/edit",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
			"controller" : "PostEditorController"
		});


		$stateProvider.state("textSearch",
		{
			"url" : "/search/text/{searchText}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/textSearchResult.html",
			"controller" : "TextSearchController"
		});

		$stateProvider.state("tagSearch",
		{
			"url" : "/search/tag/{tag}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/tagSearchResult.html",
			"controller" : "TagSearchController"
		});

		$stateProvider.state("archiveSearch",
		{
			"url" : "/search/archive/{startDate}/{endDate}",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/archiveSearchResult.html",
			"controller" : "ArchiveSearchController"
		});

	}
	]);

