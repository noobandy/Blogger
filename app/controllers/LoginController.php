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
			return Redirect::intended("/blogger/".Auth::user()->username);
		}
		
		Session::flash("flashMessage",array("type" => "error" ,"message" => Lang::get("messages.loginFailed")));
		return Redirect::to("/");
	}
}
