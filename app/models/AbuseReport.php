<?php

use Jenssegers\Mongodb\Model as Eloquent;

class AbuseReport extends Eloquent {

	protected $dates = array("created_at");

	public function author()
	{
		return $this->belongsTo("User");
	}

	
	public function comment()
	{
		return $this->belongsTo("Comment");
	}

}