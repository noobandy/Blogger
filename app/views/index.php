<!doctype html>
<html>
<head>
	<?php echo(HTML::style("packages/bootstrap/css/bootstrap.min.css")); ?>
	<style type="text/css">
		body{
			padding-top: 60px;
		}
	</style>
	<title>Blogger</title>
</head>
<body>
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
 		<div class="container">
 			<form class="navbar-form navbar-right" role="search">
				<div class="form-group">
					<input type="text" class="form-control" placeholder="Search">
				</div>
			</form>
 		</div>
	</nav>
	<div class="container">
		<?php
			if(Session::has("flashMessage"))
			{
				echo("<div class=\"row\">");
				echo("<div class=\"col-md-12\">");
				echo("<div class=\"alert alert-success\" role=\"alert\">");
				echo("<button type=\"button\" class=\"close\" data-dismiss=\"alert\">");
				echo("<span aria-hidden=\"true\">&times;</span>");
				echo("<span class=\"sr-only\">Close</span>");
				echo("</button>");
				echo(Session::get("flashMessage"));
				echo("</div>");
				echo("</div>");
				echo("</div>");
			}
		?>
		<div class="row">
			<div class="col-md-6">
			</div>
			<div class="col-md-6">
				<div class="row">
					<div class="col-md-12">
						<form name="loginForm" class="form-inline" method="post" action="<?php URL::to("/login") ?>">
							<div class="form-group">
								<input class="form-control" name="username" type="text" placeholder="username" />
							</div>
							<div class="form-group">
								<input class="form-control" name="password" type="password" placeholder="password" />
							</div>
							<button class="btn btn-primary" type="submit">Login</button>
						</form>
						<a href="<?php echo(URL::to("/forgotPassword")); ?>">forgot password? </a>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<form name="registrationForm" method="post" action="<?php echo(URL::to('/register')); ?>">
							<legend>Register</legend>
							<?php
								if($errors->register->has("email")){
									echo("<div class=\"form-group has-error\">");
								}else{
									echo("<div class=\"form-group\">");
								}
							 ?>
							<input name="email" type="email" class="form-control input-lg" placeholder="example@gmail.com" value="<?php echo(Request::old("email")); ?>" />
							<span class="hel-block">
								<?php echo(Lang::get("messages.emailHelp")) ?>
							</span>
							</div>
							<?php
								if($errors->register->has("username")){
									echo("<div class=\"form-group has-error\">");
								}else{
									echo("<div class=\"form-group\">");
								}
							 ?>
								<input name="username" type="text" class="form-control input-lg" placeholder="username" value="<?php echo(Request::old("username")); ?>"/>
								<span class="hel-block">
									<?php echo(Lang::get("messages.usernameHelp")) ?>
								</span>
							</div>
							<?php
								if($errors->register->has("password")){
									echo("<div class=\"form-group has-error\">");
								}else{
									echo("<div class=\"form-group\">");
								}
							 ?>
								<input name="password" type="password" class="form-control input-lg" placeholder="password"/>
								<span class="hel-block">
									<?php echo(Lang::get("messages.passwordHelp")) ?>
								</span>
							</div>
							<div class="form-group">
								<input name="repeatPassword" type="password" class="form-control input-lg" placeholder="repeat password"/>
							</div>
							<button type="submit" class="btn btn-primary btn-lg">Register</button>
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