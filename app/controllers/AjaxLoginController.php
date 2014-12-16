<?php

class AjaxLoginController extends BaseController {

	public function login(){
		$username = Input::get("username");
		$password = Input::get("password");
		$remember = false;
		if(Input::has("remember")){
			$remember = true;
		}

		
		if(Auth::attempt(array("username" => $username, "password" => $password, "active" => true), $remember))
		{
			$author = User::where("username", "=", $username)->firstOrFail();

			$blog =  $author->blog;
			return Response::json(array("blog" => $blog->toJson(), "user" => $author->toJson()), 200);
		}
		else
		{
			return Response::json(array(), 401);
		}
		
	}
}