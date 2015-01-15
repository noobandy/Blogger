<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get("/", function()
{
	return View::make("index");
});

Route::any("/register", "RegistrationController@register");

Route::any("/activate", "RegistrationController@activate");

Route::any("/login", "LoginController@login");

Route::any("/logout", array("" => "basic.once",
	"uses" => "LoginController@logout",
	"as" => "login.logout"));


Route::any("/password/remind", "RemindersController@getRemind");


Route::any("/password/remind", "RemindersController@postRemind");

Route::get("/password/reset/{token}", "RemindersController@getReset");


Route::post("/password/reset", "RemindersController@postReset");


Route::get("/user/{username}","UserController@show");

Route::post("/user/{username}/avatar",
	array("before" => "basic.once",
		"uses" => "UserController@changeProfilePic",
		"as" => "user.avatar"));

Route::get("/blog/{blogId}","BlogController@show");

Route::put("/blog/{blogId}",
	array('before' => "basic.once",
		"uses" => "BlogController@update",
		"as" => "blog.update"));

Route::delete("/blog/{blogId}",
	array('before' => "basic.once",
		"uses" => "BlogController@destroy",
		"as" => "blog.destroy"));



Route::get("/blog/{blogId}/asset","BlogAssetController@index");

Route::post("/blog/{blogId}/asset",
	array('before' => "basic.once",
		"uses" => "BlogAssetController@store",
		"as" => "asset.store"));

Route::get("/blog/{blogId}/asset/{assetId}","BlogAssetController@show");


Route::delete("/blog/{blogId}/asset/{assetId}",
	array('before' => "basic.once",
		"uses" => "BlogAssetController@destroy",
		"as" => "asset.destroy"));


Route::get("/blog/{blogId}/post","PostController@index");

Route::post("/blog/{blogId}/post",
	array('before' => "basic.once",
		"uses" => "PostController@store",
		"as" => "post.store"));

Route::get("/blog/{blogId}/post/{slug}","PostController@show");

Route::put("/blog/{blogId}/post/{postId}",
	array('before' => "basic.once",
	"uses" => "PostController@update",
	"as" => "post.update"));

Route::delete("/blog/{blogId}/post/{postId}",
	array('before' => "basic.once",
		"uses" => "PostController@destroy",
		"as" => "post.destroy"));


Route::get("/blog/{blogId}/post/{postId}/comment","CommentController@index");

Route::post("/blog/{blogId}/post/{postId}/comment",
	array('before' => "basic.once",
	"uses" => "CommentController@store",
	"as" => "comment.store"));

Route::get("/blog/{blogId}/post/{postId}/comment/{commentId}","CommentController@show");

Route::put("/blog/{blogId}/post/{postId}/comment/{commentId}",
	array('before' => "basic.once",
	"uses" => "CommentController@update",
	"as" => "comment.update"));

Route::put("/blog/{blogId}/post/{postId}/comment/{commentId}/upvote",
	array('before' => "basic.once",
	"uses" => "CommentController@upvote",
	"as" => "comment.upvote"));

Route::put("/blog/{blogId}/post/{postId}/comment/{commentId}/downvote",
	array('before' => "basic.once",
	"uses" => "CommentController@downvote",
	"as" => "comment.downvote"));

Route::put("/blog/{blogId}/post/{postId}/comment/{commentId}/report",
	array('before' => "basic.once",
	"uses" => "CommentController@report",
	"as" => "comment.report"));


Route::delete("/blog/{blogId}/post/{postId}/comment/{commentId}",
	array('before' => "basic.once",
	"uses" => "CommentController@destroy",
	"as" => "comment.destroy"));


Route::get("/blog/{blogId}/post/{postId}/commentCount","CommentCountController@index");

Route::get("/blog/{blogId}/tag","TagController@index");

Route::get("/blog/{blogId}/archive","ArchiveController@index");


Route::get("/blogger/{username}", function($username){
	
	$user = User::where("username", "=", $username)->where("active", "=", true)->firstOrFail();

	$blog = Blog::with("author")->where("user_id", "=", $user->_id)->firstOrFail();

	$data = array("blog" => $blog->toJson());
	
	return View::make("blogger")->with($data);
});
