recodApp.controller('recodCtr',['$scope', 'graphs',
  function($scope, graphs) {
    graphs.updateGraph('bar', ['teste', 'teste2'], [{label: 'ALOU', data: [10, 5]}])
}]);
