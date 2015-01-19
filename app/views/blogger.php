<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap-cerulean.css")); ?>
	<?php echo(HTML::style("packages/bootstrap/css/font-awesome.min.css")); ?>
	<?php echo(HTML::style("packages/nav-tree/abn_tree.css")); ?>
	<?php echo(HTML::style("packages/codemirror-4.8/lib/codemirror.css")); ?>
	<?php echo(HTML::style("packages/codemirror-4.8/theme/cobalt.css")); ?>
	<?php echo(HTML::style("packages/highlight.js/default.min.css")); ?>
	<?php echo(HTML::style("packages/ui-select/select.min.css")); ?>
	<?php echo(HTML::style("packages/angular-loading-bar/loading-bar.css")); ?>
	<?php echo(HTML::style("packages/Gallery-2.15.2/css/blueimp-gallery.css")); ?>
	<?php echo(HTML::style("packages/app/css/style.css")); ?>
	<?php echo(HTML::style("packages/pagedown/pagedown.css")); ?>
	<!-- Globals -->
	<script type="text/javascript">

		var BASE_URL = "<?php echo URL::to("/"); ?>";
		var BLOG = <?php  echo $blog; ?>;

	</script>
	<?php echo(HTML::script("packages/jquery/jquery.min.js")); ?>
	<?php echo(HTML::script("packages/bootstrap/js/bootstrap.min.js")); ?>
	<?php echo( HTML::script("packages/angular.js/angular.min.js"));?>
	<?php echo(HTML::script("packages/angular.js/angular-animate.js")) ?>
	<?php echo(HTML::script("packages/angular.js/angular-touch.js")) ?>
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
	<?php echo( HTML::script("packages/codemirror-4.8/mode/xml/xml.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/mode/gfm/gfm.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/mode/markdown/markdown.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/keymap/sublime.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/comment/comment.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/comment/continuecomment.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/edit/closebrackets.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/edit/closetag.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/edit/matchbrackets.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/edit/matchtags.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/edit/trailingspace.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/brace-fold.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/comment-fold.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/foldcode.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/foldgutter.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/indent-fold.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/markdown-fold.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/fold/xml-fold.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/anyword-hint.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/css-hint.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/javascript-hint.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/python-hint.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/show-hint.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/sql-hint.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/hint/xml-hint.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/search/match-highlighter.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/search/search.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/search/searchcursor.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/selection/active-line.js"));?>

	<?php echo( HTML::script("packages/codemirror-4.8/addon/display/fullscreen.js"));?>
	<?php echo( HTML::script("packages/codemirror-4.8/addon/display/placeholder.js"));?>

	<?php echo( HTML::script("packages/ui-codemirror-0.2.1/ui-codemirror.js"));?>
	<?php echo( HTML::script("packages/highlight.js/highlight.min.js"));?>
	<?php echo( HTML::script("packages/marked.js/marked.min.js"));?>
	<?php echo( HTML::script("packages/ui-select/select.min.js"));?>
	<?php echo( HTML::script("packages/angular-local-storage/angular-local-storage.js"));?>
	<?php echo( HTML::script("packages/angular-base64/angular-base64.js"));?>
	<?php echo( HTML::script("packages/angular-basicauth/angular-basicauth.js"));?>
	<?php echo( HTML::script("packages/angular-loading-bar/loading-bar.js"));?>

	<!-- shim is needed to support non-HTML5 FormData browsers (IE8-9)-->
	<?php echo( HTML::script("packages/angular-file-upload/angular-file-upload-shim.min.js"));?>
	<?php echo( HTML::script("packages/angular-file-upload/angular-file-upload.min.js"));?>
	<!-- Image Gallery -->
	<?php echo( HTML::script("packages/Gallery-2.15.2/js/blueimp-gallery.js"));?>

	<!-- pagedown js -->
	<?php echo( HTML::script("packages/pagedown/Markdown.Converter.js"));?>
	<?php echo( HTML::script("packages/pagedown/Markdown.Sanitizer.js"));?>
	<?php echo( HTML::script("packages/pagedown/Markdown.Editor.js"));?>

	<!-- Application scripts -->
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
				<ui-view name="content@base">

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