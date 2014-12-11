"use strict"

var bloggerAppController = angular.module("bloggerApp.controller",[]);

bloggerAppController.controller("NavController",[
	"$scope", "APP_DATA", "$state",
	function($scope, APP_DATA, $state)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.searchText = "";

		$scope.search = function()
		{
			$state.go("textSearch", {
				searchText : $scope.searchText
			});
		}
	}
	]);

bloggerAppController.controller("LeftNavController",[
	"$scope", "$http", "PostService", "APP_DATA", "TagService", "ArchiveService", "$state",
	function($scope, $http, PostService, APP_DATA, TagService, ArchiveService, $state)
	{

		$scope.archiveTree = [];

		$scope.archiveSelected = function(archive)
		{
			console.log(archive.data);

			var monthYear = String(archive.data);

			var parts = monthYear.split("-");
			if(parts.length > 1){
				var year = parts[1];
				var month = String(parseInt(parts[0]) + 1);
				var startDate = year + "-" + month + "-" + "01"; 
				
				var endDate = year + "-" + month + "-" + "31"; 

				$state.go("archiveSearch",
					{
						startDate : startDate,
						endDate : endDate
					});
			} 
		}

		ArchiveService.list().success(function(data)
		{
			$scope.archiveTree = data;
		});

		$scope.mostPopularPosts = [];

		PostService.list({}).success(function(data)
		{
			
			$scope.mostPopularPosts = data.items.slice(0,5);
		});


		$scope.tagCounts = [];

		TagService.list().success(function(data)
		{
			$scope.tagCounts = data;
		});
	}
	]);


bloggerAppController.controller("HomeController",[
	"$scope", "$http", "PostService", "APP_DATA",
	function($scope, $http, PostService, APP_DATA)
	{

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.itemsPerPage = 5;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	loadData();
	  	};

	  	var loadData = function(){
	  		PostService.list({
	  			"ps" : $scope.itemsPerPage,
	  			"pn" : $scope.currentPage
	  		}).success(function(data)
	  			{
	  				
					$scope.posts = data.items;
					$scope.totalItems = data.count;
	  			});
	  	}
	  	//load data once
	  	loadData();
	}
	]);



bloggerAppController.controller("BlogController",[
	"$scope", "$stateParams", "PostService",
	function($scope, $stateParams, PostService)
	{

	}
	]);


bloggerAppController.controller("PostController",[
	"$scope", "$stateParams", "PostService", "CommentService",
	function($scope, $stateParams, PostService, CommentService)
	{
		$scope.post = {};

		$scope.comments = [];

		$scope.newCommentText;
		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.itemsPerPage = 5;

		PostService.get($stateParams.slug).success(function(data)
			{
				$scope.post = data;
				//load once
				loadComments($scope.post._id);
			});

		var loadComments = function(postId){
	  		CommentService.list(postId, {
	  			"ps" : $scope.itemsPerPage,
	  			"pn" : $scope.currentPage
	  		}).success(function(data)
	  			{
	  				data.items.forEach(function(comment)
	  				{
	  					$scope.comments.push(comment);
	  				});
				
					$scope.totalItems = data.count;
	  			});
	  	}


	  	$scope.loadMore = function(){
			$scope.currentPage = $scope.currentPage + 1;
			
			loadComments($scope.post._id);
		}

		
	}
	]);


bloggerAppController.controller("TextSearchController",[
	"$scope", "$http", "PostService","$stateParams", "APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.itemsPerPage = 5;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : $scope.itemsPerPage,
	  			"pn" : $scope.currentPage,
	  			"s" : $stateParams.searchText
	  		}).success(function(data)
	  			{
					$scope.posts = data.items;
					$scope.totalItems = data.count;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);


bloggerAppController.controller("TagSearchController",[
	"$scope", "$http", "PostService","$stateParams","APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.itemsPerPage = 5;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : $scope.itemsPerPage,
	  			"pn" : $scope.currentPage,
	  			"t" : $stateParams.tag
	  		}).success(function(data)
	  			{
	  				
					$scope.posts = data.items;
					$scope.totalItems = data.count;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);


bloggerAppController.controller("ArchiveSearchController",[
	"$scope", "$http", "PostService","$stateParams","APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.itemsPerPage = 5;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : $scope.itemsPerPage,
	  			"pn" : $scope.currentPage,
	  			"sd" : $stateParams.startDate,
	  			"ed" : $stateParams.endDate
	  		}).success(function(data)
	  			{	
					$scope.posts = data.items;
					$scope.totalItems = data.count;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);
