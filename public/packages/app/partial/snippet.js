<script type="text/javascript">
		$(document).ready(function() {
			
			var options = {
					basePath : '${pageContext.request.contextPath}',
					discussionId : '${mediaItem.id}',
					cdnURL : '${cdnURL}'
			};
			
			var Discussion = {
					loadComments : function(success, error) {
						$.getJSON(options.basePath+"/Discussion/"+options.discussionId+"/Comment", function(data) {
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
					postComment : function(text) {
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
							console.log(data);
						}).error(function(data) {
							console.log(data);
						});
				},
				postReply : function(parentId,text) {
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
						console.log(data);
					}).error(function(data) {
						console.log(data);
					});
				},
				updateComment : function(commentId, text) {
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
						console.log(data);
					}).error(function(data) {
						console.log(data);
					});
				},
				removeComment : function(commentId) {
					$.ajax({
						url : options.basePath+"/Discussion/"+options.discussionId+"/Comment/"+commentId,
						method : "DELETE",
						contentType : "application/x-www-form-urlencoded; charset=UTF-8",
						cache : false,
						async : true
						
					}).success(function(data) {
						console.log(data);
					}).error(function(data) {
						console.log(data);
					});
				}
			};
			
			
			
			var commentFormElement = function() {
				return $("<form/>").attr("id","comment-form").append(
						$("<div/>").addClass("control-group").append(
							$("<div/>").addClass("controls").append( 
								$("<textarea>").addClass("span12 textarea-noscroll").attr("placeholder","Post Comments")	
							)	
						) 
					).append(
						$("<div/>").addClass("form-actions").append(
							$("<button/>").addClass("btn btn-primary").attr("type", "submit").html("Submit")	
						)		
					);
			};
			
			var commentToTree = function(comment) {
				var tree = '<li class="media">' +
				'<a class="pull-left" href="#">' +
				'<img class="media-object" src="'+
				options.cdnURL + comment.societyMember.profileImagePath +
				'">' +
				'</a>' +
				'<div class="media-body">' +
				'<h4 class="media-heading">' +
				comment.societyMember.legalFullName +
				'</h4>' +
				comment.text +
				'<div>' +
				'<a class="comment-control left" href="">' +
				'<i class="icon-edit"></i>' +
				'</a>' +
				'<a class="comment-control left" href="">' +
				'<i class="icon-trash"></i>' +
				'</a>' +
				'<a class="comment-control" href="">' +
				'Reply' +
				'</a>' +
				'</div>';
				
				if(comment.replies.length > 0 ) {
					/*
						Nested media object
					*/
					tree = tree + '<ul class="media-list">';
					
					comment.replies.forEach(function(comment) {
						
						tree = tree + commentToTree(comment)
					});
					
					tree = tree + '</ul>';
				}
				
				return tree + '</li>';
			};
			
			var intitialize = function(comments) {
				var element = $("#discussion");
				element.append(commentFormElement());
				
				var discussionTree = '<ul class="media-list">';
				
				comments.forEach(function(comment) {
					discussionTree = discussionTree + commentToTree(comment);
				});
				
				discussionTree = discussionTree + '</ul>';
				
				element.append(discussionTree);	
			};
			
			Discussion.loadComments(intitialize);
			
			

			
			
			$("#comment-form").on("submit", function(e) {
				var text = $(this).find("textarea").val();
				$(this).find("textarea").val("");
				e.preventDefault();
				
				if( typeof text !== "undefined" && text.trim() !== "" ) {
					Discussion.postComment({
						text: text
					});
				}
			});
			
			
		});
	</script>