<?php

class LoginController extends BaseController {

	public function register()
	{
		$registrationData = Input::only("username", "email", "password");

		//validation post data
		$validator = Validator::make($registrationData, array(
			"username" => "required | unique:users",
			"email" => "required | email | unique:users",
			"password" => "required | min:6"
			));

		if($validator->fails()){
			return Redirect::back()->withErrors($validator, "register")->withInput(Input::all());
		}else{
			
			//save user data in db
			$key = uniqid();
			$user = new User();
			$user->username = $registrationData["username"];
			$user->email = $registrationData["email"];
			$user->password = Hash::make($registrationData["password"]);
			$user->activationKey = $key;
			$user->active = false;
			$user->save();
			
			$mailData = array("to" => $user->email, "username" => $user->username, "key" => $key);

			//send activation link to the user
			Mail::queueOn("activation-mail", "emails.account.activation", $mailData, function($message) use($mailData)
			{
				$message->to($mailData["to"],$mailData["username"])->subject("Account verification");
			});
			//Flassh message 
			Session::flash("flashMessage",array("type" => "success" ,"message" => Lang::get("messages.registrationSuccess")));

			return Redirect::to("/");
		}
		
	}

	public function activate(){
		//Get activation key form request 
		$username = Input::get("username");
		$key = Input::get("key");
		$user = User::where("username" , "=", $username)->where("active" , "=", false)->firstOrFail();
		
		//verify and activate account

		if(strcasecmp($key,$user->activationKey) == 0){
		
			$user->active = true;
			$user->save();

			//Flassh message 
			Session::flash("flashMessage",array("type" => "success" ,"message" => Lang::get("messages.activationSuccess")));
			return Redirect::to("/");
		}
	}

	public function login(){
		$username = Input::get("username");
		$password = Input::get("password");
		$remember = false;
		if(Input::has("remember")){
			$remember = true;
		}

		
		if(Auth::attempt(array("username" => $username, "password" => $password, "active" => true), $remember))
		{
			return Redirect::intended("/blog/".Auth::user()->username);
		}
		
		Session::flash("flashMessage",array("type" => "error" ,"message" => Lang::get("messages.loginFailed")));
		return Redirect::to("/");
	}


	public function forgotPassword(){
		$username = Input::get("username");

		//validation post data
		$validator = Validator::make(array("username" => $username), array(
			"username" => "required"
			));

		if($validator->fails()){
			return Redirect::to("forgotPassword")->withErrors($validator, "forgotPassword") ->withInput();
		}else{
			$user = User::where("username", "=", $username)->firstOrFail();

			$key = uniqid();
			$user->passwordResetKey = $key;
			$user->save();

			//send passowrd reset link to the user
			$mailData = array("to" => $user->email, "username" => $user->username, "key" => $key);

			Mail::queueOn("forgotPassword-mail", "emails.account.forgotPassword", $mailData, function($message) use($mailData)
			{
				$message->to($mailData["to"],$mailData["username"])->subject("Account verification");
			});

			//Flassh message 
			Session::flash("flashMessage",array("type" => "success" ,"message" => Lang::get("messages.forgotPasswordMailSent")));
			return Redirect::to("/");
		}

	}

	public function resetPassword(){
		//Get password reset key from request 
		$username = Input::get("username");
		$key = Input::get("key");
		$newPassword = Input::get("newPassword");
		$repeatNewPassword = Input::get("repeatNewPassword");

		//validation post data
		$validator = Validator::make(array("username" => $username,
		 "key" => $key, "newPassword" => $newPassword, "repeatNewPassword" => $repeatNewPassword ),
		  array("username" => "required",
		 "key" => "required", "newPassword" => "required | min:6",
		  "repeatNewPassword" => "required | min:6"
			));

		if($validator->fails()){
			return Redirect::to("resetPassword")->withErrors($validator, "resetPassword") ->withInput();
		} else {
			$user = User::where("username", "=", $username)->where("passwordResetKey", "=", $key)->firstOrFail();
			//verify and reset password
			$user->password = Hash::make($newPassword);
			$user->save();
			//Flassh message 
			Session::flash("flashMessage",array("type" => "success" ,"message" => Lang::get("messages.resetPasswordSuccess")));
			return Redirect::to("/");
		}
	}

	

}
