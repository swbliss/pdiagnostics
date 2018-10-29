function initImagemanager() {
    var datatable = $('#datatable').DataTable( {
        searching: false,
        lengthChange: false,
        ordering: false,
        paging: false,
        info: false,
    });

    var tableData = [
        ['<img src="/static/data/image_ori/20171015-DJI-P4P-GSPro-Test-01_C_08.jpg">', "20171015-DJI-P4P-GSPro-Test-01_C_08", "01", "C", "DJI-P4P-GSPro", "20171015", "10"],
        ['<img src="/static/data/image_ori/20171015-DJI-P4P-GSPro-Test-01_E_05.jpg">', "20171015-DJI-P4P-GSPro-Test-01_E_05", "01", "E", "DJI-P4P-GSPro", "20171015", "7"],
        ['<img src="/static/data/image_ori/20171015-DJI-P4P-GSPro-Test-01_I_11.jpg">', "20171015-DJI-P4P-GSPro-Test-01_I_11", "01", "I", "DJI-P4P-GSPro", "20171015", "1"],
    ];

    for (i in tableData) {
        datatable.row.add(tableData[i]).draw();
    }
}

function initTrainingsetManager() {
    var gradientBarChartConfiguration =  {
      maintainAspectRatio: false,
      legend: {
            display: false
       },

       tooltips: {
         backgroundColor: '#f5f5f5',
         titleFontColor: '#333',
         bodyFontColor: '#666',
         bodySpacing: 4,
         xPadding: 12,
         mode: "nearest",
         intersect: 0,
         position: "nearest"
       },
       responsive: true,
       scales:{
         yAxes: [{

               gridLines: {
                 drawBorder: false,
                   color: 'rgba(29,140,248,0.1)',
                   zeroLineColor: "transparent",
               },
               ticks: {
                   suggestedMin: 60,
                   suggestedMax: 120,
                   padding: 20,
                   fontColor: "#9e9e9e"
               }
             }],

         xAxes: [{

               gridLines: {
                 drawBorder: false,
                   color: 'rgba(29,140,248,0.1)',
                   zeroLineColor: "transparent",
               },
               ticks: {
                   padding: 20,
                   fontColor: "#9e9e9e"
               }
             }]
         }
    };

    var ctx = document.getElementById("label-chart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0,230,0,50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    labelChart = new Chart(ctx, {
      type: 'bar',
      responsive: true,
      legend: {
            display: false
      },
      data: {
        labels: ['STATE 1', 'STATE 2', 'STATE 3', 'STATE 4', 'STATE 5',
            'STATE 6', 'STATE 7', 'STATE 8', 'STATE 9', 'STATE 10'],
        datasets: [{
          label: "Countries",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }]
      },
        options: gradientBarChartConfiguration
    });
}

function Init() {
    initImagemanager();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
