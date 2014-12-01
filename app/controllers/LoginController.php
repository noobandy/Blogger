<?php

class LoginController extends BaseController {

	public function register()
	{
		$registrationData = Input::only("username", "email", "password");

		//validation post data
		$validator = Validator::make($registrationData, array(
			"username" => "required | min:8 | unique:users",
			"email" => "required | email | unique:users",
			"password" => "required | min:8"
			));

		if($validator->fails()){
			return Redirect::back()->withErrors($validator, "register")->withInput(Input::all());
		}else{
			
			//save user data in db
			$key = uniqid();
			$user = new User($registrationData);
			$user->activationKey = $key;
			$user->activatedAt = null;
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
		$user = User::where("username" , "=", $username)->whereNull("activatedAt")->firstOrFail();
		
		//verify and activate account

		if(strcasecmp($key,$user->activationKey) == 0){
			$now = date("Y-m-d H:i:s");
			$user->activatedAt = $now;
			$user->save();

			//Flassh message 
			Session::flash("flashMessage",array("type" => "success" ,"message" => Lang::get("messages.activationSuccess")));
		}
	}

	public function forgotPassword(){
		$username = Input::get("username");
		
		$user = User::where("username", "=", $username)->firstOrFail();

		if($user != null){
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
		}
		
		return Redirect::to("/");

	}

	public function resetPassword(){
		//Get password reset key from request 
		$username = Input::get("username");
		$key = Input::get("key");
		$newPassword = Input::get("newPassword");
		$user = User::where("username", "=", $username)->where("passwordResetKey", "=", $key)->firstOrFail();
		//verify and reset password
		$user->password = $newPassword;
		$user->save();
		//Flassh message 
		Session::flash("flashMessage",array("type" => "success" ,"message" => Lang::get("messages.resetPasswordSuccess")));
		return Redirect::to("/");
	}

	public function login(){
		$username = Input::get("username");
		$password = Input::get("password");
		$user = User::where("username", "=", $username)->where("password", "=", $password);
		if($user != null)
		{
			
				//login success redirect to blogging app
			return Redirect::to("/blog");
		}
		Session::flash("flashMessage",array("type" => "error" ,"message" => Lang::get("messages.loginFailed")));
		return Redirect::to("/");
	}

}
