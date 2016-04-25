var app = angular.module('timeTracking', ['ngCookies']);

app.controller('timeTrackingCtr',['$scope', '$interval', '$window', '$timeout', '$cookies', function($scope, $interval, $window, $timeout, $cookies) {
    var timer, selectedTimer = -1;
    
    $scope.timers = [];
    
    $scope.start = function(){
	if(timer == undefined)
	    timer = $interval(ticking, 1000);
    }
    
    $scope.pause = function(){
	$interval.cancel(timer);
	timer = undefined;
	selectTimer = -1;
    }
    
    $scope.newTimer = function(){	
	$scope.timers.push({time: 0,
			    description: '',
			    edit: false});
	selectedTimer = $scope.timers.length - 1;
	if(timer == undefined)
	    $scope.start();
	
	$scope.editDescription(selectedTimer);	    
    }
    
    $scope.selectTimer = function(index){
	if(timer == undefined)
	    $scope.start();

	if(selectedTimer == index){
	    $scope.pause();
	    selectedTimer = -1;
	}
	else
	    selectedTimer = index;    
    }

    $scope.editDescription = function(index){
	$scope.timers[index].edit = true;
	$timeout(function(){
	    var element = document.getElementById('desc' + index);
            if(element)
		element.focus();
	}, 10);
    }

    $scope.leaveEdition = function(index){
	$scope.timers[index].edit = false;
    }

    $scope.deleteTimer = function(index){
	swal({
	    title: "Are you sure?",
	    text: "Your will not be able to recover this timer!",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#DD6B55",
	    confirmButtonText: "Yes, delete it!",
	    closeOnConfirm: true}, 
	    function(){ 
		if(index == selectedTimer)
		    $scope.pause();
		
		if(index < selectedTimer)
		    selectedTimer -= 1;
		
		$scope.timers.splice(index, 1);
	    });	
    }
    
    $scope.keyPress = function(event){
	if(event.keyCode == 87 && event.shiftKey == true)
	    $scope.newTimer();
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
    
    var ticking = function(){
	$scope.timers[selectedTimer].time += 1;
    }
    
    $scope.$on('$destroy', function() {
        $scope.pause();
    });
    
    $scope.defineClass = function(index){
	if(index == selectedTimer)
	    return 'fa fa-clock-o fa-pulse icon-green'
	
	return 'fa fa-clock-o'
    }
    
    
    $window.onbeforeunload = function () {
	return 'Time Tracking, are you sure?';
    }
    

    var cookiesInterval = $interval(function(){
	$cookies.put('Timer', JSON.stringify($scope.timers));
    },300000) 
    
    cookieTimer = $cookies.get('Timer');
    if(cookieTimer != undefined){
	swal({
	    title: "Load timers?",
	    text: "",
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#DD6B55",
	    confirmButtonText: "Yes, load it!",
	    cancelButtonText: "No, don't load it!",
	    closeOnConfirm: true,
	    closeOnCancel: true }, 
	     function(isConfirm){ 
		 if (isConfirm) {
		     $scope.timers = JSON.parse(cookieTimer);
		 } else {
		     $cookies.remove('Timer');
		     $scope.newTimer();
		     $scope.start();
		 }
	     });
    }
    else{
	$scope.newTimer();
	$scope.start();
    }
}]);
