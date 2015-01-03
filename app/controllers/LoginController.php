<?php

class LoginController extends BaseController {

	public function login(){
		$username = Input::get("username");
		$password = Input::get("password");
		$remember = false;
		if(Input::has("remember")){
			$remember = true;
		}

		
		if(Auth::attempt(array("username" => $username, "password" => $password, "active" => true), $remember))
		{
				$loggedInUser = User::with("blog")->where("username", "=", $username)->firstOrFail();

				return Response::json(array("loggedInUser" => $loggedInUser->toJson()), 200);
		}
		else
		{
			return Response::json(array("loggedInUser" => null), 200);
		}
		
	}


	public function logout(){
		Auth::logout();
		return Response::json(array(), 200);
	}
}
