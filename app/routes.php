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

Route::post("/login", "LoginController@login");

Route::get("/password/remind", "RemindersController@getRemind");


Route::post("/password/remind", "RemindersController@postRemind");

Route::get("/password/reset/{token}", "RemindersController@getReset");


Route::post("/password/reset", "RemindersController@postReset");



Route::resource("blog", "BlogController", array( "except" => array( "create", "edit")));

Route::resource("blog.post", "PostController", array( "except" => array( "create", "edit")));

Route::resource("blog.post.comment", "CommentController", array( "except" => array( "create", "edit")));

Route::get("/blogger/{username}", function($username){
	$author = User::where("username", "=", $username)->firstOrFail();

	$blog =  $author->blog;

	return View::make("blogger")->with(array("blog" => $blog->toJson(), "user" => $author->toJson()));
});
