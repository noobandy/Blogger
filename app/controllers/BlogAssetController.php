<?php

class BlogAssetController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blogId)
	{
		//
		$params = Input::only("s","pn", "ps");

		$blog = Blog::findOrFail($blogId);
		$query = $blog->assets();

		if(Input::has("s"))
		{
			$query = $query->where(function($query)
			{
				$query->where("name", "like", Input::get("s")."%");
			});
		}

		$count = $query->count();

		if(Input::has("pn") && Input::has("ps"))
		{
			$query = $query->skip((Input::get("pn") - 1) * Input::get("ps"))->take(Input::get("ps"));
		}



		$assets = $query->orderBy("name", "asc")->get();
		
		return Response::json(array("items" => $assets, "count" => $count), 200);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($blogId)
	{

		$blog = Blog::findOrFail($blogId);

		$author = User::findOrFail($blog->user_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$validator = Validator::make(Input::all(),
			array("asset" => "required|mimes:jpeg,bmp,png,gif|max:1024"));

			if(!$validator->fails())
			{
				$uploadedFile = Input::file("asset");

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

				$fileName = $digest.".".$uploadedFile->getClientOriginalExtension();

				$thumbnailFileName = $digest."_thumb.".$uploadedFile
				->getClientOriginalExtension();

				$destinationPath = public_path().DIRECTORY_SEPARATOR.$fileDir;


				$uploadedFile->move($destinationPath, $fileName);

				Image::make($destinationPath.DIRECTORY_SEPARATOR.$fileName,
					array(
					'width' => 100,
					'height' => 100
					))->save($destinationPath.DIRECTORY_SEPARATOR.$thumbnailFileName);


				$asset = new BlogAsset();

				$asset->name = $originalFileName;

				$asset->path = $fileDir.DIRECTORY_SEPARATOR.$fileName;
				
				$asset->thumbnail = $fileDir.DIRECTORY_SEPARATOR.$thumbnailFileName;

				$blog->assets()->save($asset);

				return Response::json($asset, 201);
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


	/**
	 * Display the specified resource.
	 *
	 * @param  string $assetId
	 * @return Response
	 */
	public function show($blogId, $assetId)
	{
		$asset = BlogAsset::findOrFail($assetId);

		return Response::json($asset, 200);
	}



	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  string  $assetId
	 * @return Response
	 */
	public function destroy($blogId, $assetId)
	{
		
		$blog = Blog::findOrFail($blogId);
		
		$author = User::findOrFail($blog->user_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$asset = BlogAsset::findOrFail($assetId);

			$asset->delete();

			return Response::json(array(), 200);
		}
		else
		{
			App::abort(403);
		}
	}


}
