/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';


var Resizable = require('../src/index');

var resizable = window.resizable = new Resizable({
    el: '#demo',
    minWidth: 100,
    minHeight: 50,
    maxWidth: 500,
    maxHeight: 400,
    ratio: 1.8
});


