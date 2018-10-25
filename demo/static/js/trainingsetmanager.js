let dataPrefix = '/static/data/';
var trainingsets;
var labelChart;

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


function getTrainingset() {
    $.ajax({
        url: 'trainingset',
        success: function(data) {
            trainingsets = JSON.parse(data);
            names = Object.keys(trainingsets);
            for (i in names) {
                addRow('datatable', [1, names[i], trainingsets[names[i]].length])
            }
        }
    });
}

function addTableRow(target, name) {
    var meta = name.split('.')[0] + '.meta.txt';
    var tableid = (target=='ori' ? 'datatable' : 'datatable2');
    var imagePrefix = dataPrefix + 'image_' + target + '/';

    $.ajax({
        url: imagePrefix + meta,
        success: function(data) {
            oriImages.push({
                img: imagePrefix + name + '.jpg',
                name: name,
                state: data.trim()
            })

            let button = "<button type='button' rel='tooltip' \
                                 data-placement='top' title='' \
                                 class='btn btn-link btn-icon btn-sm btn-neutral' \
                                 onClick='" + (target=='ori' ? "onDelete(this)" : "onAdd(this)") +
                                 "'> <i class='tim-icons " +
                                 (target=='ori' ? 'icon-trash-simple' : 'icon-simple-add') +
                                 "'></i></button>"

            if (target == "ori") {
                addRow(tableid, [1, '<img src="' + imagePrefix + name + '.jpg">', name,
                    -1, -1, 2018-10-12, -1, data.trim(), button])
            } else {
                addRow(tableid, ['<img src="' + imagePrefix + name + '.jpg" style="height:30px">', name,
                    -1, -1, 2018-10-12, -1, data.trim(), button])
            }
        },
    });
}

function addRow(tableid, data) {
    var t = $('#' + tableid).DataTable();
    t.row.add(data).draw(false);
}

function initDatatable() {
   // DataTable
    var table = $('#datatable').DataTable( {
        "scrollY": "180px",
        searching: false,
        lengthChange: false,
        paging: false,
        info: false,
        columnDefs: [
            { sortable: false, targets: 0 },
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

    // row selection
    $('#datatable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            return;
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        changeSet($($(this).children()[1]).text());
    } );
}

function changeSet(name) {
    var trainingset = trainingsets[name];
    $('#summary-title').text(name);
    $('#summary-count').text(trainingset.length);

    var labelCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $.map(trainingset, function( val, i ) {
    	labelCounts[parseInt(val[5]) - 1] += 1;
    });
    labelChart.data.datasets[0].data = labelCounts;
    labelChart.options.scales.yAxes[0]['ticks']['suggestedMax'] = Math.max(...labelCounts) + 5;
    labelChart.update()
}


function trainingsetChart() {
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
          data: [ 53, 20, 10, 80, 100, 45, 112, 80, 20, 60],
        }]
      },
        options: gradientBarChartConfiguration
    });
}

function Init() {
    initDatatable();
    getTrainingset();
    trainingsetChart();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
