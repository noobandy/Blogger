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

Route::get("/forgotPassword", function(){
	return View::make("forgotPassword");
});

Route::post("/forgotPassword", "LoginController@forgotPassword");

Route::get("/resetPassword", function(){
	return View::make("resetPassword");
});

Route::post("/resetPassword", "LoginController@resetPassword");

Route::get("/blog",function(){
	return "Blog";
});
