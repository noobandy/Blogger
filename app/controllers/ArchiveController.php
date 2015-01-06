<?php

class ArchiveController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blogId)
	{
		$params = array("blogId" => $blogId);

		$archiveCounts = DB::collection('posts')->raw(function($collection) use($params)
		{

			 return $collection->aggregate(array(
			 	array(
			 		'$match' => array(
			 			"blog_id" => $params["blogId"],
			 			"deleted_at" => null
			 			)
			 		),
			 	array('$project' => array( 
			 		'month' => array('$month' => '$created_at'),
			 		'year' => array('$year' => '$created_at')
			 	)),
			 	array(
			 		'$group' => array(
                	'_id' =>  array( 'month' => '$month', 'year' => '$year'),
                	'count' => array(
                    '$sum' => 1
                    )
                    )
			 	),
                array( '$sort' => array("_id" => 1))
                    )
			 	);
			});
		$childernArray = array();
		$monthName = array("Jan", "Feb", "Mar", "Apr", "May", "Jun",
		 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

		foreach ($archiveCounts["result"] as $record) {
			$year = (string) $record["_id"]["year"];
			$month = $record["_id"]["month"];
			$count = (String) $record["count"];

			if(!array_key_exists($year, $childernArray))
			{
				$childernArray[$year] = array();
			}

			array_push($childernArray[$year], 
				array("month" => $monthName[$month - 1], "count" => $count));
		}
		
		$archiveTree = array();

		foreach ($childernArray as $key => $value) {
			$children = array();
			$total = 0;
			foreach ($value as $child) {
				$total = $total + $child["count"];
				array_push($children, 
					array("label" => $child["month"]."(".$child["count"].")", 
						"data" => array_search($child["month"], $monthName)."-".$key));	
			}

			array_push($archiveTree,
			 array("label" => $key."(".$total.")", "children" =>  $children, "data" => $key));
		}
		return Response::json($archiveTree, 200);
	}
}
