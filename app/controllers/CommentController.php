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



		$comments = $query->orderBy("depth", "asc")->with("author")->get();
		
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

		$comment->_id = uniqid();

		if($parentId)
		{
			$parent = Comment::findOrFail($parentId);

			$comment->parent()->associate($parent);

			$comment->depth = $parent->depth + 1;

			$comment->path = $parent->path."/"+$comment->_id;

		}
		else
		{
			$comment->depth = 0;
			$comment->path = $comment->_id;
		}
	
		$commnet = $post->comments()->save($comment);

		return Response::json($comment, 201);
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  string  $commentId
	 * @return Response
	 */
	public function show($blogId, $postId, $commentId)
	{
		//
		$comment = Comment::findOrFail($commentId);

		return Response::json($comment, 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  string  $commentId
	 * @return Response
	 */
	public function update($blogId, $postId, $commentId)
	{
		
		$comment = Comment::findOrFail($commentId);
		
		$author = User::findOrFail($comment->author_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$updateData = Input::only("comment");
			$comment->update($updateData);
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
	 * @param  string  $commentId
	 * @return Response
	 */
	public function destroy($blogId, $postId, $commentId)
	{
		$comment = Comment::findOrFail($commentId);
		
		$author = User::findOrFail($comment->author_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$comment->delete();
			return Response::json(array(), 200);
		}
		else
		{
			App::abort(403);
		}
	}


}
