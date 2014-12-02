"use strict"
var bloggerApp = angular.module("bloggerApp", [
	"ui.bootstrap",
	"ui.router",
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
		$urlRouterProvider.otherwise("/blog");

		$stateProvider.state("blog",
		{
			"url" : "/blog",
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/blog.html",
			"controller" : "BlogController"
		});
	}
	]);

