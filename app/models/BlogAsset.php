<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;

class BlogAsset extends Eloquent {

	use SoftDeletingTrait;

	protected $dates = ['deleted_at'];

	protected $fillable = array("name", "about");

	public function blog()
	{
		return $this->belongsTo("Blog");
	}

}