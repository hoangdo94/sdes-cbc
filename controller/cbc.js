var fs = require('fs'),
    SDES = require('./sdes').SDES;

function encode(input, output, key, iv, callback) {
    var sdes = new SDES(key);
    var lastByte = parseInt(iv, 2);
    var readStream = fs.createReadStream(input);
    var writeStream = fs.createWriteStream(output);
    readStream.on('error', function(err) {
        callback(err, null);
    })
    readStream.on('end', function() {
    	callback(null,'OK');
    })
    readStream.on('data', function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
            chunk[i] = sdes.encode(chunk[i] ^ lastByte);
            lastByte = chunk[i];
        }
        writeStream.write(chunk);
    })
}

function decode(input, output, key, iv, callback) {
    var sdes = new SDES(key);
    var lastByte = parseInt(iv, 2);
    var readStream = fs.createReadStream(input);
    var writeStream = fs.createWriteStream(output);
    readStream.on('error', function(err) {
        callback(err, null);
    })
    readStream.on('end', function() {
    	callback(null,'OK');
    })
    readStream.on('data', function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
            var currByte = chunk[i];
			chunk[i] = sdes.decode(chunk[i]) ^ lastByte;
			lastByte = currByte;
        }
        writeStream.write(chunk);
    })
}

module.exports = {
    encode: encode,
    decode: decode,
};