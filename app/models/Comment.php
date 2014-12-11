<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletingTrait;
use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;

class Comment extends Eloquent implements SluggableInterface {

	use SoftDeletingTrait;

	protected $dates = array("deleted_at", "created_at", "updated_at");

	protected $fillable = array("comment");

	use SluggableTrait;

    protected $sluggable = array(
        'build_from' => 'fullSlug',
        'save_to'    => 'slug',
    );

    public function getFullSlugAttribute(){

    	$current_time = date("Y.m.d.H.i.s");
    	$slugPart = substr($this->comment, 0, 4);

    	if($this->parent)
    	{
    		return $this->parent->slug."/".$current_time.":".$slugPart;
    	}
    	return $current_time.":".$slugPart;
    }
	
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

}