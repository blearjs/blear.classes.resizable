/**
 * blear.classes.resizable
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Draggable = require('blear.classes.draggable');
var Events = require('blear.classes.events');


var defaults = {
    /**
     * 最小宽度
     * @type Number
     */
    minWidth: 0,

    /**
     * 最小高度
     * @type Number
     */
    minHeight: 0,

    /**
     * 最大宽度
     * @type Number
     */
    maxWidth: 0,

    /**
     * 最大高度
     * @type Number
     */
    maxHeight: 0,

    /**
     * 宽高比
     * @type Number
     */
    ratio: 0
};


