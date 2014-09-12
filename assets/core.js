require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i, len;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        for (i = 0, len = obj.length; i < len; i++) {
            iterator.call(context, obj[i], i, obj);
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    for (var i = 0, len = keys.length; i < len; i++) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {HTMLElement} element
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(element, types, handler) {
    each(splitStr(types), function(type) {
        element.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {HTMLElement} element
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(element, types, handler) {
    each(splitStr(types), function(type) {
        element.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        for (var i = 0, len = src.length; i < len; i++) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    for (var i = 0, len = src.length; i < len; i++) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    for (var i = 0, len = VENDOR_PREFIXES.length; i < len; i++) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
    this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
    this.evWin && addEventListeners(window, this.evWin, this.domHandler);
}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(window, this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    for (var i = 0; i < input.pointers.length; i++) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0;
    for (var i = 0; i < pointersLength; i++) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    },
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            store.push(ev);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // get index of the event in the store
        // it not found, so the pointer hasn't been down (so it's probably a hover)
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    /**
     * handle touch events
     * @param {Object} ev
     */
    handler: function TEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i, len;
    var targetTouches = toArray(ev.targetTouches);
    var changedTouches = toArray(ev.changedTouches);
    var changedTargetTouches = [];

    // collect touches
    if (type === INPUT_START) {
        for (i = 0, len = targetTouches.length; i < len; i++) {
            targetIds[targetTouches[i].identifier] = true;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    for (i = 0, len = changedTouches.length; i < len; i++) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone || (hasPanY && hasPanX) ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        for (var i = 0; i < this.requireFail.length; i++) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;

        if (direction === DIRECTION_ALL) {
            return [TOUCH_ACTION_NONE];
        }

        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 2, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.2';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * EXPERIMENTAL FEATURE
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[2]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        for (var i = 0, len = recognizers.length; i < len; i++) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i](data);
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof define == TYPE_FUNCTION && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],2:[function(require,module,exports){
(function (process,global){
/*
Copyright 2013 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

/*jslint expr: true */
/*global define */

(function (global, factory) {
    var built = factory();
    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    global.PromisePolyfill = built;
    global.Promise || (global.Promise = built);
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function () {

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function assign(obj, props) {
        for (var prop in props) {
            /* istanbul ignore else */
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    }

    /**
    A promise represents a value that may not yet be available. Promises allow
    you to chain asynchronous operations, write synchronous looking code and
    handle errors throughout the process.

    This constructor takes a function as a parameter where you can insert the logic
    that fulfills or rejects this promise. The fulfillment value and the rejection
    reason can be any JavaScript value. It's encouraged that rejection reasons be
    error objects

    <pre><code>
    var fulfilled = new Promise(function (resolve) {
        resolve('I am a fulfilled promise');
    });

    var rejected = new Promise(function (resolve, reject) {
        reject(new Error('I am a rejected promise'));
    });
    </code></pre>

    @class Promise
    @constructor
    @param {Function} fn A function where to insert the logic that resolves this
            promise. Receives `resolve` and `reject` functions as parameters.
            This function is called synchronously.
    **/
    function Promise(fn) {
        if (!(this instanceof Promise)) {
            Promise._log('Promises should always be created with new Promise(). This will throw an error in the future', 'error');
            return new Promise(fn);
        }

        var resolver = new Promise.Resolver(this);

        /**
        A reference to the resolver object that handles this promise

        @property _resolver
        @type Object
        @private
        */
        this._resolver = resolver;

        try {
            fn(function (value) {
                resolver.resolve(value);
            }, function (reason) {
                resolver.reject(reason);
            });
        } catch (e) {
            resolver.reject(e);
        }
    }

    assign(Promise.prototype, {
        /**
        Schedule execution of a callback to either or both of "fulfill" and
        "reject" resolutions for this promise. The callbacks are wrapped in a new
        promise and that promise is returned.  This allows operation chaining ala
        `functionA().then(functionB).then(functionC)` where `functionA` returns
        a promise, and `functionB` and `functionC` _may_ return promises.

        Asynchronicity of the callbacks is guaranteed.

        @method then
        @param {Function} [callback] function to execute if the promise
                    resolves successfully
        @param {Function} [errback] function to execute if the promise
                    resolves unsuccessfully
        @return {Promise} A promise wrapping the resolution of either "resolve" or
                    "reject" callback
        **/
        then: function (callback, errback) {
            // using this.constructor allows for customized promises to be
            // returned instead of plain ones
            var resolve, reject,
                promise = new this.constructor(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });

            this._resolver._addCallbacks(
                typeof callback === 'function' ?
                    Promise._makeCallback(promise, resolve, reject, callback) : resolve,
                typeof errback === 'function' ?
                    Promise._makeCallback(promise, resolve, reject, errback) : reject
            );

            return promise;
        },

        /*
        A shorthand for `promise.then(undefined, callback)`.

        Returns a new promise and the error callback gets the same treatment as in
        `then`: errors get caught and turned into rejections, and the return value
        of the callback becomes the fulfilled value of the returned promise.

        @method catch
        @param [Function] errback Callback to be called in case this promise is
                            rejected
        @return {Promise} A new promise modified by the behavior of the error
                            callback
        */
        'catch': function (errback) {
            return this.then(undefined, errback);
        }
    });

    /**
    Wraps the callback in another function to catch exceptions and turn them
    into rejections.

    @method _makeCallback
    @param {Promise} promise Promise that will be affected by this callback
    @param {Function} fn Callback to wrap
    @return {Function}
    @static
    @private
    **/
    Promise._makeCallback = function (promise, resolve, reject, fn) {
        // callbacks and errbacks only get one argument
        return function (valueOrReason) {
            var result;

            // Promises model exception handling through callbacks
            // making both synchronous and asynchronous errors behave
            // the same way
            try {
                // Use the argument coming in to the callback/errback from the
                // resolution of the parent promise.
                // The function must be called as a normal function, with no
                // special value for |this|, as per Promises A+
                result = fn(valueOrReason);
            } catch (e) {
                // calling return only to stop here
                reject(e);
                return;
            }

            if (result === promise) {
                reject(new TypeError('Cannot resolve a promise with itself'));
                return;
            }

            resolve(result);
        };
    };

    /**
    Logs a message. This method is designed to be overwritten with  YUI's `log`
    function.

    @method _log
    @param {String} msg Message to log
    @param {String} type Log level. One of 'error', 'warn', 'info'.
    @static
    @private
    **/
    Promise._log = function (msg, type) { /* istanbul ignore else */ if (typeof console !== 'undefined') { console[type](msg); } };

    /*
    Ensures that a certain value is a promise. If it is not a promise, it wraps it
    in one.

    This method can be copied or inherited in subclasses. In that case it will
    check that the value passed to it is an instance of the correct class.
    This means that `PromiseSubclass.resolve()` will always return instances of
    `PromiseSubclass`.

    @method resolve
    @param {Any} Any object that may or may not be a promise
    @return {Promise}
    @static
    */
    Promise.resolve = function (value) {
        if (value && value.constructor === this) {
            return value;
        }
        /*jshint newcap: false */
        return new this(function (resolve) {
        /*jshint newcap: true */
            resolve(value);
        });
    };

    /*
    A shorthand for creating a rejected promise.

    @method reject
    @param {Any} reason Reason for the rejection of this promise. Usually an Error
        Object
    @return {Promise} A rejected promise
    @static
    */
    Promise.reject = function (reason) {
        /*jshint newcap: false */
        var promise = new this(function () {});
       /*jshint newcap: true */

       // Do not go through resolver.reject() because an immediately rejected promise
       // always has no callbacks which would trigger an unnecessary warnihg
       promise._resolver._result = reason;
       promise._resolver._status = 'rejected';

       return promise;
    };

    /*
    Returns a promise that is resolved or rejected when all values are resolved or
    any is rejected. This is useful for waiting for the resolution of multiple
    promises, such as reading multiple files in Node.js or making multiple XHR
    requests in the browser.

    @method all
    @param {Any[]} values An array of any kind of values, promises or not. If a value is not
    @return [Promise] A promise for an array of all the fulfillment values
    @static
    */
    Promise.all = function (values) {
        var Promise = this;
        return new Promise(function (resolve, reject) {
            if (!isArray(values)) {
                reject(new TypeError('Promise.all expects an array of values or promises'));
                return;
            }

            var remaining = values.length,
                i         = 0,
                length    = values.length,
                results   = [];

            function oneDone(index) {
                return function (value) {
                    results[index] = value;

                    remaining--;

                    if (!remaining) {
                        resolve(results);
                    }
                };
            }

            if (length < 1) {
                return resolve(results);
            }

            for (; i < length; i++) {
                Promise.resolve(values[i]).then(oneDone(i), reject);
            }
        });
    };

    /*
    Returns a promise that is resolved or rejected when any of values is either
    resolved or rejected. Can be used for providing early feedback in the UI
    while other operations are still pending.

    @method race
    @param {Any[]} values An array of values or promises
    @return {Promise}
    @static
    */
    Promise.race = function (values) {
        var Promise = this;
        return new Promise(function (resolve, reject) {
            if (!isArray(values)) {
                reject(new TypeError('Promise.race expects an array of values or promises'));
                return;
            }
            
            // just go through the list and resolve and reject at the first change
            // This abuses the fact that calling resolve/reject multiple times
            // doesn't change the state of the returned promise
            for (var i = 0, count = values.length; i < count; i++) {
                Promise.resolve(values[i]).then(resolve, reject);
            }
        });
    };

    /**
    Forces a function to be run asynchronously, but as fast as possible. In Node.js
    this is achieved using `setImmediate` or `process.nextTick`. In YUI this is
    replaced with `Y.soon`.

    @method async
    @param {Function} callback The function to call asynchronously
    @static
    **/
    /* istanbul ignore next */
    Promise.async = typeof setImmediate !== 'undefined' ?
                        function (fn) {setImmediate(fn);} :
                    typeof process !== 'undefined' && process.nextTick ?
                        process.nextTick :
                    function (fn) {setTimeout(fn, 0);};

    /**
    Represents an asynchronous operation. Provides a
    standard API for subscribing to the moment that the operation completes either
    successfully (`fulfill()`) or unsuccessfully (`reject()`).

    @class Promise.Resolver
    @constructor
    @param {Promise} promise The promise instance this resolver will be handling
    **/
    function Resolver(promise) {
        /**
        List of success callbacks

        @property _callbacks
        @type Array
        @private
        **/
        this._callbacks = [];

        /**
        List of failure callbacks

        @property _errbacks
        @type Array
        @private
        **/
        this._errbacks = [];

        /**
        The promise for this Resolver.

        @property promise
        @type Promise
        @deprecated
        **/
        this.promise = promise;

        /**
        The status of the operation. This property may take only one of the following
        values: 'pending', 'fulfilled' or 'rejected'.

        @property _status
        @type String
        @default 'pending'
        @private
        **/
        this._status = 'pending';

        /**
        This value that this promise represents.

        @property _result
        @type Any
        @private
        **/
        this._result = null;
    }

    assign(Resolver.prototype, {
        /**
        Resolves the promise, signaling successful completion of the
        represented operation. All "onFulfilled" subscriptions are executed and passed
        the value provided to this method. After calling `fulfill()`, `reject()` and
        `notify()` are disabled.

        @method fulfill
        @param {Any} value Value to pass along to the "onFulfilled" subscribers
        **/
        fulfill: function (value) {
            var status = this._status;

            if (status === 'pending' || status === 'accepted') {
                this._result = value;
                this._status = 'fulfilled';
            }

            if (this._status === 'fulfilled') {
                this._notify(this._callbacks, this._result);

                // Reset the callback list so that future calls to fulfill()
                // won't call the same callbacks again. Promises keep a list
                // of callbacks, they're not the same as events. In practice,
                // calls to fulfill() after the first one should not be made by
                // the user but by then()
                this._callbacks = [];

                // Once a promise gets fulfilled it can't be rejected, so
                // there is no point in keeping the list. Remove it to help
                // garbage collection
                this._errbacks = null;
            }
        },

        /**
        Resolves the promise, signaling *un*successful completion of the
        represented operation. All "onRejected" subscriptions are executed with
        the value provided to this method. After calling `reject()`, `resolve()`
        and `notify()` are disabled.

        @method reject
        @param {Any} value Value to pass along to the "reject" subscribers
        **/
        reject: function (reason) {
            var status = this._status;

            if (status === 'pending' || status === 'accepted') {
                this._result = reason;
                this._status = 'rejected';
                if (!this._errbacks.length) {Promise._log('Promise rejected but no error handlers were registered to it', 'info');}
            }

            if (this._status === 'rejected') {
                this._notify(this._errbacks, this._result);

                // See fulfill()
                this._callbacks = null;
                this._errbacks = [];
            }
        },

        /*
        Given a certain value A passed as a parameter, this method resolves the
        promise to the value A.

        If A is a promise, `resolve` will cause the resolver to adopt the state of A
        and once A is resolved, it will resolve the resolver's promise as well.
        This behavior "flattens" A by calling `then` recursively and essentially
        disallows promises-for-promises.

        This is the default algorithm used when using the function passed as the
        first argument to the promise initialization function. This means that
        the following code returns a promise for the value 'hello world':

            var promise1 = new Promise(function (resolve) {
                resolve('hello world');
            });
            var promise2 = new Promise(function (resolve) {
                resolve(promise1);
            });
            promise2.then(function (value) {
                assert(value === 'hello world'); // true
            });

        @method resolve
        @param [Any] value A regular JS value or a promise
        */
        resolve: function (value) {
            if (this._status === 'pending') {
                this._status = 'accepted';
                this._value = value;

                if ((this._callbacks && this._callbacks.length) ||
                    (this._errbacks && this._errbacks.length)) {
                    this._unwrap(this._value);
                }
            }
        },

        /**
        If `value` is a promise or a thenable, it will be unwrapped by
        recursively calling its `then` method. If not, the resolver will be
        fulfilled with `value`.

        This method is called when the promise's `then` method is called and
        not in `resolve` to allow for lazy promises to be accepted and not
        resolved immediately.

        @method _unwrap
        @param {Any} value A promise, thenable or regular value
        @private
        **/
        _unwrap: function (value) {
            var self = this, unwrapped = false, then;

            if (!value || (typeof value !== 'object' &&
                typeof value !== 'function')) {
                self.fulfill(value);
                return;
            }

            try {
                then = value.then;

                if (typeof then === 'function') {
                    then.call(value, function (value) {
                        if (!unwrapped) {
                            unwrapped = true;
                            self._unwrap(value);
                        }
                    }, function (reason) {
                        if (!unwrapped) {
                            unwrapped = true;
                            self.reject(reason);
                        }
                    });
                } else {
                    self.fulfill(value);
                }
            } catch (e) {
                if (!unwrapped) {
                    self.reject(e);
                }
            }
        },

        /**
        Schedule execution of a callback to either or both of "resolve" and
        "reject" resolutions of this resolver. If the resolver is not pending,
        the correct callback gets called automatically.

        @method _addCallbacks
        @param {Function} [callback] function to execute if the Resolver
                    resolves successfully
        @param {Function} [errback] function to execute if the Resolver
                    resolves unsuccessfully
        **/
        _addCallbacks: function (callback, errback) {
            var callbackList = this._callbacks,
                errbackList  = this._errbacks;

            // Because the callback and errback are represented by a Resolver, it
            // must be fulfilled or rejected to propagate through the then() chain.
            // The same logic applies to resolve() and reject() for fulfillment.
            if (callbackList) {
                callbackList.push(callback);
            }
            if (errbackList) {
                errbackList.push(errback);
            }

            switch (this._status) {
                case 'accepted':
                    this._unwrap(this._value);
                    break;
                case 'fulfilled':
                    this.fulfill(this._result);
                    break;
                case 'rejected':
                    this.reject(this._result);
                    break;
            }
        },

        /**
        Executes an array of callbacks from a specified context, passing a set of
        arguments.

        @method _notify
        @param {Function[]} subs The array of subscriber callbacks
        @param {Any} result Value to pass the callbacks
        @protected
        **/
        _notify: function (subs, result) {
            // Since callback lists are reset synchronously, the subs list never
            // changes after _notify() receives it. Avoid calling Y.soon() for
            // an empty list
            if (subs.length) {
                // Calling all callbacks after Promise.async to guarantee
                // asynchronicity. Because setTimeout can cause unnecessary
                // delays that *can* become noticeable in some situations
                // (especially in Node.js)
                Promise.async(function () {
                    var i, len;

                    for (i = 0, len = subs.length; i < len; ++i) {
                        subs[i](result);
                    }
                });
            }
        }

    });

    Promise.Resolver = Resolver;

    return Promise;

}));


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":20}],3:[function(require,module,exports){
"use strict";

/**
 * Extends the Event-instance by adding the method `Emitter` to it.
 * The `Emitter-method` returns an object that should be merged into any Class-instance or object you
 * want to extend with the emit-methods, so the appropriate methods can be invoked on the instance.
 *
 * Should be called using  the provided `extend`-method like this:
 * @example
 * var Event = require('event');<br>
 * var EventEmitter = require('event-emitter');<br>
 * EventEmitter.mergeInto(Event);
 *
 * @module event
 * @submodule event-emitter
 * @class Event.Emitter
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/

var NAME = '[event-emitter]: ',
    REGEXP_EMITTER = /^(\w|-)+$/,

createEmitter = {
    mergeInto: function (instanceEvent) {
        /**
         * Creates an object which holds all event-emission methods.
         * The returned object should be merged into any Class-instance or object you want to
         * extend with the emit-methods, so the appropriate methods can be invoked on the instance.
         *
         * See [Event.Emitter](Event.Emitter.html) for all properties that can be merged.
         *
         * @example
         *     var greenObject = {};
         *     greenObject.merge(Event.Emitter('green'));
         *     greenObject.emit('save'); // --> emits the customEvent `green:save`
         *
         * @example
         *     Profile.mergePrototypes(Event.Emitter('PersonalProfile'));
         *     var myProfile = new Profile({name: Marco});
         *     myProfile.emit('save'); // --> emits the customEvent `PersonalProfile:save`
         *
         * @for Event
         * @method Emitter
         * @param emitterName {String} the Event-instance that is responsible for the event-system.
         *        Should be an instance created by the class provided by `core-custom-event`
         * @return {Object} with the methods which should be merged inside an instance.
         * @since 0.0.1
         */

        /**
         * This object should be merged into any Class-instance or object that you want to provide
         * event-emitter methods. This way, the appropriate methods can be invoked on the instance.
         * instead of using the static Event-methods.
         *
         * When merging, you need to merge a method with the `emitterName` as its only argument. f.e:
         * Event.Emitter('PersonalProfile')
         *
         * It is highly recommendable to merge on the prototype instead of the instance. See the docs.
         *
         * @class Event.Emitter
         *
        */
        instanceEvent.Emitter = function(emitterName) {
            var composeCustomevent = function(eventName) {
                    return emitterName+':'+eventName;
                },
                newEmitter;
            if (!REGEXP_EMITTER.test(emitterName)) {
                console.error(NAME, 'Emitter invoked with invalid argument: you must specify a valid emitterName');
                return;
            }
            newEmitter = {
                /**
                 * Defines a CustomEvent. If the eventtype already exists, it will not be overridden,
                 * unless you force to assign with `.forceAssign()`
                 *
                 * The returned object comes with 4 methods which can be invoked chainable:
                 *
                 * <ul>
                 *     <li>defaultFn() --> the default-function of the event</li>
                 *     <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
                 *     <li>forceAssign() --> overrides any previous definition</li>
                 *     <li>unHaltable() --> makes the customEvent cannot be halted</li>
                 *     <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
                 *     <li>unSilencable() --> makes that emitters cannot make this event to perform silently (using e.silent)</li>
                 *     <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
                 *     <li>noRender() --> prevents this customEvent from render the dom. Overrules unRenderPreventable()</li>
                 * </ul>
                 *
                 * @method defineEvent
                 * @param eventName {String} name of the customEvent, without `emitterName`.
                 *        The final event that will be created has the syntax: `emitterName:eventName`,
                 *        where `emitterName:` is automaticly prepended.
                 * @return {Object} with extra methods that can be chained:
                 * <ul>
                 *      <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
                 *      <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
                 *      <li>forceAssign() --> overrides any previous definition</li>
                 *      <li>defaultFn() --> the default-function of the event</li>
                 *      <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
                 * </ul>
                 * @since 0.0.1
                 */
                defineEvent: function (eventName) {
                    return instanceEvent.defineEvent(composeCustomevent(eventName));
                },

                /**
                 * Emits the event `eventName` on behalf of the instance holding this method.
                 *
                 * @method emit
                 * @param eventName {String} name of the event to be sent (available as e.type)
                 *        you could pass a customEvent here 'emitterName:eventName', which would
                 *        overrule the `instance-emitterName`
                 * @param payload {Object} extra payload to be added to the event-object
                 * @return {Promise}
                 * <ul>
                 *     <li>on success: returnValue {Any} of the defaultFn</li>
                 *     <li>on error: reason {Any} Either: description 'event was halted', 'event was defaultPrevented' or the returnvalue of the preventedFn</li>
                 * </ul>
                 * @since 0.0.1
                 */
                emit: function(eventName, payload) {
                    return instanceEvent.emit(this, eventName, payload);
                },

                /**
                 * Removes all event-definitions of the instance holding this method.
                 *
                 * @method undefAllEvents
                 * @since 0.0.1
                 */
                undefAllEvents: function () {
                    instanceEvent.undefEvent(emitterName);
                },

                /**
                 * Removes the event-definition of the specified customEvent.
                 *
                 * @method undefEvent
                 * @param eventName {String} name of the customEvent, without `emitterName`.
                 *        The calculated customEvent which will be undefined, will have the syntax: `emitterName:eventName`.
                 *        where `emitterName:` is automaticly prepended.
                 * @since 0.0.1
                 */
                undefEvent: function (eventName) {
                    instanceEvent.undefEvent(composeCustomevent(eventName));
                }

            };
            // register the emittername:
            instanceEvent.defineEmitter(newEmitter, emitterName);
            return newEmitter;
        };
    }
};

module.exports = createEmitter;
},{}],4:[function(require,module,exports){
"use strict";

/**
 * Extends the Event-instance by adding the object `Listener` to it.
 * The returned object should be merged into any Class-instance or object you want to
 * extend with the listener-methods, so the appropriate methods can be invoked on the instance.
 *
 * Should be called using  the provided `extend`-method like this:
 * @example
 * var Event = require('event');<br>
 * var EventListener = require('event-listener');<br>
 * EventListener.mergeInto(Event);
 *
 * @module event
 * @submodule event-listener
 * @class Event.Listener
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/

var NAME = '[event-listener]: ',

createListener = {
    mergeInto: function (instanceEvent) {
        /**
         * Holds all event-listener methods.
         * The returned object should be merged into any Class-instance or object you want to
         * extend with the listener-methods, so the appropriate methods can be invoked on the instance.
         *
         * See [Event.Listener](Event.Listener.html) for all properties that can be merged.
         *
         * @example
         *     var blueObject = {};
         *     blueObject.merge(Event.Listener);
         *     blueObject.after('*:save', function(e) {
         *         ...
         *     });
         *
         * @example
         *     Members.mergePrototypes(Event.Listener);
         *     var myMembers = new Members();
         *     myMembers.after('PersonalProfile:save', function(e) {
         *         ...
         *     });
         *
         * @for Event
         * @property Listener
         * @type Object
         * @since 0.0.1
         */

        /**
         * This object should be merged into any Class-instance or object that you want to provide
         * event-listener methods. This way, the appropriate methods can be invoked on the instance.
         * instead of using the static Event-methods.
         *
         * It is highly recommendable to merge on the prototype instead of the instance. See the docs.
         *
         * @class Event.Listener
         *
        */
        instanceEvent.Listener = {
            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             *
             * @method after
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            after: function (customEvent, callback, filter, prepend) {
                return instanceEvent.after(customEvent, callback, this, filter, prepend);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `before` the defaultFn.
             *
             * @method before
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            before: function (customEvent, callback, filter, prepend) {
                return instanceEvent.before(customEvent, callback, this, filter, prepend);
            },

            /**
             * Detaches (unsubscribes) the listener from the specified customEvent,
             * on behalf of the object who calls this method.
             *
             * @method detach
             * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
             *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
             * @since 0.0.1
            */
            detach: function(customEvent) {
                instanceEvent.detach(this, customEvent);
            },

            /**
             * Detaches (unsubscribes) the listener from all customevents,
             * on behalf of the object who calls this method.
             *
             * @method detachAll
             * @since 0.0.1
            */
            detachAll: function() {
                instanceEvent.detachAll(this);
            },

            /**
             * Alias for `after`.
             *
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             *
             * @method on
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            on: function (/* customEvent, callback, filter, prepend */) {
                return this.after.apply(this, arguments);
            },

            /**
             * Alias for `onceAfter`.
             *
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             * The subscriber will be automaticly removed once the callback executed the first time.
             * No need to `detach()` (unless you want to undescribe before the first event)
             *
             * @method onceAfter
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            once: function (/* customEvent, callback, filter, prepend */) {
                return this.onceAfter.apply(this, arguments);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             * The subscriber will be automaticly removed once the callback executed the first time.
             * No need to `detach()` (unless you want to undescribe before the first event)
             *
             * @method onceAfter
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            onceAfter: function (customEvent, callback, filter, prepend) {
                return instanceEvent.onceAfter(customEvent, callback, this, filter, prepend);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `before` the defaultFn.
             * The subscriber will be automaticly removed once the callback executed the first time.
             * No need to `detach()` (unless you want to undescribe before the first event)
             *
             * @method onceBefore
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            onceBefore: function (customEvent, callback, filter, prepend) {
                return instanceEvent.onceBefore(customEvent, callback, this, filter, prepend);
            }
        };
    }
};

module.exports = createListener;
},{}],5:[function(require,module,exports){
/**
Pollyfils for often used functionality for objects
@module Object
*/
/**
Pollyfils for often used functionality for objects
@class Object
*/
(function () {
	"use strict";
	// This from es5-shim
	// https://github.com/es-shims/es5-shim
	var ObjectPrototype = Object.prototype;
	var supportsDescriptors = Object.defineProperty && (function () {
		try {
			Object.defineProperty({}, 'x', {});
			return true;
		} catch (e) { /* this is ES3 */
			return false;
		}
	}());

	// Define configurable, writable and non-enumerable props
	// if they don't exist.
	var defineProperty;
	if (supportsDescriptors) {
		defineProperty = function (object, name, method, forceAssign) {
			if (!forceAssign && (name in object)) {
				return;
			}
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				writable: true,
				value: method
			});
		};
	} else {
		defineProperty = function (object, name, method, forceAssign) {
			if (!forceAssign && (name in object)) {
				return;
			}
			object[name] = method;
		};
	}
	var defineProperties = function (object, map, forceAssign) {
		var names = Object.keys(map),
			l = names.length,
			i = -1,
			name;
		while (++i < l) {
			name = names[i];
			defineProperty(object, name, map[name], forceAssign);
		}
	};
	// -------------------
	var	_each = function (fn, context) {
		var keys = Object.keys(this),
			l = keys.length,
			i = -1,
			key;
		while(++i < l) {
			key = keys[i];
			fn.call(context, this[key], key, this);
		}
		return this;
	};

	defineProperties(ObjectPrototype, {
		/**
		 * Loops through all properties in the object.  Equivalent to Array.forEach.
		 * The callback is provided with the value of the property, the name of the property
		 * and a reference to the whole object itself.
		 * The context to run the callback in can be overriden, otherwise it is undefined.
		 *
		 * @method each
		 * @param fn {Function} Function to be executed on each item in the object.  It will receive
		 *                      value {any} value of the property
		 *                      key {string} name of the property
		 *                      obj {Object} the whole of the object
		 * @chainable
		*/

		each: function(fn, context) {
			if (context) return _each(fn, context);
			var keys = Object.keys(this),
				l = keys.length,
				i = -1,
				key;
			while(++i < l) {
				key = keys[i];
				fn(this[key], key, this);
			}
			return this;
		},

		/**
		 * Loops through the properties in an object until the callback function returns *truish*.
		 * The callback is provided with the value of the property, the name of the property
		 * and a reference to the whole object itself.
		 * The order in which the elements are visited is not predictable.
		 * The context to run the callback in can be overriden, otherwise it is undefined.
		 *
		 * @method some
		 * @param fn {Function} Function to be executed on each item in the object.  It will receive
		 *                      value {any} value of the property
		 *                      key {string} name of the property
		 *                      obj {Object} the whole of the object
		 * @return {Boolean} true if the loop was interrupted by the callback function returning *truish*.
		*/
		some: function (fn, context) {
			var keys = Object.keys(this),
				l = keys.length,
				i = -1,
				key;
			while(++i < l) {
				key = keys[i];
				if (fn.call(context, this[key], key, this)) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Loops through the properties in an object until the callback assembling a new object
		 * with its properties set to the values returned by the callback function.
		 * If the callback function returns `undefined` the property will not be copied to the new object.
		 * The resulting object will have the same keys as the original, except for those where the callback
		 * returned `undefined` which will have dissapeared.
		 * The callback is provided with the value of the property, the name of the property
		 * and a reference to the whole object itself.
		 * The context to run the callback in can be overriden, otherwise it is undefined.
         *
		 * @method map
		 * @param fn {Function} Function to be executed on each item in the object.  It will receive
		 *                      value {any} value of the property
		 *                      key {string} name of the property
		 *                      obj {Object} the whole of the object
		 * @return {Object} The new object with its properties set to the values returned by the callback function.
		*/
		map: function (fn, context) {
			var keys = Object.keys(this),
				l = keys.length,
				i = -1,
				m = {},
				val, key;
			while(++i < l) {
				key = keys[i];
				val = fn.call(context, this[key], key, this);
				if (val !== undefined) {
					m[key] = val;
				}
			}
			return m;
		},
		/**
		 * Returns the keys of the object.
		 *
		 * @method keys
		 * @return {Array} Keys of the object
		*/
		keys: function () {
			return Object.keys(this);
		},
		/**
		 * Loops through the object collection the values of all its properties.
		 * It is the counterpart of the [`keys`](#method_keys).
		 *
		 * @method values
		 * @return {Array} values of the object
		*/
		values: function () {
			var keys = Object.keys(this),
				i = -1,
				len = keys.length,
				values = [];

			while(++i < len) {
				values.push(this[keys[i]]);
			}

			return values;
		},

		/**
		 * Returns true if the object has no own members
		 *
		 * @method isEmpty
		 * @return {Boolean} true if the object is empty
		 */
		isEmpty: function () {
			for (var key in this) {
				if (this.hasOwnProperty(key)) return false;
			}
			return true;
		},

		/**
		 * Returns a shallow copy of the object.
		 * It does not clone objects within the object, it does a simple, shallow clone.
		 * Fast, mostly useful for plain hash maps.
		 *
		 * @method shallowClone
		 * @return {Object} shallow copy of the original
		*/
		shallowClone: function () {
			var m = {},
				keys = Object.keys(this),
				l = keys.length,
				i = -1,
				key;
			while(++i < l) {
				key = keys[i];
				m[key] = this[key];
			}
			return m;
		},

		/**
		 * Merges into this object the properties of the given object.
		 * If the second argument is true, the properties on the source object will be overwritten
		 * by those of the second object of the same name, otherwise, they are preserved.
		 *
		 * @method merge
		 * @param obj {Object} Object with the properties to be added to the original object
		 * @param forceAssign {Boolean} If true, the properties in `obj` will override those of the same name
		 *        in the original object
		 * @chainable
		*/
		merge: function (obj, forceAssign) {
			var m = this;
			if (obj && obj.each) obj.each(function (value, key) {
				if (forceAssign || !(key in m)) {
					m[key] = obj[key];
				}
			});
			return m;
		}



	});

	/**
	 * Returns a new object resulting of merging the properties of the given objects.
	 * The copying is shallow, complex properties will reference the very same object.
	 * Properties in later objects do **not overwrite** properties of the same name in earlier objects.
	 * If any of the objects is missing, it will be skiped.
     *
	 * @example
     *
	 * 	var foo = function (config) {
	 * 		 config = Object.merge(config, defaultConfig);
	 * 	}
     *
	 * @method merge
	 * @static
	 * @param obj* {Object} Objects whose properties are to be merged
	 * @return {Object} new object with the properties merged in.
	*/
	Object.merge = function () {
		var m = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			if (obj) m.merge(obj);
		});
		return m;
	};

	defineProperties(Function.prototype, {
		/**
		 * Merges the given map of properties into the `prototype` of the Class.
         * Not to be used on instances.
         *
		 * @method mergePrototypes
		 * @param map {Object} Hash map of properties to add to the prototype of this object
		 * @param forceAssign {Boolean}  If true, it will override any existing property by the same name
		 * @chainable
		*/
		mergePrototypes: function (map, forceAssign) {
			defineProperties(this.prototype, map, forceAssign);
			return this;
		},
		/**
		 * Returns a newly created class inheriting from this class
		 * using the given `constructor` with the
		 * prototypes listed in `prototypes` merged in.
		 *
		 *
		 * The newly created class has the `superclass` static property
		 * available to access all of is ancestor's instance methods.
		 *
		 * Further methods can be added via the [mergePrototypes](#method_mergePrototypes).
		 *
		 * @example
		 *
		 * 	var Circle = Shape.subClass(
		 * 		function (x, y, r) {
		 * 			this.r = r;
		 * 			Circle.superclass.constructor.call(this, x, y);
		 * 		},
		 * 		{
		 * 			area: function () {
		 * 				return this.r * this.r * Math.PI;
		 * 			}
		 * 		}
		 * 	);
         *
		 * @method subClass
		 * @param [constructor] {Function} The function that will serve as constructor for the new class.
		 *        If `undefined` defaults to `Object.constructor`
		 * @param [prototypes] {Object} Hash map of properties to be added to the prototype of the new class.
		 * @return the new class.
		*/
		subClass: function (constructor, prototypes) {
			var create = function () {
				function F() {}

				return function (obj) {
					F.prototype = obj;
					return new F();
				};
			}();

			if ((arguments.length === 1) && (typeof constructor !== 'function')) {
				prototypes = constructor;
				constructor = null;
			}


			constructor = constructor || function (ancestor) {
				return function () {
					ancestor.apply(this, arguments);
				};
			}(this);


			var baseProt = this.prototype || Function.prototype,
				rp = create(baseProt);
			constructor.prototype = rp;

			rp.constructor = constructor;
			constructor.superclass = baseProt;

			// assign constructor property
			if (this != Object && baseProt.constructor == Object.prototype.constructor) {
				baseProt.constructor = this;
			}
			// add prototype overrides
			if (prototypes) {
				constructor.mergePrototypes(prototypes, true);
			}

			return constructor;
		},

		/**
		 * Sets the context of which the function will be execute. in the
		 * supplied object's context, optionally adding any additional
		 * supplied parameters to the end of the arguments the function
		 * is executed with.
		 *
		 * @method rbind
		 * @param [context] {Object} the execution context.
		 *        The value is ignored if the bound function is constructed using the new operator.
		 * @param [args*] {any} args* 0..n arguments to append to the end of
		 *        arguments collection supplied to the function.
		 * @return {function} the wrapped function.
		 */
		rbind: function(context /*, args* */) {
			var thisFunction = this,
				arrayArgs,
				slice = Array.prototype.slice;
			context || (context = this);
			if (arguments.length > 1) {
				// removing `context` (first item) by slicing it out:
				arrayArgs = slice.call(arguments, 1);
			}

			return (arrayArgs ?
				function() {
					// over here, `arguments` will be the "new" arguments when the final function is called!
					return thisFunction.apply(context, slice.call(arguments, 0).concat(arrayArgs));
				}:
				function() {
					// over here, `arguments` will be the "new" arguments when the final function is called!
					return thisFunction.apply(context, arguments);
				}
			);
		}
	});
	defineProperty(Object, 'createClass', function (constructor, prototype) {
		return Function.prototype.subClass(constructor, prototype);
	});
})();

},{}],6:[function(require,module,exports){
"use strict";
require('ypromise');
/**
 * Provides additional Promise-methods. These are extra methods which are not part of the PromiseA+ specification,
 * But are all Promise/A+ compatable.
 *
 * @module Promise
 * @submodule promise-ext
 * @class Promise
*/

var NAME = '[core-promise-ext]: ',
    ARRAY_EXPECTED = ' expects an array of values or promises', // include leading space!
    FUNCTION_EXPECTED = ' expects an array of function-references', // include leading space!
    PROMISE_CHAIN = 'Promise.chain';

/**
 * Returns a Promise that always fulfills. It is fulfilled when ALL items are resolved (either fulfilled
 * or rejected). This is useful for waiting for the resolution of multiple
 * promises, such as reading multiple files in Node.js or making multiple XHR
 * requests in the browser. Because -on the contrary of `Promise.all`- **finishAll** waits until
 * all single Promises are resolved, you can handle all promises, even if some gets rejected.
 *
 * @method finishAll
 * @param items {Any[]} an array of any kind of items, promises or not. If a value is not a promise,
 * its transformed into a resolved promise.
 * @return {Promise} A promise for an array of all the fulfillment items:
 * <ul>
 *     <li>Fulfilled: o {Object}
 *         <ul>
 *             <li>fulfilled {Array} all fulfilled responses, any item that was rejected will have a value of `undefined`</li>
 *             <li>rejected {Array} all rejected responses, any item that was fulfilled will have a value of `undefined`</li>
 *         </ul>
 *     </li>
 *     <li>Rejected: this promise **never** rejects</li>
 * </ul>
 * @static
 */
Promise.finishAll = function (items) {
    console.log(NAME, 'finishAll');
    return new Promise(function (fulfill, reject) {
        // Array.isArray assumes ES5
        Array.isArray(items) || (items=[items]);

        var remaining        = items.length,
            length           = items.length,
            fulfilledresults = [],
            rejectedresults  = [],
            i;

        function oneDone(index, fulfilled) {
            return function (value) {
                fulfilled ? (fulfilledresults[index]=value) : (rejectedresults[index]=value);
                remaining--;
                if (!remaining) {
                    console.log(NAME, 'finishAll is fulfilled');
                    fulfill({
                        fulfilled: fulfilledresults,
                        rejected: rejectedresults
                    });
                }
            };
        }

        if (length < 1) {
            console.warn(NAME, 'finishAll fulfilles immediately: no items');
            return fulfill({
                        fulfilled: fulfilledresults,
                        rejected: rejectedresults
                    });
        }

        fulfilledresults.length = length;
        rejectedresults.length = length;
        for (i=0; i < length; i++) {
            Promise.resolve(items[i]).then(oneDone(i, true), oneDone(i, false));
        }
    });
};

/**
 * Returns a Promise which chains the function-calls. Like an automated Promise-chain.
 * Invokes the functionreferences in a chain. You MUST supply function-references, it doesn't
 * matter wheter these functions return a Promise or not. Any returnvalues are passed through to
 * the next function.
 *
 * **Cautious:** you need to pass function-references, not invoke them!
 * chainFns will invoke them when the time is ready. Regarding to this, there is a difference with
 * using Promise.all() where you should pass invoked Promises.
 *
 * If one of the functions returns a Promise, the chain
 * will wait its execution for this function to be resolved.
 *
 * If you need specific context or arguments: use Function.bind for these items.
 * If one of the items returns a rejected Promise, by default: the whole chain rejects
 * and following functions in the chain will not be invoked. When `finishAll` is set `true`
 * the chain will always continue even with rejected Promises.
 *
 * Returning functionvalues are passed through the chain adding them as an extra argument
 * to the next function in the chain (argument is added on the right)
 *
 * @example
 *     var a = [], p1, p2, p3;
 *     p1 = function(a) {
 *         return new Promise(function(resolve, reject) {
 *             I.later(function() {
 *                 console.log('resolving promise p1: '+a);
 *                 resolve(a);
 *             }, 1000);
 *         });
 *     };
 *     p2 = function(b, r) {
 *         var value = b+r;
 *         console.log('returning p2: '+value);
 *         return value;
 *     };
 *     p3 = function(c, r) {
 *         return new Promise(function(resolve, reject) {
 *             I.later(function() {
 *                 var value = b+r;
 *                 console.log('resolving promise p3: '+value);
 *                 resolve(value);
 *             }, 1000);
 *         });
 *     };
 *     a.push(p1.bind(undefined, 100));
 *     a.push(p2.bind(undefined, 200));
 *     a.push(p3.bind(undefined, 300));
 *     Promise.chainFns(a).then(
 *         function(r) {
 *             console.log('chain resolved with '+r);
 *         },
 *         function(err) {
 *             console.log('chain-error '+err);
 *         }
 *     );
 *
 * @method chainFns
 * @param funcs {function[]} an array of function-references
 * @param [finishAll=false] {boolean} to force the chain to continue, even if one of the functions
 *        returns a rejected Promise
 * @return {Promise}
 * on success:
    * o {Object} returnvalue of the laste item in the Promisechain
 * on failure an Error object
    * reason {Error}
 * @static
 */
Promise.chainFns = function (funcs, finishAll) {
    console.log(NAME, 'chainFns');
    var handleFn, length, handlePromiseChain,
        i = 0;
    // Array.isArray assumes ES5
    Array.isArray(funcs) || (funcs=[funcs]);
    length = funcs.length;
    handleFn = function() {
        var nextFn = funcs[i],
            promise;
        if (typeof nextFn !== 'function') {
            return Promise.reject(new TypeError(PROMISE_CHAIN+FUNCTION_EXPECTED));
        }
        promise = Promise.resolve(nextFn.apply(null, arguments));
        // by using "promise.catch(function(){})" we return a resolved Promise
        return finishAll ? promise.thenFulfill() : promise;
    };
    handlePromiseChain = function() {
        // will loop until rejected, which is at destruction of the class
        return handleFn.apply(null, arguments).then((++i<length) ? handlePromiseChain : undefined);
    };
    return handlePromiseChain();
};

/**
 * Promise which can be put at the very end of a chain, even after .catch().
 * Will invoke the callback function regardless whether the chain resolves or rejects.
 *
 * The argument of the callback will be either its fulfilled or rejected argument, but
 * it is wisely not to handle it. The results should have been handled in an earlier step
 * of the chain: .finally() basicly means you want to execute code after the chain, regardless
 * whether it's resolved or rejected.
 *
 * **Note:** .finally() <u>does not return a Promise</u>: it should be used as the very last step of a Promisechain.
 * If you need an intermediate method, you should take .thenFulfill().
 *
 * @method finally
 * @param finallyback {Function} the callbackfunctio to be invoked.
 */
Promise.prototype.finally = function (finallyback) {
    console.log(NAME, 'finally');
    this.then(finallyback, finallyback);
};

/**
 * Will always return a fulfilled Promise.
 *
 * Typical usage will be by making it part of a Promisechain: it makes the chain go
 * into its fulfilled phase.
 *
 * @example
 *
 * promise1
 * .then(promise2)
 * .thenFulfill()
 * .then(handleFulfilled, handleRejected) // handleFulfilled always gets invoked
 * @method thenFulfill
 * @param [response] {Object} parameter to pass through which overrules the original Promise-response.
 * @return {Promise} Resolved Promise. `response` will be passed trough as parameter when set.
 *         When not set: in case the original Promise resolved, its parameter is passed through.
 *         in case of a rejection, no parameter will be passed through.
 */
Promise.prototype.thenFulfill = function (callback) {
    console.log(NAME, 'thenFulfill');
    return this.then(
        function(r) {
            return r;
        },
        function(r) {
            return r;
        }
    ).then(callback);
};

/**
 * Returns a Promise with 3 additional methods:
 *
 * promise.fulfill
 * promise.reject
 * promise.callback
 *
 * With Promise.manage, you get a Promise which is managable from outside, not inside as Promise A+ work.
 * You can invoke promise.**callback**() which will invoke the original passed-in callbackFn - if any.
 * promise.**fulfill**() and promise.**reject**() are meant to resolve the promise from outside, just like deferred can do.
 *
 * @example
 *     var promise = Promise.manage(
 *         function(msg) {
 *             alert(msg);
 *         }
 *     );
 *
 *     promise.then(
 *         function() {
 *             // promise is fulfilled, no further actions can be taken
 *         }
 *     );
 *
 *     setTimeout(function() {
 *         promise.callback('hey, I\'m still busy');
 *     }, 1000);
 *
 *     setTimeout(function() {
 *         promise.fulfill();
 *     }, 2000);
 *
 * @method manage
 * @param callbackFn {Function} invoked everytime promiseinstance.callback() is called.
 * @return {Promise} with three handles: fulfill, reject and callback.
 * @static
 */
Promise.manage = function (callbackFn) {
    console.log(NAME, 'manage');
    var fulfillHandler, rejectHandler, promise, finished;

    promise = new Promise(function (fulfill, reject) {
        fulfillHandler = fulfill;
        rejectHandler = reject;
    });

    promise.fulfill = function (value) {
        console.log(NAME, 'manage.fulfill');
        finished = true;
        fulfillHandler(value);
    };

    promise.reject = function (reason) {
        console.log(NAME, 'manage.reject '+((typeof reason==='string') ? reason : reason && (reason.message || reason.description)));
        finished = true;
        rejectHandler(reason);
    };

    promise.callback = function () {
        if (!finished) {
            console.log('NAME, manage.callback is invoked');
            callbackFn && callbackFn.apply(undefined, arguments);
        }
    };

    return promise;
};

},{"ypromise":2}],7:[function(require,module,exports){
module.exports = {
	idGenerator: require('./lib/idgenerator.js').idGenerator,
	typeOf: require('./lib/typeof.js').typeOf,
	later: require('./lib/timers.js').later,
	async: require('./lib/timers.js').async
};
},{"./lib/idgenerator.js":8,"./lib/timers.js":9,"./lib/typeof.js":10}],8:[function(require,module,exports){
"use strict";

var UNDEFINED_NS = '__undefined__';
var namespaces = {};
/**
Collection of various utility functions.

@module core
@submodule core-utils
@class Utils
@static
*/
/**
 * Generates an unique id with the signature: "namespace-follownr"
 *
 * @example
 * 
 *     var generator = require('core-utils-idgenerator');
 *
 *     console.log(generator()); // --> 1
 *     console.log(generator()); // --> 2
 *     console.log(generator(1000)); // --> 1000
 *     console.log(generator()); // --> 1001
 *     console.log(generator('Parcel, 500')); // -->"Parcel-500"
 *     console.log(generator('Parcel')); // -->"Parcel-501"
 * 
 *
 * @method idGenerator
 * @param [namespace] {String} namespace to prepend the generated id.
 *        When ignored, the generator just returns a number.
 * @param [start] {Number} startvalue for the next generated id. Any further generated id's will preceed this id.
 *        If `start` is lower or equal than the last generated id, it will be ignored.
 * @return {Number|String} an unique id. Either a number, or a String (digit prepended with "namespace-")
 */
module.exports.idGenerator = function(namespace, start) {
	// in case `start` is set at first argument, transform into (null, start)
/*jshint expr:true */
	(typeof namespace==='number') && (start=namespace) && (namespace=null);
	namespace || (namespace=UNDEFINED_NS);
/*jshint expr:false */
	if (!namespaces[namespace]) {
		namespaces[namespace] = start || 1;
	}
	else if (start && (namespaces[namespace]<start)) {
		namespaces[namespace] = start;
	}
	return (namespace===UNDEFINED_NS) ? namespaces[namespace]++ : namespace+'-'+namespaces[namespace]++;
};

},{}],9:[function(require,module,exports){
(function (process){
/**
 * Provides Timer (async) functionality.
 *
 * Also finilisez by calling `_afterAsyncFn()` on the host, if specified.
 * `_afterAsyncFn` could be defined on the host to get informed whenever an asynchronous action
 * has occured by this module
 * @module core-utils
 * @submodule core-timers
*/

"use strict";

//var NAME = '[core-timers]: ';
/**
 * Forces a function to be run asynchronously, but as fast as possible. In Node.js
 * this is achieved using `setImmediate` or `process.nextTick`.
 *
 * @method _asynchronizer
 * @param callbackFn {Function} The function to call asynchronously
 * @static
 * @private
**/
var _asynchronizer = (typeof setImmediate !== 'undefined') ?
                        function (fn) {setImmediate(fn);} :
                        ((typeof process !== 'undefined') && process.nextTick) ?
                            process.nextTick :
                            function (fn) {setTimeout(fn, 0);};


/**
 * Invokes the callbackFn once in the next turn of the JavaScript event loop. If the function
 * requires a specific execution context or arguments, wrap it with Function.bind.
 *
 * I.async returns an object with a cancel method.  If the cancel method is
 * called before the callback function, the callback function won't be called.
 *
 * @method async
 * @for ITSA
 * @param {Function} callbackFn
 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
 * @return {Object} An object with a cancel method.  If the cancel method is
 * called before the callback function, the callback function won't be called.
**/
module.exports.async = function (callbackFn, invokeAfterFn) {
	//console.log(NAME, 'async');
	var host = this,
		canceled;

	invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
	(typeof callbackFn==='function') && _asynchronizer(function () {
		if (!canceled) {
			callbackFn();
			// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
			invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
		}
	});

	return {
		cancel: function () {
			canceled = true;
		}
	};
};

/**
 * Invokes the callbackFn after a timeout (asynchronous). If the function
 * requires a specific execution context or arguments, wrap it with Function.bind.
 *
 * To invoke the callback function periodic, set 'periodic' either 'true', or specify a second timeout.
 * If number, then periodic is considered 'true' but with a perdiod defined by 'periodic',
 * which means: the first timer executes after 'timeout' and next timers after 'period'.
 *
 * I.later returns an object with a cancel method.  If the cancel() method is
 * called before the callback function, the callback function won't be called.
 *
 * @for ITSA
 * @method later
 * @param callbackFn {Function} the function to execute.
 * @param [timeout] {Number} the number of milliseconds to wait until the callbackFn is executed.
 * when not set, the callback function is invoked once in the next turn of the JavaScript event loop.
 * @param [periodic] {boolean|Number} if true, executes continuously at supplied, if number, then periodic is considered 'true' but with a perdiod
 * defined by 'periodic', which means: the first timer executes after 'timeout' and next timers after 'period'.
 * The interval executes until canceled.
 * @param [invokeAfterFn=true] {boolean} set to false to prevent the _afterSyncFn to be invoked
 * @return {object} a timer object. Call the cancel() method on this object to stop the timer.
*/
module.exports.later=  function (callbackFn, timeout, periodic, invokeAfterFn) {
	//console.log(NAME, 'later --> timeout: '+timeout+'ms | periodic: '+periodic);
	var host = this,
		canceled = false;
	invokeAfterFn = (typeof invokeAfterFn === 'boolean') ? invokeAfterFn : true;
	if (!timeout) {
		return host.async(callbackFn);
	}
	var interval = periodic,
		secondtimeout = (typeof interval==='number'),
		secondairId,
		wrapper = function() {
			// IE 8- and also nodejs may execute a callback, so in order to preserve
			// the cancel() === no more runny-run, we have to build in an extra conditional
			if (!canceled) {
				callbackFn();
				secondtimeout && (secondairId=setInterval(wrapperInterval, interval));
				// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
				invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
			}
		},
		wrapperInterval = function() {
			// IE 8- and also nodejs may execute a setInterval callback one last time
			// after clearInterval was called, so in order to preserve
			// the cancel() === no more runny-run, we have to build in an extra conditional
			if (!canceled) {
				callbackFn();
				// in case host._afterAsyncFn is defined: invoke it, to identify that later has been executed
				invokeAfterFn && host._afterAsyncFn && host._afterAsyncFn();
			}
		},
		id;
	(typeof callbackFn==='function') && (id=(interval && !secondtimeout) ? setInterval(wrapperInterval, timeout) : setTimeout(wrapper, timeout));

	return {
		cancel: function() {
			canceled = true;
			interval ? clearInterval(id) : clearTimeout(id);
			secondairId && clearInterval(secondairId);
		}
	};
};
}).call(this,require('_process'))
},{"_process":20}],10:[function(require,module,exports){
"use strict";
var TYPES = {
	'undefined'        : 'undefined',
	'number'           : 'number',
	'boolean'          : 'boolean',
	'string'           : 'string',
	'[object Function]': 'function',
	'[object RegExp]'  : 'regexp',
	'[object Array]'   : 'array',
	'[object Date]'    : 'date',
	'[object Error]'   : 'error'
};
/**
Collection of various utility functions.

@module core
@submodule core-utils
@class Utils
@static
*/
/**
 * Improved version of the `typeof` operator, distinguishes Arrays, Date and nulls from Object.
 *
 * Returns one of the following strings, representing the type of the item passed in:
 *
 * "array"
 * "boolean"
 * "date"
 * "error"
 * "function"
 * "null"
 * "number"
 * "object"
 * "regexp"
 * "string"
 * "undefined"
 *
 * @method typeOf
 * @param o {Any} the item to test.
 * @return {string} the detected type.
 * @static
**/
module.exports.typeOf = function(o) {
	return TYPES[typeof o] || TYPES[({}.toString).call(o)] || (o ? 'object' : 'null');
};
},{}],11:[function(require,module,exports){
"use strict";

/**
 * Provides virtual dom functionality for other modules.
 *
 * The module exports a single function which should be called to 
 * fetch the [vDOM](../classes/vDOM.html) class.
 * 
 * The function must be passed a reference to the DOM `window` object
 * or a reasonable substitute.
 * For modules to be loaded through Browserify, 
 * this is usually `global.window`.  For modules loaded both through
 * Browserify or node, assuming a suitable emulator, it can be
 * done like this:
 
 * ```   
 *    var vDOM = require('core-vdom')(global.window || require('dom-window-emulator'));
 * ```
 *
 * @module core
 * @submodule core-vdom
 */
/**
 * Contains the virtual DOM handling methods and properties
 * @class vDOM
*/
var	_typeOf = require('core-utils').typeOf,
	vNodesCache = {},
	vNodeParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g,
	vNodeAttrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/,
	rootParcel;


require('core-lang-ext');
module.exports = function (window) {
	var document = window.document;
	var v = {
		/**
		Hash of special `tagNames` that imply change in the XML namespacing.

		@property _xmlNS
		@type hash
		@private
		*/
		_xmlNS : {
			svg:"http://www.w3.org/2000/svg",
			math:"http://www.w3.org/1998/Math/MathML"
		},
		/**
		The virtual DOM for the application.

		@property _vDOM
		@type vNode
		@private
		*/
		_vDOM: null,
		/**
		 * Helper function to build [vNodes](vNode.html).
		 *
		 * It takes the name of the `tag` to be created.
		 * It supports the following four modifiers, following the rules of CSS selectors:
		 *
		 * * A `namespace` prefix followed by a colon:  `svg:line` (not needed, see note below)
		 * * One or more CSS classes, each preceeded by a dot: `div.list`
		 * * An `id` preceeded by a pound: `div#a1`
		 * * One or more attribute assignments, each enclosed in square brackets: `input[type=checkbox]`
		 *
		 * Though the last three modifiers can be set via the `attrs` argument,
		 * for performance reasons, if they won't change during the application
		 * it is better to set them via the above modifiers and reserve
		 * the attributes for variable parts.
		 *
		 * If modifiers are used, the tagName itself can be omitter and a `div` will be assumed.
		 * Thus, `#a1` is the same as `div#al`.
		 *
		 * Attributes `class` and `style` have special treatment.
		 *
		 * The `class` attribute can be given as a string or as an array of values, the last being preferable.
		 *
		 * The `style` attribute should be set with an object containing a hash map of style names to values.
		 * The style names should be in JavaScript format, not CSS format that is, `backgroundColor` not `background-color`.
		 *
		 * Neither the `svg:` or the `math:` namespaces are required.  The renderer will add the corresponding
		 * `xmlns` attribute upon detecting the `<svg>` or `<math>` elements.  All elements contained within
		 * any of those will be properly namespaced.
		 * 
		 * @example
		 *```
		 *    var v = ITSA.Parcel.vNode;
		 *
		 *    v('br');
		 *    // produces:
		 *    {tag: 'br', attrs:{}, children:[]}
		 *    // Which will result in: <br/>
		 *
		 *    v('ul.list', options.map(function (option) {
		 *        return v('li', {'data-key': option.key}, option.text);
		 *    }));
		 *    // produces:
		 *    {tag:'ul', attrs: {class:'list'}, children: [
		 *        {tag:'li', attrs: {'data-key': 'k1'}, children: ['first value']},
		 *        {tag:'li', attrs: {'data-key': 'k2'}, children: ['second value']}
		 *    }
		 *    // Which would result in:
		 *    //<ul class="list">
		 *    //    <li data-key="k1">first value</li>
		 *    //    <li data-key="k2">second value</li>
		 *    //</ul>
		 *
		 *    v('a#google.external[href="http://google.com"]", 'Google');
		 *    //would eventually result in:
		 *    <a id="google" class="external" href="http://google.com">Google</a>
		 *```
		 * It is recommended that unchanging classNames, IDs and attributes be encoded into the `tag` to improve
		 * efficiency, as these can be cached.   Use the `attrs` object for variable attributes.
		 * 
		 * @method vNode
		 * @static
		 * @param tag {String} Name of the tag to be created.
		 *  Much like with a CSS selector,
		 *  it can be followed by a `#` and an ID,
		 *  any number of CSS classNames each preceded by a `.`
		 *  and attribute assignments enclosed in square brackets (see example above).
		 * @param [attrs] {Object} Collection of attributes to be set on the node.
		 *  Any value assigned to the `class` attribute will be appended to those provided along the tag.
		 * @param [children] {any}  It can be a further virtual DOM node, a parcel, 
		 * a simple value which will result in a text string or an array of either.
		 * @return {Object} virtual DOM node.
		*/
		vNode: function (tag, attrs, children) {
			var classes = [], vAttrs = {};


			// If the attrs argument is not actually an object, it might have been ommited, shift it into the children
			// If it is an object and has a tag property, it is likely to be a vNode
			// If it has a view function, it is likely to be a parcel instance.
			if (_typeOf(attrs) != 'object' || typeof attrs.tag == 'string' || typeof attrs.view == 'function') {
				children = attrs;
				attrs = {};
			}

			// Check the cache
			var vNode = vNodesCache[tag];
			if (vNode === undefined) {
				// save the new node into the cache
				vNodesCache[tag] = vNode = {tag: "div"};
				var match;
				/*jshint boss:true*/
				// Parse the tag.
				while (match = vNodeParser.exec(tag)) {
					/*jshint boss:false*/
					switch (match[1]) {
						case "":
							vNode.tag = match[2];
							break;
						case "#":
							vAttrs.id = match[2];
							break;
						case ".":
							classes.push(match[2]);
							break;
						default:
							if (match[3][0] == "[") {
								var pair = vNodeAttrParser.exec(match[3]);
								vAttrs[pair[1]] = pair[3] || (pair[2] ? "" :true);
							}
							// Styles need to be processed or documented that they shouldn't be used.
					}
				}
				if (classes.length) vAttrs.class = classes;
				if (!vAttrs.isEmpty()) vNode.attrs = vAttrs;
			}
			// Clone in order to avoid affecting the cached copy.
			vNode = vNode.shallowClone();
			vAttrs = (vNode.attrs?vNode.attrs.shallowClone():{});
			vAttrs.class = (vAttrs.class?vAttrs.class.slice():[]);
			var s = vAttrs.style; 
			if (s) vAttrs.style = s.shallowClone();

			// ensure the children are always an array.
			if (children !== undefined) {
				vNode.children = (_typeOf(children) == 'array' ? children : [children]);
			}
			for (var attrName in attrs) {
				switch (attrName) {
				case 'class':
					if (typeof attrs.class == 'string') {
						attrs.class = attrs.class.trim().replace(/\s+/,' ').split(' ');
					}
					vAttrs.class = vAttrs.class.concat(attrs.class);
					break;
				case 'style':
					vAttrs.style = Object.merge(attrs.style, vAttrs.style); // the new styles should prevail
					if (vAttrs.style.isEmpty()) delete vAttrs.style;
					break;
				default:
					vAttrs[attrName] = attrs[attrName];
				}
			}

			if (!vAttrs.class.length) delete vAttrs.class;
			if (!vAttrs.isEmpty()) vNode.attrs = vAttrs;
			return vNode;
		},

		/**
		 * Triggers the rendering process for the page or parcel.
		 *
		 * The rendering process starts with the production of a new virtual DOM for the page or component
		 * and a comparisson of the newly created *expected* DOM against the *existing* DOM.
		 * The render process will only change those nodes in the actual DOM that differ in between the two.
		 *
		 * Called without any arguments, it will start the process at the root of the virtual DOM.
		 * If provided with an argument it will start the process at the branch of the virtual DOM
		 * controlled by the given Parcel instance.
		 *
		 * @method render
		 * @static
		 * @param [parcel] {Parcel} Instance of Parcel in control of a section of a page.
		 *
		*/
		render: function (parcel) {
			parcel = parcel || rootParcel;

			v._diffPNode(parcel._pNode, parcel);
		},

		/**
		Determines which [Parcel](Parcel.html) instance is the root app for this page
		and which is the DOM element it corresponds to and renders the app.

		If ITSA controls the whole screen, the corresponding DOM element is going to be
		`document.body`, which is the default when omitted.

		@method rootApp
		@param parcel {Parcel} instance of [Parcel](Parcel.html) that is the root of the app
		@param [element=document.body] {DOM element} DOM element that is the root of the app
		@return {Parcel} the `parcel` argument;
		@static
		*/
		rootApp: function (parcel, rootNode) {
			rootParcel = parcel;
			/* global document:true */
			rootNode = rootNode || document.body;
			// Set a vNode to match the root
			v._vDOM = {
				tag:rootNode.tagName,
				attrs:{}, // possibly not true, but it doesn't matter
				children:[],
				node:rootNode
			};
			var pNode = v._buildPNode(parcel);
			rootNode.appendChild(pNode.node);
			v._vDOM.children.push(pNode);

			return parcel;
		},
		/**
		Returns a new `pNode` based on the given parcel and namspace.

		@method _buildPNode
		@param parcel {Parcel} Parcel instance that serves as the basis for this parcel
		@param [namespace] {String} current XML namespace URL
		@return {pNode} a new `pNode` based on the given parcel
		@private
		*/

		_buildPNode: function (parcel, namespace) {
			var pNode = v._buildVNode(parcel.containerType, namespace)
				.merge( {parcel:parcel, stamp:NaN, attrs: {}, children:[]});
			
			parcel._pNode = pNode;
			v._diffPNode(pNode, parcel);
			return pNode;
		},
		/**
		Returns a new `vNode` based on the given `tag` and `namespace`

		@method _buildVNode
		@param tag {String} nodeName of the DOM node to be created.
		@param [namespace] {String} current XML namespace URL
		@return {vNode} a new `vNode`.
		@private
		*/
		_buildVNode: function (tag, namespace) {
			var xmlns = v._xmlNS[tag];

			namespace =  xmlns || namespace;

			var vNode = {
				tag:tag,
				node:(namespace?
					document.createElementNS(namespace, tag):
					document.createElement(tag)
				)
			};
			if (namespace) vNode.attrs = {xmlns:namespace};
			return vNode;
		},
		/**
		Returns a string node.

		@method _buildStringNode
		@param {String} Text to make the string node of
		@return {StringNode}
		@private
		*/
		_buildStringNode: function (s) {
			var sNode = new String(s);
			sNode.node = document.createTextNode(s);
			return sNode;
		},
		/**
		Skips over Parcels whose stamp has not changed, looking for nested parcels within

		@method _skipPNode
		@param children {[vNode | pNode]} Array of children to lookk into
		@private
		*/
		_skipPNode: function (children) {
			var child, l;
			if (children) {
				l = children.length || 0;
				for (var i = 0; i < l; i++) {
					child = children[i];
					if (child.parcel) {
						v._diffPNode(child.parcel._pNode, child.parcel);
					} else {
						v._skipPNode(child.children);
					}
				}
			}
		},

		/**
		Runs the differences in between an existing and the expected `pNodes`

		@method _diffPNode
		@param existing {pNode} The existing `pNode`
		@param parcel {Parcel} parcel that will supply the new pNode to compare against
		@protected
		@static
		*/
		_diffPNode: function (existing, parcel) {
			var stamp = parcel.stamp();
			if (existing.stamp === stamp) {
				v._skipPNode(existing.children);
			} else {
				existing.stamp = stamp;
				var children = parcel.view();
				if (!Array.isArray(children)) children = [children];

				var expected =  {parcel:parcel, stamp:NaN, children: children, attrs: {}};
				expected.attrs.merge(parcel.attributes);
				expected.attrs.class = ['parcel',  parcel.className];
				v._diffVNodes(existing, expected);
			}
		},

		/**
		Runs the difference between an existing and the expected `vNode`
		and makes the necessaty changes on the DOM based on the differences.
		At the end, the existing should match the expected.

		@method _diffVNodes
		@param existing {vNode} Branch of the virtual DOM that represents the actual, current DOM
		@param expected {vNode} The same branch as it should become
		@param [namespace] {String} current XML namespace URL
		@protected
		@static
		*/
		_diffVNodes: function ( existing, expected, namespace) {
			namespace = (existing.attrs && existing.attrs.xmlns) || namespace;
			v._diffAttrs(existing, expected, namespace);
			v._diffChildren(existing.node, existing, expected, namespace);
		},

		/**
		Compares the children of the existing and the expected vDOM and makes the necessary
		changes so it updates to the expected.

		@method _diffChildren
		@param parentEl {DOMElement} Element that contains the children represented by the existing vNode
		@param existing {vNode} virtual representation of the actual DOM
		@param expected {vNode} virtual representation of how it should be
		@param [namespace] {String} current XML namespace URL
		@protected
		@static
		*/
		_diffChildren: function (parentEl, existing, expected, namespace) {

			// need to take care of keyed elements
			var children = existing.children || [],
				newChildren = expected.children || [],
				l = Math.max(children.length, newChildren.length),
				childPos, node,
				child, newChild,
				operations = [];

			var removeEl = function (node) {
				node.parentNode.removeChild(node);
			};


			// The following functions all rely on accessing the local variables declared above through closure.
			// They cannot be moved outside of this function.
			var removeNode = function () {
				removeEl(child.node);
				children.splice(childPos,1);
			};
			var insertNode = function (oldNode) {
				if (oldNode) {
					parentEl.replaceChild(child.node, oldNode);
					children[childPos] = child;
				} else {
					parentEl.insertBefore(child.node, parentEl.childNodes[childPos]);
					children.splice(childPos,0,child);
				}
			};


			/*
			Replacers are functions to replace one kind of node for another.
			They are keyed with two letters corresponding to the current type of node
			and the new type of node.
			The types are provided by whatIsIt above, 
			u - undefined
			v - virtual node
			p - parcel node
			s - strings, integers or other value type that can be represented as text

			In looking for patterns I reordered this table in several ways.
			Currently it has all the ones where the origin and destination are the same first,
			then the rest grouped by destination.  
			*/
			var replacers = { 
				// All the ones that have the same type of destination as source
				uu: function () {
				},
				vv: function () {
					if (child.tag != newChild.tag) {
						var oldNode = child.node;
						child = v._buildVNode(newChild.tag, namespace);

						v._diffVNodes( child, newChild, namespace);

						insertNode(oldNode);
					} else {
						v._diffVNodes(child, newChild, namespace);
					}
				},
				pp: function () {
					if (child.parcel === newChild) {
						v._diffPNode(child, newChild);
					} else {
						var oldNode = child.node;
						child = v._buildPNode(newChild, namespace);

						insertNode(oldNode);
					}
				},
				ss: function () {
					if (child != newChild) {
						child.node.nodeValue = newChild;
						children[childPos] = new String(newChild);
						children[childPos].node = child.node;
					}
				},

				// These end up with nothing so whatever was there has to be removed:
				vu: removeNode,
				pu: removeNode,
				su: removeNode,

				// The following are ordered by destination

				uv: function () {
					child = v._buildVNode(newChild.tag, namespace);

					v._diffVNodes(child, newChild, namespace);

					insertNode();
				},
				pv: function () {
					var oldNode = child.node;

					child = v._buildVNode(newChild.tag, namespace);

					v._diffVNodes(child, newChild, namespace);

					insertNode(oldNode);
				},
				sv: function () {
					var oldNode = child.node;

					child = v._buildVNode(newChild.tag, namespace);

					v._diffVNodes(child, newChild, namespace);

					insertNode(oldNode);
				},
				up: function ()	{
					child = v._buildPNode(newChild, namespace);

					insertNode();
				},
				vp: function () {
					var oldNode = child.node;
					child = v._buildPNode(newChild, namespace);

					insertNode(oldNode);
				},
				sp: function () {
					var oldNode = child.node;
					child = v._buildPNode(newChild, namespace);

					insertNode(oldNode);
				},
				us: function () {
					child = v._buildStringNode(newChild);

					insertNode();
				},
				vs: function () {
					var oldNode = child.node;
					child = v._buildStringNode(newChild);

					insertNode(oldNode);
				},
				ps: function () {
					var oldNode = child.node;

					child = v._buildStringNode(newChild);

					insertNode(oldNode);
				}
			};

			var whatIsIt = function (child) {
				if (child === undefined) return 'u';
				if (typeof child === 'object') {
					if (typeof child.tag === 'string') return 'v'; //vNode
					if (typeof ((child.parcel && child.parcel.view) || child.view) === 'function') return 'p'; //pNode
				}
				return 's';  // Anything else is probably a value that can be turned into a string.

			};

			for (childPos = 0; childPos < l; childPos++) {
				child = children[childPos];
				newChild = newChildren[childPos];

				replacers[whatIsIt(child) + whatIsIt(newChild)]();

			}

			if (!existing.children && children.length) existing.children = children;
		},

		/**
		Compares the attributes of the existing virtual DOM and the expected
		and makes the differences.

		@method _diffAttrs
		@param existing {vNode} vNode whose attributes represent the current state
		@param expected {vNode} vNode whose attributes are the new expected state
		@param [namespace] {String} current XML namespace URL
		@protected
		@static
		*/
		_diffAttrs: function (existing, expected, namespace) {
			var attrs = existing.attrs || {},
				newAttrs = expected.attrs || {},
				node = existing.node;

			attrs.each(function (value, name) {
				if (! (name in newAttrs)) {
					delete attrs[name];
					if (namespace) {
						node.removeAttributeNS(namespace, name);
					} else {
						if (name != 'data') node.removeAttribute(name);
					}
					return; // continues the loop
				}
				var newValue = newAttrs[name];
				switch (name) {
					case 'style':
						v._diffStyles(existing, value, newValue);
						break;
					case 'class':
						v._diffClassNames(existing, value, newValue);
						break;
					case 'data':
						if (!namespace) break;
						/* jshint -W086 */
						// otherwise, fall through
					default:
						/* jshint +W086 */
						if (value !== newValue) {
							if (namespace && name == 'href') {
								node.setAttributeNS("http://www.w3.org/1999/xlink", name, value);
							} else {
								if (typeof newValue == 'function') {
									node[name] = newValue;
								} else {
									node.setAttribute(name, newValue);
								}
							}
						}
				}
				attrs[name] = newValue;
			});

			newAttrs.each(function (value, name) {
				if(!(name in attrs)) {
					attrs[name] = value;
					switch (name) {
						case 'style':
							value.each(function (style, key) {
								node.style[key] = style;
							});
							return;
						case 'class':
							node.className = value.join(' ');
							return;
						case 'data':
						if (!namespace) break;
							/* jshint -W086 */
							// otherwise, fall through
						default:
							/* jshint +W086 */
							if (namespace && name == 'href') {
								node.setAttributeNS("http://www.w3.org/1999/xlink", name, value);
							} else {
								if (typeof value == 'function') {
									node[name] = value;
								} else {
									node.setAttribute(name, value);
								}
							}
					}
				}
			});
			if (!existing.attrs && !attrs.isEmpty()) existing.attrs = attrs;
		},
		/**
		Compares the new and old list of classNames and 
		if there is any difference, it sets the whole thing at once.

		@method _diffClassNames
		@param existing {vDOM} virtual DOM node to apply this classes to
		@param value {Array} Object literal containing the current values
		@param newValue {Array} Object literal containin the new values
		@private
		*/
		_diffClassNames: function (existing, value, newValue) {
			value = (value || []); // the current one should already been sorted from the previous round.
			newValue = (newValue || []).sort();

			var l = value.length, i = 0;
			if (l === newValue.length) {
				while (i < l && value[i] == newValue[i]) i++;
			}
			if (i < l) {
				existing.node.className = newValue.join(' ');
			}
		},
		/**
		Compares the new and old styles and fixes the differences in the DOM

		@method _diffStyles
		@param existing {vDOM} virtual DOM node to apply this styles to
		@param value {Object} Object literal containing the current values
		@param newValue {Object} Object literal containin the new values
		@private
		*/
		_diffStyles: function (existing, value, newValue) {
			var styles = Object.keys(value).concat(Object.keys(newValue)).sort(),
				prevStyle,
				nodeStyle = existing.node.style;

			styles.forEach(function (style) {
				// skip over duplicates
				if (style == prevStyle) return;
				prevStyle = style;
				if (style in value) {
					if (style in newValue) {
						if (value[style] === newValue[style]) return;
						nodeStyle[style] = newValue[style];
					} else {
						nodeStyle[style] = '';
					}
				} nodeStyle[style] = newValue[style];
			});

		}


	};
	return v;
};
//=============================

/**
Internal, virtual representation of an actual DOM node.
There are two sub-versions of it.

* For text nodes, the vNode will be an instance of String 
  with an extra `node` property.
* For nodes corresponding to Parcel containers, the node 
  will have the extra `parcel` and `stamp` properties.

The virtual DOM version differs from that produced by the 
[Parcel.view](Parcel.html#method_view) method in that it has the `node`
property set.

This entry is just for documentation purposes.
There is no actual code for this class.  It is created as an object literal.


@class vNode
@protected
@static
*/

/**
Represents the DOM `tagName` or node type.
Corresponds to the HTML element type.

@property tag
@type String
@default "DIV"
@static
*/
/**
The value of the `xmlns` attribute for namespaced elements
such as `svg`.

@property namespace
@type String
@default undefined
@static
*/
/**
DOM node corresponding to the virtual node.
It is only present in the internal vDOM and only assigned
after the DOM has been rendered.

@property node
@type DOM element
@private
@static
*/
/**
Collection of the attributes of the DOM element.
It is an hash map of attribute names to attribute values.

@property attrs
@type Object
@default {}
@static
*/

/**
Array of children nodes of this node.
The children can be either
* further vNodes,
* pNodes
* plain values which will be converted to strings or tNodes

@property children
@type Array
@default undefined
@static
*/
/**
Reference to the [Parcel](Parcel.html) instance that has produced this pNode
and its descendants.

@property parcel
@type Parcel
@static
*/
/**
Value returned by the [`stamp()`](Parcel.html#method_stamp) method
to compare whether the parcel contents has changed
@property stamp
@type Any
@default NaN
@static
*/

},{"core-lang-ext":5,"core-utils":7}],12:[function(require,module,exports){
/* globals window:true, document:true, Element:true */

"use strict";

/**
 * Integrates DOM-events to core-event-base. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 * Should be called using  the provided `mergeInto`-method like this:
 *
 * @example
 * Event = require('event');
 * DOMEvent = require('event-dom');
 * DOMEvent.mergeInto(Event);
 *
 * @module event
 * @submodule event-dom
 * @class Event
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/

var NAME = '[event-dom]: ',
    REGEXP_UI = /^UI:/,
    REGEXP_NODE_ID = /^#\S+$/,
    REGEXP_EXTRACT_NODE_ID = /#(\S+)/,
    WINDOW = window,
    DOCUMENT = document,
    NEW_EVENTSYSTEM = DOCUMENT.addEventListener,
    OLD_EVENTSYSTEM = !NEW_EVENTSYSTEM && DOCUMENT.attachEvent,
    DOM_Events;

// polyfill for Element.matchesSelector
// based upon https://gist.github.com/jonathantneal/3062955
Element && function(ElementPrototype) {
    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
    ElementPrototype.mozMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    ElementPrototype.oMatchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    function (selector) {
        var node = this,
            nodes = (node.parentNode || DOCUMENT).querySelectorAll(selector),
            i = -1;
        while (nodes[++i] && (nodes[i] !== node));
        return !!nodes[i];
    };
}(Element.prototype);

DOM_Events = {
    /*
     * Inititialization-method to extend `Event` which comes from `event-base`.
     *
     * Should be called using  the provided `mergeInto`-method like this:
     *
     * @example
     * DOMEvent = require('core-event-dom');
     * DOMEvent.mergeInto(Event);
     *
     * @method mergeInto
     * @param instanceEvent {Object} The Event-system
     * @since 0.0.1
     */
    mergeInto: function (instanceEvent) {
        var htmlelement;

        /**
         * Internal hash containing all DOM-events that are listened for (at `document`).
         *
         * _DOMev = {
         *     'click': callbackFn,
         *     'mousemove': callbackFn,
         *     'keypress': callbackFn
         * }
         *
         * @property _DOMev
         * @default {}
         * @type Object
         * @private
         * @since 0.0.1
        */
        Object.defineProperty(instanceEvent, '_DOMev', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {} // `writable` is false means we cannot chance the value-reference, but we can change {} or [] its members
        });

        // First, we extend Event by adding and overrule some methods:

        /**
         * Polyfill for bubbling the `focus` and `blur` events in IE8.
         *
         * IE>8 we can use delegating on ALL events, because we use the capture-phase.
         * Unfortunatly this cannot be done with IE<9. But we can simulate focus and blur
         * delegation bu monitoring the focussed node.
         *
         * This means the IE<9 will miss the events: 'error', 'load', 'resize' and 'scroll'
         * However, if you need one of these to work in IE8, then you can `activate` this event on the
         * single node that you want to minotor. You activate it and then you use the eventsystem
         * like like you are used to. (delegated). Only activated nodes will bubble their non-bubbling events up
         * Activation is not done manually, but automaticly: whenever there is a subscriber on a node (or an id-selector)
         * and IE<9 is the environment, then a listener for that node is set up.
         * Side-effect is that we cannot controll when the listener isn't needed anymore. This might lead to memory-leak - but its IE<9...
         *
         * @method _bubbleIE8
         * @param instanceEvent {Object} The Event-system
         * @private
         * @since 0.0.1
         */
        instanceEvent._bubbleIE8 = function(instanceEvent) {
            // we wil emulate focus and blur by subscribing to the keyup and mouseup events:
            // when they happen, we'll ask for the current focussed Node --> if there is a
            // change compared to the previous, then we fire both a blur and a focus-event
            instanceEvent._focussedNode = DOCUMENT.activeElement;
            instanceEvent.after(['keyup', 'mouseup'], function(e) {
                var newFocussed = DOCUMENT.activeElement,
                    prevFocussed = instanceEvent._focussedNode;
                if (prevFocussed !== newFocussed) {
                    instanceEvent._focussedNode = newFocussed;
                    instanceEvent.emit(prevFocussed, 'UI:blur', e);
                    instanceEvent.emit(newFocussed, 'UI:focus', e);
                }
            });
        };

        /**
         * Creates a filterfunction out of a css-selector. To be used for catching any dom-element, without restrictions
         * of any context (like Parcels can --> Parcel.Event uses _parcelSelToDom instead)
         * On "non-outside" events, subscriber.t is set to the node that first matches the selector
         * so it can be used to set as e.target in the final subscriber
         *
         * @method _domSelToFunc
         * @param subscriber {Object} Subscriber-object
         * @param selector {String} css-selector
         * @param [outsideEvent] {Boolean} whetrer it is an outside-event (like `clickoutside`)
         * @private
         * @since 0.0.1
         */
        instanceEvent._domSelToFunc = function(subscriber, selector, outsideEvent) {
            // this stage is runned during subscription
            console.log(NAME, '_domSelToFunc');
            var byId = REGEXP_NODE_ID.test(selector);
            return function(e) {
                // this stage is runned when the event happens
                console.log(NAME, '_domSelToFunc inside filter');
                var node = e.target,
                    match = false;
                // e.target is the most deeply node in the dom-tree that caught the event
                // our listener uses `selector` which might be a node higher up the tree.
                // we will reset e.target to this node (if there is a match)
                // note that e.currentTarget will always be `document` --> we're not interested in that
                // also, we don't check for `node`, but for node.matchesSelector: the highest level `document`
                // is not null, yet it doesn;t have .matchesSelector so it would fail
                while (node.matchesSelector && !match) {
                    console.log(NAME, '_domSelToFunc inside filter check match');
                    match = byId ? (node.id===selector.substr(1)) : node.matchesSelector(selector);
                    // if there is a match, then set
                    // e.target to the target that matches the selector
                    match && !outsideEvent && (subscriber.t=node);
                    node = node.parentNode;
                }
                console.log(NAME, '_domSelToFunc filter returns '+(!outsideEvent ? match : !match));
                return !outsideEvent ? match : !match;
            };
        };

        // now redefine Event._createFilter --> it needs to work a bit differently when using DOM-events
        // because we could have css-selectors
        /**
         * Creates the filter-function on the subscriber. Overrides _createFilter from `event-base`.
         * Inside core-event-base this means: just set the filter, but core-event-dom overrides this method
         * (because dom-filters could be css-selectors)
         *
         * @method _createFilter
         * @param filter {Function|String}
         * @param customEvent {String}
         * @param [outsideEvent] {Boolean} whether it is an outside-event (like `clickoutside`)
         * @private
         * @since 0.0.1
         */
        instanceEvent._createFilter = function(subscriber, filter, customEvent, outsideEvent) {
            console.log(NAME, '_createFilter');
            var nodeid;
            if ((typeof filter==='string') && DOCUMENT && (REGEXP_UI.test(customEvent))) {
                console.log(NAME, '_createFilter create filter out of css-selector');
                subscriber.f = this._selToFunc(subscriber, filter, outsideEvent);
                nodeid = filter.match(REGEXP_EXTRACT_NODE_ID);
                nodeid ? (subscriber.nId=nodeid[1]) : (subscriber.n=DOCUMENT);
            }
            else {
                console.log(NAME, '_createFilter use filterfunc');
                subscriber.f = filter;
                subscriber.n = this._getCurrentTarget(subscriber);
            }
        };

        instanceEvent._getCurrentTarget || (instanceEvent._getCurrentTarget=function(/* subscriber */) {
            return DOCUMENT;
        });

        /**
         * Generates an event through our Event-system. Does the actual transportation from DOM-events
         * into our Eventsystem. It also looks at the response of our Eventsystem: if our system
         * halts or preventDefaults the customEvent, then the original DOM-event will be preventDefaulted.
         *
         * @method _evCallback
         * @param customEvent {String} the customEvent that is transported to the eventsystem
         * @param e {Object} eventobject
         * @private
         * @since 0.0.1
         */
        instanceEvent._evCallback = function(customEvent, e) {
            console.log(NAME, '_evCallback');
            var eventobject;
            // this = instanceEvent because of binding context
            // Emit the dom-event though our eventsystem:
            // NOTE: emit() needs to be synchronous! otherwise we wouldn't be able
            // to preventDefault in time
            //
            // e = eventobject from the DOM-event OR gesture-event
            // eventobject = eventobject from our Eventsystem, which get returned by calling `emit()`
            eventobject = this.emit(e.target, customEvent, e);
            // if eventobject was preventdefaulted or halted: take appropriate action on
            // the original dom-event:
            eventobject.status.halted && e.stopPropagation();
            // now we might nee to preventDefault the original event.
            // be carefull though: not all gesture events have e.preventDefault
            (eventobject.status.halted || eventobject.status.defaultPrevented) && e.preventDefault && e.preventDefault();
        };

        // now redefine Event._invokeSubs --> it needs to work a bit differently when using DOM-events
        // because we have the dom-bubble chain
        /**
         * Does the actual invocation of a subscriber. Overrides _invokesSubs from `event-base`.
         *
         * @method _invokeSubs
         * @param e {Object} event-object
         * @param subscribers {Array} contains subscribers (objects) with these members:
         * <ul>
         *     <li>subscriber.o {Object} context of the callback</li>
         *     <li>subscriber.cb {Function} callback to be invoked</li>
         *     <li>subscriber.f {Function} filter to be applied</li>
         *     <li>subscriber.t {DOM-node} target for the specific selector, which will be set as e.target
         *         only when event-dom is active and there are filter-selectors</li>
         *     <li>subscriber.n {DOM-node} highest dom-node that acts as the container for delegation.
         *         only when core-event-dom is active and there are filter-selectors</li>
         * </ul>
         * @param [before] {Boolean} whether it concerns before subscribers
         * @param [sort] {Function} a sort function to controll the order of execution.
         *             Only applyable when working with DOM-events (bubble-order), provided by `core-event-dom`
         * @private
         * @since 0.0.1
         */
        //
        // CAUTIOUS: When making changes here, you should look whether these changes also effect `_invokeSubs()`
        // inside `event-base`
        //
        instanceEvent._originalInvokeSubs = instanceEvent._invokeSubs;
        instanceEvent._invokeSubs = function (e, subscribers, before, sort) {
            if (!sort) {
                return this._originalInvokeSubs(e, subscribers, before, sort);
            }
            console.log(NAME, '_invokeSubs on event-dom');
            var subs, propagationStopped, targetnode;

            // we create a new sub-array with the items that passed the filter
            // this subarray gets sorted. We ALWAYS need to do this on every event: the dom could have changed
            subs = subscribers.filter(
                       function(subscriber) {
                           return !subscriber.f || subscriber.f.call(subscriber.o, e);
                       }
                   );

            // at this point, we need to find out what are the current node-refs. whenever there is
            // a filter that starts with `#` --> in those cases we have a bubble-chain, because the selector isn't
            // set up with `document` at its root.
            // we couldn't do this at time of subscribtion, for the nodes might not be there at that time.
            // however, we only need to do this once: we store the value if we find them
            // no problem when the nodes leave the dom later: the previous filter wouldn't pass
            subs.each(function(subscriber) {
                // the node-ref is specified with `subscriber.n`
                subscriber.n || (subscriber.n=DOCUMENT.getElementById(subscriber.nId));
                console.log(NAME, 'check whether to create subscriber.n');
            });

            // now we sort, based upon the sortFn
            subs.sort(sort);

            // `subs` was processed by the sort function, so it also has only subscribers that passed their filter
            subs.some(function(subscriber) {
                // inside the aftersubscribers, we may need exit right away.
                // this would be the case whenever stopPropagation or stopImmediatePropagation was called
                // in case the subscribernode equals the node on which stopImmediatePropagation was called: return true
                targetnode = (subscriber.t || subscriber.n);

                if (e.status.immediatePropagationStopped===targetnode) {
                    return true;
                }
                // in case the subscribernode does not fall within or equals the node on which stopPropagation was called: return true
                propagationStopped = e.status.propagationStopped;
                if (propagationStopped && (propagationStopped!==targetnode) && !propagationStopped.contains(targetnode)) {
                    return true;
                }

                // check: if `sort` exists, then the filter is already supplied, but we need to set e.currentTarget for every bubble-level
                // is `sort` does not exists, then the filter is not yet supplied and we need to it here
                e.currentTarget = targetnode;
                // now we might need to set e.target to the right node:
                // the filterfunction might have found the true domnode that should act as e.target
                // and set it at subscriber.t
                // also, we need to backup the original e.target: this one should be reset when
                // we encounter a subscriber with its own filterfunction instead of selector
                if (subscriber.t) {
                    e._originalTarget || (e._originalTarget=e.target);
                    e.target = subscriber.t;
                }
                else {
                    e._originalTarget && (e.target=e._originalTarget);
                }

                console.log(NAME, '_invokeSubs going to invoke subscriber');

                // finally: invoke subscriber
                subscriber.cb.call(subscriber.o, e);

                if (e.status.unSilencable && e.silent) {
                    console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                    e.silent = false;
                }

                return e.silent ||
                      (before && (
                              e.status.halted || (
                                  ((propagationStopped=e.status.propagationStopped) && (propagationStopped!==targetnode)) || e.status.immediatePropagationStopped
                              )
                          )
                      );
            });
        };

        /**
         * Creates a filterfunction out of a css-selector.
         * On "non-outside" events, subscriber.t is set to the node that first matches the selector
         * so it can be used to set as e.target in the final subscriber
         *
         * @method _selToFunc
         * @param subscriber {Object} Subscriber-object
         * @param selector {String} css-selector
         * @param [outsideEvent] {Boolean} whetrer it is an outside-event (like `clickoutside`)
         * @private
         * @since 0.0.1
         */
        // careful: _selToFunc might already be defined by Parcel.Events. This version is richer and should not be orverwritten
        instanceEvent._selToFunc || (instanceEvent._selToFunc=function(subscriber, selector, outsideEvent) {
            console.log(NAME, '_selToFunc');
            // return `_domSelToFunc` by default
            // Parcel.Event uses a different selectormethod.
            return this._domSelToFunc(subscriber, selector, outsideEvent);
        });

        /**
         * Transports DOM-events to the Event-system. Catches events at their most early stage:
         * their capture-phase. When these events happen, a new customEvent is generated by our own
         * Eventsystem, by calling _evCallback(). This way we keep DOM-events and our Eventsystem completely separated.
         *
         * @method _setupDomListener
         * @param instanceEvent {Object} The Event-system
         * @param customEvent {String} the customEvent that is transported to the eventsystem
         * @private
         * @since 0.0.1
         */
        instanceEvent._setupDomListener = function(customEvent) {
            console.log(NAME, '_setupDomListener');
            var instance = this,
                callbackFn = instance._evCallback.bind(instance, customEvent),
                eventSplitted = customEvent.split(':'),
                eventName = eventSplitted[1];
            // if eventName equals `mouseover` or `mouseleave` then we quit:
            // people should use `mouseover` and `mouseout`
            if ((eventName==='mouseenter') || (eventName==='mouseleave')) {
                console.warn(NAME, 'Subscription to '+eventName+' not supported, use mouseover and mouseout: this eventsystem uses these non-noisy so they act as mouseenter and mouseleave');
                return;
            }
            // already registered? then return, also return if someone registered for UI:*
            if (instance._DOMev[eventName] || (eventName==='*')) {
                return;
            }

            if (NEW_EVENTSYSTEM) {
                // important: set the third argument `true` so we listen to the capture-phase.
                instance._DOMev[eventName] = {
                    detach: function() {
                        DOCUMENT.removeEventListener(eventName, callbackFn, true);
                    }
                };
                DOCUMENT.addEventListener(eventName, callbackFn, true);
            }
            else if (OLD_EVENTSYSTEM) {
                instance._DOMev[eventName] = {
                    detach: function() {
                        DOCUMENT.detachEvent(eventName, callbackFn);
                    }
                };
                DOCUMENT.attachEvent('on'+eventName, callbackFn);
            }
        };

        /**
         * Generates a sort-function. Overrides _sortSubs from `event-base`.
         *
         * @method _sortSubs
         * @param customEvent {String}
         * @private
         * @return {Function|undefined} sortable function
         * @since 0.0.1
         */
        instanceEvent._sortSubs = function(customEvent) {
            console.log(NAME, '_sortSubs');
            if (REGEXP_UI.test(customEvent)) {
                return this._sortSubsDOM.bind(this);
            }
        };

        /**
         * Sort nodes conform the dom-tree by looking at their position inside the tree.
         *
         * @method _sortSubsDOM
         * @param customEvent {String}
         * @private
         * @return {Function} sortable function
         * @since 0.0.1
         */
        instanceEvent._sortSubsDOM || (instanceEvent._sortSubsDOM=function(subscriberOne, subscriberTwo) {
            console.log(NAME, '_sortSubsDOM');
            return (subscriberTwo.t || subscriberTwo.n).contains(subscriberOne.t || subscriberOne.n) ? -1 : 1;
        });

        // Now we do some initialization in order to make DOM-events work:

        // Notify when someone subscriber to an UI:* event
        // if so: then we might need to define a customEvent for it:
        // alse define the specific DOM-methods that can be called on the eventobject: `stopPropagation` and `stopImmediatePropagation`
        instanceEvent.notify('UI:*', instanceEvent._setupDomListener, instanceEvent)
                     ._setEventObjProperty('stopPropagation', function() {this.status.ok || (this.status.propagationStopped = this.currentTarget);})
                     ._setEventObjProperty('stopImmediatePropagation', function() {this.status.ok || (this.status.immediatePropagationStopped = this.currentTarget);});

        if (WINDOW && (htmlelement=WINDOW.HTMLElement)) {
            // specify the emitter by emitterName UI
            instanceEvent.defineEmitter(htmlelement.prototype, 'UI');
        }

        // next: bubble-polyfill for IE8:
        OLD_EVENTSYSTEM && instanceEvent._bubbleIE8(instanceEvent);

    }
};

module.exports = DOM_Events;

},{}],13:[function(require,module,exports){
/* globals window:true, document:true, Element:true */

"use strict";

/**
 * Integrates DOM-events to core-event-base. more about DOM-events:
 * http://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/
 *
 * Should be called using  the provided `init`-method like this:
 *
 * @example
 * Event = require('event');
 * DOMEvent = require('event-dom');
 * DOMEvent.mergeInto(Event);
 *
 * @module event
 * @submodule event-hammerjs
 * @class Event
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/

var NAME = '[event-hammer]: ',
    Hammer = require('hammerjs'),

Hammer_Events = {
    /*
     * Inititialization-method to extend `Event` which comes from `core-event-base`.
     *
     * Should be called using  the provided `init`-method like this:
     *
     * @example
     * DOMEvent = require('core-event-dom');
     * DOMEvent.init(Event);
     *
     * @method mergeInto
     * @param instanceEvent {Object} The Event-system
     * @param [emitHammerInputEvent=false] {Boolean} Whether to emit a `hammerinput` event before every gesture
     * @since 0.0.1
     */
    mergeInto: function (instanceEvent, emitHammerInputEvent) {
        // build up hammerjs to support mobile devices
        // Hammer cannot be set to `document`, we have to set it to `document.body`
        /**
         * The (only) Hammer-instance that `Event` uses. It is bound to the `body`-element.
         *
         * @property hammertime
         * @type Hammer-instance
         * @since 0.0.1
         */
        var hammertime = instanceEvent.hammertime = new Hammer(document.body),
            singletap, doubletap, tripletap;

        // create reference to the HammerClass:
        /**
         * Adds the `Hammer`-class to Event, so it can be used from within Event.
         *
         * @property Hammer
         * @type Hammer
         * @since 0.0.1
         */
        instanceEvent.Hammer = Hammer;

        // set _emitHammerInput which defines wheter HammerJS will emit an 'hammerinput' event before ALL events
        // which is handy when debugging
        /**
         * Flag to tell wether to emit an 'hammerinput' event before ALL events
         * which is handy when debugging
         *
         * @property _emitHammerInput
         * @type Boolean
         * @default false
         * @private
         * @since 0.0.1
         */
        hammertime._emitHammerInput = emitHammerInputEvent;

        // now we extend HammerJS with 2 events: doubletap and tripletap:
        doubletap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
        tripletap = new Hammer.Tap({ event: 'tripletap', taps: 3 });
        hammertime.add([
            doubletap,
            tripletap
        ]);

        // we want to recognize this simulatenous, so a doubletap and trippletap will be detected even while a tap has been recognized.
        // the tap event will be emitted on every tap
        singletap = hammertime.get('tap');
        doubletap.recognizeWith(singletap);
        tripletap.recognizeWith([doubletap, singletap]);

        // patch Hammer.Manager.prototype.emit --> it shouldn't emit to its own listeners,
        // but to our eventsystem. Inspired from Jorik Tangelder's own jquery plugin: https://github.com/hammerjs/jquery.hammer.js
        Hammer.Manager.prototype.emit = function(type, data) {
            if (!instanceEvent._evCallback) {
                console.warn(NAME, ' cannot emit event: need module \'event-dom\' to work');
                return;
            }
            if (type==='hammer.input') {
                if (!this._emitHammerInput) {
                    return;
                }
                // transform 'hammer.input' into 'hammerinput', because our eventsystem only accepts \w+
                type = 'hammerinput';
            }
            console.log(NAME, 'emit '+type);
            // label the eventobject by being a Hammer-event
            // is not being used internally, but we would like
            // to inform the subscribers
            data._isHammer = true;
            instanceEvent._evCallback.call(instanceEvent, 'UI:'+type, data);
        };

        Hammer.Manager.prototype.set = (function(originalSet) {
            return function(options) {
                delete options.domEvents; // we don't want the user make Hammer fire domevents
                originalSet.call(this, options);
            };
        })(Hammer.Manager.prototype.set);
    }
};

module.exports = Hammer_Events;

},{"hammerjs":1}],14:[function(require,module,exports){
/* globals window:true, document:true */

"use strict";

/**
 * Defines the Event-Class, which should be instantiated to get its functionality
 *
 *
 * @module core
 * @submodule core-event
 * @main core-event
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/

/**
 * Defines the Event-Class, which should be instantiated to get its functionality
 *
 *
 * @module core-event
 * @submodule core-event-base
 * @class Event
 * @constructor
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/


require('core-lang-ext');
require('ypromise');

var NAME = '[core-event]: ',
    REGEXP_CUSTOMEVENT = /^((?:\w|-)+):((?:\w|-)+)$/,
    REGEXP_WILDCARD_CUSTOMEVENT = /^(?:((?:(?:\w|-)+)|\*):)?((?:(?:\w|-)+)|\*)$/,
    /* REGEXP_WILDCARD_CUSTOMEVENT :
     *
     * valid:
     * 'red:save'
     * 'red:*'
     * '*:save'
     * '*:*'
     * 'save'
     *
     * invalid:
     * '*red:save'
     * 're*d:save'
     * 'red*:save'
     * 'red:*save'
     * 'red:sa*ve'
     * 'red:save*'
     * ':save'
     */
    REGEXP_EVENTNAME_WITH_SEMICOLON = /:((?:\w|-)+)$/,
    MSG_HALTED = 'event was halted',
    MSG_PREVENTED = 'event was defaultPrevented',
    REGEXP_UI_OUTSIDE = /^UI:.+outside$/,
    DEFINE_IMMUTAL_PROPERTY = function (obj, property, value) {
        Object.defineProperty(obj, property, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: value // `writable` is false means we cannot chance the value-reference, but we can change {} or [] its members
        });
    },
    Event;

Event = {
    /**
     * Subscribes to a customEvent. The callback will be executed `after` the defaultFn.
     *
     * @static
     * @method after
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [context] {Object} the instance that subscribes to the event.
     *        any object can passed through, even those are not extended with event-listener methods.
     *        Note: Objects who are extended with listener-methods should use instance.after() instead.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    after: function(customEvent, callback, context, filter, prepend) {
        console.log('add after subscriber to: '+customEvent);
        if (typeof context === 'string') {
            prepend = filter;
            filter = context;
            context = null;
        }
        else if (typeof context === 'boolean') {
            prepend = context;
            filter = null;
            context = null;
        }
        return this._addMultiSubs(context, false, customEvent, callback, filter, prepend);
    },

    /**
     * Subscribes to a customEvent. The callback will be executed `before` the defaultFn.
     *
     * @static
     * @method before
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [context] {Object} the instance that subscribes to the event.
     *        any object can passed through, even those are not extended with event-listener methods.
     *        Note: Objects who are extended with listener-methods should use instance.before() instead.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    before: function(customEvent, callback, context, filter, prepend) {
        console.log('add before subscriber to: '+customEvent);
        if (typeof context === 'string') {
            prepend = filter;
            filter = context;
            context = null;
        }
        else if (typeof context === 'boolean') {
            prepend = context;
            filter = null;
            context = null;
        }
        return this._addMultiSubs(context, true, customEvent, callback, filter, prepend);
    },

    /**
     * Defines an emitterName into the instance (emitter).
     * This will add a protected property `_emitterName` to the instance.
     *
     * @static
     * @method defineEmitter
     * @param emitter {Object} instance that should hold the emitterName
     * @param emitterName {String} identifier that will be added when events are sent (`emitterName:eventName`)
     * @since 0.0.1
     */
    defineEmitter: function (emitter, emitterName) {
        console.log('defineEmitter: '+emitterName);
        // ennumerable MUST be set `true` to enable merging
        Object.defineProperty(emitter, '_emitterName', {
            configurable: false,
            enumerable: true,
            writable: false,
            value: emitterName
        });
    },

    /**
     * Defines a CustomEvent. If the eventtype already exists, it will not be overridden,
     * unless you force to assign with `.forceAssign()`
     *
     * The returned object comes with 4 methods which can be invoked chainable:
     *
     * <ul>
     *     <li>defaultFn() --> the default-function of the event</li>
     *     <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
     *     <li>forceAssign() --> overrides any previous definition</li>
     *     <li>unHaltable() --> makes the customEvent cannot be halted</li>
     *     <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
     *     <li>unSilencable() --> makes that emitters cannot make this event to perform silently (using e.silent)</li>
     *     <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
     *     <li>noRender() --> prevents this customEvent from render the dom. Overrules unRenderPreventable()</li>
     * </ul>
     *
     * @static
     * @method defineEvent
     * @param customEvent {String} name of the customEvent conform the syntax: `emitterName:eventName`
     * @return {Object} with extra methods that can be chained:
     * <ul>
     *      <li>unPreventable() --> makes the customEvent's defaultFn cannot be prevented</li>
     *      <li>unRenderPreventable() --> makes that the customEvent's render cannot be prevented</li>
     *      <li>forceAssign() --> overrides any previous definition</li>
     *      <li>defaultFn() --> the default-function of the event</li>
     *      <li>preventedFn() --> the function that should be invoked when the event is defaultPrevented</li>
     * </ul>
     * @since 0.0.1
     */
    defineEvent: function (customEvent) {
        console.log('Events.defineEvent: '+customEvent);
        var instance = this,
            customevents = instance._ce,
            extract, exists, newCustomEvent;

        if (typeof customEvent!=='string') {
            console.error(NAME, 'defineEvent should have a String-type as argument');
            return;
        }
        extract = customEvent.match(REGEXP_CUSTOMEVENT);
        if (!extract) {
            console.error(NAME, 'defined Customevent '+customEvent+' does not match pattern');
            return;
        }
        newCustomEvent = {
            preventable: true,
            renderPreventable: true
        };
        exists = customevents[customEvent];
        // if customEvent not yet exists, we can add it
        // else, we might need to wait for `forceAssign` to be called
        if (!exists) {
            // we can add it
            customevents[customEvent] = newCustomEvent;
        }
        return {
            defaultFn: function(defFn) {
                newCustomEvent.defaultFn = defFn;
                return this;
            },
            preventedFn: function(prevFn) {
                newCustomEvent.preventedFn = prevFn;
                return this;
            },
            unHaltable: function() {
                newCustomEvent.unHaltable = true;
                return this;
            },
            unSilencable: function() {
                newCustomEvent.unSilencable = true;
                return this;
            },
            unPreventable: function() {
                newCustomEvent.unPreventable = true;
                return this;
            },
            unRenderPreventable: function() {
                newCustomEvent.unRenderPreventable = true;
                return this;
            },
            noRender: function() {
                newCustomEvent.noRender = true;
                return this;
            },
            forceAssign: function() {
                // only needed when not yet added:
                // exists || (customevents[customEvent]=newCustomEvent);
                customevents[customEvent] = newCustomEvent;
                return this;
            }
        };
    },

    /**
     * Detaches (unsubscribes) the listener from the specified customEvent.
     *
     * @static
     * @method detach
     * @param [listener] {Object} The instance that is going to detach the customEvent.
     *        When not passed through (or undefined), all customevents of all instances are detached
     * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
     *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
     *        Can be set as the only argument.
     * @since 0.0.1
    */
    detach: function(listener, customEvent) {
        console.log('detach instance-subscriber: '+customEvent);
        // (typeof listener === 'string') means: only `customEvent` passed through
        (typeof listener === 'string') ? this._removeSubscribers(undefined, listener) : this._removeSubscribers(listener, customEvent);
    },

    /**
     * Detaches (unsubscribes) the listener from all customevents.
     *
     * @static
     * @method detachAll
     * @param listener {Object} The instance that is going to detach the customEvent
     * @since 0.0.1
    */
    detachAll: function(listener) {
        console.log('detach '+(listener ? 'all instance-' : 'ALL')+' subscribers');
        var instance = this;
        if (listener) {
            instance._removeSubscribers(listener, '*:*');
        }
        else {
            // we cannot just redefine _subs, for it is set as readonly
            instance._subs.each(
                function(value, key) {
                    delete instance._subs[key];
                }
            );
        }
    },

    /**
     * Emits the event `eventName` on behalf of `emitter`, which becomes e.target in the eventobject.
     * During this process, all subscribers and the defaultFn/preventedFn get an eventobject passed through.
     * The eventobject is created with at least these properties:
     *
     * <ul>
     *     <li>e.target --> source that triggered the event (instance or DOM-node), specified by `emitter`</li>
     *     <li>e.type --> eventName</li>
     *     <li>e.emitter --> emitterName</li>
     *     <li>e.status --> status-information:
     *          <ul>
     *               <li>e.status.ok --> `true|false` whether the event got executed (not halted or defaultPrevented)</li>
     *               <li>e.status.defaultFn (optional) --> `true` if any defaultFn got invoked</li>
     *               <li>e.status.preventedFn (optional) --> `true` if any preventedFn got invoked</li>
     *               <li>e.status.rendered (optional) --> `true` the vDOM rendered the dom</li>
     *               <li>e.status.halted (optional) --> `reason|true` if the event got halted and optional the why</li>
     *               <li>e.status.defaultPrevented (optional) -->  `reason|true` if the event got defaultPrevented and optional the why</li>
     *               <li>e.status.renderPrevented (optional) -->  `reason|true` if the event got renderPrevented and optional the why</li>
     *          </ul>
     *     </li>
     * </ul>
     *
     * The optional `payload` is merged into the eventobject and could be used by the subscribers and the defaultFn/preventedFn.
     * If payload.silent is set true, the subscribers are not getting invoked: only the defaultFn.
     *
     * The eventobject also has these methods:
     *
     * <ul>
     *     <li>e.halt() --> stops immediate all actions: no mer subscribers are invoked, no defaultFn/preventedFn</li>
     *     <li>e.preventDefault() --> instead of invoking defaultFn, preventedFn will be invoked. No aftersubscribers</li>
     *     <li>e.preventRender() --> by default, any event will trigger the vDOM (if exists) to re-render, this can be prevented by calling e.preventRender()</li>
     * </ul>
     *
     * <ul>
     *     <li>First, before-subscribers are invoked: this is the place where you might call `e.halt()`, `a.preventDefault()` or `e.preventRender()`</li>
     *     <li>Next, defaultFn or preventedFn gets invoked, depending on whether e.halt() or a.preventDefault() has been called</li>
     *     <li>Next, after-subscribers get invoked (unless e.halt() or a.preventDefault() has been called)</li>
     *     <li>Finally, the finalization takes place: any subscribers are invoked, unless e.halt() or a.preventDefault() has been called</li>
     * <ul>
     *
     * @static
     * @method emit
     * @param [emitter] {Object} instance that emits the events
     * @param customEvent {String} Full customEvent conform syntax `emitterName:eventName`.
     *        `emitterName` is available as **e.emitter**, `eventName` as **e.type**.
     * @param payload {Object} extra payload to be added to the event-object
     * @return {Object|undefined} eventobject or undefined when the event was halted or preventDefaulted.
     * @since 0.0.1
     */
    emit: function (emitter, customEvent, payload) {
        // NOTE: emit() needs to be synchronous! otherwise we wouldn't be able
        // to preventDefault DOM-events in time.
        var instance = this,
            allCustomEvents = instance._ce,
            allSubscribers = instance._subs,
            customEventDefinition, extract, emitterName, eventName, subs, wildcard_named_subs,
            named_wildcard_subs, wildcard_wildcard_subs, e, sort;
        if (typeof emitter === 'string') {
            // emit is called with signature emit(customEvent, payload)
            // thus the source-emitter is the Event-instance
            payload = customEvent;
            customEvent = emitter;
            emitter = instance;
        }
        (customEvent.indexOf(':') !== -1) || (customEvent = emitter._emitterName+':'+customEvent);
        console.log(NAME, 'customEvent.emit: '+customEvent);

        extract = customEvent.match(REGEXP_CUSTOMEVENT);
        if (!extract) {
            console.error(NAME, 'defined emit-event does not match pattern');
            return;
        }
        emitterName = extract[1];
        eventName = extract[2];
        customEventDefinition = allCustomEvents[customEvent];
        sort = instance._sortSubs(customEvent);

        subs = allSubscribers[customEvent];
        wildcard_named_subs = allSubscribers['*:'+eventName];
        named_wildcard_subs = allSubscribers[emitterName+':*'];
        wildcard_wildcard_subs = allSubscribers['*:*'];

        e = Object.create(instance._defaultEventObj, {
            target: {
                configurable: false,
                enumerable: true,
                writable: true, // cautious: needs to be writable: event-dom resets e.target
                value: emitter
            },
            type: {
                configurable: false,
                enumerable: true,
                writable: false,
                value: eventName
            },
            emitter: {
                configurable: false,
                enumerable: true,
                writable: false,
                value: emitterName
            },
            status: {
                configurable: false,
                enumerable: true,
                writable: false,
                value: {}
            },
            _unPreventable: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: customEventDefinition && customEventDefinition.unPreventable
            },
            _unHaltable: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: customEventDefinition && customEventDefinition.unHaltable
            },
            _unRenderPreventable: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: customEventDefinition && customEventDefinition.unRenderPreventable
            }
        });
        if (customEventDefinition) {
            customEventDefinition.unSilencable && (e.status.unSilencable = true);
        }
        if (payload) {
            // e.merge(payload); is not enough --> DOM-eventobject has many properties that are not "own"-properties
            for (var key in payload) {
                e[key] || (e[key]=payload[key]);
            }
        }
        if (e.status.unSilencable && e.silent) {
            console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
            e.silent = false;
        }
        !e.silent && subs && subs.b && instance._invokeSubs(e, subs.b, true, sort);
        !e.status.halted && !e.silent && named_wildcard_subs && named_wildcard_subs.b && instance._invokeSubs(e, named_wildcard_subs.b, true);
        !e.status.halted && !e.silent && wildcard_named_subs && wildcard_named_subs.b && instance._invokeSubs(e, wildcard_named_subs.b, true);
        !e.status.halted && !e.silent && wildcard_wildcard_subs && wildcard_wildcard_subs.b && instance._invokeSubs(e, wildcard_wildcard_subs.b, true);
        e.status.ok = !e.status.halted && !e.status.defaultPrevented;
        // in case any subscriber changed e.target inside its filter (event-dom does this),
        // then we reset e.target to its original:
        e._originalTarget && (e.target=e._originalTarget);
        if (customEventDefinition && !e.status.halted) {
            // now invoke defFn
            e.returnValue = e.status.defaultPrevented ?
                            (customEventDefinition.preventedFn && (e.status.preventedFn=true) && customEventDefinition.preventedFn.call(e.target, e)) :
                            (customEventDefinition.defaultFn && (e.status.defaultFn=true) && customEventDefinition.defaultFn.call(e.target, e));
        }

        if (e.status.ok) {
            !e.silent && subs && subs.a && instance._invokeSubs(e, subs.a, false, sort);
            !e.silent && named_wildcard_subs && named_wildcard_subs.a && instance._invokeSubs(e, named_wildcard_subs.a);
            !e.silent && wildcard_named_subs && wildcard_named_subs.a && instance._invokeSubs(e, wildcard_named_subs.a);
            !e.silent && wildcard_wildcard_subs && wildcard_wildcard_subs.a && instance._invokeSubs(e, wildcard_wildcard_subs.a);
            if (!e.silent) {
                // in case any subscriber changed e.target inside its filter (event-dom does this),
                // then we reset e.target to its original:
                e._originalTarget && (e.target=e._originalTarget);
                instance._final.some(function(finallySubscriber) {
                    !e.silent && finallySubscriber(e);
                    if (e.status.unSilencable && e.silent) {
                        console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                        e.silent = false;
                    }
                    return e.silent;
                });
            }
        }
        return e;
    },

    /**
     * Adds a subscriber to the finalization-cycle, which happens after the after-subscribers.
     * Only get invoked when the cycle was not preventDefaulted or halted.
     *
     * @method finalize
     * @param finallySubscriber {Function} callback to be invoked
     *        Function recieves the eventobject as its only argument
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
     */
    finalize: function (finallySubscriber) {
        console.log(NAME, 'finalize');
        var finalHash = this._final;
        finalHash.push(finallySubscriber);
        return {
            detach: function() {
                console.log(NAME, 'detach finalizer');
                var index = finalHash.indexOf(finallySubscriber);
                (index===-1) || finalHash.splice(index, 1);
            }
        };
    },

    /**
     * Creates a notifier for the customEvent.
     * You can use this to create delayed `defineEvents`. When the customEvent is called, the callback gets invoked
     * (even before the subsrcibers). Use this callback for delayed customEvent-definitions.
     *
     * Use **no** wildcards for the emitterName. You might use wildcards for the eventName. Without wildcards, the
     * notification will be unNotified (callback automaticly detached) on the first time the event occurs.

     * You **must** specify the full `emitterName:eventName` syntax.
     * The module `core-event-dom` uses `notify` to auto-define DOM-events (UI:*).
     *
     * @static
     * @method notify
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used only  for`eventName`.
     *        If `emitterName` should be defined.
     * @param callback {Function} subscriber: will be invoked when the customEvent is called (before any subscribers.
     *                 Recieves 2 arguments: `Event` and `customEvent`.
     * @param context {Object} context of the callback
     * @chainable
     * @since 0.0.1
    */
    notify: function(customEvent, callback, context) {
        console.log(NAME, 'notify');
        this._notifiers[customEvent] = {
            cb: callback,
            o: context
        };
        return this;
    },

    /**
     * Alias for `after`.
     *
     * Subscribes to a customEvent. The callback will be executed `after` the defaultFn.
     *
     * @static
     * @method on
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [context] {Object} the instance that subscribes to the event.
     *        any object can passed through, even those are not extended with event-listener methods.
     *        Note: Objects who are extended with listener-methods should use instance.on() instead.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    on: function(/* customEvent, callback, context, filter, prepend */) {
        return this.after.apply(this, arguments);
    },

    /**
     * Alias for `onceAfter`.
     *
     * Subscribes to a customEvent. The callback will be executed `after` the defaultFn.
     * The subscriber will be automaticly removed once the callback executed the first time.
     * No need to `detach()` (unless you want to undescribe before the first event)
     *
     * @static
     * @method onceAfter
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [context] {Object} the instance that subscribes to the event.
     *        any object can passed through, even those are not extended with event-listener methods.
     *        Note: Objects who are extended with listener-methods should use instance.onceAfter() instead.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    once: function(/* customEvent, callback, context, filter, prepend */) {
        return this.onceAfter.apply(this, arguments);
    },

    /**
     * Subscribes to a customEvent. The callback will be executed `after` the defaultFn.
     * The subscriber will be automaticly removed once the callback executed the first time.
     * No need to `detach()` (unless you want to undescribe before the first event)
     *
     * @static
     * @method onceAfter
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [context] {Object} the instance that subscribes to the event.
     *        any object can passed through, even those are not extended with event-listener methods.
     *        Note: Objects who are extended with listener-methods should use instance.onceAfter() instead.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    onceAfter: function(customEvent, callback, context, filter, prepend) {
        var instance = this,
            handler, wrapperFn;
        console.log('add onceAfter subscriber to: '+customEvent);
        wrapperFn = function(e) {
            // CAUTIOUS: removeing the handler right now would lead into a mismatch of the dispatcher
            // who loops through the array of subscribers!
            // therefore, we must remove once the eventcycle has finished --> we detach by setting it
            // at the end of the global-eventstack:
            // yet there still is a change that the event is called multiple times BEFORE it
            // will reach the defined `setTimeout` --> to avoid multiple invocations, handler is
            // extended with the property `_detached`
            handler._detached  || callback.call(this, e);
            handler._detached = true;
            setTimeout(function() {handler.detach();}, 0);
        };
        if (typeof context === 'string') {
            prepend = filter;
            filter = context;
            context = null;
        }
        else if (typeof context === 'boolean') {
            prepend = context;
            filter = null;
            context = null;
        }
        handler = instance._addMultiSubs(context, false, customEvent, wrapperFn, filter, prepend);
        return handler;
    },

    /**
     * Subscribes to a customEvent. The callback will be executed `before` the defaultFn.
     * The subscriber will be automaticly removed once the callback executed the first time.
     * No need to `detach()` (unless you want to undescribe before the first event)
     *
     * @static
     * @method onceBefore
     * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
     *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
     *        If `emitterName` is not defined, `UI` is assumed.
     * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
     *        as its only argument.
     * @param [context] {Object} the instance that subscribes to the event.
     *        any object can passed through, even those are not extended with event-listener methods.
     *        Note: Objects who are extended with listener-methods should use instance.onceBefore() instead.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @since 0.0.1
    */
    onceBefore: function(customEvent, callback, context, filter, prepend) {
        var instance = this,
            handler, wrapperFn;
        console.log('add onceBefore subscriber to: '+customEvent);
        wrapperFn = function(e) {
            // CAUTIOUS: removeing the handler right now would lead into a mismatch of the dispatcher
            // who loops through the array of subscribers!
            // therefore, we must remove once the eventcycle has finished --> we detach by setting it
            // at the end of the global-eventstack.
            // yet there still is a change that the event is called multiple times BEFORE it
            // will reach the defined `setTimeout` --> to avoid multiple invocations, handler is
            // extended with the property `_detached`
            handler._detached  || callback.call(this, e);
            handler._detached = true;
            setTimeout(function() {handler.detach();}, 0);
        };
        if (typeof context === 'string') {
            prepend = filter;
            filter = context;
            context = null;
        }
        else if (typeof context === 'boolean') {
            prepend = context;
            filter = null;
            context = null;
        }
        handler = instance._addMultiSubs(context, true, customEvent, wrapperFn, filter, prepend);
        return handler;
    },

    /**
     * Removes all event-definitions of an emitter, specified by its `emitterName`.
     * When `emitterName` is not set, ALL event-definitions will be removed, except for the DOM's `UI`-events.
     *
     * @static
     * @method undefAllEvents
     * @param [emitterName] {String} name of the customEvent conform the syntax: `emitterName:eventName`
     * @since 0.0.1
     */
    undefAllEvents: function (emitterName) {
        var instance = this,
            stringpattern = emitterName ? emitterName+':' : '(?!UI:)',
            pattern = new RegExp('^'+stringpattern);
        instance._ce.each(
            function(value, key, object) {
                key.match(pattern) && (delete instance._ce[key]);
            }
        );
    },

    /**
     * Removes the event-definition of the specified customEvent.
     *
     * @static
     * @method undefEvent
     * @param customEvent {String} name of the customEvent conform the syntax: `emitterName:eventName`
     * @since 0.0.1
     */
    undefEvent: function (customEvent) {
        console.log(NAME, 'undefEvent '+customEvent);
        delete this._ce[customEvent];
    },

    /**
     * unNotifies (unsubscribes) the notifier of the specified customEvent.
     *
     * @static
     * @method unNotify
     * @param customEvent {String} conform the syntax: `emitterName:eventName`.
     * @since 0.0.1
    */
    unNotify: function(customEvent) {
        console.log(NAME, 'unNotify '+customEvent);
        delete this._notifiers[customEvent];
    },

    /**
     * unNotifies (unsubscribes) the notifiers of all defined customevent-notifications.
     *
     * @static
     * @method unNotifyAll
     * @since 0.0.1
    */
    unNotifyAll: function() {
        console.log(NAME, 'unNotifyAll');
        var instance = this;
        // we cannot just redefine _subs, for it is set as readonly
        instance._notifiers.each(
            function(value, key) {
                delete instance._notifiers[key];
            }
        );
    },

    //====================================================================================================
    // private methods:
    //====================================================================================================

    /**
     * Creates a subscriber to the specified customEvent. The customEvent must conform the syntax:
     * `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`
     * If `emitterName` is not defined, `UI` is assumed.
     *
     * Examples of valid customevents:
     *
     * <ul>
     *     <li>'redmodel:save'</li>
     *     <li>'UI:click'</li>
     *     <li>'click' --> alias for 'UI:click'</li>
     *     <li>'`*`:click' --> careful: will listen to both UIs and non-UI- click-events</li>
     *     <li>'redmodel:`*`'</li>
     *     <li>'`*`:`*`'</li>
     * </ul>
     *
     * @static
     * @method _addMultiSubs
     * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
     * @param before {Boolean} whether the subscriber is a `before` subscriber. On falsy, an `after`-subscriber is assumed.
     * @param customEvent {Array} Array of Strings. customEvent should conform the syntax: `emitterName:eventName`, wildcard `*`
     *         may be used for both `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
     * @param callback {Function} subscriber to the event.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether to make the subscriber the first in the list. By default it will pe appended.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @private
     * @since 0.0.1
    */
    _addMultiSubs: function(listener, before, customEvent, callback, filter, prepend) {
        console.log('_addMultiSubs');
        var instance = this;
        if (!Array.isArray(customEvent)) {
            return instance._addSubscriber(listener, before, customEvent, callback, filter, prepend);
        }
        customEvent.forEach(
            function(ce) {
                instance._addSubscriber(listener, before, ce, callback, filter, prepend);
            }
        );
        return {
            detach: function() {
                customEvent.each(
                    function(ce) {
                        instance._removeSubscriber(listener, before, ce, callback);
                    }
                );
            }
        };
    },

    /**
     * Creates a subscriber to the specified customEvent. The customEvent must conform the syntax:
     * `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`
     * If `emitterName` is not defined, `UI` is assumed.
     *
     * Examples of valid customevents:
     *
     * <ul>
     *     <li>'redmodel:save'</li>
     *     <li>'UI:click'</li>
     *     <li>'click' --> alias for 'UI:click'</li>
     *     <li>'`*`:click' --> careful: will listen to both UIs and non-UI- click-events</li>
     *     <li>'redmodel:`*`'</li>
     *     <li>'`*`:`*`'</li>
     * </ul>
     *
     * @static
     * @method _addSubscriber
     * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
     * @param before {Boolean} whether the subscriber is a `before` subscriber. On falsy, an `after`-subscriber is assumed.
     * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
     *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
     * @param callback {Function} subscriber to the event.
     * @param [filter] {String|Function} to filter the event.
     *        Use a String if you want to filter DOM-events by a `selector`
     *        Use a function if you want to filter by any other means. If the function returns a trully value, the
     *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
     *        the subscriber.
     * @param [prepend=false] {Boolean} whether to make the subscriber the first in the list. By default it will pe appended.
     * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
     * @private
     * @since 0.0.1
    */
    _addSubscriber: function(listener, before, customEvent, callback, filter, prepend) {
        var instance = this,
            allSubscribers = instance._subs,
            extract = customEvent.match(REGEXP_WILDCARD_CUSTOMEVENT),
            hashtable, item, notifier, customEventWildcardEventName, outsideEvent;

        if (!extract) {
            console.error(NAME, 'subscribe-error: eventname does not match pattern');
            return;
        }
        if ((typeof filter==='boolean') || (typeof filter===undefined) || (typeof filter===null)) {
            // filter was not set, instead `prepend` is set at this position
            prepend = filter;
            filter = null;
        }
        // if extract[1] is undefined, a simple customEvent is going to subscribe (without :)
        // therefore: recomposite customEvent:
        extract[1] || (customEvent='UI:'+customEvent);
        outsideEvent = REGEXP_UI_OUTSIDE.test(customEvent);
        outsideEvent && (customEvent=customEvent.substring(0, customEvent.length-7));
        allSubscribers[customEvent] || (allSubscribers[customEvent]={b:[], a:[]});
        hashtable = allSubscribers[customEvent][before ? 'b' : 'a'];
        // we need to be able to process an array of customevents
        item = {
            o: listener || instance,
            cb: callback
        };
        instance._createFilter(item, filter, customEvent, outsideEvent);

        // in case of a defined subscription (no wildcard), we should look for notifiers
        if ((extract[1]!=='*') && (extract[2]!=='*')) {
            // before subscribing: we might need to activate notifiers --> with defined eventName should also be cleaned up:
            notifier = instance._notifiers[customEvent];
            if (notifier) {
                notifier.cb.call(notifier.o, customEvent);
                delete instance._notifiers[customEvent];
            }
            // check the same for wildcard eventName:
            customEventWildcardEventName = customEvent.replace(REGEXP_EVENTNAME_WITH_SEMICOLON, ':*');
            (customEventWildcardEventName !== customEvent) && (notifier=instance._notifiers[customEventWildcardEventName]) && notifier.cb.call(notifier.o, customEvent);
        }

        console.log('_addSubscriber to customEvent: '+customEvent);
        prepend ? hashtable.unshift(item) : hashtable.push(item);
        return {
            detach: function() {
                instance._removeSubscriber(listener, before, customEvent, callback);
            }
        };
    },

    /**
     * Creates the filter-function on the subscriber.
     * Inside core-event-base this means: just set the filter, but core-event-dom overrides this method
     * (because dom-filters could be css-selectors)
     *
     * @method _createFilter
     * @param filter {Function|String}
     * @param customEvent {String}
     * @param [outsideEvent] {Boolean} whetrer it is an outside-event (like `clickoutside`)
     * @private
     * @since 0.0.1
     */
    _createFilter: function(subscriber, filter /*, customEvent, outsideEvent */) {
        console.log(NAME, '_createFilter');
        subscriber.f = filter;
    },

    /**
     * Does the actual invocation of a subscriber.
     *
     * @method _invokeSubs
     * @param e {Object} event-object
     * @param subscribers {Array} contains subscribers (objects) with these members:
     * <ul>
     *     <li>subscriber.o {Object} context of the callback</li>
     *     <li>subscriber.cb {Function} callback to be invoked</li>
     *     <li>subscriber.f {Function} filter to be applied</li>
     *     <li>subscriber.t {DOM-node} target for the specific selector, which will be set as e.target
     *         only when event-dom is active and there are filter-selectors</li>
     *     <li>subscriber.n {DOM-node} highest dom-node that acts as the container for delegation.
     *         only when event-dom is active and there are filter-selectors</li>
     * </ul>
     * @param [before] {Boolean} whether it concerns before subscribers
     * @param [sort] {Function} a sort function to controll the order of execution.
     *             Only applyable when working with DOM-events (bubble-order), provided by `core-event-dom`
     * @private
     * @since 0.0.1
     */
    //
    // CAUTIOUS: When making changes here, you should look whether these changes also effect `_invokeSubs()`
    // inside `core-event-dom`
    //
    _invokeSubs: function (e, subscribers, before /*, sort */) { // subscribers, plural
        console.log(NAME, '_invokeSubs');
        subscribers.some(function(subscriber) {
            console.log(NAME, '_invokeSubs for single subscriber');
            (!subscriber.f || subscriber.f.call(subscriber.o, e)) && // check: does it pass the filter
            subscriber.cb.call(subscriber.o, e); // finally: invoke subscriber
            if (e.status.unSilencable && e.silent) {
                console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                e.silent = false;
            }
            return e.silent || (before && e.status.halted);  // remember to check whether it was halted for any reason
        });
    },

    /**
     * Removes a subscriber from the specified customEvent. The customEvent must conform the syntax:
     * `emitterName:eventName`.
     *
     * @static
     * @method _removeSubscriber
     * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
     * @param before {Boolean} whether the subscriber is a `before` subscriber. On falsy, an `after`-subscriber is assumed.
     * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
     *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emmiterName.
     * @param [callback] {Function} subscriber to the event, when not set, all subscribers of the listener to this customEvent
     *                   will be removed.
     * @private
     * @since 0.0.1
    */
    _removeSubscriber: function(listener, before, customEvent, callback) {
        console.log('_removeSubscriber: '+customEvent);
        var instance = this,
            eventSubscribers = instance._subs[customEvent],
            hashtable = eventSubscribers && eventSubscribers[before ? 'b' : 'a'],
            i, subscriber;
        if (hashtable) {
            // unfortunatly we cannot search by reference, because the array has composed objects
            // also: can't use native Array.forEach: removing items within its callback change the array
            // during runtime, making it to skip the next item of the one that's being removed
           for (i=0; i<hashtable.length; ++i) {
                console.log(NAME, '_removeSubscriber for single subscriber');
                subscriber = hashtable[i];
                if ((subscriber.o===(listener || instance)) && (!callback || (subscriber.cb===callback))) {
                    console.log('removing subscriber');
                    hashtable.splice(i--, 1);
                }
            }
        }
        // After removal subscriber: check whether both eventSubscribers.a and eventSubscribers.b are empty
        // if so, remove the member from Event._subs to cleanup memory
        eventSubscribers && (eventSubscribers.a.length===0) && (eventSubscribers.b.length===0) && (delete instance._subs[customEvent]);
    },

    /**
     * Removes subscribers from the multiple customevents. The customEvent must conform the syntax:
     * `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`
     * If `emitterName` is not defined, `UI` is assumed.
     *
     * Examples of valid customevents:
     *
     * <ul>
     *     <li>'redmodel:save'</li>
     *     <li>'UI:click'</li>
     *     <li>'click' --> alias for 'UI:click'</li>
     *     <li>'`*`:click' --> careful: will listen to both UIs and non-UI- click-events</li>
     *     <li>'redmodel:`*`'</li>
     *     <li>'`*`:`*`'</li>
     * </ul>
     *
     * @static
     * @method _removeSubscriber
     * @param listener {Object} Object that creates the subscriber (and will be listening by `listener.after(...)`)
     * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
     *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emmiterName.
     * @private
     * @since 0.0.1
    */
    _removeSubscribers: function(listener, customEvent) {
        console.log('_removeSubscribers: '+customEvent);
        var instance = this,
            emitterName, eventName,
            extract = customEvent.match(REGEXP_WILDCARD_CUSTOMEVENT);
        if (!extract) {
            console.error(NAME, '_removeSubscribers-error: customEvent '+customEvent+' does not match pattern');
            return;
        }
        emitterName = extract[1] || 'UI';
        eventName = extract[2];
        if ((emitterName!=='*') && (eventName!=='*')) {
            instance._removeSubscriber(listener, true, customEvent);
            instance._removeSubscriber(listener, false, customEvent);
        }
        else {
            // wildcard, we need to look at all the members of Event._subs
            instance._subs.each(
                function(value, key) {
                    var localExtract = key.match(REGEXP_WILDCARD_CUSTOMEVENT),
                        emitterMatch = (emitterName==='*') || (emitterName===localExtract[1]),
                        eventMatch = (eventName==='*') || (eventName===localExtract[2]);
                    if (emitterMatch && eventMatch) {
                        instance._removeSubscriber(listener, true, key);
                        instance._removeSubscriber(listener, false, key);
                    }
                }
            );
        }
    },

    /**
     * Adds a property to the default eventobject's prototype which passes through all eventcycles.
     * Goes through Object.defineProperty with configurable, enumerable and writable
     * all set to false.
     *
     * @method _setEventObjProperty
     * @param property {String} event-object
     * @param value {Any}
     * @chainable
     * @private
     * @since 0.0.1
     */
    _setEventObjProperty: function (property, value) {
        console.log(NAME, '_setEventObjProperty');
        DEFINE_IMMUTAL_PROPERTY(this._defaultEventObj, property, value);
        return this;
    },

    /**
     * Generates a sort-function. By default NOOP, however core-event-dom will return
     * a valid function when it needs to sort nodes conform the dom-tree
     *
     * @method _sortSubs
     * @param customEvent {String}
     * @private
     * @return {Function|undefined} sortable function
     * @since 0.0.1
     */
    _sortSubs: function(/* customEvent */) {
        console.log(NAME, '_sortSubs NOOP');
        /* NOOP */
    }

};

/**
 * Objecthash containing all defined custom-events
 * which has a structure like this:
 *
 * _ce = {
 *     'UI:click': {
 *         preventable: true,
 *         defaultFn: function(){...},
 *         preventedFn: function(){...},
 *         renderPreventable: true
 *     },
 *     'redmodel:save': {
 *         preventable: true,
 *         defaultFn: function(){...},
 *         preventedFn: function(){...},
 *         renderPreventable: true
 *     }
 * }
 *
 * @property _ce
 * @default {}
 * @type Object
 * @private
 * @since 0.0.1
*/
Object.defineProperty(Event, '_ce', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
});

/**
 * Objecthash containing all defined before and after subscribers
 * which has a structure like this (`b` represents `before` and `a` represents `after`)
 * Every item that gets in the array consist by itself of 3 properties:
 *                                                          subscriberitem = {
 *                                                              o: listener,
 *                                                              cb: callback,
 *                                                              f: filter
 *                                                          };
 *
 * _subs = {
 *     'UI:click': {
 *         b: [
 *             function() {},
 *             function() {}
 *         ],
 *         a: [
 *             function() {},
 *             function() {}
 *         ]
 *     },
 *     '*:click': {
 *         b: [
 *             function() {},
 *             function() {}
 *         ],
 *         a: [
 *             function() {},
 *             function() {}
 *         ]
 *     },
 *     'redmodel:save': {
 *         b: [
 *             function() {},
 *             function() {}
 *         ],
 *         a: [
 *             function() {},
 *             function() {}
 *         ]
 *     }
 * }
 *
 * @property _ce
 * @default {}
 * @type Object
 * @private
 * @since 0.0.1
*/
DEFINE_IMMUTAL_PROPERTY(Event, '_subs', {});

/**
 * Internal list of finalize-subscribers which are invoked at the finalization-cycle, which happens after the after-subscribers.
 * Is an array of function-references.
 *
 * @property _final
 * @default []
 * @type Array
 * @private
 * @since 0.0.1
*/
DEFINE_IMMUTAL_PROPERTY(Event, '_final', []);

/**
 * Object that acts as the prototype of the eventobject.
 * To add more methods, you can use `_setEventObjProperty`
 *
 * @property _defaultEventObj
 * @default {
 *    halt: function()
 *    preventDefault: function()
 *    preventRender: function()
 * }
 * @type Object
 * @private
 * @since 0.0.1
*/
DEFINE_IMMUTAL_PROPERTY(Event, '_defaultEventObj', {});

/**
 * Objecthash containing all notifiers, keyed by customEvent name.
 * This list is maintained by `notify`, `unNotify` and `unNotifyAll`
 *
 * _notifiers = {
 *     'UI:click': {
 *         cb:function() {}
 *         o: {} // context
 *     },
 *     'redmodel:*': {
 *         cb:function() {}
 *         o: {} // context
 *     },
 *     'bluemodel:save': {
 *         cb:function() {}
 *         o: {} // context
 *     }
 * }
 *
 * @property _notifiers
 * @default {}
 * @type Object
 * @private
 * @since 0.0.1
*/
DEFINE_IMMUTAL_PROPERTY(Event, '_notifiers', {});

Event._setEventObjProperty('halt', function(reason) {this.status.ok || this._unHaltable || (this.status.halted = (reason || true));})
     ._setEventObjProperty('preventDefault', function(reason) {this.status.ok || this._unPreventable || (this.status.defaultPrevented = (reason || true));})
     ._setEventObjProperty('preventRender', function(reason) {this.status.ok || this._unRenderPreventable || (this.status.renderPrevented = (reason || true));});

module.exports = Event;

},{"core-lang-ext":5,"ypromise":2}],15:[function(require,module,exports){
module.exports=require(3)
},{}],16:[function(require,module,exports){
/* globals XMLHttpRequest:true */

/**
 * Provides core IO-functionality.
 *
 * The returned xhr DOES support CORS for all modern browsers.
 * To use CORS, you need to setup the responseserver right
 * More info about CORS: http://remysharp.com/2011/04/21/getting-cors-working/
 *
 *
 *
 *
 * TODO: make STREAMING with IE9-browsers work: the XDomainRequest() seems not to fire the onprogress-event...
 *       (and XMLHttpRequest1 doesn't have this event at all)
 * TODO: make CORS with IE9-browsers work: the XDomainRequest() fails currently on cors..
 *
 *
 *
 *
 * Using CORS with IE9-browsers need special consideration, for it uses the XDomainRequest():
 * 1. Only GET and POST methods are supported. Other methods will be reset into one of these,
 *    so make sure the cross-domain-server handles all requests as being send with the GET or POST method.
 * 2. Only text/plain is supported for the request's Content-Type header. This will lead into troubles when handling
 *    POST-requests: the cross-domain-server needs to extract the parameters itself. For nodejs, there is a nice npm module:
 *    `express-ie-cors` https://github.com/advanced/express-ie-cors/blob/master/lib/express-ie-cors.js
 * 3. No custom headers can be added to the request.
 * 4. No authentication or cookies will be sent with the request.
 * more info: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
 *
 * @module io
 * @submodule io-win
 * @class IO
*/

/* global module:false */

"use strict";

require('ypromise');
require('core-lang-ext');
require('core-promise-ext');

var NAME = '[io-win]: ',
    GET = 'GET',
    DEF_REQ_TIMEOUT = 300000, // don't create an ever-lasting request: always quit after 5 minutes
    BODY_METHODS = {
        POST: 1,
        PUT: 1
    },
    CONTENT_TYPE = 'Content-Type',
    MIME_JSON = 'application/json',
    DEF_CONTENT_TYPE_POST = 'application/x-www-form-urlencoded; charset=UTF-8',
    ERROR_NO_XHR = 'no valid xhr transport-mechanism available',
    REQUEST_TIMEOUT = 'Request-timeout',
    UNKNOW_ERROR = 'Unknown response-error',
    XHR_ERROR = 'XHR Error',
    ABORTED = 'Request aborted',
    NO_XHR = 'No valid xhr found on this browser',
    ENCODE_URI_COMPONENT = encodeURIComponent,

IO = {
    config: {},

    //===============================================================================================
    // private methods:
    //===============================================================================================

    _xhrList: [],

    /**
     * Initializes the xhr-instance, based on the config-params.
     * This method is the standard way of doing xhr-requests without processing streams.
     *
     * @method _initXHR
     * @param xhr {Object} xhr-instance
     * @param options {Object}
     *    @param [options.url] {String} The url to which the request is sent.
     *    @param [options.method='GET'] {String} The HTTP method to use.
     *    can be ignored, even if streams are used --> the returned Promise will always hold all data
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.data] {Object} Data to be sent to the server, either to be used by `query-params` or `body`.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.responseType] {String} Force the response type.
     *    @param [options.timeout=3000] {number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     * @param fulfill {Function} reference to xhr-promise's fulfill-function
     * @param reject {Function} reference to xhr-promise's reject-function
     * @param promise {Promise} the xhr-promise which will be extended with the `abort()`-method
     * @private
    */
    _initXHR: function (xhr, options, promise) {
        console.log(NAME, '_initXHR');
        var instance = this,
            url = options.url,
            method = options.method || GET,
            headers = options.headers || {}, // all request will get some headers
            async = !options.sync,
            data = options.data,
            reject = promise.reject;
        // xhr will be null in case of a CORS-request when no CORS is possible
        if (!xhr) {
            console.error(NAME, '_initXHR fails: '+ERROR_NO_XHR);
            reject(new Error(ERROR_NO_XHR));
            return;
        }
        console.log(NAME, '_initXHR succesfully created '+(xhr._isXHR2 ? 'XMLHttpRequest2' : (xhr._isXDR ? 'XDomainRequest' : 'XMLHttpRequest1'))+'-instance');

        // method-name should be in uppercase:
        method = method.toUpperCase();

        // in case of BODY-method: eliminate any data behind querystring:
        // else: append data-object behind querystring
        if (BODY_METHODS[method]) {
            url = url.split('?'); // now url is an array
            url = url[0]; // now url is a String again
        }
        else if (data) {
            url += ((url.indexOf('?') > 0) ? '&' : '?') + instance._toQueryString(data);
        }

        xhr.open(method, url, async);
        // xhr.responseType = options.responseType || 'text';
        options.withCredentials && (xhr.withCredentials=true);


        // more initialisation might be needed by extended modules:
        instance._xhrInitList.each(
            function(fn) {
                fn(xhr, promise, headers, method);
            }
        );

        // send the request:
        xhr.send((BODY_METHODS[method] && data) ? ((headers[CONTENT_TYPE]===MIME_JSON) ? JSON.stringify(data) : instance._toQueryString(data)) : null);

        console.log(NAME, 'xhr send to '+url+' with method '+method);

        // now add xhr.abort() to the promise, so we can call from within the returned promise-instance
        promise.abort = function() {
            console.log(NAME, 'xhr aborted');
            reject(new Error(ABORTED));
            xhr._aborted = true; // must be set: IE9 won't allow to read anything on xhr after being aborted
            xhr.abort();
        };

        // in case synchronous transfer: force an xhr.onreadystatechange:
        async || xhr.onreadystatechange();
    },

    /**
     * Adds the `headers`-object to `xhr`-headers.
     *
     * @method _setHeaders
     * @param xhr {Object} containing the xhr-instance
     * @param headers {Object} containing all headers
     * @param method {String} the request-method used
     * @private
    */
    _setHeaders: function(xhr, promise, headers, method) {
        // XDR cannot set requestheaders, only XHR:
        if (!xhr._isXDR) {
            console.log(NAME, '_setHeaders');
            var name;
            if ((method!=='POST') && (method!=='PUT')) {
                // force GET-request to make a request instead of using cache (like IE does):
                headers['If-Modified-Since'] = 'Wed, 15 Nov 1995 01:00:00 GMT';
                // header 'Content-Type' should only be set with POST or PUT requests:
                delete headers[CONTENT_TYPE];
            }
            // set all headers
            for (name in headers) {
                xhr.setRequestHeader(name, headers[name]);
            }

            // in case of POST or PUT method: always make sure 'Content-Type' is specified
            ((method!=='POST') && (method!=='PUT')) || (headers && (CONTENT_TYPE in headers)) || xhr.setRequestHeader(CONTENT_TYPE, DEF_CONTENT_TYPE_POST);
        }
    },

    /**
     * Adds 2 methods on the xhr-instance which are used by xhr when events occur:
     *
     * xhr.onreadystatechange()
     * xhr.ontimeout()  // only XMLHttpRequest2
     *
     * These events are responsible for making the Promise resolve.
     * @method _setReadyHandle
     * @param xhr {Object} containing the xhr-instance
     * @param fulfill {Function} reference to the Promise fulfill-function
     * @param reject {Function} reference to the Promise reject-function
     * @private
    */
    _setReadyHandle: function(xhr, promise) {
        console.log(NAME, '_setReadyHandle');
        // for XDomainRequest, we need 'onload' instead of 'onreadystatechange'
        xhr.onreadystatechange = function() {
            // CANNOT console xhr.responseText here! IE9 will throw an error:
            // you can only acces it after (xhr.readyState===4)
            // also check xhr._aborted --> IE9 comes here after aborted and will throw an error when reading xhr's native properties
            if (!xhr._aborted && (xhr.readyState===4)) {
                clearTimeout(xhr._timer);
                if ((xhr.status>=200) && (xhr.status<300)) {
                    console.log(NAME, 'xhr.onreadystatechange will fulfill xhr-instance: '+xhr.responseText);
                    promise.fulfill(xhr);
                }
                else {
                    console.warn(NAME, 'xhr.onreadystatechange will reject xhr-instance: '+xhr.statusText);
                    promise.reject(new Error(xhr.statusText || UNKNOW_ERROR));
                }
            }
        };
        xhr.onerror = function() {
            clearTimeout(xhr._timer);
            promise.reject(new Error(XHR_ERROR));
        };
    },

    /**
     * Stringifies an object into one string with every pair separated by `&`
     *
     * @method _toQueryString
     * @param data {Object} containing key-value pairs
     * @return {String} stringified presentation of the object, with every pair separated by `&`
     * @private
    */
    _toQueryString: function(data) {
        var paramArray = [],
            key, value;
    // TODO: use `object` module
        for (key in data) {
            value = data[key];
            key = ENCODE_URI_COMPONENT(key);
            paramArray.push((value === null) ? key : (key + '=' + ENCODE_URI_COMPONENT(value)));
        }
        console.log(NAME, '_toQueryString --> '+paramArray.join('&'));
        return paramArray.join('&');
    },

    /**
     * Sends a HTTP request to the server and returns a Promise with an additional .abort() method to cancel the request.
     * This method is the standard way of doing xhr-requests without processing streams.
     *
     * @method _xhr
     * @param options {Object}
     *    @param [options.url] {String} The url to which the request is sent.
     *    @param [options.method='GET'] {String} The HTTP method to use.
     *    can be ignored, even if streams are used --> the returned Promise will always hold all data
     *    @param [options.sync=false] {boolean} By default, all requests are sent asynchronously. To send synchronous requests, set to true.
     *    @param [options.data] {Object} Data to be sent to the server, either to be used by `query-params` or `body`.
     *    @param [options.headers] {Object} HTTP request headers.
     *    @param [options.responseType] {String} Force the response type.
     *    @param [options.timeout=3000] {number} to timeout the request, leading into a rejected Promise.
     *    @param [options.withCredentials=false] {boolean} Whether or not to send credentials on the request.
     *    @param [options.streamback] {Function} callbackfunction in case you want to process streams (needs io-stream module).
     * @return {Promise} Promise holding the request. Has an additional .abort() method to cancel the request.
     * <ul>
     *     <li>on success: xhr {XMLHttpRequest1|XMLHttpRequest2} xhr-response</li>
     *     <li>on failure: reason {Error}</li>
     * </ul>
     * @private
    */
    _xhr: function(options) {
        console.log(NAME, '_xhr');
        var instance = this,
            props = {},
            xhr, promise;
        options || (options={});

        xhr = new XMLHttpRequest();
        props._isXHR2 = ('withCredentials' in xhr);
        // it could be other modules like io-cors or io-stream have subscribed
        // xhr might be changed, also private properties might be extended
        instance._xhrList.each(
            function(fn) {
                xhr = fn(xhr, props, options);
            }
        );
        if (!xhr) {
            return Promise.reject(NO_XHR);
        }
        xhr.merge(props);
        console.log(NAME, '_xhr creating xhr of type: '+ (props._isXHR2 ? 'XMLHttpRequest2' : (props._isXDR ? 'XDomainRequest' : 'XMLHttpRequest1')));
        console.log(NAME, 'CORS-IE: '+ props._CORS_IE + ', canStream: '+props._canStream);

        promise = Promise.manage(options.streamback);

        // Don't use xhr.timeout --> IE<10 throws an error when set xhr.timeout
        // We use a timer that aborts the request
        Object.defineProperty(xhr, '_timer', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: setTimeout(function() {
                       promise.reject(new Error(REQUEST_TIMEOUT));
                       xhr._aborted = true; // must be set: IE9 won't allow to read anything on xhr after being aborted
                       xhr.abort();
                   }, options.timeout || instance.config.reqTimeout || DEF_REQ_TIMEOUT)
        });

        instance._initXHR(xhr, options, promise);
        return promise;
    }
};

IO._xhrInitList = [
    IO._setReadyHandle,
    IO._setHeaders
];

module.exports = IO;
},{"core-lang-ext":5,"core-promise-ext":6,"ypromise":2}],17:[function(require,module,exports){
"use strict";
/**
@module core
@submodule parcel
*/
require('core-lang-ext');
/**
All Parcela apps should inherit from this class.

The constructor ensures the `config` argument exists and is an object.
It merges the values from the [`defaultConfig`](#property_defaultConfig) property into it and
sets the properties of the instance to the resulting values.  
It then calls the `init` method with all its arguments.  
The [`init`](#method_init) might be considered the true constructor of the parcel.



@class Parcel
@constructor
*/
var Parcel = Object.createClass(function (config) {
	config = Object.merge(config, this.defaultConfig);
	this.merge(config);
	// fastest way, according to http://jsperf.com/concatenating
	var a = Array.prototype.slice.call(arguments, 1);
	a.unshift(config);
	this.init.apply(this, a);
},{
	/**
	Provides the initialization of the parcel, called by the constructor of the parcel with all its arguments.
	
	Can be overriden by each Parcela app.

	Set up event listeners, initialize variables and models and prepare for operation.
	@method init
	*/
	init: function (config) {},
	
	
	/**
	Called by the page manager before unloading the parcel, for example, when switching pages.

	@method unload
	@return {Boolean}  If it returns exactly `false`, page switching will be prevented.
	*/
	unload: function () {},
	
	
	/**
	Returns the virtual DOM for this parcel.

	Must be overriden by each Parcela app.
	
	A virtual DOM node is composed of the following elements:

	* `tag` {String}:  Name of the HTML tag for the node to be created.
	* `attrs` {Object}: Collection of HTML attributes to be added to the node.
	* `children` {Array}: Array of virtual DOM nodes that will become children of the created node.
	
	This method will usually use the [`ITSA.vNode`](ITSA.html#method_vNode) 
	helper function to produce the virtual DOM node.

	@example
		view: function () {
			var v = I.Parcel.vNode;
			return v('div', [
				v('p.joyful','Hello Workd!'),
				v('hr'),
				v('p','(Not very original, really)')
			]);
		}

		// Equivalent to:
		view: function () {
			return {tag:'div', attrs:{},children: [
				{tag:'p', attrs:{class:'joyful'}, children:['Hellow World!']},
				{tag:'hr', attrs: {}, children: []},
				{tag:'p', attrs:{}, children:['(Not very original, really)']}
			]};
		}
	@method view
	@return {vNode} The expected virtual DOM for this parcel.
	*/
	view: function () {
		return {};
	},
	
	/**
	Returns a value representative of the state of this parcel.
	The system will compare it with the previous state and if they match, 
	it will assume the view has not changed.
	
	The default function returns `NaN` which is always different than itself.
	It may be overriden for optimization purposes.
	@method stamp
	@return {value} any simple value (no objects or such) that reflects the state of this view
	*/
	stamp: function () {
		return NaN;
	},
	/**
	Provides default initialization values for the configuration of this Parcel.
	It is used by the constructor to merge it with the `config` values it might have 
	received.
	
	The constructor only makes a shallow copy of the values in the hash.
	Object references must be initialized in the [`init`](#method_init) method,
	otherwise they would all point to the very same copy.
	
	@property defaultConfig
	@type Object
	@default undefined
	*/
	
	/**
	Type of DOM element that will be created to serve as a container for this Parcel.
	Defaults to a `DIV`
	
	@property containerType
	@type String
	@default DIV
	
	*/
	containerType: 'DIV',
	/**
	CSS className to add to the container for this parcel.  
	This is in addition to the className of `parcel` which is 
	automatically added to all Parcel containers.
	
	@property className
	@type String
	@default ''
	*/
	className:''
});

module.exports = Parcel;

},{"core-lang-ext":5}],18:[function(require,module,exports){
/*
In good part inspired by Leo Horie's Mithirl https://github.com/lhorie/mithril.js
*/
/**
Provides routing services.

The module exports a single function which should be called to 
fetch the [Router](../classes/Router.html) class.

The function must be passed a reference to the DOM `window` object
or a reasonable substitute.
For modules to be loaded through Browserify, 
this is usually `global.window`.  For modules loaded both through
Browserify or node, assuming a suitable emulator, it can be
done like this:
 
```   
var vDOM = require('core-vdom')(global.window || require('dom-window-emulator'));
```

@module core
@submodule core-routing
*/

/**
Provides routing services to Parcela

@class Router
@static
*/


module.exports = function (window) {
	"use strict";
	
	var winLoc = window.location,
		document = window.document;
	
	var rootApp = require('core-vdom')(window).rootApp;
	require('core-lang-ext');
	
	

	var r = {
		/**
		Current routing mode.  Can be one of the following, allowing paths of the format shown:
		
		* `'pathname'`: http://server/path/to/page
		* `'hash'`: http://server/#/path/to/page
		* **`'search'`**: http://server/?/path/to/page
		
		See the user guide for further discussion about the different modes.
		
		@property mode
		@type String
		@default 'search'
		*/
		mode: 'search',
		
		/**
		Routing table. Contains a hash map, indexed by the url, 
		with the sub-Class of Parcel that should be instantiated to handle the route.
		
		@property routes
		@type Hash table
		@default {}
		*/
		routes: {},
		
		/**
		DOM element where the application will be rendered.  Defaults to the `document.body`.
		
		@property rootNode
		@type DOM reference
		@default document.body
		*/
		rootNode: document.body,
		
		/**
		Default route to use when the url given by the browser does not match any 
		in the routing table
		
		@property defaultRoute
		@type String
		@default '/'
		*/
		defaultRoute: '/',

		_modes: {pathname: "", hash: "#", search: "?"},
		_routeParams: {}, 
		_currentRoute:null,
		_redirect: function() {}, 
		_computePostRedrawHook: null,

		_buildQueryString: function (object, prefix) {
			if (!object) return null;
			var str = [];
			object.each(function (prop) {
				var key = prefix ? prefix + "[" + prop + "]" : prop, value = object[prop];
				str.push(
					typeof value == "object" ? 
					r._buildQueryString(value, key) : 
					encodeURIComponent(key) + "=" + encodeURIComponent(value)
				);
			});
			return str.join("&");
		},
		

		_parseQueryString: function (str) {
			var params = {};
	
			var decodeSpace = function (string) {
				return decodeURIComponent(string.replace(/\+/g, " "));
			};
			str.split('&').forEach(function (pair) {
				pair = pair.split("=");
				params[decodeSpace(pair[0])] = pair[1] ? decodeSpace(pair[1]) : (pair.length === 1 ? true : "");
			});
			return params;
		},
		
		_routeByValue: function (path) {
			r._routeParams = {};
			var routes = r.routes;

			var queryStart = path.indexOf("?");
			if (queryStart !== -1) {
				r._routeParams = r._parseQueryString(path.substr(queryStart + 1, path.length));
				path = path.substr(0, queryStart);
			}
			r._routeParams.route = path;

			return routes.some(function (Parcel, route) {
				if (route == path) {
					rootApp(new Parcel(r._routeParams), r.rootNode);
					return true;
				}

				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

				if (matcher.test(path)) {
					path.replace(matcher, function() {
						var values = [].slice.call(arguments, 1, -2);
						(route.match(/:[^\/]+/g) || []).forEach(function (key, i) {
							r._routeParams[key.replace(/:|\./g, "")] = decodeURIComponent(values[i]);
						});
						rootApp(new Parcel(r._routeParams), r.rootNode);
					});
					return true;
				}
			});
		},

		_setScroll: function () {
			if (r.mode != "hash" && winLoc.hash) {
				winLoc.hash = winLoc.hash;
			} else window.scrollTo(0, 0);
		},
		getCurrent: function () {
			return r._currentRoute;
		},
		
		/**
		Determines the routing configuration for an application.
		It will immediately act on the given routes, running the corresponding parcel.
		This method is for conveniency, all the properties it sets are public.
		
		```
		ITSA.Router.setRoutes(
			{
				'/item/:id': ItemParcel,
				'/itemList': ItemList
			},
			'/itemList'
		);
		```
		In this case we define two routes, the first one with a parameter `id`,
		each handled by a different Parcel. The default is the second route.
		No `rootNode` has been specified, thus the parcel will be rendered
		in the `document.body`.
		

		@method setRoutes
		@chainable
		@param routes {Object} A route table as described in [routes](#property_routes)
		@param [mode] {String} One of `search`, `hash` of `pathname` to set the [mode](#property_mode) property.
		@param [defaultRoute] {String} url of the route to execute if the current location doesn't match any of the above.
		     defaults to '/'
		@param [rootNode] {DOM Element} Where to render the given Parcel. Defaults to `document.body`.
		*/
		setRoutes: function (routes, mode, defaultRoute, rootNode) {
			r.routes = routes.shallowClone();
			if (mode !== undefined) {
				if (mode in r._modes) {
					r.mode = mode;
				} else {
					rootNode = defaultRoute;
					defaultRoute = mode;
				}
				if (defaultRoute !== undefined && defaultRoute.appendChild) {
					rootNode = defaultRoute;
					defaultRoute = null;
				}
			}
					
			
			r.rootNode = rootNode || document.body;
			r.defaultRoute = defaultRoute || '/';

			var normalizeRoute = function (route) {
				return route.slice(r._modes[r.mode].length);
			};
			r._redirect = function(source) {
				var path = r._currentRoute = normalizeRoute(source);
				if (!r._routeByValue(path)) {
					r.navigate(r.defaultRoute, true);
				}
			};
			var listener = r.mode == "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function () {
				console.log(r._currentRoute, normalizeRoute(winLoc[r.mode]));
				if (r._currentRoute != normalizeRoute(winLoc[r.mode])) {
					r._redirect(winLoc[r.mode]);
				}
			};
			r._computePostRedrawHook = r._setScroll;
			window[listener]();
			return r;
		},
		
		/**
		Returns the value of a parameter from the url when the route had variable parts.
		For a route such as `'/item/:id'` if the browser navigates to `/item/123`,
		`getParam('id')` should return `123`.
		
		@method getParam
		@param name {String} Name of the parameter to read
		@return {String} value of the parameter or undefined if not found.
		*/
		getParam: function (name) {
			return r._routeParams[name];
		},
		
		/**
		Navigates to the given route. Query parameters can be passed.  
		The new route can either be added to the browser history or replace the current entry.
		If the route is not found in the routing table, the [defaultRoute](#property_defaultRoute)
		will be used.
		
		@method navigate
		@chainable
		@param route {String} url of the route to navigate to
		@param [params] {Hash Map} parameters to be added to the query
		@param [replace] {Boolean} if true, the given route will replace the current one in the browser history
		*/
		navigate: function (route, params, replace) {
			r._currentRoute = route;
			if (typeof params !== "object") {
				replace = params;
				params = null;
			}

			var querystring = r._buildQueryString(params);
			if (querystring) {
				r._currentRoute += (r._currentRoute.indexOf("?") === -1 ? "?" : "&") + querystring;
			}
			
			if (window.history.pushState) {
				r._computePostRedrawHook = function() {
					window.history[replace === true ? "replaceState" : "pushState"]
						(null, document.title, r._modes[r.mode] + r._currentRoute);
					r._setScroll();
				};
				r._redirect(r._modes[r.mode] + r._currentRoute);
			}
			else winLoc[r.mode] = r._currentRoute;
			return r;
		},
		
		
		/**
		Helper method to set or replace a route in the routing table.
		
		@method setRoute
		@chainable
		@param url {String |regex} url template of the route to set or replace 
			or a regular expression that should match the route.
		@param parcel {Parcel} sub-class of Parcel to instantiate to handle this route
		*/
		setRoute: function (url, parcel, index) {
			r.routes[url] = parcel;
			return r;
		},

		/** 
		Removes the given route from the routing table.
		@method removeRoute
		@chainable
		@param url {String} route to remove
		*/
		removeRoute: function (url) {
			delete r.routes[url];
			return r;
		}
	};

	/* *
	Shortcut to the [Router.setRoutes](#method_setRoutes) method.
	
	```
	ITSA.Router(
		{
			'/item/:id': ItemParcel,
			'/itemList': ItemList
		},
		'/itemList'
	);
	```

	**Important** If this method is used, 
	it should be used before any of the other methods in this static class are used.
	
	@method ()
	@chainable
	@param routes {Object} A route table as described in [routes](#property_routes)
		@param [mode] {String} One of `search`, `hash` of `pathname` to set the [mode](#property_mode) property.
		@param [defaultRoute] {String} url of the route to execute if the current location doesn't match any of the above.
		     defaults to '/'
		@param [rootNode] {DOM Element} Where to render the given Parcel. Defaults to `document.body`.
	*/
	
	return function () {
		return r.setRoutes.apply(r, arguments);
	}.merge(r);
};


},{"core-lang-ext":5,"core-vdom":11}],19:[function(require,module,exports){
/* globals document:true */

"use strict";

/**
 * Extends the Event-instance by adding the object `listener` to it.
 * The returned object should be merged into any Class-instance or object you want to
 * extend with the listener-methods, so the appropriate methods can be invoked on the instance.
 *
 * Should be called using  the provided `extend`-method like this:
 * @example
 *     var coreEventListener = require('core-event-listener');<br>
 *     coreEventListener.extend(ITSA.event);
 *
 * @module parcel
 * @submodule parcel-event-listener
 * @class Parcel.Listener
 * @since 0.0.1
 *
 * <i>Copyright (c) 2014 Parcela - https://github.com/Parcela</i>
 * New BSD License - https://github.com/ItsAsbreuk/itsa-library/blob/master/LICENSE
 *
*/

// Include Function.mergePrototypes:
require('core-lang-ext');

var NAME = '[parcel-events]: ',
    EventEmitter = require('event/event-emitter.js'),
    DOCUMENT = document,

createListener = {
    mergeInto: function (ParcelClass, instanceEvent) {
        /**
         * Holds all event-listener methods.
         * The returned object should be merged into any Class-instance or object you want to
         * extend with the listener-methods, so the appropriate methods can be invoked on the instance.
         *
         * See [Event.listener](Event.listener.html) for all properties that can be merged.
         *
         * @example
         *     var blueObject = {};
         *     blueObject.merge(Event.Listener);
         *     blueObject.after('*:save', function(e) {
         *         ...
         *     });
         *
         * @example
         *     Members.mergePrototypes(Event.Listener);
         *     var myMembers = new Members();
         *     myMembers.after('PersonalProfile:save', function(e) {
         *         ...
         *     });
         *
         * @for Parcel
         * @property EventListener
         * @type Object
         * @since 0.0.1
         */

        /**
         * This object should be merged into any Class-instance or object that you want to provide
         * event-listener methods. This way, the appropriate methods can be invoked on the instance.
         * instead of using the static Event-methods.
         *
         * It is highly recommendable to merge on the prototype instead of the instance. See the docs.
         *
         * @class Parcel.EventListener
         *
        */

        // if Event doesn't have its Emitter plugin, then we will plug it in now:
        instanceEvent.Emitter || (EventEmitter.mergeInto(instanceEvent));

        instanceEvent._getCurrentTarget = function(subscriber) {
            console.log(NAME, '_getCurrentTarget');
            var ispNode = (typeof ((subscriber.o.parcel && subscriber.o.parcel.view) || subscriber.o.view) === 'function');
            ispNode && (subscriber.parcel=true);
            // in case of pNode, subscriber.o._pNode might not exist yet --> so we can't return anything at this stage
            // it will be set the first time the even gets called inside _invokeSubs
            return ispNode ? undefined : DOCUMENT;
        };

        /**
         * Given a domnode and a parcel, this method returns an object from the parcel
         * with information about which vNode corresponds with the domnode and the parcelTree towards
         * this vNode.
         *
         * @method _getPVnode
         * @param parcel {parcel} Parcelinstance to search through
         * @param domnode {DOMnode} DOMnode to search for
         * @private
         * @return {Object|undefined} undefined when `domnode` is not within the parcel, the object has 2 properties:
         * <ul>
         *     <li>vNode: vNode that corresponds with domnode</li>
         *     <li>parcelTree: array with Parcels downto the parcel that holds vNode. Top down: the first item
         *         is the parcel that was passed through as first argument</li>
         * </ul>
         * @since 0.0.1
         */
        instanceEvent._getPVnode = function(parcel, domnode) {
            console.log(NAME, '_getPVnode');
            var pNode = parcel._pNode,
                parcelTree = [pNode],
                vNode, returnObject,
                getChildPVnode = function(children) {
                    console.log(NAME, 'getChildPVnode');
                    var found;
                    children.some(
                        function(child) {
                            console.log(NAME, 'getChildPVnode for one child');
                            var vChildren,
                                ispNode;
                            // only pNodes and vNodes can have a DOMnode bounded
                            if (typeof child === 'object') {
                                ispNode = (typeof ((child.parcel && child.parcel.view) || child.view) === 'function');
                                if (child.node===domnode) {
                                    // the vNode's node matches the searched domnode
                                    found = child;
                                }
                                else {
                                    // inspect its children
                                    vChildren = child.children;
                                    Array.isArray(vChildren) || (vChildren=[vChildren]);
                                    ispNode && parcelTree.push(child.parcel);
                                    found = getChildPVnode(vChildren);
                                    found || (ispNode && parcelTree.splice(parcelTree.length-1, 1));
                                }
                                return found;
                            }
                        }
                    );
                    return found;
                };

            if (pNode && pNode.children) {
                vNode = getChildPVnode(pNode.children);
                returnObject = vNode ? {vNode: vNode, parcelTree: parcelTree} : undefined;
            }
            return returnObject;
        };

        // now redefine Event._invokeSubs --> it needs to work a bit differently when using Parcels combined with
        // DOM-events because we have the dom-bubble chain
        /**
         * Does the actual invocation of a subscriber. Overrides _invokesSubs from `event-base`.
         *
         * @method _invokeSubs
         * @param e {Object} event-object
         * @param subscribers {Array} contains subscribers (objects) with these members:
         * <ul>
         *     <li>subscriber.o {Object} context of the callback</li>
         *     <li>subscriber.cb {Function} callback to be invoked</li>
         *     <li>subscriber.f {Function} filter to be applied</li>
         *     <li>subscriber.t {DOM-node|pNode|vNode} target for the specific selector, which will be set as e.target
         *         only when event-dom is active and there are filter-selectors</li>
         *     <li>subscriber.n {DOM-node|pNode} highest dom-node that acts as the container for delegation.
         *         only when core-event-dom is active and there are filter-selectors</li>
         * </ul>
         * @param [before] {Boolean} whether it concerns before subscribers
         * @param [sort] {Function} a sort function to controll the order of execution.
         *             Only applyable when working with DOM-events (bubble-order), provided by `core-event-dom`
         * @private
         * @since 0.0.1
         */
        //
        // CAUTIOUS: When making changes here, you should look whether these changes also effect `_invokeSubs()`
        // inside `event-base`
        //
        instanceEvent._originalInvokeSubsParcel = instanceEvent._invokeSubs;
        instanceEvent._invokeSubs = function (e, subscribers, before, sort) {
            if (!sort) {
                return this._originalInvokeSubsParcel(e, subscribers, before, sort);
            }
            console.log(NAME, '_invokeSubs');
            var instance = this,
                subs, propagationStopped, targetnode, pvnode;

        // if `sort` exists, we create a new sub-array with the items that passed the filter
        // this subarray gets sorted. We ALWAYS need to do this on every event: the dom could have changed
            subs = subscribers.filter(
                       function(subscriber) {
                           return subscriber.f ? subscriber.f.call(subscriber.o, e) : (subscriber.parcel && !!instance._getPVnode(subscriber.o, e.target));
                       }
                   );

            // at this point, we need to find out what are the current node-refs. whenever there is
            // a filter that starts with `#` --> in those cases we have a bubble-chain, because the selector isn't
            // set up with `document` at its root.
            // we couldn't do this at time of subscribtion, for the nodes might not be there at that time.
            // however, we only need to do this once: we store the value if we find them
            // no problem when the nodes leave the dom later: the previous filter wouldn't pass
            subs.each(function(subscriber) {
                // the node-ref is specified with `subscriber.n`
                if (!subscriber.n) {
                    if (subscriber.nId) {
                        subscriber.n = DOCUMENT.getElementById(subscriber.nId);
                        // careful: if the subscriber is a parcel, then we want the vNode instead of the domnode
                        subscriber.parcel && (pvnode=instance._getPVnode(subscriber.o, subscriber.n)) && (subscriber.n=pvnode.vNode);
                    }
                    else if (subscriber.parcel) {
                        subscriber.n = subscriber.o._pNode;
                    }
                }
            });

            // now we sort, based upon the sortFn
            subs.sort(sort);

            // if `subs` was processed by the sort function, it also has only subscribers that passed their filter
            // if not, the `subs` equals `subscribers` and we still need to check their filter before invoke them
            subs.some(function(subscriber) {
                // inside the aftersubscribers, we may need exit right away.
                // this would be the case whenever stopPropagation or stopImmediatePropagation was called
                // in case the subscribernode equals the node on which stopImmediatePropagation was called: return true
                targetnode = (subscriber.t || subscriber.n);

                if (e.status.immediatePropagationStopped===targetnode) {
                    return true;
                }
                // in case the subscribernode does not fall within or equals the node on which stopPropagation was called: return true
                propagationStopped = e.status.propagationStopped;
                if (propagationStopped && (propagationStopped!==targetnode) && !instance._nodeContains(propagationStopped, targetnode)) {
                    return true;
                }

                // check: if `sort` exists, then the filter is already supplied, but we need to set e.currentTarget for every bubble-level
                // is `sort` does not exists, then the filter is not yet supplied and we need to it here
                e.currentTarget = targetnode;
                // now we might need to set e.target to the right node:
                // the filterfunction might have found the true domnode that should act as e.target
                // and set it at subscriber.t
                // also, we need to backup the original e.target: this one should be reset when
                // we encounter a subscriber with its own filterfunction instead of selector
                if (subscriber.t) {
                    e._originalTarget || (e._originalTarget=e.target);
                    e.target = subscriber.t;
                }
                else {
                    e._originalTarget && (e.target=e._originalTarget);
                }

                // finally: invoke subscriber
                subscriber.cb.call(subscriber.o, e);

                if (e.status.unSilencable && e.silent) {
                    console.warn(NAME, ' event '+e.emitter+':'+e.type+' cannot made silent: this customEvent is defined as unSilencable');
                    e.silent = false;
                }

                return e.silent ||
                      (before && (
                              e.status.halted || (
                                  ((propagationStopped=e.status.propagationStopped) && (propagationStopped!==targetnode)) || e.status.immediatePropagationStopped
                              )
                          )
                      );
            });
        };
        /**
         * Creates a filterfunction out of a css-selector. To be used for catching any dom-element
         * that happens on domnodes within the parcel-instance. Makes e.target to reurn the vNode.
         * also adds e.parcelTree which is the tree of all Parcel-instances between the Parcel that
         * got the subscriber and the vNode that where there was a match with the selector.
         *
         * On "non-outside" events, subscriber.t is set to the node that first matches the selector
         * so it can be used to set as e.target in the final subscriber
         *
         * @method _parcelSelToDom
         * @param subscriber {Object} Subscriber-object
         * @param selector {String} css-selector
         * @param [outsideEvent] {Boolean} whetrer it is an outside-event (like `clickoutside`)
         * @private
         * @since 0.0.1
         */
        instanceEvent._parcelSelToVDom = function(subscriber, selector, outsideEvent) {
            console.log(NAME, '_parcelSelToVDom');
            // CAUTIOUS: parcelinstance._pNode is undefined when the subscriber is set up within `init`
            // therefore, we need to take its reference inside the filterfunction
            // this stage is runned during subscription
            var instance = this;
            return function(e) {
                // this stage is runned when the event happens
                var node = e.target,
                    parcelinstance = subscriber.o,
                    pNode_node = parcelinstance._pNode && parcelinstance._pNode.node,
                    match = false,
                    vnodeInfo;
                // e.target is the most deeply node in the dom-tree that caught the event
                // our listener uses `selector` which might be a node higher up the tree.
                // we will reset e.target to this node (if there is a match)
                // note that e.currentTarget will always be `document` --> we're not interested in that
                // also, we don't check for `node`, but for node.matchesSelector: the highest level `document`
                // is not null, yet it doesn;t have .matchesSelector so it would fail
                if (selector && (vnodeInfo=instance._getPVnode(parcelinstance, node))) {
                    while (!match) {
                        console.log(NAME, '_parcelSelToVDom check match');
                        match = node.matchesSelector(selector);
                        // reset e.target to the target that matches the selector
                        if (match) {
                            if (!outsideEvent) {
                                e.target===node || (vnodeInfo=instance._getPVnode(parcelinstance, node));
                                subscriber.t = vnodeInfo.vNode;
                                e.parcelTree = vnodeInfo.parcelTree;
                            }
                        }
                        else {
                            node = node.parentNode;
                        }
                    }
                }
                else {
                    // only accept exact match at containernode
                    match = (node===pNode_node);
                    match || (subscriber.t=pNode_node);
                }
                return !outsideEvent ? match : !match;
            };
        };

        /**
         * Creates a filterfunction out of a css-selector.
         * On "non-outside" events, subscriber.t is set to the node that first matches the selector
         * so it can be used to set as e.target in the final subscriber
         *
         * @method _selToFunc
         * @param subscriber {Object} Subscriber-object
         * @param selector {String} css-selector
         * @param [outsideEvent] {Boolean} whetrer it is an outside-event (like `clickoutside`)
         * @private
         * @since 0.0.1
         */
        instanceEvent._selToFunc = function(subscriber, selector, outsideEvent) {
            console.log(NAME, '_selToFunc');
            // return `_domSelToFunc` by default
            // Parcel.Event uses a different selectormethod.
            var context = subscriber.o,
                isParcel = context && (typeof context.view==='function') && (typeof context.stamp==='function');
            return isParcel ? this._parcelSelToVDom(subscriber, selector, outsideEvent) : this._domSelToFunc(subscriber, selector, outsideEvent);
        };

/*  NOT GOING to use this. It would have been a quicker way, but we need vDOM-information
        instanceEvent._parcelSelToDom = function(subscriber, selector, outsideEvent) {
            // CAUTIOUS: parcelinstance._pNode is undefined when the subscriber is set up within `init`
            // therefore, we need to take its reference inside the filterfunction
            return function(e) {
                var node = e.target,
                    parcelinstance = subscriber.o,
                    pNode_node = parcelinstance._pNode && parcelinstance._pNode.node,
                    match = false;
                // e.target is the most deeply node in the dom-tree that caught the event
                // our listener uses `selector` which might be a node higher up the tree.
                // we will reset e.target to this node (if there is a match)
                // note that e.currentTarget will always be `document` --> we're not interested in that
                // also, we don't check for `node`, but for node.matchesSelector: the highest level `document`
                // is not null, yet it doesn;t have .matchesSelector so it would fail
                if (selector && pNode_node.contains(node)) {
                    while (!match && (pNode_node!==node)) {
                        match = node.matchesSelector(selector);
                        // reset e.target to the target that matches the selector
                        if (match) {
                            !outsideEvent || (subscriber.t=node);
                        }
                        else {
                            node = node.parentNode;
                        }
                    }
                }
                else {
                    // only accept exact match at containernode
                    match = (node===pNode_node);
                    match || (subscriber.t=pNode_node);
                }
                return !outsideEvent ? match : !match;
            };
        };
*/

            instanceEvent._vNodeContains = function(vNodeA, vNodeB) {
                console.log(NAME, '_vNodeContains');
                var findPVnode = function(vNode) {
                    console.log(NAME, '_vNodeContains - findPVnode');
                    var found = false;
                    vNode.children.some(
                        function(child) {
                            console.log(NAME, '_vNodeContains - findPVnode check child');
                            found = (child===vNodeB) || (child.children && findPVnode(child));
                            return found;
                        }
                    );
                    return !!found;
                };
                return vNodeA.children ? findPVnode(vNodeA) : false;
            };

            /**
             * Sort nodes conform the dom-tree by looking at their position inside the tree.
             * overrules '_sortSubsDOM' from
             *
             * @method _sortSubsDOM
             * @param customEvent {String}
             * @private
             * @return {Function} sortable function
             * @since 0.0.1
             */
            instanceEvent._sortSubsDOM = function(subscriberOne, subscriberTwo) {
                console.log(NAME, '_sortSubsDOM');
                return this._nodeContains(subscriberOne.t || subscriberOne.n, subscriberTwo.t || subscriberTwo.n) ? 1 : -1;
            };

            instanceEvent._nodeContains = function(nodeA, nodeB) {
                console.log(NAME, '_nodeContains');
                var aIsDomNode = nodeA.clientHeight,
                    bIsDomNode = nodeB.clientHeight,
                    a, b;
                if (!aIsDomNode && !bIsDomNode) {
                    return this._vNodeContains(nodeA, nodeB);
                }
                else {
                    a = aIsDomNode ? nodeA : nodeA.node;
                    b = bIsDomNode ? nodeB : nodeB.node;
                    return a.contains(b);
                }
            };

        ParcelClass.mergePrototypes({

            /**
             * Defines an emitterName into the instance.
             * This will add a protected property `_emitterName` to the instance. If you need an emitterName on
             * the Class, you should use the Event.Emitter helper: `ClassName.mergePrototypes(Event.Emitter(emitterName));`
             *
             * @static
             * @method defineEmitter
             * @param emitterName {String} identifier that will be added when events are sent (`emitterName:eventName`)
             * @since 0.0.1
            */
            defineEmitter: function(emitterName) {
                 // force assign: there might be an emittername on the Class
                this.merge(instanceEvent.Emitter(emitterName), true);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             *
             * @method after
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            after: function (customEvent, callback, filter, prepend) {
                return instanceEvent.after(customEvent, callback, this, filter, prepend);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `before` the defaultFn.
             *
             * @method before
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            before: function (customEvent, callback, filter, prepend) {
                return instanceEvent.before(customEvent, callback, this, filter, prepend);
            },

            /**
             * Detaches (unsubscribes) the listener from the specified customEvent,
             * on behalf of the object who calls this method.
             *
             * @method detach
             * @param customEvent {String} conform the syntax: `emitterName:eventName`, wildcard `*` may be used for both
             *        `emitterName` as well as only `eventName`, in which case 'UI' will become the emitterName.
             * @since 0.0.1
            */
            detach: function(customEvent) {
                instanceEvent.detach(this, customEvent);
            },

            /**
             * Detaches (unsubscribes) the listener from all customevents,
             * on behalf of the object who calls this method.
             *
             * @method detachAll
             * @since 0.0.1
            */
            detachAll: function() {
                instanceEvent.detachAll(this);
            },

            /**
             * Alias for `after`.
             *
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             *
             * @method on
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            on: function (/* customEvent, callback, filter, prepend */) {
                return this.after.apply(this, arguments);
            },

            /**
             * Alias for `onceAfter`.
             *
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             * The subscriber will be automaticly removed once the callback executed the first time.
             * No need to `detach()` (unless you want to undescribe before the first event)
             *
             * @method onceAfter
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            once: function (/* customEvent, callback, filter, prepend */) {
                return this.onceAfter.apply(this, arguments);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `after` the defaultFn.
             * The subscriber will be automaticly removed once the callback executed the first time.
             * No need to `detach()` (unless you want to undescribe before the first event)
             *
             * @method onceAfter
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of after-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            onceAfter: function (customEvent, callback, filter, prepend) {
                return instanceEvent.onceAfter(customEvent, callback, this, filter, prepend);
            },

            /**
             * Subscribes to a customEvent on behalf of the object who calls this method.
             * The callback will be executed `before` the defaultFn.
             * The subscriber will be automaticly removed once the callback executed the first time.
             * No need to `detach()` (unless you want to undescribe before the first event)
             *
             * @method onceBefore
             * @param customEvent {String|Array} the custom-event (or Array of events) to subscribe to. CustomEvents should
             *        have the syntax: `emitterName:eventName`. Wildcard `*` may be used for both `emitterName` as well as `eventName`.
             *        If `emitterName` is not defined, `UI` is assumed.
             * @param callback {Function} subscriber:will be invoked when the event occurs. An `eventobject` will be passed
             *        as its only argument.
             * @param [filter] {String|Function} to filter the event.
             *        Use a String if you want to filter DOM-events by a `selector`
             *        Use a function if you want to filter by any other means. If the function returns a trully value, the
             *        subscriber gets invoked. The function gets the `eventobject` as its only argument and the context is
             *        the subscriber.
             * @param [prepend=false] {Boolean} whether the subscriber should be the first in the list of before-subscribers.
             * @return {Object} handler with a `detach()`-method which can be used to detach the subscriber
             * @since 0.0.1
            */
            onceBefore: function (customEvent, callback, filter, prepend) {
                return instanceEvent.onceBefore(customEvent, callback, this, filter, prepend);
            }
        });
    }
};

module.exports = createListener;
},{"core-lang-ext":5,"event/event-emitter.js":15}],20:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"core":[function(require,module,exports){
(function (global){
/**
 * core module
 *
 * @module core
*/
(function (window) {
    "use strict";
    /**
     * The ITSA class provides the core functionality for the ITSA library
     * and is the root namespace for all the additional modules.
     *
     * The ITSA class cannot be instantiated.
     * Instead, the ITSA function takes a configuration object to allow for tailoring of the library.
     * The ITSA function returns itself to allow for further chaining.
     *
     * Calling the ITSA function is optional. If the default configuration is acceptable,
     * the ITSA class can be used directly.
     *
     * The ITSA name is usually used only once in an application, when configuring it
     * and when calling the [`ready`](#method_ready) or [`require`](#method_require) methods.
     * The callback to these two methods provide a reference to ITSA itself as their argument.
     * These methods allow the developer to rename ITSA to a shorter name, usually `I`,
     * for use within the local scope.
     *
     *  ITSA( config )
     *      .require('dialog', 'event', ...)
     *      .then(function (I) {
     *          // I is an alias of ITSA
     *      });
     *
     *  // If the default configuration is acceptable, you can simply do:
     *  ITSA.require('dialog', 'event', ...)
     *      .then(function (I) {
     *          // I is an alias of ITSA
     *      });
     *
     *  // If extra modules are to be loaded later, you can simply do:
     *  ITSA( config ).ready
     *      .then(function (I) {
     *          // I is an alias of ITSA
     *      });
     *
     *  // And if no configuration is needed:
     *  ITSA.ready
     *      .then(function (I) {
     *          // I is an alias of ITSA
     *      });
     *
     *
     *
     * @class ITSA
     * @static
     * @param config {Object} Configuration options for the ITSA Library
     * @return self {Object}
    */
    var ITSA = function (config) {
        var key;
        for (key in config) {
            ITSA._config[key] = config[key];
        }
        return ITSA;
    };
    /**
     * Global configuration properties for the ITSA object.
     * It can only be set on initialization via the [`ITSA`](#docs-main) function.
     *
     * The config is set at a default-configutation
     *
     * @property _config
     * @type Object
     * @private
    */
    ITSA._config = {
        debug: true,
        base: '/components'
    };
     var Event = require('event'),
         EventDom = require('event-dom'),
         EventEmitter = require('../event/event-emitter.js'),
         EventListener = require('../event/event-listener.js'),
         HammerJS = require('event-hammerjs'),
         ParcelEvents = require('../parcel/events.js'),
         io_config = {
             reqTimeout: 3000,
             debug: true,
             base: '/build'
         },
         EVENT_NAME_TIMERS_EXECUTION = 'timers:asyncfunc';

    require('ypromise');
    require('core-promise-ext');
    require('core-lang-ext');
    //require('core-loader');
    // ITSA.Events = require('events'); <-- will be activated when ready

    /**
    Reference to the `idGenerator` function in [core-utils](../modules/core-utils.html)

    @property idGenerator
    @type function
    @static
    */
    /**
    Reference to the `typeOf` function in [core-utils](../modules/core-utils.html)

    @property typeOf
    @type function
    @static
    */
    ITSA.merge(require('core-utils'));


    /**
     * Reference to the [IO](io.html) object
     * @property IO
     * @type Object
     * @static
    */
    ITSA.IO = require('io');
    ITSA.IO.config.merge(io_config);


    /**
     * [Event](Event.html)-instance
     * @property Event
     * @type Event
     * @static
    */
    ITSA.Event = Event;
    EventDom.mergeInto(ITSA.Event);
    EventEmitter.mergeInto(ITSA.Event);
    EventListener.mergeInto(ITSA.Event);
    HammerJS.mergeInto(ITSA.Event);

    // Now we setup `_afterAsyncFn` --> the `timers` module uses this:
    // whenever `async() or `later() is called, it will invoke `_afterAsyncFn` if it is defined
    // By define it in a way that an event is emitted, we make sure the vDOM will be re-rendered.
    // this event cannot be prevented, halted or preventRendered --> if the user wants to prevent
    // vDOM-rendering, the last argument of `async9)` or `later()` should be used.
    ITSA.Event.defineEvent(EVENT_NAME_TIMERS_EXECUTION)
              .unHaltable()
              .unPreventable()
              .unRenderPreventable()
              .unSilencable();
    ITSA._afterAsyncFn = function() {
        console.log('[ITSA]: ', ' emitting '+EVENT_NAME_TIMERS_EXECUTION+' through ITSA._afterAsyncFn()');
        // emittng a `dummy`-event which will re-render the dDOM:
        ITSA.Event.emit(EVENT_NAME_TIMERS_EXECUTION);
    };

    /**
    Reference to the [Parcel](Parcel.html) static class

    @property Parcel
    @type Parcel
    @static
    */
    ITSA.Parcel = require('parcel');
    ParcelEvents.mergeInto(ITSA.Parcel, ITSA.Event); // needs both Parcel and Event to merge
    var vdom = require('core-vdom')(window);
    /**
    Reference to the virtual DOM [render](vDOM.html#method_render) method

    @property render
    @type Function
    @static
    */
    ITSA.render = vdom.render;
    ITSA.rootApp = vdom.rootApp;
    ITSA.Parcel.vNode = vdom.vNode;

    /**
    Reference to the [routing module](Router.html).

    @property Router
    @type Function
    @static
    */
    ITSA.Router = require('routing')(window);


    module.exports = ITSA;

    var INIT_TIMEOUT = 3000, // timeout within ITSA.ready ought to be finished
        INIT_TIMEOUT_MSG = 'Initialisation timeout';



    /**
     * Returns a promise when the DOM and ITSA library are ready.
     *
     * The callback receives a copy of `ITSA` as its only argument so that the developer can use a shorter name within the application.
     * It is often called simply `I`.
     *
     * Calling the ITSA function is optional. If the default configuration is acceptable,
     * the ITSA class can be used directly.
     *
     * @example
     *  <script>
     *      ITSA.ready
     *      .then(function (I) {
     *          // I is an alias of ITSA
     *      });
     *  </script>
     *
     * @example
     *  <script>
     *      ITSA({base: '/build'}).ready
     *      .then(function (I) {
     *          // I is an alias of ITSA
     *      });
     *  </script>
     *
     * @property ready
     * @type Promise
    */
    ITSA.ready = function (fn) {
        var initpromise;
        if (ITSA._ready) {
            return ITSA._ready;
        }
        initpromise = new Promise(function (resolve, reject) {
            var promisehash = [];
            // when not initialized within timeout, reject (which can be called allways: resolved promises don't change state)
            setTimeout(function() {reject(INIT_TIMEOUT_MSG);}, INIT_TIMEOUT);
            // do the initializationstuff here, when ready, invoke resolve(I);
            // every async-action can be placed inside 'promisehash'
            Promise.all(promisehash).then(
                function() {
                    resolve(ITSA);
                },
                function(err) {
                    reject(err);
                }
            );
        });
        if (typeof fn === 'function') {
            ITSA._ready = initpromise
                .then(function (I) {
                    return fn(I);
                });
        }
        else {
            ITSA._ready = initpromise;
        }
        return ITSA._ready;
    };

})(global.window || require('fake-dom')());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../event/event-emitter.js":3,"../event/event-listener.js":4,"../parcel/events.js":19,"core-lang-ext":5,"core-promise-ext":6,"core-utils":7,"core-vdom":11,"event":14,"event-dom":12,"event-hammerjs":13,"fake-dom":undefined,"io":16,"parcel":17,"routing":18,"ypromise":2}]},{},[]);
