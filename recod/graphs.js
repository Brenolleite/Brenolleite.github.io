var recodApp = angular.module('recod', ['ui.mask', 'ngDialog']);

recodApp.factory('graphs', function graphs() {
    var factory = {};

    var ctx = document.getElementById("chart");

    factory.updateGraph = function(ptype, plabels, pdatasets){
        var myChart = new Chart(ctx, {
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
                }
            }
        });
    }

    return factory;
});
