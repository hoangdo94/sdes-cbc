var express = require('express');
var cbc = require('../controller/cbc');
var multer = require('multer');
var upload = multer({
    dest: 'tmp/'
});
var router = express.Router();
var path = require('path');
var fs = require('fs');

function cleanUpFiles(input, output) {
    fs.unlink(input, function(err) {
        if (err) console.log(err);
        console.log('file successfully deleted', input);
    });
    setTimeout(function() {
        fs.unlink(output, function(err) {
            if (err) console.log(err);
            console.log('file successfully deleted', output);
        });
    }, 30 * 60 * 1000);
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/encrypt', function(req, res, next) {
    res.render('encrypt');
});

router.get('/decrypt', function(req, res, next) {
    res.render('decrypt');
});

router.post('/upload', upload.single('inputFile'), function(req, res, next) {
    res.send({
        name: req.file.originalname,
        path: req.file.path,
    })
});

router.post('/encrypt', function(req, res, next) {
    var key = req.body.key;
    var iv = req.body.iv;
    var filename = req.body.filename;
    var filepath = req.body.filepath;

    var input = path.join(__dirname, '/../', filepath);
    var outputDownloadPath = '/files/' + 'encrypted_' + Date.now() + '_' + filename;
    var output = path.join(__dirname, '/../public', outputDownloadPath);
    console.log(input, output, key, iv);
    cbc.encode(input, output, key, iv, function(err) {
        cleanUpFiles(input, output);
        if (err) res.send('failed');
        else res.send(outputDownloadPath);
    })
});

router.post('/decrypt', function(req, res, next) {
    var key = req.body.key;
    var iv = req.body.iv;
    var filename = req.body.filename;
    var filepath = req.body.filepath;

    var input = path.join(__dirname, '/../', filepath);
    var outputDownloadPath = '/files/' + 'decrypted_' + Date.now() + '_' + filename;
    var output = path.join(__dirname, '/../public', outputDownloadPath);
    console.log(input, output, key, iv);
    cbc.decode(input, output, key, iv, function(err) {
        cleanUpFiles(input, output);
        if (err) res.send('failed');
        else res.send(outputDownloadPath);
    })
});

module.exports = router;