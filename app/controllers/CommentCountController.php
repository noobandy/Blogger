<?php

class CommentCountController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blogId, $slug)
	{
		$post = Post::where("blog_id", "=", $blogId)->where("slug", "=", $slug)->firstOrFail();

		$count = $post->comments()->count();

		return Response::json($count, 200);
	}
}
