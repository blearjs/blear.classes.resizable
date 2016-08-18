/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var Resizable = require('../src/index');

var resizable = window.resizable = new Resizable({
    el: '#demo',
    minWidth: 100,
    minHeight: 50,
    maxWidth: 500,
    maxHeight: 400,
    ratio: 1.8
});

var minSizeEl = document.getElementById('minSize');
var maxSizeEl = document.getElementById('maxSize');
var randomWidthEl = document.getElementById('randomWidth');
var randomHeightEl = document.getElementById('randomHeight');

minSizeEl.onclick = function () {
    resizable.setMinSize();
};

maxSizeEl.onclick = function () {
    resizable.setMaxSize();
};

randomWidthEl.onclick = function () {
    resizable.setSize(random.number(1, 400), null);
};

randomHeightEl.onclick = function () {
    resizable.setSize(null, random.number(1, 300));
};
