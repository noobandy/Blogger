<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;

class Comment extends Eloquent {

	use SoftDeletingTrait;

	protected $dates = array("deleted_at", "created_at", "updated_at");

	protected $fillable = array("comment");
	
	public function post()
	{
		return $this->belongsTo("Post");
	}

	public function author()
	{
		return $this->belongsTo("User");
	}

	public function parent()
	{
		return $this->belongsTo("Comment");
	}


	public function upVotes()
	{
		return $this->hasMany("UpVote");
	}

	public function downVotes()
	{
		return $this->hasMany("DownVote");
	}

	public function abuseReports()
	{
		return $this->hasMany("AbuseReport");
	}

}