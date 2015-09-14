$('.header li a[href="/decrypt"]').parent().addClass('pure-menu-selected');
$('form').submit(function(e) {
    e.preventDefault();
    //disable all input
    $('#file').prop('disabled', true);
    $('#key').prop('disabled', true);
    $('#iv').prop('disabled', true);
    $('#download-link').empty();
    //show progress
    $('#progress-container').show();
    changeProgress($('#upload-progress'), 0);
    changeProgress($('#decrypt-progress'), 0);
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
            $.post('/decrypt', data, function(r) {
                $('#file').prop('disabled', false);
                $('#key').prop('disabled', false);
                $('#iv').prop('disabled', false);
                $('#progress-container').hide();
                if (r === 'failed') {
                    alert('Failed...');
                } else {
                    alert('Done...');
                    $('#download-link').html('<a class="pure-button button-success" href="' + r + '" target="_blank" download>Download Decrypted file</a>');
                }
            })
        }
    });
})