<?php

use Jenssegers\Mongodb\Model as Eloquent;
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class UserProfile extends Eloquent {

	use SoftDeletingTrait;

}
