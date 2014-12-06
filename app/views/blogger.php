<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap.min.css")); ?>
	<?php echo(HTML::style("packages/nav-tree/abn_tree.css")); ?>
	<style type="text/css">
		body{
			padding-top: 60px;
		}
	</style>
	<script type="text/javascript">
		var BASE_URL = "<?php echo URL::to("/"); ?>";

		var blog = <?php echo $blog; ?>;
		var user = <?php echo $user; ?>;
	</script>
	<title>Blogger</title>
</head>
<body ng-app="bloggerApp">
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation" ng-controller="NavController">
 		<div class="container">
 			<!-- Brand and toggle get grouped for better mobile display -->
		    <div class="navbar-header">
		      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
		        <span class="sr-only">Toggle navigation</span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		      </button>
		      <a class="navbar-brand" ui-sref="home">{{brand}}</a>
		    </div>

		    <!-- Collect the nav links, forms, and other content for toggling -->
		    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
		      <ul class="nav navbar-nav">
		        <li class="active"><a href="#">About <span class="sr-only">(current)</span></a></li>
		      </ul>
		      <form class="navbar-form navbar-right" role="search">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="Search">
					</div>
			  </form>

    </div><!-- /.navbar-collapse -->
 		</div>
	</nav>
	<div class="container">
		<div class="row">
			<div class="col-md-9">
				<ui-view>
			</div>
			<div class="col-md-3" ng-controller="LeftNavController">
				<div class="panel panel-default">
		  			<div class="panel-heading">
		   				<h3 class="panel-title">Most Popular</h3>
		  			</div>
		  			<div class="panel-body">
		  				<ul class="list-unstyled">
		  					<li ng-repeat="post in mostPopularPosts">
		  						<a ui-sref="post({blogId: blog._id, postId: post._id})">{{post.title}}</a>
		  					</li>
		  				</ul>
		  			</div>
				</div>
				<div class="panel panel-default">
		  			<div class="panel-heading">
		   				<h3 class="panel-title">Blog Archive</h3>
		  			</div>
		  			<div class="panel-body">
		  				<abn-tree icon-leaf= "glyphicon glyphicon-file" icon-expand= "glyphicon glyphicon-chevron-right" icon-collapse="glyphicon glyphicon-chevron-down" tree-data="archiveTree" expand-level= "1" >
						</abn-tree>
		  			</div>
				</div>
				<div class="panel panel-default">
		  			<div class="panel-heading">
		   				<h3 class="panel-title">Tags</h3>
		  			</div>
		  			<div class="panel-body">
		  				<a ng-repeat="tagCount in tagCounts" ui-sref="tagSearch({blogId: blog._id, tag: tagCount.tag})" class="btn btn-default">
		  					{{tagCount.tag}}
		  					<span class="badge">
		  						{{tagCount.count}}
		  					</span>
		  				</a>
		  			</div>
				</div>
			</div>
		</div>		
	</div>
<?php echo(HTML::script("packages/jquery/jquery.min.js")); ?>
<?php echo(HTML::script("packages/bootstrap/js/bootstrap.min.js")); ?>
<?php echo( HTML::script("packages/angular.js/angular.min.js"));?>
<?php echo( HTML::script("packages/ui-router/angular-ui-router.min.js"));?>
<?php echo( HTML::script("packages/ui-bootstrap/ui-bootstrap-tpls-0.12.0.min.js"));?>
<?php echo(HTML::script("packages/nav-tree/abn_tree_directive.js")); ?>
<?php echo( HTML::script("packages/app/app.js"));?>
<?php echo( HTML::script("packages/app/controller/controller.js"));?>
<?php echo( HTML::script("packages/app/service/service.js"));?>
<?php echo( HTML::script("packages/app/filter/filter.js"));?>
<?php echo( HTML::script("packages/app/directive/directive.js"));?>
</body>
</html>