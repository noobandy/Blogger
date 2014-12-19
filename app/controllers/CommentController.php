<?php

class CommentController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blogId, $slug)
	{
		//
		$post = Post::where("blog_id", "=", $blogId)->where("slug", "=", $slug)->firstOrFail();
		
		$query = $post->comments();

		$count = $query->count();

		if(Input::has("pn") && Input::has("ps"))
		{
			$query = $query->skip((Input::get("pn") - 1) * Input::get("ps"))->take(Input::get("ps"));
		}



		$comments = $query->orderBy("slug", "asc")->get();
		
		return Response::json(array("items" => $comments, "count" => $count), 200);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($blogId, $postId)
	{
		$post = Post::findOrFail($postId);
		
		$parentId = Input::get("parentId");

		$inputData = Input::only("comment");

		$username = Auth::user()->username;
		
		$currentUser = User::where("username", "=", $username)->firstOrFail();

		$comment = new Comment($inputData);

		$comment->author()->associate($currentUser);

		if($parentId)
		{
			$parent = Comment::findOrFail($parentId);
			$comment->parent()->associate($parent);
		}
	
		$commnet = $post->comments()->save($comment);

		return Response::json($comment, 201);
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($blogId, $postId, $id)
	{
		//
		$comment = Comment::findOrFail($id);

		return Response::json($comment, 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($blogId, $postId, $id)
	{
		//
		$updateData = Input::only("comment");

		Comment::findOrFail($id)->update($updateData);

		return Response::json(array(), 200);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($blogId, $postId, $id)
	{
		//
		Comment::findOrFail($id)->delete();

		return Response::json(array(), 200);
	}


}
