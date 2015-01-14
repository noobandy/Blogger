"use strict"

var bloggerAppController = angular.module("bloggerApp.controller",[]);

bloggerAppController.controller("LoginController",[
	"$rootScope", "$scope", "$modalInstance", "authService",
	function($rootScope, $scope, $modalInstance, authService)
	{
		$scope.alerts = [];

		$scope.closeAlert = function(index)
		{
			$scope.alerts.splice(index, 1);

		};

    	$scope.closeLoginModal = function()
    	{
    		$modalInstance.dismiss("ok");
    	}

    	$scope.login = function(username, password) {
    		authService.login(username, password).then(function(data)
    		{
    			$modalInstance.dismiss("ok");
    			
    		},function(data)
    		{
    			$scope.alerts.push(
	    				{ type: 'danger', msg: 'Wrong username or password.' }
	    				);
    		});
    	}
	}
	]);

bloggerAppController.controller("UserProfileController",[
	"$rootScope", "$scope", "$modalInstance", "user", "authService",
	function($rootScope, $scope, $modalInstance, user, authService)
	{
		$scope.user = user;
		$scope.alerts = [];

		$scope.closeAlert = function(index)
		{
			$scope.alerts.splice(index, 1);

		};

    	$scope.closeUserProfileModal = function()
    	{
    		$modalInstance.dismiss("ok");
    	}
	}
	]);

bloggerAppController.controller("NavbarController",[
	"$rootScope", "$scope", "APP_DATA", "$state", "authService",
	"UserProfileDialogService", "$modal",
	function($rootScope, $scope, APP_DATA, $state, authService, UserProfileDialogService, $modal)
	{
		$scope.navCollapsed = true;
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

		$scope.loginDialog = function(e)
		{
			$modal.open(
			{
    			templateUrl: APP_DATA.BASE_URL + "/packages/app/partial/loginForm.html",
				size: "sm",
				controller: "LoginController"
    		});
		}

		$scope.userProfileDialog = function(username) {
			UserProfileDialogService.userProfile(username);
		}

		$scope.logout = function() {
    		authService.logout();
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
	"$scope", "$http", "PostService", "APP_DATA", "paginationConfig", "data",
	function($scope, $http, PostService, APP_DATA, paginationConfig, data)
	{
	

		$scope.posts = data.items;

		$scope.totalItems = data.count;

	  	$scope.currentPage = 1;
	  	
	  	
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : paginationConfig.itemsPerPage,
	  			"pn" : $scope.currentPage,
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

bloggerAppController.controller("AssetController",[
	"APP_DATA", "$scope", "$stateParams", "AssetService", 
	"$upload", "$timeout", "authService", "data", 
	function(APP_DATA, $scope, $stateParams, AssetService, 
		$upload, $timeout, authService, data)
	{
		$scope.fileReaderSupported = window.FileReader != null && 
		(window.FileAPI == null || FileAPI.html5 != false);

		$scope.maxProgress = 100;
		$scope.assets = data.items;

		$scope.alerts = [];

		$scope.files = [];

		$scope.inProgressFilter = function(file)
		{
			if(typeof file.progress === "undefined")
			{
				return true;
			}
			else
			{
				return file.progress < $scope.maxProgress;
			}
    	};

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		

		$scope.generateThumb = function(file)
		{
			if (file != null)
			{
				if ($scope.fileReaderSupported && file.type.indexOf('image') > -1)
				{
					$timeout(function()
					{
						var fileReader = new FileReader();
						fileReader.readAsDataURL(file);
					
						fileReader.onload = function(e)
						{
							$timeout(function()
							{
								file.dataUrl = e.target.result;
							});
						}
					});
				}
			}
		}


		$scope.onFileSelect = function($files)
		{	
			//$files: an array of files selected, each file has name, size, and type.
			for (var i = 0; i < $files.length; i++) {
				
				(function(file){

					$scope.generateThumb(file);

					file.upload = $upload.upload({
					url: APP_DATA.BASE_URL+'/blog/'+$stateParams.blogId+'/asset', //upload.php script, node.js route, or servlet url
					method:'POST',
					headers: {
						'Content-Type' : 'multipart/form-data',
						'Authorization' : authService.getAuth()
					},
					//withCredentials: true,
					//data: {myObj: $scope.myModelObj},
					file: file, // or list of files ($files) for html5 only
					//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
					// customize file formData name ('Content-Desposition'), server side file variable name. 
					//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
					fileFormDataName: "asset"
					// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
					//formDataAppender: function(formData, key, val){}
				}).progress(function(evt)
				{
					file.progress = parseInt(100.0 * evt.loaded / evt.total);
				}).success(function(data, status, headers, config)
				{
					if(data.errors)
					{
						data.errors.asset.forEach(function(msg)
						{
							$scope.alerts.push({ type: 'danger', msg: msg });
						});
					}
					else
					{
						// file is uploaded successfully
						//$scope.alerts.push({ type: 'success', msg: 'File successfully uploaded' });
						
						$scope.assets.push(data);

					}
				}).error(function(data)
				{
					$scope.alerts.push({ type: 'danger', msg: 'Failed to upload file' });
				});
				})($files[i]);
			}
		};


		$scope.deleteAsset = function(index)
		{
			var asset = $scope.assets[index];

			AssetService.delete(asset._id).success(function()
			{
				$scope.assets.splice(index, 1);

				$scope.alerts.push({ type: 'success', msg: 'Asset successfully deleted.' });
			});
		}

	}]);

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
	"post", "commentsCount", "paginationConfig",
	function($scope, $stateParams, PostService, CommentService, 
		post, commentsCount, paginationConfig)
	{

		$scope.post = post;
		$scope.commentsCount = commentsCount;
		
	}
	]);

bloggerAppController.controller("CommentController", [
	"$rootScope", "$scope", "$stateParams", "CommentService", "comments",
	function($rootScope, $scope, $stateParams, CommentService, comments){
		$scope.comments = comments;

		$scope.newCommentText;

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

		$scope.postReply = function(comment, reply)
		{
			var commentObj = {
				post_id : $scope.post._id,
				parent_id : comment._id,
				comment : reply 
			}

			CommentService.add(commentObj).success(function(data)
			{
				coomment.replies.unshift(data);
			});
		}

		$scope.upvoteComment = function(commentId)
		{
			CommentService.upvote($scope.post._id, commentId).success(function()
			{

			});
		}


		$scope.downvoteComment = function(commentId)
		{
			CommentService.downvote($scope.post._id, commentId).success(function()
			{
				
			});
		}

		$scope.reportComment = function(commentId)
		{
			CommentService.report($scope.post._id, commentId).success(function()
			{
				
			});
		}

	}]);

bloggerAppController.controller("TextSearchController",[
	"$scope", "$stateParams", "PostService", "data", "paginationConfig",
	function($scope, $stateParams, PostService, data, paginationConfig)
	{
		$scope.searchText = $stateParams.searchText;

		$scope.posts = data.items;

		$scope.totalItems = data.count;

	  	$scope.currentPage = 1;
	  	
	  	
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : paginationConfig.itemsPerPage,
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
	"$scope","PostService","$stateParams","data", "paginationConfig",
	function($scope, PostService, $stateParams, data, paginationConfig)
	{
		$scope.currentTag = $stateParams.tag;

		$scope.posts = data.items;

		$scope.totalItems = data.count;

	  	$scope.currentPage = 1;
	  	
	  	
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : paginationConfig.itemsPerPage,
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
	"$scope", "PostService","$stateParams","data", "paginationConfig",
	function($scope, PostService, $stateParams, data, paginationConfig)
	{
		$scope.startDate = $stateParams.startDate;
		$scope.endDate = $stateParams.endDate;

		$scope.posts = data.items;

		$scope.totalItems = data.count;

	  	$scope.currentPage = 1;
	  	
	  	
	   	
	   	$scope.pageChanged = function() {
	    	$scope.loadData();
	  	};

	  	$scope.loadData = function(){
	  		PostService.list({
	  			"ps" : paginationConfig.itemsPerPage,
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
