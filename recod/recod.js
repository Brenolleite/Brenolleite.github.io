recodApp.controller('recodCtr',['$scope', '$http', 'graphs',
  function($scope, $http, graphs) {
    // server config
    server = 'localhost:8080';

    // Bars graph for users usage
    function users_usage(){
      $http.get('http://' + server + '/api/usersUsage?date_filter=2018-01-01')
      .success(function(response){
        labels = []
        idle = []
        used = []

        response.forEach(function(item){
          labels.push(item.username);
          idle.push(item.idle_time/60);
          used.push(item.used_time/60);
        });

        datasets = [
          {
            label: 'Used Time (h)',
            data: used,
            backgroundColor: 'rgba(0, 230, 0, 0.7)',
            borderColor: 'rgba(0, 128, 0, 0.7)',
            borderWidth: 2
          },
          {
            label: 'Idle Time (h)',
            data: idle,
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            borderColor: 'rgba(153, 0, 0, 0.7)',
            borderWidth: 2
          }
        ]

        graphs.updateGraph('horizontalBar', labels, datasets);
      });
    }

    $scope.selectGraph = function(graph){
      if(graph == 'usersUsage'){
        users_usage();
      }
    }

    users_usage()
}]);
