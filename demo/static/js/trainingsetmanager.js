
function initDatatable() {
   // DataTable
    var table = $('#datatable').DataTable( {
        searching: false,
        lengthChange: false,
        paging: false,
        info: false,
        columnDefs: [
            { sortable: false, "class": "index", targets: 0 },
            { sortable: false, targets: 1 },
            { sortable: false, targets: 2 }
        ]
    } );

    // indexing
    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

    // DataTable2 (modal)
    // $('#datatable2').DataTable( {
    //     "scrollY": "300px",
    //     "scrollX": false,
    //     searching: false,
    //     lengthChange: false,
    //     ordering: false,
    //     "pageLength": 5,
    // });
}

function trainingsetChart() {
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


    var ctx = document.getElementById("CountryChart").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0,230,0,50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


    var myChart = new Chart(ctx, {
      type: 'bar',
      responsive: true,
      legend: {
            display: false
      },
      data: {
        labels: ['USA','GER','AUS','UK','RO','BR', 'KR', 'JP', 'CA', 'ID'],
        datasets: [{
          label: "Countries",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [ 53, 20, 10, 80, 100, 45, 112, 80, 20, 60],
        }]
      },
        options: gradientBarChartConfiguration
    });
}

function Init() {
    trainingsetChart();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
