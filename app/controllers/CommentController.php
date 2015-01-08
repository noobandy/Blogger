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



		$comments = $query->orderBy("depth", "asc")
		->with(array("author","upVotes.author","downVotes.author","abuseReports.author"))->get();
		
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
		$comment = Comment::with(array("author","upVotes.author","downVotes.author","abuseReports.author"))
		->where("_id", "=", $commentId)->firstOrFail();

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

	public function upvote($blogId, $postId, $commentId)
	{
		
		$comment = Comment::findOrFail($commentId);

		$currentUser = User::where("username", "=", Auth::user()->username)->firstOrFail();

		$existingDownVote = DownVote::where("comment_id", "=", $commentId)
		->where("author_id", "=", $currentUser->_id)->first();

		$existingUpVote = UpVote::where("comment_id", "=", $commentId)
		->where("author_id", "=", $currentUser->_id)->first();


		if(is_null($existingUpVote) && is_null($existingDownVote))
		{
			$upVote = new UpVote();

			$upVote->author()->associate($currentUser);

			$comment->downVotes()->save($upVote);

			return Response::json($upVote, 200);
		}
		else
		{
			if(!is_null($existingDownVote) && is_null($existingUpVote))
			{
				$existingDownVote->delete();
				
				$upVote = new UpVote();

				$upVote->author()->associate($currentUser);

				$comment->downVotes()->save($upVote);

				return Response::json($upVote, 200);
			}
			else
			{
				$existingUpVote->delete();
				return Response::json(array(), 200);
			}
			
		}
	}


	public function downvote($blogId, $postId, $commentId)
	{
		$comment = Comment::findOrFail($commentId);

		$currentUser = User::where("username", "=", Auth::user()->username)->firstOrFail();

		$existingDownVote = DownVote::where("comment_id", "=", $commentId)
		->where("author_id", "=", $currentUser->_id)->first();

		$existingUpVote = UpVote::where("comment_id", "=", $commentId)
		->where("author_id", "=", $currentUser->_id)->first();


		if(is_null($existingUpVote) && is_null($existingDownVote))
		{
			$downVote = new DownVote();

			$downVote->author()->associate($currentUser);

			$comment->downVotes()->save($downVote);

			return Response::json($downVote, 200);
		}
		else
		{
			if(!is_null($existingUpVote) && is_null($existingDownVote))
			{
				$existingUpVote->delete();
				
				$downVote = new DownVote();

				$downVote->author()->associate($currentUser);

				$comment->downVotes()->save($downVote);

				return Response::json($downVote, 200);
			}
			else
			{
				$existingDownVote->delete();
				return Response::json(array(), 200);
			}
			
		}
	}


	public function report($blogId, $postId, $commentId)
	{
		$comment = Comment::findOrFail($commentId);

		$currentUser = User::where("username", "=", Auth::user()->username)->firstOrFail();

		$existingAbuseReport = AbuseReport::where("comment_id", "=", $commentId)
		->where("author_id", "=", $currentUser->_id)->first();

		if(is_null($existingAbuseReport))
		{
			$abuseReport = new AbuseReport();

			$abuseReport->author()->associate($currentUser);

			$comment->abuseReports()->save($abuseReport);

			return Response::json($abuseReport, 200);
		}
		else
		{
			$existingAbuseReport->delete();
			return Response::json(array(), 200);
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
