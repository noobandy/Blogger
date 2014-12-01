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

Route::get("/forgotPassword", "RemindersController@getRemind");

Route::post("/forgotPassword", "RemindersController@postRemind");


Route::get("/password/reset/{token}", "RemindersController@getReset");

Route::post("/resetPassword", "RemindersController@postReset");

Route::get("/blog/{username}", array( "before" => "auth", function(){
	return View::make("blog");
}));
