function uploadFile(file, progressCallback, loadCallback) {
    var formData = new FormData();
    formData.append('inputFile', file);

    var xhr = new XMLHttpRequest();

    xhr.open('post', '/upload', true);

    xhr.upload.onprogress = function(e) {
        if (progressCallback && e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            progressCallback(percentage);
        }
    };

    xhr.onerror = function(e) {
        alert('An error occurred while uploading file');
    };

    xhr.onload = function() {
        if (loadCallback) {
            loadCallback(this.statusText, JSON.parse(this.response));
        }
    };

    xhr.send(formData);
}

function changeProgress($element, percent) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({
        width: progressBarWidth
    }, 500).html(percent + "% ");
}