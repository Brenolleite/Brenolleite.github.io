recodApp.controller('recodCtr',['$scope', '$http', 'graphs', '$interval',
  function($scope, $http, graphs, $interval) {
    // server config
    server = 'localhost:8080';

    $scope.halt = false;

    function sanityCheck(){
      $http.get('http://' + server + '/api/sanityCheck').success(function(response){
        $scope.halt = !response[0].sanity_check;
        console.log(response[0].sanity_check)
      });
    }

    // Bars graph for users usage
    function users_usage(){
      $http.get('http://' + server + '/api/usersUsage?date_filter=2018-01-01')
      .success(function(response){
        labels = []
        idle = []
        used = []

        response.forEach(function(item){
          labels.push(item.username);
          idle.push((item.idle_time/60).toFixed(2));
          used.push((item.used_time/60).toFixed(2));
        });

        datasets = [
          {
            label: 'Used Time (h)',
            data: used,
            backgroundColor: 'rgba(0, 230, 0, 0.5)',
            borderColor: 'rgba(0, 128, 0, 0.5)',
            borderWidth: 2
          },
          {
            label: 'Idle Time (h)',
            data: idle,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(153, 0, 0, 0.5)',
            borderWidth: 2
          }
        ]

        graphs.updateGraph('horizontalBar', labels, datasets);
      });
    }

    // Graphs for dls usage control
    function dls_usage(){
      $http.get('http://' + server + '/api/dlsUsage?date_filter=2018-01-01')
      .success(function(response){
        labels = []
        idle_res = []
        idle_nres = []
        used_res = []
        used_nres = []

        response.forEach(function(item){
          labels.push(item.dl_name);
          idle_res.push((item.idle_res_time/60).toFixed(2));
          idle_nres.push((item.idle_nres_time/60).toFixed(2));
          used_res.push((item.used_res_time/60).toFixed(2));
          used_nres.push((item.used_nres_time/60).toFixed(2));
        });

        datasets = [
          {
            label: 'Used Time - Reserved (h)',
            data: used_res,
            backgroundColor: 'rgba(0, 230, 0, 0.5)',
            borderColor: 'rgba(0, 128, 0, 0.5)',
            borderWidth: 2
          },
          {
            label: 'Used Time - Not Reserved (h)',
            data: used_nres,
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            borderColor: 'rgba(179, 179, 0, 0.5)',
            borderWidth: 2
          },
          {
            label: 'Idle Time - Reserved (h)',
            data: idle_res,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(153, 0, 0, 0.5)',
            borderWidth: 2
          },
          {
            label: 'Idle Time - Not Reserved (h)',
            data: idle_nres,
            backgroundColor: 'rgba(255, 153, 51, 0.5)',
            borderColor: 'rgba(204, 102, 0, 0.5)',
            borderWidth: 2
          }
        ]

        graphs.updateGraph('bar', labels, datasets);
      });
    }

    $scope.selectGraph = function(graph){
      if(graph == 'usersUsage')
        users_usage();
      else if(graph == 'dlsUsage')
        dls_usage();
    }

    // Starting graph
    dls_usage()

    // Create sanity check for server icon warning 900000
    $interval(sanityCheck, 1000)
}]);
