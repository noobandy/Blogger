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


		<div discussion blog-id="{{currentBlog._id}}" post-slug="{{post.slug}}" post-id="{{post._id}}" logged-in-user="{{loggedInUser.username}}" base-path="{{basePath}}">



		bloggerAppController.controller("ImageGalleryController",[
	"$scope", "$modalInstance",
	function($scope, $modalInstance)
	{

	    // Set of Photos

	    // initial image index
	    $scope._Index = 0;

	    // if a current image is the same as requested image
	    $scope.isActive = function (index) {
	        return $scope._Index === index;
	    };

	    // show prev image
	    $scope.showPrev = function () {
	        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.assets.length - 1;
	    };

	    // show next image
	    $scope.showNext = function () {
	        $scope._Index = ($scope._Index < $scope.assets.length - 1) ? ++$scope._Index : 0;
	    };

	    // show a certain image
	    $scope.showPhoto = function (index) {
	        $scope._Index = index;
	    };

	    $scope.closeGallery = function()
    	{
    		$modalInstance.dismiss("ok");
    	}

	}]);


		$scope.galleryDialog = function(index)
		{
			$modal.open(
			{
    			"templateUrl": APP_DATA.BASE_URL + "/packages/app/partial/imageGallery.html",
				"size": "lg",
				"controller": "ImageGalleryController",
				"scope" : $scope
    		});
		};



		/*
* IMage gallery css
*/

.gallery-arrow {
    cursor: pointer;
    display: block;
    height: 64px;
    margin-top: -35px;
    outline: medium none;
    position: absolute;
    top: 50%;
    width: 64px;
    z-index: 5;
}
.gallery-arrow.prev {
    background-image: url("../images/prev.png");
    left: 20px;
    opacity: 0.2;
    transition: all 0.2s linear 0s;
}
.gallery-arrow.next {
    background-image: url("../images/next.png");
    opacity: 0.2;
    right: 20px;
    transition: all 0.2s linear 0s;
}
.gallery-arrow.prev:hover{
    opacity:1;
}
.gallery-arrow.next:hover{
    opacity:1;
}

.gallery-nav {
    bottom: -4px;
    display: block;
    height: 48px;
    left: 0;
    margin: 0 auto;
    padding: 1em 0 0.8em;
    position: absolute;
    right: 0;
    text-align: center;
    width: 100%;
    z-index: 5;
}
.gallery-nav li {
    border: 5px solid #AAAAAA;
    border-radius: 5px;
    cursor: pointer;
    display: inline-block;
    height: 30px;
    margin: 0 8px;
    position: relative;
    width: 50px;
}
.gallery-nav li.active {
    border: 5px solid #FFFFFF;
}
.gallery-nav li img {
    width: 100%;
}

.gallery-slider {
    border: 15px solid #FFFFFF;
    border-radius: 5px;
    height: 500px;
    margin: 20px auto;
    position: relative;
    width: 800px;

    -webkit-perspective: 1000px;
    -moz-perspective: 1000px;
    -ms-perspective: 1000px;
    -o-perspective: 1000px;
    perspective: 1000px;

    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    -o-transform-style: preserve-3d;
    transform-style: preserve-3d;
}
.gallery-slide {
    position: absolute;
    top: 0;
    left: 0;
}
.gallery-slide.ng-hide-add {
    opacity:1;

    -webkit-transition:1s linear all;
    -moz-transition:1s linear all;
    -o-transition:1s linear all;
    transition:1s linear all;

    -webkit-transform: rotateX(50deg) rotateY(30deg);
    -moz-transform: rotateX(50deg) rotateY(30deg);
    -ms-transform: rotateX(50deg) rotateY(30deg);
    -o-transform: rotateX(50deg) rotateY(30deg);
    transform: rotateX(50deg) rotateY(30deg);

    -webkit-transform-origin: right top 0;
    -moz-transform-origin: right top 0;
    -ms-transform-origin: right top 0;
    -o-transform-origin: right top 0;
    transform-origin: right top 0;
}
.gallery-slide.ng-hide-add.ng-hide-add-active {
    opacity:0;
}
.gallery-slide.ng-hide-remove {
    -webkit-transition:1s linear all;
    -moz-transition:1s linear all;
    -o-transition:1s linear all;
    transition:1s linear all;

    display:block!important;
    opacity:0;
}
.gallery-slide, .gallery-slide.ng-hide-remove.ng-hide-remove-active {
    opacity:1;
}

@media (max-width: 900px) {
    .logo img {
        width: 60%;
    }
    .gallery-slider {
        height: 312px;
        width: 500px;
    }
    .gallery-slider .gallery-slide {
        width: 100%;
    }
}
@media (max-width: 550px) {
    .logo img {
        width: 60%;
    }
    .gallery-slider {
        height: 188px;
        width: 300px;
    }
    .gallery-slider .gallery-slide {
        width: 100%;
    }
    .gallery-nav {
        height: 28px;
    }
    .gallery-nav li {
        border: 3px solid #AAAAAA;
        border-radius: 3px;
        height: 15px;
        width: 25px;
    }
}



bloggerAppDirective.directive("comment", [
  "APP_DATA", "$rootScope",
  function(APP_DATA, $rootScope)
  {
    var voted = function(votes)
    {
      for(var vote in votes)
      {
        if($rootScope.loggedInUser != null && 
          $rootScope.loggedInUser._id === votes[vote].author_id)
        {
          return true;
        }
      }
  };

  var canModifyComment = function(comment)
  {
    return ($rootScope.loggedInUser != null 
      && $rootScope.loggedInUser._id === comment.author_id) ||
      $rootScope.isBlogOwner; 
  };


    return {
      restrict : "E",
      templateUrl : APP_DATA.BASE_URL + "/packages/app/partial/comment.html",
      transclude : false,
      link: function(scope, element, attrs)
      {
        scope.upvoted = voted(scope.comment.up_votes);
        scope.downvoted = voted(scope.comment.down_votes);
      } 
    }
  }]);


$("body").append(
              '<div id="fileManager" class="modal hide fade" tabindex="-1" role="dialog">'+
              '<div class="modal-header">'+
              '<button type="button" class="close" data-dismiss="modal">×</button>'+
              '<h3>Dialog</h3>'+
              '</div>'+
              '<div class="modal-body">'+
              '<iframe src="" style="zoom:0.60" width="99.6%" height="250" frameborder="0"></iframe>'+
              '</div>'+
              '<div class="modal-footer">'+
              '<button class="btn" data-dismiss="modal">OK</button>'+
              '</div>'+
              '</div>');

             $('#fileManager').on('show', function () {
              $('iframe').attr("src","http://localhost/FileManager/");
            });

             
            $('#fileManager').modal({show:true});