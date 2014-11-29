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
			Session::flash("flashMessage",Lang::get("messages.registrationSuccess"));

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
			Session::flash("flashMessage",Lang::get("messages.activationSuccess"));
			return Redirect::to("/");
		}
	}

	public function forgotPassword(){

	}

	public function resetPassword(){
		//Get password reset key from request 

		//verify and reset password

		//Flassh message 
		Session::flash("flashMessage",Lang::get("messages.activationSuccess"));

		return Redirect::to("/");
	}

	public function login(){

		return Redirect::to("/blog");
	}

	public function changePassword(){

	}

}
