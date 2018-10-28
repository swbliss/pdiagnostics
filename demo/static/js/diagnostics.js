let dataPrefix = '/static/data/';
var trainingsets;

function initTrainingsetList() {
    $.ajax({
        url: 'trainingset_list',
        success: function(data) {
            names = JSON.parse(data);
            for (i in names) {
                $('#trainingset-list').append(
                    '<option value="' + i + '">' + names[i] + '</option>'
                );
            }
            $("#trainingset-list").selectpicker("refresh");
        }
    });

    $('#trainingset-list').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        $('#run-training').removeClass('disabled');
        $('#start-eval').addClass('disabled');

        $('.eval').remove();
        $('#result-placeholder').show();
    });
}

function runTraining() {
    var currentTrainingset = $('.filter-option').text();
    showNotification('bottom', 'right',
    "<b>Training</b> with <b>" + currentTrainingset + "</b> set is started. Please, wait a moment until training is finshed.")

    setTimeout(function() {
        $.ajax({
            url: 'train?set=' + currentTrainingset,
            success: function(data) {
                showNotification('bottom', 'right',
                "<b>Training Done</b>. You can start the evaluation.")
                $('#start-eval').removeClass('disabled');
            }
        });
    }, 1500);
}

function startEval() {
    $('#result-placeholder').hide();
    $.ajax({
        url: 'eval',
        success: function(data) {
            var result = JSON.parse(data);
            var imgs = Object.keys(result);
            for (i in imgs) {
                console.log("debug: " + i);
                setTimeout(addCards, 400*i, result, imgs, i);
            }
        }
    });
}

function addCards(result, imgs, i) {
    $('#eval-result').append(evalResultCard(imgs[i], result[imgs[i]]));
    if (i == imgs.length - 1) {
        showNotification('bottom', 'right',
            "<b>Evaluation Done</b>.")
    }
}

function evalResultCard(name, pred) {
    var level;
    if (pred <= 3) {
        level = "danger";
    } else if (pred >= 4 && pred <= 7){
        level = "warn";
    } else {
        level = "safe";
    }

	return '<div class="eval col-lg-3 col-md-6 animated fadeIn">\
	  <div class="card card-pricing card-warning card-white">\
	    <div class="card-body">\
	      <h1 class="card-title">' + level + '</h1>\
	      <ul class="list-group">\
	        <li class="list-group-item">200 messages</li>\
	        <li class="list-group-item">130 emails</li>\
	        <li class="list-group-item">24/7 Support</li>\
	      </ul>\
		  <img src="static/data/test/' + name + '.jpg">\
	      <div class="card-prices">\
	        <h3 class="text-on-front">\
	          <span>STATE</span> ' + pred + '</h3>\
	        <h5 class="text-on-back">' + pred + '</h5>\
	        <p class="plan">' + name + '</p>\
	      </div>\
	    </div>\
	  </div>\
	</div>';
}

function fillTrainingImages(name) {
    $('#datatable2').DataTable().clear().draw();

    examples = trainingsets[name];
    if (examples.length == 0) {
        return;
    }

    let button = "<button type='button' rel='tooltip' \
                    data-placement='top' title='' \
                    class='btn btn-link btn-icon btn-sm btn-neutral' \
                    onClick='onDelete'> <i class='tim-icons icon-trash-simple'></i></button>";

    for (i in examples) {
        let ex = examples[i];
        addRow("datatable2", [1, '<img src="static/data/training/' + name + '/' + ex[0] + '.jpg">',
            ex[0], ex[1], ex[2], ex[3], ex[4], ex[5], button]);
    }
}


function initDatatable() {
    // Trainingset List
    var datatable = $('#datatable').DataTable( {
        "scrollY": "180px",
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
    } );

    //// indexing
    datatable.on( 'order.dt search.dt', function () {
        datatable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
        // table.$('tr.selected').removeClass('selected');
        // $($('#datatable tbody').children()[0]).addClass('selected');
        // changeSet($($('#datatable tbody').children()[0]).text());
    } ).draw();

    //// row selection
    $('#datatable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            return;
        } else {
           datatable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        changeSet($($(this).children()[1]).text());
    } );

    // example list
    var datatable2 = $('#datatable2').DataTable( {
        searching: false,
        lengthChange: false,
        columnDefs: [
            { sortable: false, "class": "index", targets: 0 },
            { sortable: false, targets: 1 },
            { sortable: false, targets: -1 }
        ],
        order: [[ 2, 'asc' ]],
        "pageLength": 5
    } );

    datatable2.on( 'order.dt search.dt', function () {
        datatable2.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

}

function changeSet(name) {
    var trainingset = trainingsets[name];
    $('#summary-title').text(name);
    $('#summary-count').text(trainingset.length);

    // update chart
    var labelCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $.map(trainingset, function( val, i ) {
    	labelCounts[parseInt(val[5]) - 1] += 1;
    });
    labelChart.data.datasets[0].data = labelCounts;
    labelChart.options.scales.yAxes[0]['ticks']['suggestedMax'] = Math.max(...labelCounts) + 5;
    labelChart.update()

    // update table
    fillTrainingImages(name);
}


function initTrainingsetChart() {
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
    initTrainingsetList();

    // initDatatable();
    // initTrainingsetChart();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
