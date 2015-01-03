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
		$params = Input::only("po", "s", "t", "sd", "ed", "pn", "ps");

		$blog = Blog::findOrFail($blogId);
		$query = $blog->posts();
		
		if(Input::has("po"))
		{
			$query = $query->where("exists", "publishedAt", true);
		}

		if(Input::has("s"))
		{
			$query = $query->where(function($query)
			{
				$query->where("excerpt", "like", "%".Input::get("s")."%")
				->orWhere("text", "like", "%".Input::get("s")."%");
			});
		}

		if(Input::has("t"))
		{
			$query = $query->where("tags", "all", array(Input::get("t")));
		}

		if(Input::has("sd"))
		{
			$query = $query->where("created_at", ">=", date_create(Input::get("sd")));
		}

		if(Input::has("ed"))
		{
			$query = $query->where("created_at", "<=", date_create(Input::get("ed")));
		}

		$count = $query->count();

		if(Input::has("pn") && Input::has("ps"))
		{
			$query = $query->skip((Input::get("pn") - 1) * Input::get("ps"))->take(Input::get("ps"));
		}



		$posts = $query->orderBy("created_at", "desc")->get(array(
			"_id", "title", "excerpt","tags", "created_at", "updated_at","published_at", "slug"
			));
		
		return Response::json(array("items" => $posts, "count" => $count), 200);
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
			$inputData = Input::only("title", "excerpt", "text", "tags");

			$post = new Post($inputData);
		
			$post = $blog->posts()->save($post);

			return Response::json($post, 201);
		}
		else
		{
			App::abort(403);
		}

	}


	/**
	 * Display the specified resource.
	 *
	 * @param  string $slug
	 * @return Response
	 */
	public function show($blogId, $slug)
	{
		//
		$post = Post::where("blog_id", "=", $blogId)->where("slug", "=", $slug)->firstOrFail();

		return Response::json($post, 200);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  string  $postId
	 * @return Response
	 */
	public function update($blogId, $postId)
	{
		$blog = Blog::findOrFail($blogId);

		$author = User::findOrFail($blog->user_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$updateData = Input::only("title", "excerpt", "text", "tags");

			$blog->posts()->findOrFail($postId)->update($updateData);

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
	 * @param  string  $postId
	 * @return Response
	 */
	public function destroy($blogId, $postId)
	{
		
		$blog = Blog::findOrFail($blogId);
		
		$author = User::findOrFail($blog->user_id);

		if(strcmp($author->username, Auth::user()->username) == 0)
		{
			$updateData = Input::only("title", "excerpt", "text", "tags");

			$blog->posts()->findOrFail($postId)->delete();

			return Response::json(array(), 200);
		}
		else
		{
			App::abort(403);
		}
	}


}
