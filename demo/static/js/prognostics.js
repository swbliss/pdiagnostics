var soChart;

function getModels() {
    $.ajax({
        url: 'pmodel_list',
        success: function(data) {
            names = JSON.parse(data);
            for (i in names) {
                $('#pmodel-select1').append('<option value="' + i + '">' + names[i] + '</option>');
                $('#pmodel-select2').append('<option value="' + i + '">' + names[i] + '</option>');
                $('#pmodel-select3').append('<option value="' + i + '">' + names[i] + '</option>');
            }
            $("#pmodel-select1").selectpicker("refresh");
            $("#pmodel-select2").selectpicker("refresh");
            $("#pmodel-select3").selectpicker("refresh");
        }
    });
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function checkInputGiven(includeBudget) {
    //var inputs = includeBudget ? $('input') : $('input').not('#budget');
    //console.log('test', inputs.length);
    //for (i in inputs) {
    //    console.log($(inputs[i]).val());
    //    if ($(inputs[i]).val().length == 0) {
    //        showNotification('top', 'right',
    //        "Fill in <b>all the blanks</b> required for item optimizer.", "warning")
    //        return false;
    //    }
    //}
    return true;
}

function itemOptimize() {
    if (!checkInputGiven(false)) {
        return;
    }

    $.ajax({
        url: 'itemoptimize',
        success: function(data) {
            renderIOInfo(JSON.parse(data))
        }
    });
}

function renderIOInfo(data) {
    var lcc_sum = 0;
    for (i in data) {
        let item = data[i]
        addRow('datatable', [1, '<img src="static/data/test/' + item[0] + '.jpg">', item[0],
            item[1], item[2], item[3], item[4]]);
        addRow('datatable2', [1, item[2], item[3]]);
        lcc_sum += parseInt(item[4]);
    }
    $('#summary-io').text(numberWithCommas(lcc_sum));
    $('#io-result').show();
}

function systemOptimize() {
    if (!checkInputGiven(false)) {
        return;
    }

    $.ajax({
        url: 'systemoptimize',
        success: function(data) {
            renderSOInfo(JSON.parse(data));
        }
    });
    $('#so-result').show();
}

function renderSOInfo(data) {
    $('#summary-so').text(numberWithCommas(parseInt(data[1])));

    var labels = []
    var budgets = []
    for (i in data[2]) {
        labels.push(i);
        budgets.push($('#budget').val());
    }
    soChart.data.datasets[0].data = data[2];
    soChart.data.datasets[1].data = budgets;
    soChart.data.labels = labels;
    soChart.options.scales.yAxes[0]['ticks']['suggestedMax'] = Math.max(...data[2]) + 5;
    soChart.options.scales.yAxes[0]['ticks']['suggestedMin'] = Math.min(...data[2]) - 100;
    soChart.update()
}

function addRow(tableid, data) {
    var t = $('#' + tableid).DataTable();
    t.row.add(data).draw(false);
}

function datatableInit() {
    var datatable = $('#datatable').DataTable( {
        searching: false,
        lengthChange: false,
        ordering: false,
        "pageLength": 5,
    });

    datatable.on( 'order.dt search.dt', function () {
        datatable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

    lccTableInit('datatable2');
    lccTableInit('datatable3');
}

function lccTableInit(tableid) {
    var datatable = $('#' + tableid).DataTable( {
        "scrollY": "180px",
        "scrollX": false,
        searching: false,
        lengthChange: false,
        paging: false,
        info: false,
        columnDefs: [
            { sortable: false, targets: 0 },
            { sortable: false, targets: 1 },
            { targets: 2 }
        ],
        order: [[ 2, 'desc' ]]
    });

    datatable.on( 'order.dt search.dt', function () {
        datatable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
}

let gradientChartOptionsConfigurationWithTooltipGreen =  {
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
       barPercentage: 1.6,
           gridLines: {
             drawBorder: false,
               color: 'rgba(29,140,248,0.0)',
               zeroLineColor: "transparent",
           },
           ticks: {
             suggestedMin: 50,
             suggestedMax: 125,
               padding: 20,
               fontColor: "#9e9e9e"
           }
         }],

     xAxes: [{
       barPercentage: 1.6,
           gridLines: {
             drawBorder: false,
               color: 'rgba(0,242,195,0.1)',
               zeroLineColor: "transparent",
           },
           ticks: {
               padding: 20,
               fontColor: "#9e9e9e"
           }
         }]
     }
};

function chartInit() {
    var ctxGreen = document.getElementById("chartLineGreen").getContext("2d");
    var gradientStroke = ctxGreen.createLinearGradient(0,230,0,50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: [],
      datasets: [{
        label: "optimized",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor:'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [],
      }, {
        label: "budget",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#fd5d93',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#fd5d93',
        pointBorderColor:'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#fd5d93',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        data: [],
      }]
    };

    soChart = new Chart(ctxGreen, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen

    });

}

function Init() {
    getModels();
    datatableInit();
    chartInit();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
