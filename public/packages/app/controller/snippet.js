$scope.startDate = new Date(59859000);
		$scope.endDate = new Date();
		$scope.setPeriod = function(startDate, endDate)
		{
			$scope.startDate = new Date(startDate);
			$scope.endDate = new Date(endDate);
		}

		$scope.withinPeriod = function(post){
			var publishedAt = new Date(post.publishedAt);
			if(publishedAt.getTime() > $scope.startDate.getTime() 
				&& publishedAt.getTime() < $scope.endDate.getTime() )
			{
				return true;
			}else{
				return false;
			}
		}