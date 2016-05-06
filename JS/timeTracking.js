var app = angular.module('timeTracking', ['ngCookies']);

app.controller('timeTrackingCtr',['$scope', '$interval', '$window', '$timeout', '$cookies', function($scope, $interval, $window, $timeout, $cookies) {
  var timer, selectedTimer = -1, editing = false;

  $scope.timers = [];
  
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
												editDesc: false,
                        editTimer: false});
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
    editing = true;
		$scope.timers[index].editTimer = true;
		$timeout(function(){
			var element = document.getElementById('timer' + index);
      if(element)
				element.focus();
		}, 10);
  }

  $scope.leaveEdition = function(index){
		editing = false;
		$scope.timers[index].editDesc = false;
    $scope.timers[index].editTimer = false;
  }

  $scope.enterAsTab = function(event, index){
		if(event.keyCode == 13 && editing)
			$scope.leaveEdition(index);
  }

  $scope.deleteTimer = function(index){
		swal({
			title: "Deseja excluir contador?",
			text: "Não será possível reverter essa operação!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Sim!",
			cancelButtonText: "Cancelar",
			closeOnConfirm: true}, 
				 function(){ 
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
		swal({
			title: "Deseja limpar toda a lista?",
			text: "Não será possível reverter essa operação!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Sim",
			cancelButtonText: "Cancelar",
			closeOnConfirm: true}, 
				 function(){ 
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
			type: "warning"});
      
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
  }
  
  
  $window.onbeforeunload = function() {
    $cookies.remove('Timer');

		if($scope.timers.length > 0)
			backUp();

    return null;
  }
  
  $window.onunload = function() {
	  var status = $cookies.get('Timer');
    while(status == undefined)
      status = $cookies.get('Timer');
  }
    
  var backUp = function(saved){
    $cookies.put('Timer', JSON.stringify($scope.timers, function(key, value){
			if(key === "$$hashKey")
				return undefined;			

			return value;
		}));
  }
  
  cookieTimer = $cookies.get('Timer');
  if(cookieTimer != undefined){
		$scope.timers = JSON.parse(cookieTimer);
  }
  
  $scope.time = 0;
}]);
