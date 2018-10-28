let dataPrefix = '/static/data/';
var trainingsets;
var examples;
var labelChart;

let addButton = "<button type='button' rel='tooltip' \
                data-placement='top' title='' \
                class='btn btn-link btn-icon btn-sm btn-neutral' \
                onClick='imgAdd(this)'> <i class='tim-icons \
                icon-simple-add'></i></button>";

let deleteButton = "<button type='button' rel='tooltip' \
                data-placement='top' title='' \
                class='btn btn-link btn-icon btn-sm btn-neutral' \
                onClick='imgDelete(this)'> <i class='tim-icons icon-trash-simple'></i></button>";
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

function getExamples() {
    $.ajax({
        url: 'examples',
        success: function(data) {
            examples = JSON.parse(data);
        }
    });
}

function getNewExamples(name) {
    var imagePrefix = 'static/data/image_ori/';
    $('#datatable3').DataTable().clear().draw();

    var trainingset = trainingsets[name];
    var includedExamples = trainingset.map(set => set[0]);

    for (i in examples) {
        if ($.inArray(examples[i][0], includedExamples) != -1) {
            continue;
        }
        var e = examples[i];
        addRow('datatable3', ['<img src="' + imagePrefix + e[0] + '.jpg" style="height:30px">', e[0],
            e[1], e[2], e[3], e[4], e[5], addButton]);
    }
}


// function addRowWithName(target, name) {
//     var meta = name + '.meta.txt';
//
//     $.ajax({
//         url: imagePrefix + meta,
//         success: function(data) {
//             var m = data.trim().split(',');
//
//             let button = "<button type='button' rel='tooltip' \
//                             data-placement='top' title='' \
//                             class='btn btn-link btn-icon btn-sm btn-neutral' \
//                             onClick='imgAdd'> <i class='tim-icons \
//                             icon-simple-add'></i></button>";
//
//             addRow(target, ['<img src="' + imagePrefix + name + '.jpg" style="height:30px">', name,
//                 m[0], m[1], m[2], m[3], m[4], button])
//         },
//     });
// }


function addRow(tableid, data) {
    var t = $('#' + tableid).DataTable();
    t.row.add(data).draw(false);
}

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

function fillTrainingImages(name) {
    $('#datatable2').DataTable().clear().draw();

    includedExamples = trainingsets[name];
    if (includedExamples.length == 0) {
        return;
    }

    for (i in includedExamples) {
        let ex = includedExamples[i];
        addRow("datatable2", [1, '<img src="static/data/training/' + name + '/' + ex[0] + '.jpg">',
            ex[0], ex[1], ex[2], ex[3], ex[4], ex[5], deleteButton]);
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

    $('#addImageButton').on('click', function() {
        getNewExamples($($('#datatable').find('tr.selected').children()[1]).text());
    });

    // Modal Table
    var datatable3 = $('#datatable3').DataTable( {
        "scrollY": "300px",
        "scrollX": false,
        searching: false,
        lengthChange: false,
        ordering: false,
        "pageLength": 5,
    });

    // indexing
    // datatable3.on( 'order.dt search.dt', function () {
    //     datatable3.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
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

function createModalInit() {
    $('#createModal').on('hidden.bs.modal', function () {
        $('#createModalInput').val('');
    });
    $('#createModalButton').on('click', function () {
        var name = $('#createModalInput').val().trim();
        $.ajax({
            url: 'create_set?name=' + name,
            success: function(data) {
                showNotification('bottom', 'right',
                "Training set <b>" + name + "</b> has been created.");
            }
        });

        if (name in Object.keys(trainingsets)) {
            showNotification('top', 'right',
            "Training set having the same name aleary exits.", "warning")
            return;
        }

        trainingsets[name] = [];

        addRow('datatable', [1, name, trainingsets[name].length]);
        // Scroll to the bottom
        var $scrollBody = $($('#datatable').DataTable().table().node()).parent();
        $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);

        var tmp = $('#datatable').find('tr');
        $('#datatable').find('tr.selected').removeClass('selected');
        $(tmp[tmp.length -1]).addClass('selected');

        changeSet(name);
    });
}

function addTableRow(target, name) {
    var meta = name + '.meta.txt';
    var imagePrefix = 'static/data/image_ori/';

    $.ajax({
        url: imagePrefix + meta,
        success: function(data) {
            var m = data.trim().split(',')

            let button = "<button type='button' rel='tooltip' \
                            data-placement='top' title='' \
                            class='btn btn-link btn-icon btn-sm btn-neutral' \
                            onClick='" + (target=='ori' ? "onDelete(this)" : "imgAdd(this)") +
                            "'> <i class='tim-icons " +
                            (target=='datatable2' ? 'icon-trash-simple' : 'icon-simple-add') +
                            "'></i></button>"

            addRow(target, [1, '<img src="' + imagePrefix + name + '.jpg">', name,
                m[0], m[1], m[2], m[3], m[4], button]);
        }
    });
}

function imgDelete(button) {
    var table = $('#datatable2').DataTable();
    table.row($(button).parent().parent()).remove().draw( false );

    var trainingset = $($('#datatable').find('tr.selected').children()[1]).text();
    var filename = $(button).parent().parent().children()[2].textContent;

    for (i in trainingsets[trainingset]) {
        if (trainingsets[trainingset][i][0] == filename) {
            trainingsets[trainingset].splice(i, 1);
        }
    }

    $.ajax({
        url: "/set_delete_img?set=" + trainingset + '&' + 'name=' + filename,
        success: function(data) {
            showNotification('bottom', 'right',
            "<b>Image</b> " + filename + " is safely deleted.");

            var dt = $('#datatable').DataTable();
            var temp = dt.row($('#datatable').find('tr.selected')).data();
            temp[2] = trainingsets[trainingset].length;
            dt.row($('#datatable').find('tr.selected')).data(temp);
            changeSet(trainingset);
        }
    });
}

function imgAdd(button) {
    var table = $('#datatable3').DataTable();
    var trainingset = $($('#datatable').find('tr.selected').children()[1]).text();
    var filename = $(button).parent().parent().children()[1].textContent;

    table.row($(button).parent().parent()).remove().draw( false );
    // TODO: datasets에 새로 추가되는 애 넣어주기
    var e = examples[$.inArray(filename, examples.map(e=>e[0]))];
    trainingsets[trainingset].push(e);

    $.ajax({
        url: "/set_add_img?set=/" + trainingset + '&' + 'name=' + filename,
        success: function(data) {
            showNotification('bottom', 'right',
            "<b>Image</b> " + filename + " is safely added.");

            var dt = $('#datatable').DataTable();
            var temp = dt.row($('#datatable').find('tr.selected')).data();
            temp[2] = trainingsets[trainingset].length;
            dt.row($('#datatable').find('tr.selected')).data(temp);
            changeSet(trainingset);
        }
    });
}


function Init() {
    getTrainingset();
    createModalInit();
    getExamples();

    initDatatable();
    initTrainingsetChart();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
