<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;

class Post extends Eloquent {

	use SoftDeletingTrait;
	protected $dates = ['deleted_at','publishedAt'];

	protected $fillable = array("title", "excerpt","text","tags");

	public function blog()
	{
		return $this->belongsTo("Blog");
	}

	public function comments()
	{
		return $this->hasMany("Comment");
	}
}