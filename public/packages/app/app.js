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
	"ui.select",
	"angularBasicAuth",
	"ngAnimate",
	"ngTouch",
	"angular-loading-bar",
	"angularFileUpload",
	"xeditable",
	"ui.tinymce"
	]);

bloggerApp.constant("APP_DATA", {
	"BASE_URL": BASE_URL,
	"BLOG": BLOG
});

bloggerApp.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: true,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: false
});

bloggerApp.constant('angularMomentConfig', {
    preprocess: 'utc', // optional
    timezone: tzid // optional
});


bloggerApp.config([
	"$locationProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider", "APP_DATA",
	function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, APP_DATA)
	{
		/*$locationProvider.html5Mode({
			enabled: true,
  			requireBase: false
		});*/

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
						mostPopularPosts : ["$q", "PostService", "paginationConfig",
						function($q, PostService, paginationConfig)
						{
							var deferred = $q.defer();
							var params = {
									ps : paginationConfig.itemsPerPage,
									pn : 1
								}

							PostService.list(params).success(function(data)
								{
									deferred.resolve(data.items);
								});

							return deferred.promise;
						}],
					}


				}
			},
			data : {
				isAuthRequired : false
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
							"$q", "PostService", "paginationConfig",
							function($q, PostService, paginationConfig)
							{
								var deferred = $q.defer();
								var params = {
									ps : paginationConfig.itemsPerPage,
									pn : 1
								}

								PostService.list(params).success(function(data)
								{
									deferred.resolve(data);
								});

								return deferred.promise;
							}]
					}
				}
			},
			data : {
				isAuthRequired : false
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
			},
			data : {
				isAuthRequired : true
			}
			
		});

		$stateProvider.state("base.asset",
		{
			"url" : "blog/{blogId}/asset",
			"views" : {
				"content@base" : {
					"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/assetList.html",
					"controller" : "AssetController"
				}
			},
			"resolve" : {
				"data" : [
							"$q", "AssetService", "paginationConfig",
							function($q, AssetService, paginationConfig)
							{
								var deferred = $q.defer();
								var params = {
									ps : paginationConfig.itemsPerPage,
									pn : 1
								}

								AssetService.list({}).success(function(data)
								{
									deferred.resolve(data);
								});

								return deferred.promise;
							}]
			},
			"data" : {
				isAuthRequired : true
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
			},
			data : {
				isAuthRequired : true
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
						}],
						commentsCount : ["$q", "$stateParams", "CommentService", 
						function($q, $stateParams, CommentService)
						{
							var deferred = $q.defer();

							CommentService.count($stateParams.slug).success(function(data)
							{
								deferred.resolve(data);
							});

							return deferred.promise;
						}]
					}

				}
			},
			data : {
				isAuthRequired : false
			}
			
		});



		$stateProvider.state("base.post.comment",
		{
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/discussion.html",
			"controller" : "CommentController",
			"resolve" : {
				comments : ["$q", "$stateParams", "CommentService",
				function($q, $stateParams, CommentService)
				{
					var deferred = $q.defer();

					CommentService.list($stateParams.slug).success(function(data)
					{
		  				var idToNodeMap = {};
						var comments = [];
						for(var i = 0; i < data.items.length; i++) {
						    var datum = data.items[i];
						    datum.replies = [];
						    idToNodeMap[datum._id] = datum;
						    
						    if(typeof datum.parent_id === "undefined") {
						        comments.push(datum);        
						    } else {
						        var parentNode = idToNodeMap[datum.parent_id];
						        parentNode.replies.push(datum);
						    }
						}
						
						deferred.resolve(comments);

	  				});
	  				
	  				return deferred.promise;
				}]
			},
			data : {
				isAuthRequired : false
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
			},
			data : {
				isAuthRequired : true
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
							"$q", "PostService", "$stateParams", "paginationConfig",
							function($q, PostService, $stateParams, paginationConfig)
							{
								var deferred = $q.defer();
								var params = {
									ps : paginationConfig.itemsPerPage,
									pn : 1,
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
			},
			data : {
				isAuthRequired : false
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
							"$q", "PostService", "$stateParams", "paginationConfig",
							function($q, PostService, $stateParams, paginationConfig)
							{
								var deferred = $q.defer();
								var params = {
									ps : paginationConfig.itemsPerPage,
									pn : 1,
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
			},
			data : {
				isAuthRequired :false
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
							"$q", "PostService", "$stateParams", "paginationConfig",
							function($q, PostService, $stateParams, paginationConfig)
							{
								var deferred = $q.defer();
								var params = {
									ps : paginationConfig.itemsPerPage,
									pn : 1,
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
			},
			data : {
				isAuthRequired : false
			}
		});

	}
	]);

bloggerApp.run(["APP_DATA", "$rootScope", "$modal",
	"authDefaults", "authService", "UserService", "cfpLoadingBar","editableOptions",
	function(APP_DATA, $rootScope, $modal, authDefaults, authService, UserService, cfpLoadingBar,
		editableOptions)
	{
		 editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
		
		//store gloabl current blog data in root scope
		$rootScope.currentBlog = APP_DATA.BLOG;
		//store global base url in root scope
		$rootScope.basePath = APP_DATA.BASE_URL;
		
		//set authentication url
		authDefaults.authenticateUrl = $rootScope.basePath +"/login";

		//add current domain for end point
		authService.addEndpoint();

		var username = authService.username();

		//if user is authnticated
		// load and store logged in user data in root scope
		// store is logged in user is owner of the current blog
		if(typeof username !== "undefined" 
			&& username != null && username.trim() !== "")
		{
			UserService.getUser(authService.username()).success(function(data)
			{
            	$rootScope.loggedInUser = data;
            	$rootScope.isBlogOwner = $rootScope.loggedInUser._id === $rootScope.currentBlog.user_id;
            });
		}
		else
		{
			$rootScope.loggedInUser = null;
			$rootScope.isBlogOwner = false;
		}
		
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams)
			{
				//start gloabal loading bar aimation.
				cfpLoadingBar.start();
				
				//is this state require user to be authenticated
				if(toState.data.isAuthRequired)
				{	
					if($rootScope.loggedInUser === null)
					{
						event.preventDefault();
						//stop loading bar animation
						cfpLoadingBar.complete();
					}
				}
			});
		$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams)
			{
				//stop loading bar animation
				cfpLoadingBar.complete();
			});

		// listen for login events
        $rootScope.$on('login', function() {
            UserService.getUser(authService.username()).success(function(data)
            {
            	$rootScope.loggedInUser = data;
            	$rootScope.isBlogOwner = $rootScope.loggedInUser._id === $rootScope.currentBlog.user_id; 

            });
        });

        // listen for logout events
        $rootScope.$on('logout', function() {
           $rootScope.loggedInUser = null;
           $rootScope.isBlogOwner = false;
        });
	}
	]);


