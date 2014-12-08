<?php

class TagController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blogId)
	{
		$params = array("blogId" => $blogId);

		$tagCounts = DB::collection('posts')->raw(function($collection) use($params)
		{

			 return $collection->aggregate(array(
			 	array(
			 		'$match' => array(
			 			"blog_id" => $params["blogId"]
			 			)
			 		),
			 	array('$unwind' => '$tags'),
			 	array(
			 		'$group' => array(
                	'_id' => '$tags',
                	'count' => array(
                    '$sum' => 1
                    )
                    )
			 	),
                array( '$sort' => array("count" => -1))    
                    )
			 	);
			});
		
		return Response::json($tagCounts["result"], 200);
	}
}
