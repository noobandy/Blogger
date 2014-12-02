<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap.min.css")); ?>
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
		      <a class="navbar-brand" href="{{homeUrl}}">{{brand}}</a>
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
	<div class="container" ui-view>
		
	</div>
<?php echo(HTML::script("packages/jquery/jquery.min.js")); ?>
<?php echo(HTML::script("packages/bootstrap/js/bootstrap.min.js")); ?>
<?php echo( HTML::script("packages/angular.js/angular.min.js"));?>
<?php echo( HTML::script("packages/ui-router/angular-ui-router.min.js"));?>
<?php echo( HTML::script("packages/ui-bootstrap/ui-bootstrap-tpls-0.12.0.min.js"));?>
<?php echo( HTML::script("packages/app/app.js"));?>
<?php echo( HTML::script("packages/app/controller/controller.js"));?>
<?php echo( HTML::script("packages/app/service/service.js"));?>
<?php echo( HTML::script("packages/app/filter/filter.js"));?>
<?php echo( HTML::script("packages/app/directive/directive.js"));?>
</body>
</html>