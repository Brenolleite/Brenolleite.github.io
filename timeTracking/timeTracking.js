var app = angular.module('timeTracking', ['ui.mask', 'ngDialog']);

app.controller('timeTrackingCtr',['$scope', '$interval', '$window', '$timeout', 'ngDialog',
  function($scope, $interval, $window, $timeout, ngDialog) {
  var timer, selectedTimer = -1, editing = false;

  $scope.timers = [];

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

	$scope.start = function(){
		if(timer == undefined)
			timer = $interval(ticking, 1000);
  }

  $scope.pause = function(){
		$interval.cancel(timer);
		timer = undefined;
		selectedTimer = -1;
  }

  $scope.newTimer = function(){
		$scope.timers.push({time: 0,
												description: '',
												editDesc   : false,
                        editTimer  : false,
                        editedTime : undefined});
		selectedTimer = $scope.timers.length - 1;
		if(timer == undefined)
			$scope.start();

		$scope.editDescription(selectedTimer);
  }

  $scope.selectTimer = function(index){
		if(timer == undefined)
			$scope.start();

		if(selectedTimer == index)
			$scope.pause();
		else
			selectedTimer = index;
  }

  $scope.editDescription = function(index){
		editing = true;
		$scope.timers[index].editDesc = true;
		$timeout(function(){
			var element = document.getElementById('desc' + index);
      if(element)
				element.focus();
		}, 10);
  }

  $scope.editTimer = function(index){
    $scope.timers[index].editedTime = $scope.displayTime($scope.timers[index].time);
    editing = true;
		$scope.timers[index].editTimer = true;
		$timeout(function(){
			var element = document.getElementById('timer' + index);
      if(element)
				element.focus();
		}, 10);
  }

  $scope.saveTimer = function(index){
     var editing = false,
         error   = true,
         msg,
         time;

     $scope.timers[index].editTimer = false;

     if($scope.timers[index].editedTime == undefined
        || $scope.timers[index].editedTime == '000000'
        || $scope.timers[index].editedTime.length != 6)
       msg   = "Tempo incorreto!";
     else{
       time = $scope.timers[index].editedTime.match(/\d{1,2}/g);

       if(parseInt(time[1]) >= 60 || parseInt(time[2]) >= 60)
         msg   = "Tempo incorreto!";
       else
         error = false;
     }

     if(error){
       showSwal(msg, 'error');
       return;
     }

     showSwal('Tem certeza que deseja alterar o contador para ' + time[0] + ':' + time[1] + ':' + time[2] +  '? ', 'confirmation', function(){
       $scope.timers[index].time = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
       $scope.$digest();

 	  });
  }

  $scope.transferTimer = function(index){
    $scope.transferTo   = undefined;
    $scope.transferFrom = index;
    $scope.transferTime = undefined;

    ngDialog.open({
                    template:  'timeTrackingDialog.html',
                    className: 'ngdialog-theme-default',
                    scope:     $scope
                  });
  }

  $scope.selectToTransfer = function(index){
    $scope.transferTo = index;
  }

  $scope.transfer = function(transferTime){
    var error = true,
        msg,
        time;

    if($scope.transferTo == undefined)
      msg = "Contador para transferência não selecionado!"
    else if(transferTime == undefined || transferTime == '000000' || transferTime.length != 4)
      msg = "Tempo incorreto!";
    else{
      time = transferTime.match(/\d{1,2}/g);

      if(parseInt(time[1]) >= 60 || parseInt(time[2]) >= 60)
        msg   = "Tempo incorreto!";
      else if(parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 > $scope.timers[$scope.transferFrom].time)
        msg = "Contador não possuí tempo suficiente!";
      else
        error = false;
    }

    if(error){
      showSwal(msg, 'error');
      return;
    }

    showSwal('Tem certeza que deseja transferir o tempo?', 'confirmation', function(){
     $scope.timers[$scope.transferFrom].time =  $scope.timers[$scope.transferFrom].time - (parseInt(time[0]) * 3600 + parseInt(time[1]) * 60);
     $scope.timers[$scope.transferTo].time =  $scope.timers[$scope.transferTo].time + parseInt(time[0]) * 3600 + parseInt(time[1]) * 60;;
     $scope.$digest();

     ngDialog.close();
	  });


}

  $scope.leaveEdition = function(index){
		editing = false;
		$scope.timers[index].editDesc = false;
    $scope.timers[index].editTimer = false;
  }

  $scope.enterAsTab = function(event, index){
		if(event.keyCode == 13 && editing){
      if($scope.timers[index].editTimer)
        $scope.saveTimer(index);

			$scope.leaveEdition(index);
    }
  }

  $scope.deleteTimer = function(index){
    showSwal('Deseja excluir contador?', 'confirmation', function(){
					 if(index == selectedTimer){
						 $scope.pause();
						 selectedTimer -= 1;
					 }

					 $scope.timers.splice(index, 1);
					 $scope.$digest();
				 });
  }

  $scope.keyPress = function(event){
		if(editing)
			return;
		if((event.keyCode == 87 && event.shiftKey) || event.keyCode == 110)
			$scope.newTimer();
		else if(event.keyCode == 112 && timer != undefined){
			$scope.pause();
			$scope.$digest();
		}
		else if(event.keyCode == 100 && selectedTimer != -1)
			$scope.deleteTimer(selectedTimer);
  }

  $scope.displayTime = function(time){
		var minutes, seconds, hours;

		hours = parseInt(time/3600);
		if(hours < 10)
			hours = '0' + hours;

		minutes = parseInt((time%3600)/60);
		if(minutes < 10)
			minutes = '0' + minutes;

		seconds =  parseInt((time%3600)%60);
		if(seconds < 10)
			seconds = '0' + seconds

		return hours + ':' + minutes  + ':' + seconds;
  }

  $scope.clearList = function() {
    showSwal('Deseja limpar toda a lista?', 'confirmation', function(){
					 $scope.pause();
					 selectedTimer -= 1;
					 $scope.timers = [];
					 $scope.$digest();
				 });
  }

  var ticking = function(){
    var date = new Date();
    if ((date.getHours() === 18 && date.getMinutes() === 0) || (date.getHours() === 12 && date.getMinutes() === 0)) {
      $scope.pause();
      swal({
			     title: "Horário de descanso!",
			     text: "O seu contador foi parado automaticamente!",
			     type: "warning"
          });

      return;
    }

		$scope.timers[selectedTimer].time += 1;
  }

  $scope.$on('$destroy', function() {
    $scope.pause();
  });

  $scope.defineClass = function(type, index){
		if(type == 'i'){
			if(index == selectedTimer)
				return 'fa fa-clock-o fa-pulse icon-green';

			return 'fa fa-clock-o';
		}
		else if(type == 'tr'){
			if(index == selectedTimer)
				return 'active-row';

			return '';
		}
    else if(type == 'trDialog'){
			if(index == $scope.transferTo)
				return 'active-row-purple';

			return '';
		}
  }

  $window.onunload = function(){
    if($scope.timers.length > 0){
      localStorage.setItem('Timer', JSON.stringify($scope.timers, function(key, value){
  			if(key === "$$hashKey")
  				return undefined;

  			return value;
  		}));
    }
    else
      localStorage.removeItem('Timer');

    return null;
  }

  backedTimer = localStorage.getItem('Timer');
  if(backedTimer != undefined){
    localStorage.removeItem('Timer');
		$scope.timers = JSON.parse(backedTimer);
  }
}]);
