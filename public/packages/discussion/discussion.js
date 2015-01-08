(function ( $ ) {
 
    $.fn.discussion = function(opts) {
    	var options = $.extend( {}, $.fn.discussion.defaults, opts );
    	var element = this;
    	var Discussion = {
					loadComments : function(success, error) {
						$.getJSON(options.basePath+"/blog/"+options.blogId+"/post/"+options.postSlug+"/comment", function(data) {
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
							
							success(comments);
						});
					},
					postComment : function(comment,success,error) {
						$.ajax({
							url : options.basePath+"/blog/"+options.blogId+"/post/"+options.postId+"/comment",
							method : "POST",
							data : {
								comment : comment
							},
							contentType : "application/x-www-form-urlencoded; charset=UTF-8",
							cache : false,
							async : true
							
						}).success(function(data) {
							var comment = data;
							comment.replies = [],
							success(comment);
						}).error(function(data) {
							error(data);
						});
				},
				postReply : function(parentId,comment,success,error) {
					$.ajax({
						url : options.basePath+"/blog/"+options.blogId+"/post/"+options.postId+"/comment",
						method : "POST",
						data : {
							parentId : parentId,
							comment : comment
						},
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						cache : false,
						async : true
						
					}).success(function(data) {
						var comment = data;
						comment.replies = [],
						success(comment);
					}).error(function(data) {
						error(data);
					});
				},
				updateComment : function(commentId, comment,success,error) {
					$.ajax({
						url : options.basePath+"/blog/"+options.blogId+"/post/"+options.postId+"/comment/"+commentId,
						method : "PUT",
						data : {
							comment : comment
						},
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						cache : false,
						async : true
						
					}).success(function(data) {
						var comment = data;
						comment.replies = [],
						success(comment);
					}).error(function(data) {
						error(data);
					});
				},
				removeComment : function(commentId,success,error) {
					$.ajax({
						url : options.basePath+"/blog/"+options.blogId+"/post/"+options.postId+"/comment/"+commentId,
						method : "DELETE",
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						cache : false,
						async : true
						
					}).success(function(data) {
						var comment = data;
						comment.replies = [],
						success(comment);
					}).error(function(data) {
						error(data);
					});
				},
				toggleUpvote : function(commentId,success,error) {
					$.ajax({
						url : options.basePath+"/blog/"+options.blogId+"/post/"+options.postId+"/comment/"+commentId+"/upvote",
						method : "PUT",
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						cache : false,
						async : true
						
					}).success(function(data) {
						success(data);
					}).error(function(data) {
						error(data);
					});
				}
			};
			
			var processUpvoteContent = function(commentId, upvotes) {
				var data = [];
				var userList = $("<ul/>").addClass("unstyled").attr("id","upvote-popover-"+commentId);
				upvotes.forEach(function(upvote) {
					if(options.loggedInUser === upvote.author.username) {
						data.push(true);
					}
					userList.append(
						$("<li>").append(
							$("<a/>").attr("href",options.basePath+"/SocietyMember/publicProfile?min="+upvote.author.username).
							attr("target", "_blank").html(upvote.author.username)
						).attr("id","upvote-popover-"+commentId+"-min-"+upvote.author.username)	
					);
				});
				
				if(data.length === 0) {
					data.push(false);
				}
				
				data.push(userList.prop("outerHTML"));
				
				return data;
			};
			
			var commentToTree = function(comment) {
				
				var data = processUpvoteContent(comment._id, comment.up_votes);
				var sanitizer = $("<span/>").text(comment.comment);
				
				var tree = '<li id="comment-'+ comment._id +
				'" class="media">' +
				'<a class="media-left" href="'+ options.basePath + '/SocietyMember/publicProfile?min='+
				comment.author.username+
				'" target="_blank">' +
				'<img class="thumbnail media-object" src="';
				
				if(typeof comment.author.profileImagePath !== "undefined" && comment.author.profileImagePath.trim() !== "") {
					tree = tree + options.cdnURL + comment.author.profileImagePath;
				} else {
					tree = tree + options.noAvatarPic.trim();
				}
				
				tree = tree + '">' +
				'</a>' +
				'<div class="media-body">' +
				'<h4 class="media-heading">' +
				comment.author.username + ' <i class="glyphicon glyphicon-time"></i> <small>' + moment(comment.created_at).fromNow() + '</small>' +
				'</h4>' +
				'<p id="comment-text-'+ comment._id + '">' +
				String(sanitizer.prop("innerHTML")) +
				'</p>' +
				'<div id="comment-edit-form-holder-'+ comment._id +'"></div>' +
				'<div id="comment-control-'+ comment._id +'">' +
				'<a href="#" class="upvote-count" id="comment-upvote-count-'+ comment._id +'"' +
				' data-content=\''+ data[1] +'\'>';
				
				if(comment.up_votes.length > 0) {
					
					tree = tree + String(comment.up_votes.length) + " ";
				}
				
				tree = tree + '</a>';
				
				tree = tree + '<a class="comment-control left upvote" href="#" data-id="'+ comment._id + '">';
				
				if(data[0] === true) {
					tree = tree + '<i class="glyphicon glyphicon-thumbs-up voted"></i></a>';
				} else {
					tree = tree + '<i class="glyphicon glyphicon-thumbs-up"></i></a>';
				}
				
				
				if(options.loggedInUser === comment.author.username || options.isBlogOwner === "true") {
					tree = tree + '<a class="comment-control left edit" href="#" data-id="'+
					comment._id +
					'">' +
					'<i class="glyphicon glyphicon-edit"></i>' +
					'</a>' +
					'<a class="comment-control left delete" href="#" data-id="'+
					comment._id +
					'">' +
					'<i class="glyphicon glyphicon-trash"></i>' +
					'</a>';
				}
				 
				tree = tree + '<a class="comment-control reply" href="#" data-id="'+
				comment._id +
				'">' +
				'Reply' +
				'</a>' +
				'</div>';
				
				tree = tree + '<div id="comment-reply-form-holder-'+ comment._id +'"></div>';
				
				/*
					Nested media object
				*/
				tree = tree + '<ul class="media-list">';
				
				if(comment.replies.length > 0 ) {
					
					
					comment.replies.forEach(function(comment) {
						
						tree = tree + commentToTree(comment);
					});
					
				}
				tree = tree + '</ul>';
				
				return tree + '</li>';
			};
			
			var commentFormElement = function() {
				return $("<form/>").addClass("comment-form well").append(
					$("<legend/>").html("Post Comment")		
				).append(
					$("<div/>").addClass("form-group").append(
						$("<textarea/>").addClass("comment-text form-control input-lg").attr("placeholder", options.placeholder)		
					)		
				).append(
					$("<div/>").addClass("form-actions").append(
						$("<button/>").addClass("btn btn-primary").attr("type","submit").html("Submit")		
					).
					append("&nbsp;").
					append(
						$("<button/>").addClass("btn btn-primary").attr("type","reset").html("Cancel")		
					)			
				);
			};
			
			var replyFormElement = function(parentId) {
				return $("<form/>").addClass("reply-form well").attr("data-parent",parentId).append(
						$("<legend/>").html("Post Reply")		
					).append(
						$("<div/>").addClass("form-group").append(
							$("<textarea/>").addClass("comment-text form-control input-lg").attr("placeholder", options.placeholder)	
						)		
					).append(
						$("<div/>").addClass("form-actions").append(
							$("<button/>").addClass("btn btn-primary").attr("type","submit").html("Submit")
						).
						append("&nbsp;").
						append(
							$("<button/>").addClass("cancel-reply btn btn-primary").attr("type","button").attr("data-id", parentId).html("Cancel")		
						)		
					);
				};
			
				var editFormElement = function(commentId, oldText) {
					return $("<form/>").addClass("edit-form well").attr("data-parent",commentId).append(
							$("<legend/>").html("Edit Comment")		
						).append(
							$("<div/>").addClass("form-group").append(
								$("<textarea/>").addClass("comment-text form-control input-lg").attr("placeholder", options.placeholder).val(oldText)		
							)		
						).append(
							$("<div/>").addClass("form-actions").append(
								$("<button/>").addClass("btn btn-primary").attr("type","submit").html("Submit")
							).
							append("&nbsp;").
							append(
								$("<button/>").addClass("cancel-edit btn btn-primary").attr("type","button").attr("data-id", commentId).html("Cancel")		
							)		
						);
					};
					
					var attachReplyForm = function(parentId) {

						$("#comment-control-"+parentId).hide("slow");
						
						$("#comment-reply-form-holder-"+parentId).append(replyFormElement(parentId));
					};
					
					
					var detachReplyForm = function(parentId) {

						$("#comment-control-"+parentId).show("slow");
						
						$("#comment-reply-form-holder-"+parentId).empty();
					};
					
					var attachEditForm = function(commentId, oldText) {

						$("#comment-text-"+commentId).hide("slow");
						
						$("#comment-control-"+commentId).hide("slow");
						
						$("#comment-edit-form-holder-"+commentId).append(editFormElement(commentId, oldText));
					};
					
					
					var detachEditForm = function(commentId) {
						
						$("#comment-text-"+commentId).show("slow");
						
						$("#comment-control-"+commentId).show("slow");
						
						$("#comment-edit-form-holder-"+commentId).empty();
					};		
			
			var intitialize = function(comments) {
				
				var commentForm = commentFormElement();
				
				var discussionTree = '<ul class="comment-root media-list">';
				
				comments.forEach(function(comment) {
					discussionTree = discussionTree + commentToTree(comment);
				});
				
				discussionTree = discussionTree + '</ul>';
				
				element.append(commentForm);
				
				element.append(discussionTree);
				
				element.on("click","a.upvote-count", function(e) {
	                e.preventDefault() ;
	            }).on("mouseenter","a.upvote-count",function(e) {
	            	$(this).popover({
						placement : "top",
						trigger : "manual",
						selector : 'a.upvote-count',
						html : true,
						animation : true,
						template: '<div class="popover" onmouseover="clearTimeout(timeoutObj);$(this).mouseleave(function() {$(this).hide();});"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
	            	});
	            	
	                $(this).popover('show');
	            }).on("mouseleave","a.upvote-count", function(e) {
	                var ref = $(this);
	                timeoutObj = setTimeout(function(){
	                    ref.popover('hide');
	                }, 50);
	            });
				
				
				element.on("submit", "form.comment-form", function(e) {
					e.preventDefault();
					
					var text = $(this).find("textarea").filter(':visible:first').val();
					
					 $(this).find("textarea").filter(':visible:first').val("");
					
					if(typeof text !== "undefined" && text.trim() !== "") {
						Discussion.postComment(text,function(comment) {
							$(".comment-root").prepend(commentToTree(comment));
						});
					}
				});
				
				
				element.on("submit", "form.reply-form", function(e) {
					e.preventDefault();
					
					var comment = $(this).find("textarea").filter(':visible:first').val();
					
					 $(this).find("textarea").filter(':visible:first').val("");
					
					 var parentId = $(this).attr("data-parent");
					
					if(typeof comment !== "undefined" && comment.trim() !== "") {
						Discussion.postReply(parentId, comment, function(comment) {
							
							//detach reply form
							detachReplyForm(parentId);
							//add reply in the list
							$("#comment-"+parentId).find("ul.media-list").filter(":visible:first").prepend(commentToTree(comment));
						});
					}
				});
				
				
				element.on("submit", "form.edit-form", function(e) {
					e.preventDefault();
					
					var comment = $(this).find("textarea").filter(':visible:first').val();
					
					 $(this).find("textarea").filter(':visible:first').val("");
					
					 var commentId = $(this).attr("data-parent");
					
					if(typeof comment !== "undefined" && comment.trim() !== "") {
						Discussion.updateComment(commentId, comment, function(comment) {
							
							//detach reply form
							detachEditForm(commentId);
							//add reply in the list
							$("#comment-text-"+commentId).filter(":visible:first").empty().html(comment.comment);
						});
					}
				});
				
				
				element.on("click", "a.edit", function(e) {
					e.preventDefault();
					
					var commentId = $(this).attr("data-id");
					var oldText = element.find("p#comment-text-"+commentId).filter(':visible:first').html();
					//attch edit form
					attachEditForm(commentId, oldText);
					
					
				});
				
				element.on("click", "a.delete", function(e) {
					e.preventDefault();
					
					var commentId = $(this).attr("data-id");
					if(confirm("Do you want to delete this comment?")) {
						Discussion.removeComment(commentId, function(data) {
							element.find("li#comment-"+commentId).filter(':visible:first').empty().remove();
							
							alert("Comment deleted successfully.");
						}, function(data) {
							alert("Failed to delete comment. Please retry.");
						});
					}
				});
				
				
				element.on("click", "a.reply", function(e) {
					e.preventDefault();
					
					var commentId = $(this).attr("data-id");
					//attch reply form
					attachReplyForm(commentId);
					
					
				});
				
				element.on("click", "button.cancel-reply", function(e) {
					e.preventDefault();
					
					var commentId = $(this).attr("data-id");
					//attch reply form
					detachReplyForm(commentId);
					
					
				});
				
				element.on("click", "button.cancel-edit", function(e) {
					e.preventDefault();
					
					var commentId = $(this).attr("data-id");
					//attch reply form
					detachEditForm(commentId);
					
					
				});
				
				element.on("click", "a.upvote", function(e) {
					e.preventDefault();
					
					var commentId = $(this).attr("data-id");
					var icon = $(this).find("i.glyphicon-thumbs-up").filter(':visible:first');
					
					Discussion.toggleUpvote(commentId, function(data) {
						
						
						var count = $("#comment-upvote-count-"+commentId).text();
						
						var popoverContent = $($("#comment-upvote-count-"+commentId).attr("data-content"));
						
						
						if(typeof count !== "undefined") {
							count = count.trim();
						} else {
							count = 0;
						}
						
						if(icon.hasClass("voted")) {
							//remove class and decrement count
							icon.removeClass("voted");
							
							popoverContent.find("li#upvote-popover-"+commentId+"-min-"+options.min).empty().remove();
							
							if("" !== count && count > 1) {
								$("#comment-upvote-count-"+commentId).text(--count);
							} else {
								$("#comment-upvote-count-"+commentId).text("");
							}
							
						} else {
							//add class and increment count
							icon.addClass("voted");
							
							popoverContent.append(
								$("<li/>").attr("id", "upvote-popover-"+commentId+"-min-"+data.mkclIdentificationNumber).append(
										$("<a/>").attr("href",options.basePath+"/SocietyMember/publicProfile?min="
												+data.mkclIdentificationNumber).
										attr("target", "_blank").html(data.legalFullName)	
								)		
							);
							if("" !== count) {
								$("#comment-upvote-count-"+commentId).text(++count);
							} else {
								$("#comment-upvote-count-"+commentId).text(1);
							}
						}
						
						$("#comment-upvote-count-"+commentId).attr("data-content",popoverContent.prop("outerHTML"));

					});
					
				});

			};
			
			
		Discussion.loadComments(function(comments) {
			intitialize(comments);
		});
		
        return this;
    };
    
    $.fn.discussion.defaults = {
        	basePath : '',
    		blogId : '',
    		postSlug : '',
    		postId : '',
    		isBlogOwner: '',
    		loggedInUser : '',
    		placeholder : "Write you comment",
    		noAvatarPic : "images/user.jpg",
    		order : "ASCENDING"
        };
 
}( jQuery ));