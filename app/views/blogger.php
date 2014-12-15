<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap.min.css")); ?>
	<?php echo(HTML::style("packages/nav-tree/abn_tree.css")); ?>
	<?php echo(HTML::style("packages/app/css/animation.css")); ?>
	<?php echo(HTML::style("packages/codemirror-4.8/lib/codemirror.css")); ?>
	<?php echo(HTML::style("packages/codemirror-4.8/theme/cobalt.css")); ?>
	<?php echo(HTML::style("packages/highlight.js/default.min.css")); ?>
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
	</style>
	<!-- Globals -->
	<script type="text/javascript">

		var BASE_URL = "<?php echo URL::to("/"); ?>";

		var blog = <?php echo $blog; ?>;
	</script>
	<title>Blogger</title>
</head>
<body ng-app="bloggerApp">
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation" ng-controller="NavController">
 		<div class="container-fluid">
 			<!-- Brand and toggle get grouped for better mobile display -->
		    <div class="navbar-header">
		      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
		        <span class="sr-only">Toggle navigation</span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		      </button>
		      <a class="navbar-brand" ui-sref="home">{{blog.name}}</a>
		    </div>

		    <!-- Collect the nav links, forms, and other content for toggling -->
		    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		      <ul class="nav navbar-nav">
		        <li class="active"><a href="#">About <span class="sr-only">(current)</span></a></li>
		      </ul>
		      <form novalidate name="searchForm" ng-submit="searchForm.$valid && search()" class="navbar-form navbar-right" role="search">
					<div class="form-group">
						<input required ng-model="searchText" type="text" class="form-control" placeholder="Search">
					</div>
					<button type="submit" class="btn btn-default navbar-btn">
						<i class="glyphicon glyphicon-search"></i>
					</button>
			  </form>

    </div><!-- /.navbar-collapse -->
 		</div>
	</nav>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-9 view-container">
				<div ui-view class="view-frame">
				</div>	
			</div>
			<div class="col-md-3" ng-controller="LeftNavController">
				<div class="panel panel-default">
		  			<div class="panel-heading">
		   				<h3 class="panel-title">Most Popular</h3>
		  			</div>
		  			<div class="panel-body">
		  				<ul class="list-unstyled">
		  					<li ng-repeat="post in mostPopularPosts">
		  						<a ui-sref="post({slug: post.slug})">{{post.title}}</a>
		  					</li>
		  				</ul>
		  			</div>
				</div>
				<div class="panel panel-default">
		  			<div class="panel-heading">
		   				<h3 class="panel-title">Blog Archive</h3>
		  			</div>
		  			<div class="panel-body">
		  				<abn-tree  on-select="archiveSelected(branch)" icon-leaf= "glyphicon glyphicon-file" icon-expand= "glyphicon glyphicon-chevron-right" icon-collapse="glyphicon glyphicon-chevron-down" tree-data="archiveTree" expand-level= "1" >
						</abn-tree>
		  			</div>
				</div>
				<div class="panel panel-default">
		  			<div class="panel-heading">
		   				<h3 class="panel-title">Tags</h3>
		  			</div>
		  			<div class="panel-body">
		  				<span ng-repeat="tagCount in tagCounts">
		  					<a ui-sref="tagSearch({tag: tagCount._id})" class="btn btn-default">
			  					{{tagCount._id}}
			  					<span class="badge">
			  						{{tagCount.count}}
			  					</span>
		  					</a>
		  				</span>
		  			</div>
				</div>
			</div>
		</div>		
	</div>
<?php echo(HTML::script("packages/jquery/jquery.min.js")); ?>
<?php echo( HTML::script("packages/angular.js/angular.min.js"));?>
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
<?php echo( HTML::script("packages/app/app.js"));?>
<?php echo( HTML::script("packages/app/controller/controller.js"));?>
<?php echo( HTML::script("packages/app/service/service.js"));?>
<?php echo( HTML::script("packages/app/filter/filter.js"));?>
<?php echo( HTML::script("packages/app/directive/directive.js"));?>
</body>
</html>