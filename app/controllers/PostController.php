<?php

class PostController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blogId)
	{
		//
		$blog = Blog::findOrFail($blogId);
		$posts = $blog->posts;
		return Response::json($posts, 200);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($blogId)
	{
		$blog = Blog::findOrFail($blogId);
		
		$inputData = Input::only("title", "excerpt", "text", "tags");

		$post = new Post($inputData);
	
		$post = $blog->posts()->save($post);

		return Response::json($post, 201);
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($blobId, $id)
	{
		//
		$post = Post::findOrFail($id);

		return Response::json($post, 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($blogId, $id)
	{
		//
		$updateData = Input::only("title", "excerpt", "text", "tags");

		Post::findOrFail($id)->update($updateData);

		return Response::json(array(), 200);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($blogId, $id)
	{
		//
		Post::findOrFail($id)->delete();

		return Response::json(array(), 200);
	}


}
