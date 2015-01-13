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
			if(Input::hasFile("asset"))
			{
				$uploadedFile = Input::file("asset");

				$originalFileName = $uploadedFile->getClientOriginalName();

				$digest = md5_file($uploadedFile->getRealPath());

				$part1 = substr($digest, 0, 4);
				$part2 = substr($digest, 4, 4);
				$part3 = substr($digest, 8, 4);
				$part4 = substr($digest, 12, 4);

				$destinationPath = public_path().
				DIRECTORY_SEPARATOR.
				"uploads".
				DIRECTORY_SEPARATOR.
				$part1.
				DIRECTORY_SEPARATOR.
				$part2.
				DIRECTORY_SEPARATOR.
				$part3.
				DIRECTORY_SEPARATOR.
				$part4.
				DIRECTORY_SEPARATOR.
				$digest.
				$uploadedFile->getClientOriginalExtension();

				$uploadedFile->move($uploadedFile);

				$asset = new Asset();

				$asset->name = $originalFileName;

				$asset->path = $destinationPath;

				$blog->assets()->save($asset);

				return Response::json($asset, 201);
			}
			else
			{

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
		$asset = Asset::findOrFail($assetId);

		return Response::json($asset, 200);
	}



	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  string  $postId
	 * @return Response
	 */
	public function destroy($blogId, $postId)
	{
		
		$blog = Blog::findOrFail($blogId);
		
		$author = User::findOrFail($blog->user_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$asset = Asset::findOrFail($assetId);

			$asset->delete();

			return Response::json(array(), 200);
		}
		else
		{
			App::abort(403);
		}
	}


}
