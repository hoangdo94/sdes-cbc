function uploadFile(file, progressCallback, loadCallback) {
    var formData = new FormData();
    formData.append('inputFile', file);

    var xhr = new XMLHttpRequest();

    xhr.open('post', '/upload', true);

    xhr.upload.onprogress = function(e) {
        if (progressCallback && e.lengthComputable) {
            var percentage = Math.round((e.loaded / e.total) * 100);
            progressCallback(percentage);
        }
    };

    xhr.onerror = function(e) {
        alert('An error occurred while uploading file, maybe the file is too big');
        location.reload();
    };

    xhr.onload = function() {
        if (loadCallback) {
            var data = JSON.parse(this.response);
            console.log('\nFile size', data.size);
            loadCallback(this.statusText, data);
        }
    };

    xhr.send(formData);
}

function changeProgress($element, percent) {
    $element.find('div').css({
        width: percent + '%'
    }).html(percent + "% ");
}

$(document).ajaxStart(function(e) {
    var task = (e.target.URL.indexOf('encrypt') !== -1) ? 'Encrypt' : 'Decrypt';
    console.time(task);
})
$(document).ajaxStop(function(e) {
    var task = (e.target.URL.indexOf('encrypt') !== -1) ? 'Encrypt' : 'Decrypt';
    console.timeEnd(task);
})