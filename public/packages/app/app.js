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
	"ui.codemirror",
	"ngSanitize",
	"ui.select"
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
		$urlRouterProvider.otherwise("/home");

		$stateProvider.state("base",
		{
			"abstract" : true,
			"url" : "/",
			"views" : {
				"navbar" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/navbar.html",
					"controller" : "NavbarController"
				},
				"sidebar" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/sidebar.html",
					"controller" : "SidebarController"
				}
			}
		});

		$stateProvider.state("base.home",
		{
			"url" : "home",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/home.html",
					"controller" : "HomeController"
				}
			}
		});

		$stateProvider.state("base.editBlog",
		{
			"url" : "blog/{blogId}/edit",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/blogEditor.html",
					"controller" : "BlogController"
				}
			}
			
		});

		$stateProvider.state("base.newPost",
		{
			"url" : "post",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
					"controller" : "PostEditorController"
				}
			}
			
		});

		$stateProvider.state("base.post",
		{
			"url" : "post/{slug}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/post.html",
					"controller" : "PostController"
				}
			}
			
		});

		$stateProvider.state("base.editPost",
		{
			"url" : "post/{slug}/edit",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
					"controller" : "PostEditorController"
				}
			}
		});


		$stateProvider.state("base.textSearch",
		{
			"url" : "search/text/{searchText}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/textSearchResult.html",
					"controller" : "TextSearchController"
				}
			}
		});

		$stateProvider.state("base.tagSearch",
		{
			"url" : "search/tag/{tag}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/tagSearchResult.html",
					"controller" : "TagSearchController"
				}
			}
		});

		$stateProvider.state("base.archiveSearch",
		{
			"url" : "search/archive/{startDate}/{endDate}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/archiveSearchResult.html",
					"controller" : "ArchiveSearchController"
				}
			}
		});

	}
	]);

