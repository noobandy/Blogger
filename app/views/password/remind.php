<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap.min.css")); ?>
	<style type="text/css">
		body{
			padding-top: 60px;
		}
	</style>
	<title>Reset Password</title>
</head>
<body>
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
 		<div class="container">
 			<!-- Brand and toggle get grouped for better mobile display -->
		    <div class="navbar-header">
		      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
		        <span class="sr-only">Toggle navigation</span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		      </button>
		      <a class="navbar-brand" href="<?php echo(URL::to("/")); ?>">Blogger</a>
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
			<div class="col-md-6">
			</div>
			<div class="col-md-6">
				<div class="row">
					<div class="col-md-12">
						<form name="loginForm" class="form-horizontal" method="post" action="<?php echo(URL::action("RemindersController@postRemind")); ?>">
							<legend>Reset passord</legend>
							<div class="form-group">	
								<input class="form-control input-lg" name="email" type="email" placeholder="email" />
							</div>
							<button class="btn btn-primary btn-lg" type="submit">Submit</button>
						</form>
					</div>
				</div>
			</div>
		</div>	
	</div>
<?php echo(HTML::script("packages/jquery/jquery.min.js")); ?>
<?php echo(HTML::script("packages/bootstrap/js/bootstrap.min.js")); ?>
</body>
</html>