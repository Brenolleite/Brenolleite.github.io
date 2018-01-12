recodApp.controller('recodCtr',['$scope', '$http', 'graphs', '$interval',
  function($scope, $http, graphs, $interval) {
    // server config
    var server = 'serverdojesus.duckdns.org:6664';
    var request = ''
    $scope.halt = false;

    // Roughly verify date
    function isDate(date){
      var re = new RegExp('[0-9]{2}/[0-2][0-9]/[0-9]{4}');
      return re.test(date);
    }

    function applyFilters(){
      // Verify filterss
      if(isDate($scope.date_filter1) && isDate($scope.date_filter2)){
        params = '?date_filter1=' + $scope.date_filter1 +
                 '&date_filter2=' + $scope.date_filter2;

        // Call last request with new filters
        if(request == 'usersUsage')
          users_usage(params)
        else
          dls_usage(params)
      }
    }

    function sanityCheck(){
      $http.get('http://' + server + '/api/sanityCheck').success(function(response){
        $scope.halt = !response[0].sanity_check;
      });
    }

    // Bars graph for users usage
    function users_usage(params){
      // Blank string intead undefined on params
      if(params == undefined)
        params = ''

      // Store last request for filters
      request = 'usersUsage'

      $http.get('http://' + server + '/api/usersUsage' + params)
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
    function dls_usage(params){
      // Blank string intead undefined on params
      if(params == undefined)
      params = ''

      // Store last request for filters
      request = 'dlsUsage'

      $http.get('http://' + server + '/api/dlsUsage')
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

    // Execute first sanity check
    sanityCheck();

    // Starting graph
    dls_usage();

    // Create sanity check for server icon warning 900000
    $interval(sanityCheck, 900000);

    // Active watches on filters
    $scope.$watch('date_filter1', applyFilters);
    $scope.$watch('date_filter2', applyFilters);
}]);