"use strict"

var bloggerAppController = angular.module("bloggerApp.controller",[]);

bloggerAppController.controller("NavbarController",[
	"$scope", "APP_DATA", "$state",
	function($scope, APP_DATA, $state)
	{
		$scope.blog = APP_DATA.BLOG;

		$scope.searchText = "";

		$scope.search = function()
		{
			
			var searchText = $scope.searchText;
			$scope.searchText = "";
			$scope.searchForm.$setUntouched();

			$state.go("base.textSearch", {
				searchText : searchText
			});
		}
	}
	]);

bloggerAppController.controller("SidebarController",[
	"$scope", "tagCounts", "archiveTree",
	 "mostPopularPosts", "$state",
	function($scope, tagCounts, archiveTree,
	 mostPopularPosts,  $state)
	{

		$scope.archiveTree = archiveTree;
		$scope.mostPopularPosts = mostPopularPosts;
		$scope.tagCounts = tagCounts;

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

				$state.go("base.archiveSearch",
					{
						startDate : startDate,
						endDate : endDate
					});
			} 
		}
	}
	]);


bloggerAppController.controller("HomeController",[
	"$scope", "$http", "PostService", "APP_DATA", "data",
	function($scope, $http, PostService, APP_DATA, data)
	{
	

		$scope.posts = data.items;

		$scope.totalItems = data.count;
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
	}
	]);



bloggerAppController.controller("BlogController",[
	"$scope", "$stateParams", "PostService",
	function($scope, $stateParams, PostService)
	{

	}
	]);

bloggerAppController.controller("PostEditorController",[
	"$scope", "PostService", "$modal", "APP_DATA", "TagService",
	"$state", "post", "availableTags",
	function($scope, PostService, $modal, APP_DATA, TagService,
	 $state, post, availableTags)
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

    	$scope.post = post;

    	$scope.availableTags = availableTags;

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

	    			$scope.post = data;
	    		});
    		}
    		
    	}

    	$scope.deletePost = function()
    	{
    		if($scope.post._id)
    		{
    			PostService.delete($scope.post._id).success(function(data)
	    		{
	    			$state.go("base.home");
	    		});
    		}
    	}
	}
	]);

bloggerAppController.controller("PostController",[
	"$scope", "$stateParams", "PostService", "CommentService",
	"post",
	function($scope, $stateParams, PostService, CommentService, 
		post)
	{

		$scope.post = post;

		$scope.comments = [];

		$scope.newCommentText;

		$scope.totalItems = 0;
	  	$scope.currentPage = 1;
	  	$scope.itemsPerPage = 5;

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

		$scope.postComment = function()
		{
			var commentObj = {
				post_id : $scope.post._id,
				comment : $scope.newCommentText
			};

			$scope.newCommentText = "";

			$scope.commentForm.$setUntouched();

			CommentService.add(commentObj).success(function(data)
			{
				$scope.comments.unshift(data);
			});	
		}
		
	}
	]);


bloggerAppController.controller("TextSearchController",[
	"$scope", "$stateParams", "PostService", "data",
	function($scope, $stateParams, PostService, data)
	{
		$scope.searchText = $stateParams.searchText;

		$scope.posts = data.items;

		$scope.totalItems = data.count;

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
	}
	]);


bloggerAppController.controller("TagSearchController",[
	"$scope","PostService","$stateParams","data",
	function($scope, PostService, $stateParams, data)
	{
		$scope.currentTag = $stateParams.tag;

		$scope.posts = data.items;

		$scope.totalItems = data.count;

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
	}
	]);


bloggerAppController.controller("ArchiveSearchController",[
	"$scope", "PostService","$stateParams","data",
	function($scope, PostService, $stateParams, data)
	{
		$scope.startDate = $stateParams.startDate;
		$scope.endDate = $stateParams.endDate;

		$scope.posts = data.items;

		$scope.totalItems = data.count;

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
	}
	]);
