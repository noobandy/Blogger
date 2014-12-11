<?php

class BlogController extends \BaseController {

	

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		if(Auth::check())
		{
			
		}

		$inputData = Input::only("name", "about");
		$blog = new Blog($inputData);
		$username = Auth::user()->username;
		$author = User::where("username", "=", $username)->firstOrFail();
		$blog = $author->blog()->save($blog);

		return Response::json($blog, 201);
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
		$blog = Blog::findOrFail($id);

		return Response::json($blog, 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
		$updateData = Input::only("name", "about");

		Blog::findOrFail($id)->update($updateData);

		return Response::json(array(), 200);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
		Blog::findOrFail($id)->delete();

		return Response::json(array(), 200);
	}


}
