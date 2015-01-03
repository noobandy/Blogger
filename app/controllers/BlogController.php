<?php

class BlogController extends \BaseController {



	/**
	 * Display the specified resource.
	 *
	 * @param  string  $blogId
	 * @return Response
	 */
	public function show($blogId)
	{
		
		$blog = Blog::findOrFail($blogId);

		return Response::json($blog, 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  string  $blogId
	 * @return Response
	 */
	public function update($blogId)
	{
		$blog = Blog::findOrFail($blogId);

		if(strcmp($blog->author()->username, Auth::user()->username) == 0)
		{
			$updateData = Input::only("name", "about");

			$blog->update($updateData);

			return Response::json(array(), 200);
		}
		else
		{
			App::abort(403);
		}
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  string  $blogId
	 * @return Response
	 */
	public function destroy($blogId)
	{
		$blog = Blog::findOrFail($blogId);

		if(strcmp($blog->author()->username, Auth::user()->username) == 0)
		{
			$updateData = Input::only("name", "about");

			$blog->delete();

			return Response::json(array(), 200);
		}
		else
		{
			App::abort(403);
		}
	}


}
