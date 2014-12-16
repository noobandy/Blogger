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

bloggerAppController.controller("PostEditorController",[
	"$scope", "$stateParams", "PostService", "$modal", "APP_DATA", "TagService",
	"$state",
	function($scope, $stateParams, PostService, $modal, APP_DATA, TagService, $state)
	{
		$scope.alerts = [];

		$scope.closeAlert = function(index)
		{
			$scope.alerts.splice(index, 1);

		};

		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
	        readOnly: false,
	        mode: "Markdown",
	        theme: "cobalt",
	        autofocus: true
    	};

    	$scope.post = {
    		title : "New post title",
    		text : "Post content",
    		tags : [],
    		created_at : new Date(),
    		excerpt : "Short summary"
    	}

    	$scope.availableTags = [];

    	TagService.list().success(function(data)
    	{
    		data.forEach(function(tagCount)
    		{
    			$scope.availableTags.push(tagCount._id);
    		});
    	});

    	if($stateParams.slug)
    	{
    		PostService.get($stateParams.slug).success(function(data)
			{
				$scope.post = data;
			});
    	}

    	$scope.preview = function()
    	{
    		$scope.modalInstance = $modal.open(
    		{
    			templateUrl: APP_DATA.BASE_URL + "/packages/app/partial/postPreview.html",
				size: "lg",
				scope: $scope
    		});
    	}

    	$scope.closePreviewModal = function()
    	{
    		$scope.modalInstance.dismiss("ok");
    	}

    	$scope.savePost = function()
    	{
    		if($scope.post._id)
    		{
    			PostService.update($scope.post).success(function(data)
	    		{
	    			$scope.alerts.push(
	    				{ type: 'success', msg: 'Post saved successfully.' }
	    				);
	    		});
    		}
    		else
    		{
    			PostService.add($scope.post).success(function(data)
	    		{
	    			$scope.alerts.push(
	    				{ type: 'success', msg: 'Post saved successfully.' }
	    				);
	    		});
    		}
    		
    	}

    	$scope.deletePost = function()
    	{
    		if($scope.post._id)
    		{
    			PostService.delete($scope.post._id).success(function(data)
	    		{
	    			$state.go("home");
	    		});
    		}
    	}
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

		$scope.postComment = function(comment)
		{
			var commentObj = {
				post_id : $scope.post._id,
				comment : comment
			};

			CommentService.add(commentObj).success(function(data)
			{
				$scope.comments.unshift(data);
			});	
		}
		
	}
	]);


bloggerAppController.controller("TextSearchController",[
	"$scope", "$http", "PostService","$stateParams", "APP_DATA",
	function($scope, $http, PostService, $stateParams, APP_DATA)
	{
		$scope.searchText = $stateParams.searchText;

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
	  			"s" : $scope.searchText
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
		$scope.currentTag = $stateParams.tag;

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
	  			"t" : $scope.currentTag
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
		$scope.startDate = $stateParams.startDate;
		$scope.endDate = $stateParams.endDate;

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
	  			"sd" : $scope.startDate,
	  			"ed" : $scope.endDate
	  		}).success(function(data)
	  			{	
					$scope.posts = data.items;
					$scope.totalItems = data.count;
	  			});
	  	}

	  	$scope.loadData();
	}
	]);
