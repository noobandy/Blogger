(function ( $ ) {
 
    $.fn.discussion = function(opts) {
    	var options = $.extend( {}, $.fn.discussion.defaults, opts );
    	var element = this;
    	var Discussion = {
					loadComments : function(success, error) {
						$.getJSON(options.basePath+"/blog/"+options.blogId+"/Comment?order="+options.order, function(data) {
							var idToNodeMap = {};
							var comments = [];
							for(var i = 0; i < data.length; i++) {
							    var datum = data[i];
							    datum.replies = [];
							    idToNodeMap[datum.id] = datum;
							    
							    if(datum.parentId === null) {
							        comments.push(datum);        
							    } else {
							        var parentNode = idToNodeMap[datum.parentId];
							        parentNode.replies.push(datum);
							    }
							}
							
							success(comments);
						});
					},
					postComment : function(text,success,error) {
						$.ajax({
							url : options.basePath+"/Discussion/"+options.discussionId+"/Comment",
							method : "POST",
							data : {
								text : text
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
				postReply : function(parentId,text,success,error) {
					$.ajax({
						url : options.basePath+"/Discussion/"+options.discussionId+"/Comment",
						method : "POST",
						data : {
							parentId : parentId,
							text : text
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
				updateComment : function(commentId, text,success,error) {
					$.ajax({
						url : options.basePath+"/Discussion/"+options.discussionId+"/Comment/"+commentId,
						method : "PUT",
						data : {
							text : text
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
						url : options.basePath+"/Discussion/"+options.discussionId+"/Comment/"+commentId,
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
						url : options.basePath+"/Discussion/"+options.discussionId+"/Comment/"+commentId+"/upVotes",
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
					if(options.min === upvote.mkclIdentificationNumber) {
						data.push(true);
					}
					userList.append(
						$("<li>").append(
							$("<a/>").attr("href",options.basePath+"/SocietyMember/publicProfile?min="+upvote.mkclIdentificationNumber).
							attr("target", "_blank").html(upvote.legalFullName)
						).attr("id","upvote-popover-"+commentId+"-min-"+upvote.mkclIdentificationNumber)	
					);
				});
				
				if(data.length === 0) {
					data.push(false);
				}
				
				data.push(userList.prop("outerHTML"));
				
				return data;
			};
			
			var commentToTree = function(comment) {
				
				var data = processUpvoteContent(comment.id, comment.upVotes);
				var sanitizer = $("<span/>").text(comment.text);
				
				var tree = '<li id="comment-'+ comment.id +
				'" class="media">' +
				'<a class="pull-left" href="'+ options.basePath + '/SocietyMember/publicProfile?min='+
				comment.societyMember.mkclIdentificationNumber+
				'" target="_blank">' +
				'<img class="thumbnail media-object" src="';
				
				if(typeof comment.societyMember.profileImagePath !== "undefined" && comment.societyMember.profileImagePath.trim() !== "") {
					tree = tree + options.cdnURL + comment.societyMember.profileImagePath;
				} else {
					tree = tree + options.noAvatarPic.trim();
				}
				
				tree = tree + '">' +
				'</a>' +
				'<div class="media-body">' +
				'<h4 class="media-heading">' +
				comment.societyMember.legalFullName + ' <i class="icon-time"></i> <small>' + moment(comment.createOn).fromNow() + '</small>' +
				'</h4>' +
				'<p id="comment-text-'+ comment.id + '">' +
				String(sanitizer.prop("innerHTML")) +
				'</p>' +
				'<div id="comment-edit-form-holder-'+ comment.id +'"></div>' +
				'<div id="comment-control-'+ comment.id +'">' +
				'<a href="#" class="upvote-count" id="comment-upvote-count-'+ comment.id +'"' +
				' data-content=\''+ data[1] +'\'>';
				
				if(comment.upVotes.length > 0) {
					
					tree = tree + String(comment.upVotes.length) + " ";
				}
				
				tree = tree + '</a>';
				
				tree = tree + '<a class="comment-control left upvote" href="#" data-id="'+ comment.id + '">';
				
				if(data[0] === true) {
					tree = tree + '<i class="icon-thumbs-up voted"></i></a>';
				} else {
					tree = tree + '<i class="icon-thumbs-up"></i></a>';
				}
				
				
				if(options.min === comment.societyMember.mkclIdentificationNumber || options.isSocietyAdmin === "true") {
					tree = tree + '<a class="comment-control left edit" href="#" data-id="'+
					comment.id +
					'">' +
					'<i class="icon-edit"></i>' +
					'</a>' +
					'<a class="comment-control left delete" href="#" data-id="'+
					comment.id +
					'">' +
					'<i class="icon-trash"></i>' +
					'</a>';
				}
				 
				tree = tree + '<a class="comment-control reply" href="#" data-id="'+
				comment.id +
				'">' +
				'Reply' +
				'</a>' +
				'</div>';
				
				tree = tree + '<div id="comment-reply-form-holder-'+ comment.id +'"></div>';
				
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
				return $("<form/>").addClass("comment-form").append(
					$("<legend/>").append($("<h6/>").html("Post Comment"))		
				).append(
					$("<div/>").addClass("control-group").append(
						$("<div/>").addClass("control").append(
							$("<textarea/>").addClass("comment-text span12").attr("placeholder", options.placeholder)		
						)		
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
				return $("<form/>").addClass("reply-form").attr("data-parent",parentId).append(
						$("<legend/>").append($("<h6/>").html("Post Reply"))		
					).append(
						$("<div/>").addClass("control-group").append(
							$("<div/>").addClass("control").append(
								$("<textarea/>").addClass("comment-text span12").attr("placeholder", options.placeholder)		
							)		
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
					return $("<form/>").addClass("edit-form").attr("data-parent",commentId).append(
							$("<legend/>").append($("<h6/>").html("Edit Comment"))		
						).append(
							$("<div/>").addClass("control-group").append(
								$("<div/>").addClass("control").append(
									$("<textarea/>").addClass("comment-text span12").attr("placeholder", options.placeholder).val(oldText)		
								)		
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
					
					var text = $(this).find("textarea").filter(':visible:first').val();
					
					 $(this).find("textarea").filter(':visible:first').val("");
					
					 var parentId = $(this).attr("data-parent");
					
					if(typeof text !== "undefined" && text.trim() !== "") {
						Discussion.postReply(parentId, text, function(comment) {
							
							//detach reply form
							detachReplyForm(parentId);
							//add reply in the list
							$("#comment-"+parentId).find("ul.media-list").filter(":visible:first").prepend(commentToTree(comment));
						});
					}
				});
				
				
				element.on("submit", "form.edit-form", function(e) {
					e.preventDefault();
					
					var text = $(this).find("textarea").filter(':visible:first').val();
					
					 $(this).find("textarea").filter(':visible:first').val("");
					
					 var commentId = $(this).attr("data-parent");
					
					if(typeof text !== "undefined" && text.trim() !== "") {
						Discussion.updateComment(commentId, text, function(comment) {
							
							//detach reply form
							detachEditForm(commentId);
							//add reply in the list
							$("#comment-text-"+commentId).filter(":visible:first").empty().html(comment.text);
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
					var icon = $(this).find("i.icon-thumbs-up").filter(':visible:first');
					
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
    		postId : '',
    		isBlogOwner: '',
    		loggedInUser : '',
    		placeholder : "Write you comment",
    		noAvatarPic : "images/user.jpg",
    		order : "ASCENDING"
        };
 
}( jQuery ));