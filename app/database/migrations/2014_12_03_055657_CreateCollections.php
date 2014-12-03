<?php

use Jenssegers\Mongodb\Schem\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCollections extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		// Create Collections for app

		//User collection
		Schema::create("users", function(Blueprint $collecction)
		{
			$collecction->unique("email");

		});

		//Blog collection
		Schema::create("blogs", function(Blueprint $collecction)
		{
			//add index on user_id property
			$collecction->index("user_id");
			
		});

		//Post collection
		Schema::create("posts", function(Blueprint $collecction)
		{
			//add index on blog_id property
			$collecction->index("blog_id");

			//non blocking multi key index on tags
			$collecction->background("tags");

			//non blocking text index on text
			//$collecction->background("text")

			//add index on published_at property
			//cause we will be ordering posts by their 
			//published_at time
			$collecction->index("published_at");


			
		});

		//Comment collection
		Schema::create("comments", function(Blueprint $collecction)
		{
			//add index on post_id property
			$collecction->index("post_id");

			//add index on user_id property
			$collecction->index("user_id");

			//add index on created_at property
			//cause we will be ordering comments by their 
			//created_at time
			$collecction->index("created_at");
			
		});

		

	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		// Drop Collections for app

		//User collection
		Schema::drop("users");

		//Blog collection
		Schema::drop("blogs");

		//Post collection
		Schema::drop("posts");

		//Comment collection
		Schema::drop("comments");
	}

}
