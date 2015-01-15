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

				$originalFileName = $uploadedFile->getClientOriginalName();

				$digest = md5_file($uploadedFile->getRealPath());

				$part1 = substr($digest, 0, 2);
				$part2 = substr($digest, 2, 2);
				$part3 = substr($digest, 4, 2);
				$part4 = substr($digest, 6, 2);

				$fileDir = "uploads".
				DIRECTORY_SEPARATOR.
				$part1.
				DIRECTORY_SEPARATOR.
				$part2.
				DIRECTORY_SEPARATOR.
				$part3.
				DIRECTORY_SEPARATOR.
				$part4;

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
						"original" => $originFilePath,
						"thumbnail" => $thumbnailFilePath,
						"avatar" => $avatarFilePath,
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
