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

function itemOptimize() {
    var inputs = $('input').not('#budget');
    for (i in inputs) {
        if ($(inputs[i]).val().length == 0) {
            showNotification('top', 'right',
            "Fill in <b>all the blanks</b> required for item optimizer.", "warning")
            return;
        }
    }

}

function Init() {
    getModels();
}

$( document ).ready(function() {
    // Handler for .ready() called.
    Init();
});
