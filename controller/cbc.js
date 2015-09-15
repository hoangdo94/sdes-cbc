var fs = require('fs'),
    SDES = require('./sdes').SDES;

function encode(input, output, key, iv, callback) {
    var sdes = new SDES(key);
    var lastByte = parseInt(iv, 2);

    var startTime = Date.now();
    var isDone = false;

    var readStream = fs.createReadStream(input);
    var writeStream = fs.createWriteStream(output);
    readStream.on('error', function(err) {
        callback(err, null);
    })
    readStream.on('end', function() {
        isDone = true;
    })
    readStream.on('data', function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
            chunk[i] = sdes.encode(chunk[i] ^ lastByte);
            lastByte = chunk[i];
        }
        writeStream.write(chunk, function() {
            if (isDone) {
                var duration = Date.now() - startTime;
                console.log('Encrypt time', duration, 'ms');
                callback(null, 'OK', duration);
            }
        });
    })
}

function decode(input, output, key, iv, callback) {
    var sdes = new SDES(key);
    var lastByte = parseInt(iv, 2);

    var startTime = Date.now();
    var isDone = false;

    var readStream = fs.createReadStream(input);
    var writeStream = fs.createWriteStream(output);
    readStream.on('error', function(err) {
        callback(err, null);
    })
    readStream.on('end', function() {
        isDone = true;
    })
    readStream.on('data', function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
            var currByte = chunk[i];
            chunk[i] = sdes.decode(chunk[i]) ^ lastByte;
            lastByte = currByte;
        }
        writeStream.write(chunk, function() {
            if (isDone) {
                var duration = Date.now() - startTime;
                console.log('Decrypt time', duration, 'ms');
                callback(null, 'OK', duration);
            }
        });
    })
}

module.exports = {
    encode: encode,
    decode: decode,
};