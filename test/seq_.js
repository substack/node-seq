var Seq = require('seq');
var assert = require('assert');

exports.seq_ = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 5000);
    
    Seq(['xxx'])
        .seq_('pow', function (next, x) {
            assert.eql(next, this);
            assert.eql(x, 'xxx');
            next(null, 'yyy');
        })
        .seq(function (y) {
            clearTimeout(to);
            assert.eql(y, 'yyy');
            assert.eql(this.vars.pow, 'yyy');
        })
    ;
};

exports.par_ = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 5000);
    
    Seq()
        .par_(function (next) {
            assert.eql(next, this);
            next(null, 111);
        })
        .par_(function (next) {
            assert.eql(next, this);
            next(null, 222);
        })
        .seq(function (x, y) {
            clearTimeout(to);
            assert.eql(x, 111);
            assert.eql(y, 222);
        })
    ;
};

exports.forEach_ = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 5000);
    
    var acc = [];
    Seq([7,8,9])
        .forEach_(function (next, x) {
            assert.eql(next, this);
            acc.push(x);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(acc, [ 7, 8, 9 ]);
        })
    ;
};

exports.forEachLimited_ = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 500);
    
    var running = 0;
    var values = [];
    Seq([1,2,3,4,5,6,7,8,9,10])
        .forEach_(3, function (next, x, i){
            running++;
            // console.log('['+i+'] started!  (running: '+running+', values=[['+values.join('],[')+']])');
            assert.ok(running <= 3);
            
            values.push([i,x]);
            setTimeout(function (){
                running--;
                // console.log('['+i+'] finished! (running: '+running+', values=[['+values.join('],[')+']])');
                next(null);
            }, 10);
        })
        .seq(function (){
            clearTimeout(to);
            assert.eql(values,
                [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]]
            );
        })
    ;
};

exports.seqEach_ = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 5000);
    
    var acc = [];
    Seq([7,8,9])
        .seqEach_(function (next, x) {
            assert.eql(next, this);
            acc.push(x);
            setTimeout(function () {
                next(null, x);
            }, Math.random() * 10);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(acc, [ 7, 8, 9 ]);
            assert.eql(this.stack, [ 7, 8, 9 ]);
        })
    ;
};

exports.parEach_ = function () {
    var to = setTimeout(function () {
        assert.fail('never got to the end of the chain');
    }, 5000);
    
    var acc = [];
    Seq([7,8,9])
        .parEach_(function (next, x) {
            assert.eql(next, this);
            acc.push(x);
            setTimeout(function () {
                next(null, x);
            }, Math.random() * 10);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(acc, [ 7, 8, 9 ]);
            assert.eql(this.stack, [ 7, 8, 9 ]);
        })
    ;
};

exports.parEachLimited_ = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 500);
    
    var running = 0;
    var values = [];
    Seq([1,2,3,4,5,6,7,8,9,10])
        .parEach_(3, function (next, x, i){
            running ++;
            
            assert.ok(running <= 3);
            
            values.push([i,x]);
            setTimeout(function () {
                running --;
                next(null);
            }, 10);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(values,
                [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]]
            );
        })
    ;
};



exports.seqMap_ = function () {
    var to = setTimeout(function () {
        assert.fail('seqMap_ never got to the end of the chain');
    }, 5000);
    
    var acc = [];
    Seq([7,8,9])
        .seqMap_(function (next, x) {
            assert.eql(next, this);
            acc.push(x);
            setTimeout(function () {
                next(null, x * 10);
            }, Math.random() * 10);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(acc, [ 7, 8, 9 ]);
            assert.eql(this.stack, [ 70, 80, 90 ]);
        })
    ;
};

exports.parMap_ = function () {
    var to = setTimeout(function () {
        assert.fail('parMap_ never got to the end of the chain');
    }, 5000);
    
    var acc = [];
    Seq([7,8,9])
        .parMap_(function (next, x) {
            assert.eql(next, this);
            acc.push(x);
            setTimeout(function () {
                next(null, x * 10);
            }, Math.random() * 10);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(acc, [ 7, 8, 9 ]);
            assert.eql(this.stack, [ 70, 80, 90 ]);
        })
    ;
};

exports.parMapLimited_ = function () {
    var to = setTimeout(function () {
        assert.fail('parMapLimited_ never finished');
    }, 500);
    
    var running = 0;
    var values = [];
    Seq([1,2,3,4,5,6,7,8,9,10])
        .parMap_(2, function (next, x, i) {
            running ++;
            
            assert.ok(running <= 2);
            
            setTimeout(function (){
                running --;
                next(null, x * 10);
            }, Math.floor(Math.random() * 100));
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(this.stack, [10,20,30,40,50,60,70,80,90,100]);
            assert.eql(this.stack, [].slice.call(arguments));
        })
    ;
};


exports.seqFilter_ = function () {
    var to = setTimeout(function () {
        assert.fail('seqFilter_ never finished');
    }, 500);
    
    var running = 0;
    var values = [];
    Seq([1,2,3,4,5,6,7,8,9,10])
        .seqFilter_(function (next, x, i) {
            running ++;
            
            // TODO: buh?
            // assert.eql(running, 1);
            
            setTimeout(function () {
                running --;
                next(null, x % 2 === 0);
            }, 10);
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(this.stack, [2,4,6,8,10]);
        })
    ;
};


exports.parFilterLimited_ = function () {
    var to = setTimeout(function () {
        assert.fail('parFilterLimited_ never finished');
    }, 500);
    
    var running = 0;
    var values = [];
    Seq([1,2,3,4,5,6,7,8,9,10])
        .parFilter_(2, function (next, x, i) {
            running ++;
            
            assert.ok(running <= 2);
            
            setTimeout(function () {
                running --;
                next(null, x % 2 === 0);
            }, Math.floor(Math.random() * 100));
        })
        .seq(function () {
            clearTimeout(to);
            assert.eql(this.stack, [2,4,6,8,10]);
            assert.eql(this.stack, [].slice.call(arguments));
        })
    ;
};
