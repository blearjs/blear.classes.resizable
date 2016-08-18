/**
 * blear.classes.resizable
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Draggable = require('blear.classes.draggable');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var layout = require('blear.core.layout');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var number = require('blear.utils.number');

var namespace = 'blear-classes-resizable';
var index = 0;
var defaults = {
    /**
     * 待改变尺寸的元素
     */
    el: null,

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
    ratio: 0,

    /**
     * 拖拽手柄尺寸
     */
    dragHandleSize: 10
};

var Resizable = Draggable.extend({
    className: 'Resizable',
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_initData]();
        the[_className] = namespace + index++;
        the[_initNode]();
        Resizable.parent(the, {
            containerEl: the[_resizeEl],
            effectedSelector: the[_resizeEl],
            handleSelector: '.' + the[_className],
            shadow: false,
            draggable: false
        });
        the[_initEvent]();
    }
});
var _options = Resizable.sole();
var _className = Resizable.sole();
var _resizeEl = Resizable.sole();
var _eastEl = Resizable.sole();
var _southEl = Resizable.sole();
var _initData = Resizable.sole();
var _initNode = Resizable.sole();
var _initEvent = Resizable.sole();
var _limitFromWidth = Resizable.sole();
var _limitFromHeight = Resizable.sole();
var pro = Resizable.prototype;

pro[_initData] = function () {
    var the = this;
    var options = the[_options];
    var optionRatio = options.ratio;

    if (!optionRatio) {
        return;
    }

    var optionMinWidth = options.minWidth;
    var optionMinHeight = options.minHeight;
    var optionMaxWidth = options.maxWidth;
    var optionMaxHeight = options.maxHeight;

    if (optionMinWidth && optionMinHeight) {
        var minRatio = optionMinWidth / optionMinHeight;

        if (minRatio < optionRatio) {
            optionMinWidth = optionMinHeight * optionRatio;

            if (optionMinWidth > optionMaxWidth) {
                throw new RangeError('最大宽度限制错误，最小值为 ' + optionMinWidth);
            }
        } else if (minRatio > optionRatio) {
            optionMinHeight = optionMinWidth / optionRatio;

            if (optionMinHeight > optionMaxHeight) {
                throw new RangeError('最大高度限制错误，最小值为 ' + optionMinHeight);
            }
        }
    } else if (optionMinWidth) {
        optionMinHeight = optionMinWidth / optionRatio;

        if (optionMinHeight > optionMaxHeight) {
            throw new RangeError('最大高度限制错误，最小值为 ' + optionMinHeight);
        }
    } else if (optionMinHeight) {
        optionMinWidth = optionMinHeight * optionRatio;

        if (optionMinWidth > optionMaxWidth) {
            throw new RangeError('最大宽度限制错误，最小值为 ' + optionMinWidth);
        }
    }

    if (optionMaxWidth && optionMaxHeight) {
        var maxRatio = optionMaxWidth / optionMaxHeight;

        if (maxRatio > optionRatio) {
            optionMaxWidth = optionMaxHeight * optionRatio;

            if (optionMinWidth > optionMaxWidth) {
                throw new RangeError('最小宽度限制错误，最大值为 ' + optionMaxWidth);
            }
        } else if (maxRatio < optionRatio) {
            optionMaxHeight = optionMaxWidth / optionRatio;

            if (optionMinHeight > optionMaxHeight) {
                throw new RangeError('最小高度限制错误，最大值为 ' + optionMaxHeight);
            }
        }
    } else if (optionMaxWidth) {
        optionMaxHeight = optionMaxWidth / optionRatio;

        if (optionMinHeight > optionMaxHeight) {
            throw new RangeError('最小高度限制错误，最大值为 ' + optionMaxHeight);
        }
    } else if (optionMaxHeight) {
        optionMaxWidth = optionMaxHeight * optionRatio;

        if (optionMinWidth > optionMaxWidth) {
            throw new RangeError('最小宽度限制错误，最大值为 ' + optionMaxWidth);
        }
    }

    options.minWidth = optionMinWidth;
    options.minHeight = optionMinHeight;
    options.maxWidth = optionMaxWidth;
    options.maxHeight = optionMaxHeight;
};

pro[_initNode] = function () {
    var the = this;
    var options = the[_options];

    the[_resizeEl] = selector.query(options.el)[0];

    if (!layout.positioned(the[_resizeEl])) {
        attribute.style(the[_resizeEl], 'position', 'relative');
    }

    var borderRightWidth = number.parseFloat(attribute.style(the[_resizeEl], 'borderRightWidth'), 0);
    var borderBottomWidth = number.parseFloat(attribute.style(the[_resizeEl], 'borderBottomWidth'), 0);

    the[_eastEl] = modification.create('div', {
        style: {
            background: '#0f0',
            position: 'absolute',
            cursor: 'e-resize',
            top: 0,
            right: -borderRightWidth,
            bottom: 0,
            width: options.dragHandleSize
        },
        'class': the[_className]
    });
    the[_southEl] = modification.create('div', {
        style: {
            background: '#00f',
            position: 'absolute',
            cursor: 's-resize',
            left: 0,
            right: 0,
            bottom: -borderBottomWidth,
            height: options.dragHandleSize
        },
        'class': the[_className]
    });

    modification.insert(the[_eastEl], the[_resizeEl]);
    modification.insert(the[_southEl], the[_resizeEl]);
};


pro[_initEvent] = function () {
    var the = this;
    var outerWidth = 0;
    var styleWidth = 0;
    var outerHeight = 0;
    var styleHeight = 0;
    var deltaWidth = 0;
    var deltaHeight = 0;
    var isEast = true;

    the.on('dragStart', function (meta) {
        isEast = meta.handleEl === the[_eastEl];
        outerWidth = layout.outerWidth(the[_resizeEl]);
        styleWidth = number.parseFloat(attribute.style(the[_resizeEl], 'width'));
        deltaWidth = outerWidth - styleWidth;
        outerHeight = layout.outerHeight(the[_resizeEl]);
        styleHeight = number.parseFloat(attribute.style(the[_resizeEl], 'height'));
        deltaHeight = outerHeight - styleHeight;
    });

    the.on('dragMove', function (meta) {
        var limitSizes;

        if (isEast) {
            outerWidth = styleWidth + meta.deltaX + deltaWidth;
            limitSizes = the[_limitFromWidth](outerWidth);
        } else {
            outerHeight = styleHeight + meta.deltaY + deltaHeight;
            limitSizes = the[_limitFromHeight](outerHeight);
        }

        var setWidth = limitSizes[0] === null ? styleWidth : limitSizes[0] - deltaWidth;
        var setHeight = limitSizes[1] === null ? styleHeight : limitSizes[1] - deltaHeight;
        attribute.style(the[_resizeEl], {
            width: setWidth,
            height: setHeight
        });
    });

    the.on('dragEnd', function () {

    });
};


pro[_limitFromWidth] = function (width) {
    var the = this;
    var options = the[_options];

    width = Math.max(options.minWidth, width);
    width = Math.min(options.maxWidth, width);

    var height = options.ratio ? width / options.ratio : null;

    return [width, height];
};


pro[_limitFromHeight] = function (height) {
    var the = this;
    var options = the[_options];

    height = Math.max(options.minHeight, height);
    height = Math.min(options.maxHeight, height);

    var width = options.ratio ? height * options.ratio : null;

    return [width, height];
};


Resizable.defaults = defaults;
module.exports = Resizable;
