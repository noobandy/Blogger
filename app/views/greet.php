<!doctype html>
<html>
<head>
	<title>Greetings</title>
</head>
<body>
	<?php
		define("GREETING", "Greetings");
		class Greeter {
			function Greeter($name){
				$this->name = $name;
			}
			function greet(){
				return GREETING." ".$this->name;
			}
		}

		$greeter = new Greeter(Input::get('name'));
		echo($greeter->greet());
		//echo(var_dump($greeter));
	?>
	<?php
		echo(GREETING);
	 ?>
</body>
</html>