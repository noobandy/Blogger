<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;
use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;

class Post extends Eloquent implements SluggableInterface {

	use SoftDeletingTrait;
	protected $dates = array("deleted_at", "published_at", "created_at", "updated_at");

	protected $fillable = array("title", "excerpt","text","tags");

	use SluggableTrait;

    protected $sluggable = array(
        'build_from' => 'title',
        'save_to'    => 'slug',
    );
    
	public function blog()
	{
		return $this->belongsTo("Blog");
	}

	public function comments()
	{
		return $this->hasMany("Comment");
	}

}