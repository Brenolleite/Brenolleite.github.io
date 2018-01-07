var recodApp = angular.module('recod', ['ui.mask', 'ngDialog']);

recodApp.factory('graphs', function graphs() {
    var factory = {};

    var ctx = document.getElementById("chart");
    var myChart;

    factory.updateGraph = function(ptype, plabels, pdatasets){
        if(myChart)
            myChart.destroy();

        myChart = new Chart(ctx, {
            type: ptype,
            data: {
                labels: plabels,
                datasets: pdatasets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },
                responsive: true,
                responsiveAnimationDuration: 1500
            }
        });
    }

    return factory;
});
