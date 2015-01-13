<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;

class Blog extends Eloquent {

	use SoftDeletingTrait;

	protected $dates = ['deleted_at'];

	protected $fillable = array("name", "about");
	
	public function author()
	{
		return $this->belongsTo("User");
	}

	public function posts()
	{
		return $this->hasMany("Post");
	}

	public function assets()
	{
		return $this->hasMany("BlogAsset");
	}
}