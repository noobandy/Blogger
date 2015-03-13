<?php

class RegistrationController extends BaseController {

	public function register()
	{
		$registrationData = Input::only("username", "email", "password","blogName");

		//validation post data
		$validator = Validator::make($registrationData, array(
			"username" => "required | unique:users",
			"email" => "required | email | unique:users",
			"password" => "required | min:6",
			"blogName" => "required"
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
			
			//save blog data in the db

			$blog = new Blog();
			$blog->name = $registrationData["blogName"];
			$blog->about = "";
			$user->blog()->save($blog);

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
}
