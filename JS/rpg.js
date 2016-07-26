var app = angular.module('rpg', ['ui.mask', 'ngDialog']);

app.controller('rpgCtr',['$scope', '$window', 'ngDialog',
  function($scope, $window, ngDialog) {
  
  $scope.players = [];

  function showSwal(text, type, func){
    var title,
        cancelButton;

    switch (type) {
      case 'error':
        title = 'ERRO';
        break;
      case 'warning':
        title = 'ATENÇÃO';
        break;
      case 'confirmation':
        title = 'ATENÇÃO';
        type  = 'warning';
        cancelButton = true;
        break;
      default:
        title = 'Not that option DA';
        break;
    }

    swal({
      title: title,
      text: text,
      type: type,
      showCancelButton: cancelButton,
  		confirmButtonText: "OK",
  		cancelButtonText: "Cancelar",
      closeOnConfirm: true
    }, func);
  }

  $scope.newPlayer = function(){
    $scope.players.push({name: 'Novo Jogador', HP: 0});
  }

  $scope.editName = function(index){
    $scope.players[index].editName = true;
  }

  $scope.editUtility = function(index){
    $scope.players[index].editUtility = true;
  }

  $scope.leaveEdition = function(index){
		$scope.players[index].editName = false;
    $scope.players[index].editUtility = false;
  }

  $scope.enterAsTab = function(event, index){
		if(event.keyCode == 13)
			$scope.leaveEdition(index);
  }

  $scope.deletePlayer = function(index){
    showSwal('Deseja excluir o jogador (' + $scope.players[index].name +')?', 'confirmation', function(){
					 $scope.players.splice(index, 1);
					 $scope.$digest();
				 });
  }

  $scope.clearList = function() {
    showSwal('Deseja excluir todos os jogadores?', 'confirmation', function(){
           $scope.players = [];
           $scope.$digest();
         });
  }

  $scope.rollDice = function(){
    var x;

    for (x = 0; x < $scope.players.length; x++){
      $scope.players[x].dice = parseInt((Math.random() * 100) % 20) + 1;
    }
  }

  $scope.getTotal = function(index){
    var result = parseInt($scope.players[index].dice) + parseInt($scope.players[index].utility);
    return ((isNaN(result))? 0:result);
  }

  $scope.changeHP = function(index){
    $scope.selectedHP = index;
    ngDialog.open({
                    template:  'Layouts/rpgDialog.html',
                    className: 'ngdialog-theme-default',
                    scope:     $scope
                  });
  }

  $scope.saveHP = function(type, value, index){
    var HP = parseInt($scope.players[$scope.selectedHP].HP);
    value = parseInt(value);
    var total = (type)? HP + value: HP - value;

    $scope.players[$scope.selectedHP].HP = (total < 0)? 0: total;
    ngDialog.close();
  }


  $window.onunload = function(){
    if($scope.players.length > 0){
      localStorage.setItem('game', JSON.stringify($scope.players, function(key, value){
  			if(key === "$$hashKey")
  				return undefined;

  			return value;
  		}));
    }
    else
      localStorage.removeItem('game');

    return null;
  }

  backedTimer = localStorage.getItem('game');
  if(backedTimer != undefined){
    localStorage.removeItem('game');
		$scope.players = JSON.parse(backedTimer);
  }
}]);
