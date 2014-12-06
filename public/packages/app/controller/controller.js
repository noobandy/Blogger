"user strict"

var bloggerAppController = angular.module("bloggerApp.controller",[]);

bloggerAppController.controller("NavController",[
	"$scope", "APP_DATA",
	function($scope,APP_DATA)
	{
		$scope.brand = APP_DATA.BLOG.name;
		$scope.username = APP_DATA.USER.username;
		$scope.homeUrl = APP_DATA.BASE_URL + "/blogger/" + $scope.username;
	}
	]);

bloggerAppController.controller("LeftNavController",[
	"$scope", "$http", "PostService", "APP_DATA",
	function($scope, $http, PostService, APP_DATA)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.archiveTree = [
			{
				label: "2014 (140)",
				children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			{
				label: "2013",
				children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			{
				label: "2012",
				children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			{
				label: "2011",
				children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			{
				label: "2010",
				children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dec"]
			}
		];

		$scope.mostPopularPosts = [];

		PostService.list({}).success(function(data)
		{
			
			$scope.mostPopularPosts = data.slice(0,5);
		});


		$scope.tagCounts = [
		{
			tag: "Java",
			count: 40
		},
		{
			tag: "Hibernate",
			count: 30
		},
		{
			tag: "Spring",
			count: 20
		},
		{
			tag: "AngularJs",
			count: 10
		},
		{
			tag: "Javascript",
			count: 5
		}
		];
	}
	]);


bloggerAppController.controller("HomeController",[
	"$scope", "$http", "PostService", "APP_DATA",
	function($scope, $http, PostService, APP_DATA)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$log.log('Page changed to: ' + $scope.currentPage);
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({}).success(function(data)
	  			{
	  				
					$scope.posts = data;
					$scope.totalItems = $scope.posts.length;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);



bloggerAppController.controller("BlogController",[
	"$scope",
	"$stateParams",
	function($scope, $stateParams)
	{

	}
	]);


bloggerAppController.controller("PostController",[
	"$scope",
	"$stateParams",
	function($scope, $stateParams)
	{

	}
	]);


bloggerAppController.controller("TextSearchController",[
	"$scope", "$http", "PostService","$stateParams", "APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$log.log('Page changed to: ' + $scope.currentPage);
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({}).success(function(data)
	  			{
	  				
					$scope.posts = data;
					$scope.totalItems = $scope.posts.length;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);


bloggerAppController.controller("TagSearchController",[
	"$scope", "$http", "PostService","$stateParams","APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$log.log('Page changed to: ' + $scope.currentPage);
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({}).success(function(data)
	  			{
	  				
					$scope.posts = data;
					$scope.totalItems = $scope.posts.length;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);


bloggerAppController.controller("ArchiveSearchController",[
	"$scope", "$http", "PostService","$stateParams","APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.posts = [];

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.maxSize = 5;
	   	
	   	$scope.pageChanged = function() {
	    	$log.log('Page changed to: ' + $scope.currentPage);
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({}).success(function(data)
	  			{
	  				
					$scope.posts = data;
					$scope.totalItems = $scope.posts.length;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);
