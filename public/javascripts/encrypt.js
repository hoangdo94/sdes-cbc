$('.header li a[href="/encrypt"]').parent().addClass('pure-menu-selected');
$('form').submit(function(e) {
    e.preventDefault();
    //disable all input
    $('#file').prop('disabled', true);
    $('#key').prop('disabled', true);
    $('#iv').prop('disabled', true);
    $('#download-link').hide();
    //show progress
    $('#progress-container').show();
    changeProgress($('#upload-progress'), 0);
    changeProgress($('#encrypt-progress'), 0);
    //upload file
    var file = document.getElementById('file').files[0];
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
            $.post('/encrypt', data, function(r) {
                $('#file').prop('disabled', false);
                $('#key').prop('disabled', false);
                $('#iv').prop('disabled', false);
                if (r === 'failed') {
                    alert('Failed...');
                } else {
                    changeProgress($('#encrypt-progress'),100);
                    $('#download-link').show();
                    $('#download-link').attr('href', r);
                    // alert('Done...');
                }
            })
        }
    });
})