let dataPrefix = '/static/data/';

function getImage(target) {
    $.ajax({
        url: dataPrefix + "image_" + target + "/list.txt",
        success: function(data) {
            var names = data.trim().split('\n');
            var tableid = (target=='ori' ? 'datatable' : 'datatable2');
            for (i in names) {
                addTableRow(target, names[i]);
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
            var m = data.trim().split(',')

            let button = "<button type='button' rel='tooltip' \
                            data-placement='top' title='' \
                            class='btn btn-link btn-icon btn-sm btn-neutral' \
                            onClick='" + (target=='ori' ? "onDelete(this)" : "onAdd(this)") +
                            "'> <i class='tim-icons " +
                            (target=='ori' ? 'icon-trash-simple' : 'icon-simple-add') +
                            "'></i></button>"

            if (target == "ori") {
                addRow(tableid, [1, '<img src="' + imagePrefix + name + '.jpg">', name,
                    m[0], m[1], m[2], m[3], m[4], button])
            } else {
                addRow(tableid, ['<img src="' + imagePrefix + name + '.jpg" style="height:30px">', name,
                    m[0], m[1], m[2], m[3], m[4], button])
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
        searching: false,
        lengthChange: false,
        columnDefs: [
            { sortable: false, "class": "index", targets: 0 },
            { sortable: false, targets: 1 },
            { sortable: false, targets: -1 }
        ],
        order: [[ 2, 'asc' ]]
    } );

    // indexing
    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();

    // DataTable2 (modal)
    $('#datatable2').DataTable( {
        "scrollY": "300px",
        "scrollX": false,
        searching: false,
        lengthChange: false,
        ordering: false,
        "pageLength": 5,
    });
}

function onDelete(button) {
    var table = $('#datatable').DataTable();
    table.row($(button).parent().parent()).remove().draw( false );

    $.ajax({
        url: "/delete_img/" + $(button).parent().parent().children()[2].textContent,
        success: function(data) {
            showNotification('bottom', 'right',
            "<b>Image</b> " + $(button).parent().parent().children()[2].textContent + " is safely deleted.")
            addTableRow('new', $(button).parent().parent().children()[2].textContent);
        }
    });
}

function onAdd(button) {
    var table = $('#datatable2').DataTable();
    table.row($(button).parent().parent()).remove().draw( false );

    $.ajax({
        url: "/add_img/" + $(button).parent().parent().children()[1].textContent,
        success: function(data) {
            showNotification('bottom', 'right',
            "<b>Image</b> " + $(button).parent().parent().children()[1].textContent + " is safely added.")
            addTableRow('ori', $(button).parent().parent().children()[1].textContent);
        }
    });
}

function toggleNewModal() {
    $('#myModal').modal();
    $('#datatable2').DataTable().draw();
}

function Init() {
    initDatatable();
    getImage("ori");
    getImage("new");
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
