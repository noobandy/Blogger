<?php

class UserProfileController extends \BaseController {



	/**
	 * Display the specified resource.
	 *
	 * @param  string  $username
	 * @return Response
	 */
	public function show($username)
	{
		
		$user = User::with("blog")->where("username", "=", $username)->firstOrFail();

		return Response::json($user, 200);
	}
	
}
