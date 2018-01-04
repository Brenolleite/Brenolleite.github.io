recodApp.factory('graphs', function graph(ptype, plabels, pdata) {
    var ctx = document.getElementById("chart");

    var myChart = new Chart(ctx, {
        type: ptype,
        data: {
            labels: plabels,
            datasets: [{
                label: '# of Votes',
                data: pdata,
            }]
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
});
