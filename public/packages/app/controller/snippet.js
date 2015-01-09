$scope.startDate = new Date(59859000);
		$scope.endDate = new Date();
		$scope.setPeriod = function(startDate, endDate)
		{
			$scope.startDate = new Date(startDate);
			$scope.endDate = new Date(endDate);
		}

		$scope.withinPeriod = function(post){
			var publishedAt = new Date(post.publishedAt);
			if(publishedAt.getTime() > $scope.startDate.getTime() 
				&& publishedAt.getTime() < $scope.endDate.getTime() )
			{
				return true;
			}else{
				return false;
			}
		}



		$stateProvider.state("base.post.comment",
		{
			"templateUrl" : APP_DATA.BASE_URL + "/packages/app/partial/comment.html",
			"controller" : "CommentController",
			"resolve" : {
				comments : ["$q", "$stateParams", "CommentService",
				function($q, $stateParams, CommentService)
				{
					var deferred = $q.defer();

					CommentService.list($stateParams.slug).success(function(data)
					{
		  				var idToNodeMap = {};
						var roots = [];
						for(var i = 0; i < data.items.length; i++) {
						    var datum = data.items[i];
						    datum.replies = [];
						    idToNodeMap[datum._id] = datum;
						    
						    if(typeof datum.parent_id === "undefined") {
						        roots.push(datum);        
						    } else {
						        var parentNode = idToNodeMap[datum.parent_id];
						        parentNode.replies.push(datum);
						    }
						}
						
						deferred.resolve(roots);

	  				});


	  				return deferred.promise;
				}]
			}
		});





		bloggerAppController.controller("CommentController", [
	"$scope", "$stateParams", "CommentService", "comments",
	function($scope, $stateParams, CommentService, comments){
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

	}]);

		<div discussion blog-id="{{currentBlog._id}}" post-slug="{{post.slug}}" post-id="{{post._id}}" logged-in-user="{{loggedInUser.username}}" base-path="{{basePath}}">