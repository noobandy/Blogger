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
      return $("<p/>").addClass("comment-text").
      attr("id", "comment-text-"+comment._id).
      text(comment.comment);
    }

    var replyFormHolderElement = function(comment)
    {
      return $("<div/>").
      addClass("comment-reply-form-holder").
      attr("id", "comment-reply-form-holder-"+comment._id);
    }

    var editFormHolderElement = function(comment)
    {
      return $("<div/>").
      addClass("comment-edit-form-holder").
      attr("id", "comment-edit-form-holder-"+comment._id);
    }

    var userList = function(commentId, votes)
    {
      var list = $("<ul/>").addClass("list-unstyled").attr("id","popover-"+commentId);

        votes.forEach(function(vote) {
          list.append(
            $("<li>").append(
              $("<a/>").
              attr("href","").
              html(vote.author.username)
            ).attr("id","popover-"+commentId+"-uid-"+vote.author_id) 
          );
        });

        return  list;
    }

    var commentActionElement = function(comment, upvoted, downvoted, canModifyComment)
    {
      var holder = $("<div/>").
      addClass("comment-control-holder").
      attr("id", "comment-control-holder-"+comment._id);

      if(comment.up_votes.length > 0)
      {
        holder.append(
            $("<a/>").
            attr("href", "").
            addClass("vote-count").
            attr("id", "comment-upvote-count-"+comment._id).
            attr("data-content", userList(comment._id, comment.up_votes).prop("outerHTML")).
            html(comment.up_votes.length)
          );
      }

      var upVoteControl = $("<a/>").
      attr("href", "").
      attr("data-commentId", comment._id).
      addClass("comment-control left up-vote").
      append(
          $("<i/>").
          attr("id", "up-vote-icon-"+comment._id).
          addClass("glyphicon glyphicon-thumbs-up")
        );

      if(upvoted)
      {
        upVoteControl.addClass("voted");
      }

      holder.append(upVoteControl);

      if(comment.down_votes.length > 0)
      {
        holder.append(
            $("<a/>").
            attr("href", "").
            addClass("vote-count").
            attr("id", "comment-downvote-count-"+comment._id).
            attr("data-content", userList(comment._id, comment.down_votes).prop("outerHTML")).
            html(comment.down_votes.length)
          );
      }

      var downVoteControl = $("<a/>").
      attr("href", "").
      attr("data-commentId", comment._id).
      addClass("comment-control left down-vote").append(
          $("<i/>").
          attr("id", "down-vote-icon-"+comment._id).
          addClass("glyphicon glyphicon-thumbs-down")
        );

      if(downvoted)
      {
        downVoteControl.addClass("voted");
      }

      holder.append(downVoteControl);

      if(canModifyComment)
      {
        holder.append(
            $("<a/>").
            attr("href", "").
            attr("data-commentId", comment._id).
            addClass("comment-control left edit").
            append(
                $("<i/>").addClass("glyphicon glyphicon-edit")
              )
          );

        holder.append(
            $("<a/>").
            attr("href", "").
            attr("data-commentId", comment._id).
            addClass("comment-control left delete").
            append(
                $("<i/>").addClass("glyphicon glyphicon-trash")
              )
          );
      }

      holder.append(
            $("<a/>").
            attr("href", "").
            attr("data-commentId", comment._id).
            addClass("comment-control reply").html("Reply")
          );

      return holder;

    }

    var commentNode = function(comment)
    {
      var upvoted = voted(comment.up_votes);
      var downvoted = voted(comment.down_votes);
      var modify = canModifyComment(comment);

      var commentElement = $("<li>").
      addClass("media").
      attr("id","comment-"+comment._id);
      
      commentElement.append(avatrElement(comment));

      var mediaBody = $("<div/>").addClass("media-body");

      mediaBody.append(commentHeaderElement(comment));

      mediaBody.append(commentBodyElement(comment));

      mediaBody.append(editFormHolderElement(comment));

      mediaBody.append(replyFormHolderElement(comment));
      

      mediaBody.append(commentActionElement(comment, upvoted, downvoted, modify));

      var commentReplyHolder = $("<ul/>").
      addClass("media-list").
      attr("id", "comment-reply-"+comment._id);

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

      var discussionTree = $("<ul/>").
      addClass("media-list discussion-tree").
      attr("id", "discussion-tree")

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

    var attachReplyForm = function(commentId)
    {
      $("#comment-reply-form-holder-"+commentId).append(replyFormElement(commentId));

      $("#comment-control-holder-"+commentId).hide("slow");
    };

    var detachReplyForm = function(commentId)
    {
      $("#comment-reply-form-holder-"+commentId).empty();

      $("#comment-control-holder-"+commentId).show("slow");
    };

    var attachEditForm = function(commentId, oldCommentText)
    {
      $("#comment-edit-form-holder-"+commentId).append(editFormElement(commentId, oldCommentText));

      $("#comment-text-"+commentId).hide("slow");
            
      $("#comment-control-holder-"+commentId).hide("slow");
    };

    var detachEditForm = function(commentId)
    {
      $("#comment-edit-form-holder-"+commentId).empty();

      $("#comment-text-"+commentId).show("slow");
            
      $("#comment-control-holder-"+commentId).show("slow");
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


        element.on("click", "a.vote-count", function(e)
        {
          e.preventDefault() ;
        }).on("mouseenter", "a.vote-count", function(e)
        {
          $(this).popover(
          {
            placement : "top",
            trigger : "manual",
            selector : 'a.vote-count',
            html : true,
            animation : true,
            template: '<div class="popover" onmouseover="clearTimeout(timeoutObj);$(this).mouseleave(function() {$(this).hide();});"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
          });
                
           $(this).popover('show');

        }).on("mouseleave", "a.vote-count", function(e)
        {
          var ref = $(this);
          window.timeoutObj = setTimeout(function()
          {
            ref.popover('hide');
          }, 50);
        });

        element.on("click", "a.edit", function(e)
        {
          e.preventDefault();

          var commentId = $(this).attr("data-commentId");
          
          var oldCommentText = $("#comment-text-"+commentId).text();

          attachEditForm(commentId, oldCommentText);
        });

        element.on("click", "a.delete", function(e)
        {
          e.preventDefault();

          var commentId = $(this).attr("data-commentId");

          if(confirm("Are you sure?"))
          {
            CommentService.delete(scope.post._id, commentId).success(function()
            {
              alert("Comment deleted successfully.");

              $("#comment-"+commentId).empty().remove();
            });
          }

        });

        element.on("click", "a.reply", function(e)
        {
          e.preventDefault();

          var commentId = $(this).attr("data-commentId");

          attachReplyForm(commentId);

        }); 

        element.on("click", "a.up-vote", function(e)
        {
          e.preventDefault();
          
          var commentId = $(this).attr("data-commentId");

          var upVoteControlIcon = $("#up-vote-icon-"+commentId);

          var downVoteControlIcon = $("#down-vote-icon-"+commentId);

          CommentService.upvote(scope.post._id, commentId).success(function(upvote)
          {
            if(upVoteControlIcon.hasClass("voted"))
            {
              upVoteControlIcon.removeClass("voted");
            }
            else
            {
              downVoteControlIcon.removeClass("voted");
              upVoteControlIcon.addClass("voted");
            }
          });

        });


        element.on("click", "a.down-vote", function(e)
        {
          e.preventDefault();
          
          var commentId = $(this).attr("data-commentId");

          var upVoteControlIcon = $("#up-vote-icon-"+commentId);

          var downVoteControlIcon = $("#down-vote-icon-"+commentId);

          CommentService.downvote(scope.post._id, commentId).success(function(upvote)
          {
            if(downVoteControlIcon.hasClass("voted"))
            {
              downVoteControlIcon.removeClass("voted");
            }
            else
            {
              upVoteControlIcon.removeClass("voted");
              downVoteControlIcon.addClass("voted");
            }
          });

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
                element.find("ul#discussion-tree").
                append(commentNode(comment));

                initAvatarPlaceHolder();

              });
          }

        });


        element.on("submit", "form.comment-reply-form", function(e)
        {
          e.preventDefault();
          var commentText = $(this).find("textarea").filter(":visible:first").val();

          var commentId = $(this).find("textarea").filter(":visible:first").attr("data-commentId"); 
          
          $(this).find("textarea").filter(":visible:first").val("");

          if(hasText(commentText))
          {

            CommentService.add(
              {
                post_id : scope.post._id,
                comment : commentText,
                parentId : commentId
              }).success(function(comment)
              {
                detachReplyForm(commentId);

                comment.replies = [];

                $("#comment-reply-"+commentId).append(commentNode(comment));

                initAvatarPlaceHolder();

              });
          }

        });


        element.on("submit", "form.comment-edit-form", function(e)
        {
          e.preventDefault();
          var commentText = $(this).find("textarea").filter(":visible:first").val();

          var commentId = $(this).find("textarea").filter(":visible:first").attr("data-commentId"); 
          
          $(this).find("textarea").filter(":visible:first").val("");

          if(hasText(commentText))
          {

            CommentService.update(
              {
                _id : commentId,
                post_id : scope.post._id,
                comment : commentText
              }).success(function(comment)
              {
                detachEditForm(commentId);

                $("#comment-text-"+commentId).text(comment.comment);

              });
          }

        });


      }
  }
}]);
