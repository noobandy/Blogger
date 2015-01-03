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

Route::post("/register", "RegistrationController@register");

Route::get("/activate", "RegistrationController@activate");

Route::post("/login", "LoginController@login");

Route::post("/logout", "LoginController@logout");

Route::get("/password/remind", "RemindersController@getRemind");


Route::post("/password/remind", "RemindersController@postRemind");

Route::get("/password/reset/{token}", "RemindersController@getReset");


Route::post("/password/reset", "RemindersController@postReset");



Route::get("/blog/{blogId}","BlogController@show");

Route::put("/blog/{blogId}", array('before' => "basic.once","BlogController@update"));

Route::delete("/blog/{blogId}", array('before' => "basic.once","BlogController@destroy"));


Route::get("/blog/{blogId}/post","PostController@index");

Route::post("/blog/{blogId}/post", array('before' => "basic.once", "PostController@store"));

Route::get("/blog/{blogId}/post/{slug}","PostController@show");

Route::put("/blog/{blogId}/post/{postId}", array('before' => "basic.once", "PostController@update"));

Route::delete("/blog/{blogId}/post/{postId}", array('before' => "basic.once", "PostController@destroy"));


Route::get("/blog/{blogId}/post/{postId}/comment","CommentController@index");

Route::post("/blog/{blogId}/post/{postId}/comment", array('before' => "basic.once", "CommentController@store"));

Route::get("/blog/{blogId}/post/{postId}/comment/{commentId}","CommentController@show");

Route::put("/blog/{blogId}/post/{postId}/comment/{commentId}", array('before' => "basic.once", "CommentController@update"));

Route::delete("/blog/{blogId}/post/{postId}/comment/commentId", array('before' => "basic.once", "CommentController@destroy"));

Route::get("/blog/{blogId}/post/{postId}/commentCount","CommentCountController@index");

Route::get("/blog/{blogId}/tag","TagController@index");

Route::get("/blog/{blogId}/archive","ArchiveController@index");


Route::get("/blogger/{username}", function($username){
	
	$user = User::where("username", "=", $username)->where("active", "=", true)->firstOrFail();

	$blog = Blog::with("author")->where("user_id", "=", $user->_id)->firstOrFail();

	$data = array("blog" => $blog->toJson());
	
	return View::make("blogger")->with($data);
});
