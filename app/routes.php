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

Route::post("/register", "LoginController@register");

Route::get("/activate", "LoginController@activate");

Route::post("/login", "AjaxLoginController@login");

Route::post("/logout", "AjaxLoginController@logout");

Route::get("/password/remind", "RemindersController@getRemind");


Route::post("/password/remind", "RemindersController@postRemind");

Route::get("/password/reset/{token}", "RemindersController@getReset");


Route::post("/password/reset", "RemindersController@postReset");



Route::resource("blog", "BlogController", array( "except" => array("index", "create", "edit")));

Route::resource("blog.post", "PostController", array( "except" => array( "create", "edit")));

Route::resource("blog.post.comment", "CommentController", array( "except" => array( "create", "edit")));

Route::resource("blog.post.commentCount", "CommentCountController", array( "only" => array( "create", "index")));

Route::resource("blog.tag", "TagController", array( "only" => array( "index")));

Route::resource("blog.archive", "ArchiveController", array( "only" => array( "index")));

Route::get("/blogger/{username}", function($username){
	$author = User::where("username", "=", $username)->firstOrFail();

	$blog =  $author->blog;

	return View::make("blogger")->with(array("blog" => $blog->toJson()));
});
