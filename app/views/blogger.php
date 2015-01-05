<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap-cerulean.css")); ?>
	<?php echo(HTML::style("packages/nav-tree/abn_tree.css")); ?>
	<?php echo(HTML::style("packages/app/css/animation.css")); ?>
	<?php echo(HTML::style("packages/codemirror-4.8/lib/codemirror.css")); ?>
	<?php echo(HTML::style("packages/codemirror-4.8/theme/cobalt.css")); ?>
	<?php echo(HTML::style("packages/highlight.js/default.min.css")); ?>
	<?php echo(HTML::style("packages/ui-select/select.min.css")); ?>
	<style type="text/css">
		body{
			padding-top: 80px;
		}

		input.ng-invalid.ng-touched {
	    	border-color: #FA787E;
	  	}

	  	input.ng-valid.ng-touched {
	    	border-color: #78FA89;
	  	}


	  	textarea.ng-invalid.ng-touched {
	    	border-color: #FA787E;
	  	}

	  	textarea.ng-valid.ng-touched {
	  		border-color: #78FA89;
	  	}

	  	.comment-control {
   	 		display: inline-block;
    		width: auto;
    		padding: 2px;
		}
		
		.left {
		    border-right: 1px solid #ccc;
		}

		.CodeMirror {
  			border: 1px solid #eee;
  			height: auto;
  			font-size: 16px;
		}

		.select2 > .select2-choice.ui-select-match {
		    /* Because of the inclusion of Bootstrap */
		    height: 36px;
    	}
	</style>
	<!-- Globals -->
	<script type="text/javascript">

		var BASE_URL = "<?php echo URL::to("/"); ?>";
		var BLOG = <?php  echo $blog; ?>;

	</script>
	<?php echo(HTML::script("packages/jquery/jquery.min.js")); ?>
	<?php echo( HTML::script("packages/angular.js/angular.min.js"));?>
	<?php echo( HTML::script("packages/angular.js/angular-sanitize.min.js"));?>
	<?php echo( HTML::script("packages/ui-router/angular-ui-router.min.js"));?>
	<?php echo( HTML::script("packages/ui-bootstrap/ui-bootstrap-tpls-0.12.0.min.js"));?>
	<?php echo(HTML::script("packages/nav-tree/abn_tree_directive.js")); ?>
	<?php echo(HTML::script("packages/angular-moment.js/moment-with-locales.js")); ?>
	<?php echo(HTML::script("packages/angular-moment.js/moment-timezone-with-data.js")); ?>
	<?php echo(HTML::script("packages/angular-moment.js/tzdetect.js")); ?>
	<?php echo(HTML::script("packages/angular-moment.js/angular-moment.min.js")); ?>
	<script type="text/javascript">
			var tzid = tzdetect.matches()[0]
	</script>
	<?php echo( HTML::script("packages/holder.js/holder.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/lib/codemirror.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/mode/overlay.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/mode/gfm/gfm.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/mode/markdown/markdown.js"));?>
	<?php echo( HTML::script("packages/ui-codemirror-0.2.1/ui-codemirror.js"));?>
	<?php echo( HTML::script("packages/highlight.js/highlight.min.js"));?>
	<?php echo( HTML::script("packages/marked.js/marked.min.js"));?>
	<?php echo( HTML::script("packages/ui-select/select.min.js"));?>
	<?php echo( HTML::script("packages/angular-local-storage/angular-local-storage.js"));?>
	<?php echo( HTML::script("packages/angular-base64/angular-base64.js"));?>
	<?php echo( HTML::script("packages/angular-basicauth/angular-basicauth.js"));?>
	<?php echo( HTML::script("packages/app/app.js"));?>
	<?php echo( HTML::script("packages/app/controller/controller.js"));?>
	<?php echo( HTML::script("packages/app/service/service.js"));?>
	<?php echo( HTML::script("packages/app/filter/filter.js"));?>
	<?php echo( HTML::script("packages/app/directive/directive.js"));?>
	<title>Blogger</title>
</head>
<body ng-app="bloggerApp">
	<ui-view name="navbar">

	</ui-view>
	<div class="container">
		<div class="row">
			<div class="col-md-9">
				<ui-view class="slide" name="content@base">

				</ui-view>	
			</div>
			<div class="col-md-3">
				<ui-view name="sidebar">

				</ui-view>
			</div>
		</div>		
	</div>
</body>
</html>