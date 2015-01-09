"use strict"

var bloggerAppDirective = angular.module("bloggerApp.directive",[]);

bloggerAppDirective.directive('holder', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$set('data-src', attrs.holder);
      Holder.run({images:element[0]});
    }
  };
});

bloggerAppDirective.directive("marked",[
  "$sanitize",
  function ($sanitize) {
	marked.setOptions({
		renderer: new marked.Renderer(),
		highlight: function (code) {
			return hljs.highlightAuto(code).value;
		},
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: true
	});

    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        if (attrs.marked) {
          scope.$watch(attrs.marked, function (newVal) {
            var html = newVal ? $sanitize(marked(newVal)) : '';
            element.html(html);
          });
        } else {
          var html = $sanitize(marked(element.text()));
          element.html(html);
        }
      }
    };
}]);

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



bloggerAppDirective.directive("discussion",[
  "$rootScope", "PostService", "CommentService",
  function($rootScope, PostService, CommentService) {
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
    }

    var canModifyComment = function(comment)
    {
      return ($rootScope.loggedInUser != null 
      && $rootScope.loggedInUser._id === comment.author_id) ||
      $rootScope.isBlogOwner; 
    }

    var commentFormElement = function()
    {
      return $("<div/>").addClass("row").append(
          $("<div/>").addClass("col-md-12").append(
              $("<form/>").addClass("well comment-post-form").append(
                  $("<legend>").html("Post Comment")
                ).append(
                  $("<div/>").addClass("form-group").append(
                      $("<textarea/>").addClass("form-control input-lg comment-text")
                    )
                ).append(
                  $("<button>").attr("type","submit").addClass("btn btn-primary").html("Submit")
                )
            )
        )
    }


    var replyFormElement = function(commentId)
    {
      return $("<div/>").addClass("row").append(
          $("<div/>").addClass("col-md-12").append(
              $("<form/>").addClass("well comment-reply-form").append(
                  $("<legend>").html("Post Reply")
                ).append(
                  $("<div/>").addClass("form-group").append(
                      $("<textarea/>").addClass("form-control input-lg comment-text").
                      attr("data-commentId", commentId)
                    )
                ).append(
                  $("<button>").attr("type","submit").addClass("btn btn-primary").html("Submit")
                )
            )
        )
    }

    var editFormElement = function(commentId, oldCommentText)
    {
      return $("<div/>").addClass("row").append(
          $("<div/>").addClass("col-md-12").append(
              $("<form/>").addClass("well comment-edit-form").append(
                  $("<legend>").html("Edit Comment")
                ).append(
                  $("<div/>").addClass("form-group").append(
                      $("<textarea/>").addClass("form-control input-lg comment-text").
                      attr("data-commentId", commentId).val(oldCommentText)
                    )
                ).append(
                  $("<div/>").addClass("form-actions").append(
                      $("<button>").attr("type","submit").addClass("btn btn-primary").html("Submit")
                    )
                )
            )
        )
    }

    var avatrElement = function(comment)
    {
      return $("<a/>").addClass("media-left").append(
          $("<img/>").attr("src", "holder.js/64x64").addClass("avatar img-circle")
        )
    }

    var commentHeaderElement = function(comment)
    {
      return $("<h4/>").addClass("media-heading").append(
          $("<a/>").attr("href", "").html(comment.author.username)
        ).append("&nbsp;").append(
          $("<small/>").html(moment.utc(comment.created_at).tz(tzid).fromNow())
        );
    }

    var commentBodyElement = function(comment)
    {
      return $("<p/>").addClass("comment-text").text(comment.comment);
    }

    var replyFormHolderElement = function()
    {
      return $("<div/>").addClass("comment-reply-form-holder");
    }

    var editFormHolderElement = function()
    {
      return $("<div/>").addClass("comment-edit-form-holder");
    }


    var commentActionElement = function(comment, upvoted, downvoted, canModifyComment)
    {
      var holder = $("<div/>").addClass("comment-control-holder");

      if(comment.up_votes.length > 0)
      {
        holder.append(
            $("<a/>").attr("herf", "").html(comment.up_votes.length)
          );
      }

      var upVoteControl = $("<a/>").attr("href", "").addClass("comment-control left up-vote").append(
          $("<i/>").addClass("glyphicon glyphicon-thumbs-up")
        );

      if(upvoted)
      {
        upVoteControl.addClass("voted");
      }

      holder.append(upVoteControl);

      if(comment.down_votes.length > 0)
      {
        holder.append(
            $("<a/>").attr("href", "").html(comment.down_votes.length)
          );
      }

      var downVoteControl = $("<a/>").attr("href", "").addClass("comment-control left down-vote").append(
          $("<i/>").addClass("glyphicon glyphicon-thumbs-down")
        );

      if(downvoted)
      {
        downVoteControl.addClass("voted");
      }

      holder.append(downVoteControl);

      if(canModifyComment)
      {
        holder.append(
            $("<a/>").attr("href", "").addClass("comment-control left edit").append(
                $("<i/>").addClass("glyphicon glyphicon-edit")
              )
          );

        holder.append(
            $("<a/>").attr("href", "").addClass("comment-control left delete").append(
                $("<i/>").addClass("glyphicon glyphicon-trash")
              )
          );
      }

      holder.append(
            $("<a/>").attr("href", "").addClass("reply").html("Reply")
          );

      return holder;

    }

    var commentNode = function(comment)
    {
      var upvoted = voted(comment.up_votes);
      var downvoted = voted(comment.down_votes);
      var modify = canModifyComment(comment);

      var commentElement = $("<li>").addClass("media").attr("data-commentId", comment._id);
      
      commentElement.append(avatrElement(comment));

      var mediaBody = $("<div/>").addClass("media-body");

      mediaBody.append(commentHeaderElement(comment));

      mediaBody.append(commentBodyElement(comment));

      mediaBody.append(editFormHolderElement());

      mediaBody.append(replyFormHolderElement);
      

      mediaBody.append(commentActionElement(comment, upvoted, downvoted, modify));

      var commentReplyHolder = $("<ul/>").addClass("media-list");

      if(comment.replies.length > 0)
      {
        comment.replies.forEach(function(comment) {
            
            commentReplyHolder.append(
              commentNode(comment)
            );
          });
      }

      mediaBody.append(commentReplyHolder);

      commentElement.append(mediaBody);

      return commentElement;
    }

    var initAvatarPlaceHolder = function()
    {
      Holder.run({images:".avatar"})
    };

    var init = function(element, comments)
    {
      var commentForm = commentFormElement();

      var discussionTreeRow = $("<div/>").addClass("row");

      var discussionTreeCol = $("<div/>").addClass("col-md-12");

      var discussionTree = $("<ul/>").addClass("media-list discussion-tree")

      comments.forEach(function(comment)
      {
        discussionTree.append(commentNode(comment));
      });

      discussionTreeCol.append(discussionTree);
      
      discussionTreeRow.append(discussionTreeCol);

      element.append(commentForm);

      element.append(discussionTreeRow);

      initAvatarPlaceHolder();
    }; 

    var hasText = function(text)
    {
      if(typeof text !== "undefined" && text != null && text.trim() != "")
      {
        return true;
      }
      else
      {
        return false;
      }
    };

    return {
      restrict: "E",
      scope : {
        slug: "@slug"
      },
      replace : false,
      transclude : false,
      link: function (scope, element, attrs) {

        PostService.get(scope.slug).success(function(post)
        {
          scope.post = post;

          CommentService.list(scope.slug).success(function(data)
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
            
            init(element, comments);
        });
        });

        element.on("click", "a.edit", function(e)
        {
          e.preventDefault();
          var commentId = $(this).parents("li.media").filter(":visible:first").attr("data-commentId");
          
          var oldCommentText = $(this).parents("p.comment-text").filter(":visible:first").text();

          $(this).parents("div.comment-control-holder").filter(":visible:first").hide("slow");

          $(this).parents("div.comment-edit-form-holder").append(editFormElement(commentId, oldCommentText));


        });

        element.on("click", "a.delete", function(e)
        {
          e.preventDefault();
          $(this).parents("div.comment-control-holder").filter(":visible:first").hide("slow");

        });

        element.on("click", "a.reply", function(e)
        {
          e.preventDefault();
          $(this).parents("div.comment-control-holder").filter(":visible:first").hide("slow");

        }); 

        element.on("submit", "form.comment-post-form", function(e)
        {
          e.preventDefault();
          var commentText = $(this).find("textarea").filter(":visible:first").val();
           
          $(this).find("textarea").filter(":visible:first").val("");

          if(hasText(commentText))
          {

            CommentService.add(
              {
                post_id : scope.post._id,
                comment : commentText
              }).success(function(comment)
              {
                comment.replies = [];
                element.find("ul.discussion-tree").filter(":visible:first").
                prepend(commentNode(comment));

                initAvatarPlaceHolder();
                
                console.log(comment);

              });
          }

        });


      }
  }
}]);
