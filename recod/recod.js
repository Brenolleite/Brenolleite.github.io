recodApp.controller('recodCtr',['$scope', '$http', 'graphs',
  function($scope, $http, graphs) {
    // server config
    server = 'localhost:8080';

    // Bars graph for users usage
    function users_usage(){
      $http.get('http://' + server + '/api/usersUsage?date_filter=2018-01-01')
      .success(function(response){
        graphs.updateGraph('horizontalBar',
                            ['teste', 'teste2'],
                            [{label: 'ALOU', data: [10, 5]},
                            {label: 'ALOU2', data: [10, 5]}]);
      });
    }

    $scope.selectGraph = function(graph){
      if(graph == 'usersUsage'){
        users_usage();
      }
    }
}]);
