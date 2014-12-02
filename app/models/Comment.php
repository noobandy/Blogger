<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;

class Comment extends Eloquent {

	use SoftDeletingTrait;

	protected $dates = ['deleted_at'];

	protected $fillable = array("comment");
	
	public function post()
	{
		return $this->belongsTo("Post");
	}

	public function author()
	{
		return $this->belongsTo("User");
	}	
}