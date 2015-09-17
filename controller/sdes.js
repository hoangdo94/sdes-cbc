//Helpers
//process string data
function circularLeftShift(k, num) {
    return k.substring(num) + k.substring(0, num);
}

function p8(k) {
    return k[5] + k[2] + k[6] + k[3] + k[7] + k[4] + k[9] + k[8];
}

function p10(k) {
    return k[2] + k[4] + k[1] + k[6] + k[3] + k[9] + k[0] + k[8] + k[7] + k[5];
}

//process binary data
function ip(input) {
    var output = 0;
    var indexs = [1, 5, 2, 0, 3, 7, 4, 6];
    for (var i = 0; i < indexs.length; i++) {
        var t = ((input << indexs[i]) & 0x80) >> i;
        output |= t;
    }
    return output;
}

function ip1(input) {
    var output = 0;
    var indexs = [3, 0, 2, 4, 6, 1, 7, 5];
    for (var i = 0; i < indexs.length; i++) {
        var t = ((input << indexs[i]) & 0x80) >> i;
        output |= t;
    }
    return output;
}

function ep(input) {
    var output = 0;
    var indexs = [3, 0, 1, 2, 1, 2, 3, 0];
    for (var i = 0; i < indexs.length; i++) {
        var t = ((input << indexs[i]) & 0x80) >> i;
        output |= t;
    }
    return output;
}

function sbox0(input) {
    var box = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2]
    ];
    var row = ((input & 0x8) >> 2) | (input & 0x1);
    var col = (input & 0x6) >> 1;
    return box[row][col];
}

function sbox1(input) {
    var box = [
        [0, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3]
    ];
    var row = ((input & 0x8) >> 2) | (input & 0x1);
    var col = (input & 0x6) >> 1;
    return box[row][col];
}

function p4(input) {
    var output = 0;
    var indexs = [1, 3, 2, 0];
    for (var i = 0; i < indexs.length; i++) {
        var t = ((input << indexs[i]) & 0x8) >> i;
        output |= t;
    }
    return output;
}

function fk(input, k) {
    var l = input >> 4;
    var r = input & 0xf;
    var t = k ^ ep(r << 4);
    var sb = (sbox0(t >> 4) << 2) | sbox1(t & 0xf);
    var p4r = p4(sb);
    return ((l ^ p4r) << 4) | r;
}

function sw(input) {
    return (input >> 4) | ((input & 0xf) << 4);
}

//Class: SDES
function SDES(k) {
    if (k.length !== 10) {
        throw new Error('k must be 10 bit length');
    }
    this.generateKeys(k);
    console.log(this.k1, this.k2);
}

SDES.prototype.generateKeys = function(k) {
    var p = p10(k);
    var l = p.substring(0, 5);
    var r = p.substring(5);
    var key1 = p8(circularLeftShift(l, 1) + circularLeftShift(r, 1)),
        key2 = p8(circularLeftShift(l, 3) + circularLeftShift(r, 3));
    this.k1 = parseInt(key1, 2);
    this.k2 = parseInt(key2, 2);
}

SDES.prototype.encrypt = function(data) {
    return ip1(fk(sw(fk(ip(data), this.k1)), this.k2));
}

SDES.prototype.decrypt = function(data) {
    return ip1(fk(sw(fk(ip(data), this.k2)), this.k1));
}

//Exports
module.exports = {
    SDES: SDES,
};