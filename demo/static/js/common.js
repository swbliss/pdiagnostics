function showNotification(from, align, msg, t='default') {
    $.notify({
        icon: "tim-icons icon-bell-55",
        message: msg
    },{
        type: t,
        delay: 1200,
        placement: {
            from: from,
            align: align
        }
    });
}
