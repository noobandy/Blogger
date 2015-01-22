<?php

class UserController extends \BaseController {



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
	

	public function changeProfilePic($username)
	{
		$user = User::where("username", "=", $username)->firstOrFail();

		if(strcmp($user->username, Auth::user()->username) == 0)
		{
			$validator = Validator::make(Input::all(),
			array("profilePicture" => "required|mimes:jpeg,bmp,png,gif|max:1024"));

			if(!$validator->fails())
			{
				$uploadedFile = Input::file("profilePicture");

				$fileDir = str_replace("/", DIRECTORY_SEPARATOR, $user->asset_dir);

				$fileName = $username.".".$uploadedFile->getClientOriginalExtension();

				$thumbnailFileName = $username."_thumb.".$uploadedFile
				->getClientOriginalExtension();

				$avatarFileName = $username."_avatar.".$uploadedFile->getClientOriginalExtension();

				$destinationPath = public_path().DIRECTORY_SEPARATOR.$fileDir;


				$uploadedFile->move($destinationPath, $fileName);

				Image::make($destinationPath.DIRECTORY_SEPARATOR.$fileName,
					array(
					'width' => 307,
					'height' => 320
					))->save($destinationPath.DIRECTORY_SEPARATOR.$thumbnailFileName);

				Image::make($destinationPath.DIRECTORY_SEPARATOR.$fileName,
					array(
					'width' => 30,
					'height' => 30
					))->save($destinationPath.DIRECTORY_SEPARATOR.$avatarFileName);

				$originFilePath =  $fileDir.DIRECTORY_SEPARATOR.$fileName;
				$avatarFilePath =  $fileDir.DIRECTORY_SEPARATOR.$avatarFileName;
				$thumbnailFilePath =  $fileDir.DIRECTORY_SEPARATOR.$thumbnailFileName;

				$user->profilePicture = array(
						"original" => str_replace(DIRECTORY_SEPARATOR, "/", $originFilePath),
						"thumbnail" => str_replace(DIRECTORY_SEPARATOR, "/", $thumbnailFilePath),
						"avatar" => str_replace(DIRECTORY_SEPARATOR, "/", $avatarFilePath),
					);

				$user->save();

				return Response::json($user, 201);

			}
			else
			{
				return Response::json(array("errors" => $validator->messages()), 200);
			}
		}
		else
		{
			App::abort(403);
		}
	}
}
