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
	"BLOG": blog,
	"globalRecordsPerPage": glogalRecordsPerPage,
	"gloablStartPage": gloablStartPage
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
					"controller" : "SidebarController",
					"resolve" : {
						archiveTree : ["$q", "ArchiveService",
						function($q, ArchiveService)
						{
							var deferred = $q.defer();
							ArchiveService.list().success(function(data)
								{
									deferred.resolve(data);
								});
							return deferred.promise;
						}],
						tagCounts : ["$q", "TagService",
						function($q, TagService)
						{
							var deferred = $q.defer();
							TagService.list().success(function(data)
								{
									deferred.resolve(data);
								});
							return deferred.promise;
						}],
						mostPopularPosts : ["$q", "PostService", "APP_DATA",
						function($q, PostService)
						{
							var deferred = $q.defer();
							var params = {
									ps : APP_DATA.glogalRecordsPerPage,
									pn : APP_DATA.gloablStartPage
								}

							PostService.list(params).success(function(data)
								{
									deferred.resolve(data.items);
								});

							return deferred.promise;
						}],
					}


				}
			}
		});

		$stateProvider.state("base.home",
		{
			"url" : "home",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/home.html",
					"controller" : "HomeController",
					"resolve" : {
						data : [
							"$q", "PostService", "APP_DATA",
							function($q, PostService)
							{
								var deferred = $q.defer();
								var params = {
									ps : APP_DATA.glogalRecordsPerPage,
									pn : APP_DATA.gloablStartPage
								}

								PostService.list(params).success(function(data)
								{
									deferred.resolve(data);
								});

								return deferred.promise;
							}]
					}
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
					"controller" : "PostEditorController",
					"resolve" : {
						post : function()
						{
							return {
								title : "Post Title",
								text : "Post content",
								excerpt : "Post summary",
								tags : []
							}
						},
						availableTags : ["$q", "TagService", function($q, TagService)
						{
							var deferred = $q.defer();

							TagService.list().success(function(data)
							{
								var availableTags = [];
								data.forEach(function(tagCount)
								{
									availableTags.push(tagCount._id);
								});

								deferred.resolve(availableTags);
							});

							return deferred.promise;
						}] 
					}
				}
			}
			
		});

		$stateProvider.state("base.post",
		{
			"url" : "post/{slug}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/post.html",
					"controller" : "PostController",
					"resolve" : {
						post : ["$q", "$stateParams", "PostService", function($q, 
							$stateParams, PostService)
						{
							var deferred = $q.defer();
							PostService.get($stateParams.slug).success(function(data)
							{
								deferred.resolve(data);
							});
							return deferred.promise;
						}]
					}

				}
			}
			
		});

		$stateProvider.state("base.editPost",
		{
			"url" : "post/{slug}/edit",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/postEditor.html",
					"controller" : "PostEditorController",
					"resolve" : {
						post : ["$q", "$stateParams", "PostService", function($q, 
							$stateParams, PostService)
						{
							var deferred = $q.defer();
							PostService.get($stateParams.slug).success(function(data)
							{
								deferred.resolve(data);
							});
							return deferred.promise;
						}],
						availableTags : ["$q", "TagService", function($q, TagService)
						{
							var deferred = $q.defer();

							TagService.list().success(function(data)
							{
								var availableTags = [];
								data.forEach(function(tagCount)
								{
									availableTags.push(tagCount._id);
								});

								deferred.resolve(availableTags);
							});

							return deferred.promise;
						}] 
					}
				}
			}
		});


		$stateProvider.state("base.textSearch",
		{
			"url" : "search/text/{searchText}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/textSearchResult.html",
					"controller" : "TextSearchController",
					"resolve" : {
						data : [
							"$q", "PostService", "$stateParams", "APP_DATA",
							function($q, PostService, $stateParams)
							{
								var deferred = $q.defer();
								var params = {
									ps : APP_DATA.glogalRecordsPerPage,
									pn : APP_DATA.gloablStartPage,
									s : $stateParams.searchText
								}

								PostService.list(params).success(function(data)
								{
									deferred.resolve(data);
								});

								return deferred.promise;
							}]
					}
				}
			}
		});

		$stateProvider.state("base.tagSearch",
		{
			"url" : "search/tag/{tag}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/tagSearchResult.html",
					"controller" : "TagSearchController",
					"resolve" : {
						data : [
							"$q", "PostService", "$stateParams", "APP_DATA",
							function($q, PostService, $stateParams)
							{
								var deferred = $q.defer();
								var params = {
									ps : APP_DATA.glogalRecordsPerPage,
									pn : APP_DATA.gloablStartPage,
									t : $stateParams.tag
								}

								PostService.list(params).success(function(data)
								{
									deferred.resolve(data);
								});

								return deferred.promise;
							}]
					}
				}
			}
		});

		$stateProvider.state("base.archiveSearch",
		{
			"url" : "search/archive/{startDate}/{endDate}",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/archiveSearchResult.html",
					"controller" : "ArchiveSearchController",
					"resolve" : {
						data : [
							"$q", "PostService", "$stateParams", "APP_DATA",
							function($q, PostService, $stateParams)
							{
								var deferred = $q.defer();
								var params = {
									ps : APP_DATA.glogalRecordsPerPage,
									pn : APP_DATA.gloablStartPage,
									sd : $stateParams.startDate,
									ed : $stateParams.endDate
								}

								PostService.list(params).success(function(data)
								{
									deferred.resolve(data);
								});

								return deferred.promise;
							}]
					}
				}
			}
		});

	}
	]);

