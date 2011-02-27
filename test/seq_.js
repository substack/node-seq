var Seq = require('seq');
var assert = require('assert');

exports.seq_ = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 5000);
    
    Seq('xxx')
        .seq_('pow', function (next, x) {
            assert.eql(next, this);
            assert.eql(x, 'xxx');
            next(null, 'yyy');
        })
        .seq(function (y) {
            clearTimeout(to);
            assert.eql(y, 'yyy');
        })
    ;
};
