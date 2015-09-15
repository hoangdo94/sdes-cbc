$('.header li a[href="/encrypt"]').parent().addClass('pure-menu-selected');
$('form').submit(function(e) {
    e.preventDefault();
    //disable all input
    $('form input').prop('disabled', true);
    $('#download-link').hide();
    $('#up').attr('class', '');
    $('#ep').attr('class', '');
    //show progress
    $('#progress-container').show();
    changeProgress($('#upload-progress'), 0);
    changeProgress($('#encrypt-progress'), 0);
    //upload file
    var file = document.getElementById('file').files[0];
    $('#up').attr('class', 'fa fa-spinner fa-spin');
    uploadFile(file, function(percent) {
        changeProgress($('#upload-progress'), percent);
    }, function(status, r) {
        if (status === 'OK') {
            var key = $('#key').val();
            var iv = $('#iv').val();
            var data = {
                key: key,
                iv: iv,
                filename: r.name,
                filepath: r.path,
            }
            $('#up').attr('class', 'fa fa-check');
            $('#ep').attr('class', 'fa fa-spinner fa-spin');
            $.post('/encrypt', data, function(r) {
                $('form input').prop('disabled', false);
                if (r === 'failed') {
                    $('#ep').attr('class', 'fa fa-times');
                    alert('Failed...');
                } else {
                    changeProgress($('#encrypt-progress'),100);
                    $('#ep').attr('class', 'fa fa-check');
                    $('#download-link').show();
                    $('#download-link').attr('href', r);
                    // alert('Done...');
                }
            })
        }
    });
})