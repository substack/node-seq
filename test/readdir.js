var assert = require('assert');
var Seq = require('seq');
var fs = require('fs');

exports.readdir = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 500);
    
    Seq()
        .seq(fs.readdir, __dirname, Seq)
        .seq(function (files) {
            clearTimeout(to);
            assert.ok(files.length >= 2);
        })
        .catch(assert.fail)
    ;
}; 
