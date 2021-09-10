function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*!
 * Splide.js
 * Version  : 3.0.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Splide = factory());
})(this, function () {
  'use strict';

  var PROJECT_CODE = "splide";
  var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
  var CREATED = 1;
  var MOUNTED = 2;
  var IDLE = 3;
  var MOVING = 4;
  var DESTROYED = 5;
  var STATES = {
    CREATED: CREATED,
    MOUNTED: MOUNTED,
    IDLE: IDLE,
    MOVING: MOVING,
    DESTROYED: DESTROYED
  };

  function empty(array) {
    array.length = 0;
  }

  function isObject(subject) {
    return !isNull(subject) && typeof subject === "object";
  }

  function isArray(subject) {
    return Array.isArray(subject);
  }

  function isFunction(subject) {
    return typeof subject === "function";
  }

  function isString(subject) {
    return typeof subject === "string";
  }

  function isUndefined(subject) {
    return typeof subject === "undefined";
  }

  function isNull(subject) {
    return subject === null;
  }

  function isHTMLElement(subject) {
    return subject instanceof HTMLElement;
  }

  function isHTMLButtonElement(subject) {
    return subject instanceof HTMLButtonElement;
  }

  function toArray(value) {
    return isArray(value) ? value : [value];
  }

  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }

  function includes(array, value) {
    return array.indexOf(value) > -1;
  }

  function push(array, items) {
    array.push.apply(array, toArray(items));
    return array;
  }

  var arrayProto = Array.prototype;

  function slice(arrayLike, start, end) {
    return arrayProto.slice.call(arrayLike, start, end);
  }

  function find(arrayLike, predicate) {
    return slice(arrayLike).filter(predicate)[0];
  }

  function toggleClass(elm, classes, add) {
    if (elm) {
      forEach(classes, function (name) {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }

  function addClass(elm, classes) {
    toggleClass(elm, classes, true);
  }

  function append(parent, children) {
    forEach(children, parent.appendChild.bind(parent));
  }

  function before(nodes, ref) {
    forEach(nodes, function (node) {
      var parent = ref.parentNode;

      if (parent) {
        parent.insertBefore(node, ref);
      }
    });
  }

  function matches(elm, selector) {
    return (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
  }

  function children(parent, selector) {
    return parent ? slice(parent.children).filter(function (child) {
      return matches(child, selector);
    }) : [];
  }

  function child(parent, selector) {
    return selector ? children(parent, selector)[0] : parent.firstElementChild;
  }

  function forOwn(object, iteratee) {
    if (object) {
      var keys = Object.keys(object);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }

    return object;
  }

  function assign(object) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function (source) {
      forOwn(source, function (value, key) {
        object[key] = source[key];
      });
    });
    return object;
  }

  function merge(object, source) {
    forOwn(source, function (value, key) {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge(isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
    return object;
  }

  function removeAttribute(elm, attrs) {
    if (elm) {
      forEach(attrs, function (attr) {
        elm.removeAttribute(attr);
      });
    }
  }

  function setAttribute(elm, attrs, value) {
    if (isObject(attrs)) {
      forOwn(attrs, function (value2, name) {
        setAttribute(elm, name, value2);
      });
    } else {
      isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    }
  }

  function create(tag, attrs, parent) {
    var elm = document.createElement(tag);

    if (attrs) {
      if (isString(attrs) || isArray(attrs)) {
        addClass(elm, attrs);
      } else {
        setAttribute(elm, attrs);
      }
    }

    if (parent) {
      append(parent, elm);
    }

    return elm;
  }

  function style(elms, styles) {
    if (isString(styles)) {
      return isArray(elms) ? null : getComputedStyle(elms)[styles];
    }

    forOwn(styles, function (value, key) {
      if (!isNull(value)) {
        forEach(elms, function (elm) {
          if (elm) {
            elm.style[key] = "" + value;
          }
        });
      }
    });
  }

  function display(elm, display2) {
    style(elm, {
      display: display2
    });
  }

  function getAttribute(elm, attr) {
    return elm.getAttribute(attr);
  }

  function hasClass(elm, className) {
    return elm && elm.classList.contains(className);
  }

  function parseHtml(html) {
    return child(new DOMParser().parseFromString(html, "text/html").body);
  }

  function prevent(e, stopPropagation) {
    e.preventDefault();

    if (stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  function query(parent, selector) {
    return parent && parent.querySelector(selector);
  }

  function queryAll(parent, selector) {
    return slice(parent.querySelectorAll(selector));
  }

  function rect(target) {
    return target.getBoundingClientRect();
  }

  function remove(nodes) {
    forEach(nodes, function (node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }

  function removeClass(elm, classes) {
    toggleClass(elm, classes, false);
  }

  function unit(value) {
    return isString(value) ? value : value ? value + "px" : "";
  }

  function assert(condition, message) {
    if (message === void 0) {
      message = "";
    }

    if (!condition) {
      throw new Error("[" + PROJECT_CODE + "] " + message);
    }
  }

  function nextTick(callback) {
    setTimeout(callback);
  }

  var noop = function noop() {};

  function raf(func) {
    return requestAnimationFrame(func);
  }

  function between(number, minOrMax, maxOrMin, exclusive) {
    var min = Math.min(minOrMax, maxOrMin);
    var max = Math.max(minOrMax, maxOrMin);
    return exclusive ? min < number && number < max : min <= number && number <= max;
  }

  var max$1 = Math.max,
      min$1 = Math.min;

  function clamp(number, x, y) {
    var minimum = min$1(x, y);
    var maximum = max$1(x, y);
    return min$1(max$1(minimum, number), maximum);
  }

  function sign(x) {
    return +(x > 0) - +(x < 0);
  }

  var min = Math.min,
      max = Math.max,
      floor = Math.floor,
      ceil = Math.ceil,
      abs = Math.abs,
      round = Math.round;

  function format(string, replacements) {
    forEach(replacements, function (replacement) {
      string = string.replace("%s", "" + replacement);
    });
    return string;
  }

  function pad(number) {
    return number < 10 ? "0" + number : "" + number;
  }

  var ids = {};

  function uniqueId(prefix) {
    return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
  }

  function Options(Splide2, Components2, options) {
    var initialOptions;
    var points;
    var currPoint;

    function setup() {
      try {
        merge(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
      } catch (e) {
        assert(false, e.message);
      }

      initialOptions = merge({}, options);
    }

    function mount() {
      var breakpoints = options.breakpoints;

      if (breakpoints) {
        points = Object.keys(breakpoints).sort(function (n, m) {
          return +n - +m;
        }).map(function (point) {
          return [point, matchMedia("(" + (options.mediaQuery || "max") + "-width:" + point + "px)")];
        });
        addEventListener("resize", observe);
        observe();
      }
    }

    function destroy(completely) {
      if (completely) {
        removeEventListener("resize", observe);
      }
    }

    function observe() {
      var item = find(points, function (item2) {
        return item2[1].matches;
      }) || [];

      if (item[0] !== currPoint) {
        onMatch(currPoint = item[0]);
      }
    }

    function onMatch(point) {
      var newOptions = options.breakpoints[point] || initialOptions;

      if (newOptions.destroy) {
        Splide2.options = initialOptions;
        Splide2.destroy(newOptions.destroy === "completely");
      } else {
        if (Splide2.state.is(DESTROYED)) {
          destroy(true);
          Splide2.mount();
        }

        Splide2.options = newOptions;
      }
    }

    return {
      setup: setup,
      mount: mount,
      destroy: destroy
    };
  }

  var RTL = "rtl";
  var TTB = "ttb";
  var ORIENTATION_MAP = {
    marginRight: ["marginBottom", "marginLeft"],
    width: ["height"],
    autoWidth: ["autoHeight"],
    fixedWidth: ["fixedHeight"],
    paddingLeft: ["paddingTop", "paddingRight"],
    paddingRight: ["paddingBottom", "paddingLeft"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    pageX: ["pageY"],
    ArrowLeft: ["ArrowUp", "ArrowRight"],
    ArrowRight: ["ArrowDown", "ArrowLeft"]
  };

  function Direction(Splide2, Components2, options) {
    function resolve(prop, axisOnly) {
      var direction = options.direction;
      var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
      return ORIENTATION_MAP[prop][index] || prop;
    }

    function orient(value) {
      return value * (options.direction === RTL ? 1 : -1);
    }

    return {
      resolve: resolve,
      orient: orient
    };
  }

  var CLASS_ROOT = PROJECT_CODE;
  var CLASS_SLIDER = PROJECT_CODE + "__slider";
  var CLASS_TRACK = PROJECT_CODE + "__track";
  var CLASS_LIST = PROJECT_CODE + "__list";
  var CLASS_SLIDE = PROJECT_CODE + "__slide";
  var CLASS_CLONE = CLASS_SLIDE + "--clone";
  var CLASS_CONTAINER = CLASS_SLIDE + "__container";
  var CLASS_ARROWS = PROJECT_CODE + "__arrows";
  var CLASS_ARROW = PROJECT_CODE + "__arrow";
  var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
  var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
  var CLASS_PAGINATION = PROJECT_CODE + "__pagination";
  var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
  var CLASS_PROGRESS = PROJECT_CODE + "__progress";
  var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
  var CLASS_AUTOPLAY = PROJECT_CODE + "__autoplay";
  var CLASS_PLAY = PROJECT_CODE + "__play";
  var CLASS_PAUSE = PROJECT_CODE + "__pause";
  var CLASS_SPINNER = PROJECT_CODE + "__spinner";
  var CLASS_INITIALIZED = "is-initialized";
  var CLASS_ACTIVE = "is-active";
  var CLASS_PREV = "is-prev";
  var CLASS_NEXT = "is-next";
  var CLASS_VISIBLE = "is-visible";
  var CLASS_LOADING = "is-loading";
  var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
  var CLASSES = {
    slide: CLASS_SLIDE,
    clone: CLASS_CLONE,
    arrows: CLASS_ARROWS,
    arrow: CLASS_ARROW,
    prev: CLASS_ARROW_PREV,
    next: CLASS_ARROW_NEXT,
    pagination: CLASS_PAGINATION,
    page: CLASS_PAGINATION_PAGE,
    spinner: CLASS_SPINNER
  };
  var EVENT_MOUNTED = "mounted";
  var EVENT_READY = "ready";
  var EVENT_MOVE = "move";
  var EVENT_MOVED = "moved";
  var EVENT_CLICK = "click";
  var EVENT_ACTIVE = "active";
  var EVENT_INACTIVE = "inactive";
  var EVENT_VISIBLE = "visible";
  var EVENT_HIDDEN = "hidden";
  var EVENT_SLIDE_KEYDOWN = "slide:keydown";
  var EVENT_REFRESH = "refresh";
  var EVENT_UPDATED = "undated";
  var EVENT_RESIZE = "resize";
  var EVENT_RESIZED = "resized";
  var EVENT_DRAG = "drag";
  var EVENT_DRAGGING = "dragging";
  var EVENT_DRAGGED = "dragged";
  var EVENT_SCROLL = "scroll";
  var EVENT_SCROLLED = "scrolled";
  var EVENT_DESTROY = "destroy";
  var EVENT_ARROWS_MOUNTED = "arrows:mounted";
  var EVENT_ARROWS_UPDATED = "arrows:updated";
  var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
  var EVENT_PAGINATION_PAGE = "pagination:page";
  var EVENT_PAGINATION_UPDATED = "pagination:updated";
  var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
  var EVENT_AUTOPLAY_PLAY = "autoplay:play";
  var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
  var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
  var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

  function EventBus() {
    var handlers = {};

    function on(events, callback, key, priority) {
      if (priority === void 0) {
        priority = 10;
      }

      forEachEvent(events, function (event, namespace) {
        handlers[event] = handlers[event] || [];
        push(handlers[event], {
          _event: event,
          _callback: callback,
          _namespace: namespace,
          _priority: priority,
          _key: key
        }).sort(function (handler1, handler2) {
          return handler1._priority - handler2._priority;
        });
      });
    }

    function off(events, key) {
      forEachEvent(events, function (event, namespace) {
        var eventHandlers = handlers[event];
        handlers[event] = eventHandlers && eventHandlers.filter(function (handler) {
          return handler._key ? handler._key !== key : handler._namespace !== namespace;
        });
      });
    }

    function offBy(key) {
      forOwn(handlers, function (eventHandlers, event) {
        off(event, key);
      });
    }

    function emit(event) {
      var _arguments = arguments;
      (handlers[event] || []).forEach(function (handler) {
        handler._callback.apply(handler, slice(_arguments, 1));
      });
    }

    function destroy() {
      handlers = {};
    }

    function forEachEvent(events, iteratee) {
      toArray(events).join(" ").split(" ").forEach(function (eventNS) {
        var fragments = eventNS.split(".");
        iteratee(fragments[0], fragments[1]);
      });
    }

    return {
      on: on,
      off: off,
      offBy: offBy,
      emit: emit,
      destroy: destroy
    };
  }

  function EventInterface(Splide2) {
    var event = Splide2.event;
    var key = {};
    var listeners = [];

    function on(events, callback, priority) {
      event.on(events, callback, key, priority);
    }

    function off(events) {
      event.off(events, key);
    }

    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, function (target, event2) {
        listeners.push([target, event2, callback, options]);
        target.addEventListener(event2, callback, options);
      });
    }

    function unbind(targets, events) {
      forEachEvent(targets, events, function (target, event2) {
        listeners = listeners.filter(function (listener) {
          if (listener[0] === target && listener[1] === event2) {
            target.removeEventListener(event2, listener[2], listener[3]);
            return false;
          }

          return true;
        });
      });
    }

    function forEachEvent(targets, events, iteratee) {
      forEach(targets, function (target) {
        if (target) {
          events.split(" ").forEach(iteratee.bind(null, target));
        }
      });
    }

    function destroy() {
      listeners = listeners.filter(function (data) {
        return unbind(data[0], data[1]);
      });
      event.offBy(key);
    }

    event.on(EVENT_DESTROY, destroy, key);
    return {
      on: on,
      off: off,
      emit: event.emit,
      bind: bind,
      unbind: unbind,
      destroy: destroy
    };
  }

  function RequestInterval(interval, onInterval, onUpdate, limit) {
    var now = Date.now;
    var startTime;
    var rate = 0;
    var id;
    var paused = true;
    var count = 0;

    function update() {
      if (!paused) {
        var elapsed = now() - startTime;

        if (elapsed >= interval) {
          rate = 1;
          startTime = now();
        } else {
          rate = elapsed / interval;
        }

        if (onUpdate) {
          onUpdate(rate);
        }

        if (rate === 1) {
          onInterval();

          if (limit && ++count >= limit) {
            pause();
            return;
          }
        }

        raf(update);
      }
    }

    function start(resume) {
      !resume && cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      raf(update);
    }

    function pause() {
      paused = true;
    }

    function rewind() {
      startTime = now();
      rate = 0;

      if (onUpdate) {
        onUpdate(rate);
      }
    }

    function cancel() {
      cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }

    function isPaused() {
      return paused;
    }

    return {
      start: start,
      rewind: rewind,
      pause: pause,
      cancel: cancel,
      isPaused: isPaused
    };
  }

  function State(initialState) {
    var state = initialState;

    function set(value) {
      state = value;
    }

    function is(states) {
      return includes(toArray(states), state);
    }

    return {
      set: set,
      is: is
    };
  }

  function Throttle(func, duration) {
    var interval;

    function throttled() {
      var _arguments2 = arguments,
          _this = this;

      if (!interval) {
        interval = RequestInterval(duration || 0, function () {
          func.apply(_this, _arguments2);
          interval = null;
        }, null, 1);
        interval.start();
      }
    }

    return throttled;
  }

  function Elements(Splide2, Components2, options) {
    var _EventInterface = EventInterface(Splide2),
        on = _EventInterface.on;

    var root = Splide2.root;
    var elements = {};
    var slides = [];
    var classes;
    var slider;
    var track;
    var list;

    function setup() {
      collect();
      identify();
      addClass(root, classes = getClasses());
    }

    function mount() {
      on(EVENT_REFRESH, refresh);
      on(EVENT_UPDATED, update);
    }

    function destroy() {
      empty(slides);
      removeClass(root, classes);
    }

    function refresh() {
      destroy();
      setup();
    }

    function update() {
      removeClass(root, classes);
      addClass(root, classes = getClasses());
    }

    function collect() {
      slider = child(root, "." + CLASS_SLIDER);
      track = query(root, "." + CLASS_TRACK);
      list = child(track, "." + CLASS_LIST);
      assert(track && list, "Missing a track/list element.");
      push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
      var autoplay = find("." + CLASS_AUTOPLAY);
      var arrows = find("." + CLASS_ARROWS);
      assign(elements, {
        root: root,
        slider: slider,
        track: track,
        list: list,
        slides: slides,
        arrows: arrows,
        prev: query(arrows, "." + CLASS_ARROW_PREV),
        next: query(arrows, "." + CLASS_ARROW_NEXT),
        bar: query(find("." + CLASS_PROGRESS), "." + CLASS_PROGRESS_BAR),
        play: query(autoplay, "." + CLASS_PLAY),
        pause: query(autoplay, "." + CLASS_PAUSE)
      });
    }

    function identify() {
      var id = root.id || uniqueId(PROJECT_CODE);
      root.id = id;
      track.id = track.id || id + "-track";
      list.id = list.id || id + "-list";
    }

    function find(selector) {
      return child(root, selector) || child(slider, selector);
    }

    function getClasses() {
      return [CLASS_ROOT + "--" + options.type, CLASS_ROOT + "--" + options.direction, options.drag && CLASS_ROOT + "--draggable", options.isNavigation && CLASS_ROOT + "--nav", CLASS_ACTIVE];
    }

    return assign(elements, {
      setup: setup,
      mount: mount,
      destroy: destroy
    });
  }

  function Style() {
    var style;
    var sheet;

    function mount() {
      style = create("style", {}, document.head);
      sheet = style.sheet;
    }

    function destroy() {
      remove(style);
      sheet = null;
    }

    function rule(selector, prop, value) {
      var _sheet = sheet,
          cssRules = _sheet.cssRules;
      var cssRule = find(cssRules, function (cssRule2) {
        return isCSSStyleRule(cssRule2) && cssRule2.selectorText === selector;
      }) || cssRules[sheet.insertRule(selector + "{}", 0)];

      if (isCSSStyleRule(cssRule)) {
        cssRule.style[prop] = "" + value;
      }
    }

    function ruleBy(target, prop, value) {
      rule("#" + (isHTMLElement(target) ? target.id : target), prop, value);
    }

    function isCSSStyleRule(cssRule) {
      return cssRule instanceof CSSStyleRule;
    }

    return {
      mount: mount,
      destroy: destroy,
      rule: rule,
      ruleBy: ruleBy
    };
  }

  var ROLE = "role";
  var ARIA_CONTROLS = "aria-controls";
  var ARIA_CURRENT = "aria-current";
  var ARIA_LABEL = "aria-label";
  var ARIA_HIDDEN = "aria-hidden";
  var TAB_INDEX = "tabindex";
  var DISABLED = "disabled";
  var ALL_ATTRIBUTES = [ROLE, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_HIDDEN, TAB_INDEX, DISABLED];
  var SLIDE = "slide";
  var LOOP = "loop";
  var FADE = "fade";

  function Slide$1(Splide2, index, slideIndex, slide) {
    var _EventInterface2 = EventInterface(Splide2),
        on = _EventInterface2.on,
        emit = _EventInterface2.emit,
        bind = _EventInterface2.bind,
        destroyEvents = _EventInterface2.destroy;

    var Components = Splide2.Components,
        root = Splide2.root,
        options = Splide2.options;
    var isNavigation = options.isNavigation,
        updateOnMove = options.updateOnMove;
    var resolve = Components.Direction.resolve;
    var isClone = slideIndex > -1;
    var container = child(slide, "." + CLASS_CONTAINER);

    function mount() {
      var _this2 = this;

      init();
      bind(slide, "click keydown", function (e) {
        emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, _this2, e);
      });
      on(EVENT_MOUNTED, onMounted.bind(this));
    }

    function onMounted() {
      var boundUpdate = update.bind(this);
      boundUpdate();
      on([EVENT_MOVED, EVENT_UPDATED, EVENT_RESIZED, EVENT_SCROLLED], boundUpdate);

      if (updateOnMove) {
        on(EVENT_MOVE, onMove.bind(this));
      }
    }

    function onMove(next, prev, dest) {
      if (dest === index) {
        updateActivity.call(this, true);
      }

      update.call(this);
    }

    function init() {
      if (!isClone) {
        slide.id = root.id + "-slide" + pad(index + 1);
      }

      if (isNavigation) {
        if (!isHTMLButtonElement(slide)) {
          setAttribute(slide, ROLE, "button");
        }

        var idx = isClone ? slideIndex : index;
        var label = format(options.i18n.slideX, idx + 1);
        var controls = Splide2.splides.map(function (splide) {
          return splide.root.id;
        }).join(" ");
        setAttribute(slide, ARIA_LABEL, label);
        setAttribute(slide, ARIA_CONTROLS, controls);
      }
    }

    function destroy() {
      destroyEvents();
      removeClass(slide, STATUS_CLASSES);
      removeAttribute(slide, ALL_ATTRIBUTES);
    }

    function update() {
      var currIndex = Splide2.index;
      updateActivity.call(this, isActive());
      updateVisibility.call(this, isVisible());
      toggleClass(slide, CLASS_PREV, index === currIndex - 1);
      toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
    }

    function updateActivity(active) {
      if (active !== hasClass(slide, CLASS_ACTIVE)) {
        toggleClass(slide, CLASS_ACTIVE, active);

        if (isNavigation) {
          setAttribute(slide, ARIA_CURRENT, active || null);
        }

        emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, this);
      }
    }

    function updateVisibility(visible) {
      setAttribute(slide, ARIA_HIDDEN, !visible || null);
      setAttribute(slide, TAB_INDEX, visible && options.slideFocus ? 0 : null);

      if (visible !== hasClass(slide, CLASS_VISIBLE)) {
        toggleClass(slide, CLASS_VISIBLE, visible);
        emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, this);
      }
    }

    function rule(prop, value, useContainer) {
      var selector = "#" + slide.id + (container && useContainer ? " > ." + CLASS_CONTAINER : "");
      Components.Style.rule(selector, prop, value);
    }

    function isActive() {
      return Splide2.index === index;
    }

    function isVisible() {
      if (Splide2.is(FADE)) {
        return isActive();
      }

      var trackRect = rect(Components.Elements.track);
      var slideRect = rect(slide);
      var left = resolve("left");
      var right = resolve("right");
      return floor(trackRect[left]) <= slideRect[left] && slideRect[right] <= ceil(trackRect[right]);
    }

    function isWithin(from, distance) {
      var diff = abs(from - index);

      if (!Splide2.is(SLIDE) && !isClone) {
        diff = min(diff, Splide2.length - diff);
      }

      return diff <= distance;
    }

    return {
      index: index,
      slideIndex: slideIndex,
      slide: slide,
      container: container,
      isClone: isClone,
      mount: mount,
      destroy: destroy,
      rule: rule,
      isWithin: isWithin
    };
  }

  function Slides(Splide2, Components2, options) {
    var _EventInterface3 = EventInterface(Splide2),
        on = _EventInterface3.on,
        emit = _EventInterface3.emit,
        bind = _EventInterface3.bind;

    var _Components2$Elements = Components2.Elements,
        slides = _Components2$Elements.slides,
        list = _Components2$Elements.list;
    var Slides2 = [];

    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
    }

    function init() {
      slides.forEach(function (slide, index) {
        register(slide, index, -1);
      });
    }

    function destroy() {
      forEach$1(function (Slide2) {
        Slide2.destroy();
      });
      empty(Slides2);
    }

    function refresh() {
      destroy();
      init();
    }

    function register(slide, index, slideIndex) {
      var object = Slide$1(Splide2, index, slideIndex, slide);
      object.mount();
      Slides2.push(object);
    }

    function get(excludeClones) {
      return excludeClones ? filter(function (Slide2) {
        return !Slide2.isClone;
      }) : Slides2;
    }

    function getIn(page) {
      var Controller = Components2.Controller;
      var index = Controller.toIndex(page);
      var max = Controller.hasFocus() ? 1 : options.perPage;
      return filter(function (Slide2) {
        return between(Slide2.index, index, index + max - 1);
      });
    }

    function getAt(index) {
      return filter(index)[0];
    }

    function add(items, index) {
      forEach(items, function (slide) {
        if (isString(slide)) {
          slide = parseHtml(slide);
        }

        if (isHTMLElement(slide)) {
          var ref = slides[index];
          ref ? before(slide, ref) : append(list, slide);
          addClass(slide, options.classes.slide);
          observeImages(slide, emit.bind(null, EVENT_RESIZE));
        }
      });
      emit(EVENT_REFRESH);
    }

    function remove$1(matcher) {
      remove(filter(matcher).map(function (Slide2) {
        return Slide2.slide;
      }));
      emit(EVENT_REFRESH);
    }

    function forEach$1(iteratee, excludeClones) {
      get(excludeClones).forEach(iteratee);
    }

    function filter(matcher) {
      return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
        return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
      });
    }

    function rule(prop, value, useContainer) {
      forEach$1(function (Slide2) {
        Slide2.rule(prop, value, useContainer);
      });
    }

    function observeImages(elm, callback) {
      var images = queryAll(elm, "img");
      var length = images.length;

      if (length) {
        images.forEach(function (img) {
          bind(img, "load error", function () {
            if (! --length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }

    function getLength(excludeClones) {
      return excludeClones ? slides.length : Slides2.length;
    }

    function isEnough() {
      return Slides2.length > options.perPage;
    }

    return {
      mount: mount,
      destroy: destroy,
      register: register,
      get: get,
      getIn: getIn,
      getAt: getAt,
      add: add,
      remove: remove$1,
      forEach: forEach$1,
      filter: filter,
      rule: rule,
      getLength: getLength,
      isEnough: isEnough
    };
  }

  function Clones(Splide2, Components2, options) {
    var _EventInterface4 = EventInterface(Splide2),
        on = _EventInterface4.on,
        emit = _EventInterface4.emit;

    var Elements = Components2.Elements,
        Slides = Components2.Slides;
    var resolve = Components2.Direction.resolve;
    var clones = [];
    var cloneCount;
    var cloneIndex;

    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_UPDATED, EVENT_RESIZE], observe);
    }

    function init() {
      if (cloneCount = computeCloneCount()) {
        generate(cloneCount);
      }
    }

    function destroy() {
      remove(clones);
      empty(clones);
    }

    function refresh() {
      destroy();
      init();
    }

    function observe() {
      if (cloneCount !== computeCloneCount()) {
        emit(EVENT_REFRESH);
      }
    }

    function generate(count) {
      var slides = Slides.get().slice();
      var length = slides.length;

      if (length) {
        cloneIndex = 0;

        while (slides.length < count) {
          push(slides, slides);
        }

        slides.slice(-count).concat(slides.slice(0, count)).forEach(function (Slide, index) {
          var isHead = index < count;
          var clone = cloneDeep(Slide.slide);
          isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
          push(clones, clone);
          Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
        });
      }
    }

    function cloneDeep(elm) {
      var clone = elm.cloneNode(true);
      addClass(clone, options.classes.clone);
      clone.id = Splide2.root.id + "-clone" + pad(++cloneIndex);
      return clone;
    }

    function computeCloneCount() {
      var clones2 = options.clones;

      if (!Splide2.is(LOOP)) {
        clones2 = 0;
      } else if (!clones2) {
        var fixedSize = options[resolve("fixedWidth")];
        var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
        var baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
        clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
      }

      return clones2;
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  function Layout(Splide2, Components2, options) {
    var _EventInterface5 = EventInterface(Splide2),
        on = _EventInterface5.on,
        bind = _EventInterface5.bind,
        emit = _EventInterface5.emit;

    var Slides = Components2.Slides;
    var ruleBy = Components2.Style.ruleBy;
    var resolve = Components2.Direction.resolve;
    var _Components2$Elements2 = Components2.Elements,
        root = _Components2$Elements2.root,
        track = _Components2$Elements2.track,
        list = _Components2$Elements2.list;
    var getAt = Slides.getAt;
    var vertical = options.direction === TTB;

    function mount() {
      init();
      bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on(EVENT_RESIZE, resize);
    }

    function init() {
      ruleBy(root, "maxWidth", unit(options.width));
      ruleBy(track, resolve("paddingLeft"), cssPadding(false));
      ruleBy(track, resolve("paddingRight"), cssPadding(true));
      Slides.rule(resolve("marginRight"), unit(options.gap));
      Slides.rule("width", cssSlideWidth());
      setSlidesHeight();
      resize();
    }

    function resize() {
      ruleBy(track, "height", cssTrackHeight());
      options.heightRatio && setSlidesHeight();
      emit(EVENT_RESIZED);
    }

    function setSlidesHeight() {
      Slides.rule("height", cssSlideHeight(), true);
    }

    function cssPadding(right) {
      var padding = options.padding;
      var prop = resolve(right ? "right" : "left", true);
      return padding ? unit(padding[prop] || (isObject(padding) ? "0" : padding)) : "";
    }

    function cssTrackHeight() {
      var height = "";

      if (vertical) {
        height = cssHeight();
        assert(height, '"height" or "heightRatio" is missing.');
        var paddingTop = cssPadding(false);
        var paddingBottom = cssPadding(true);

        if (paddingTop || paddingBottom) {
          height = "calc(" + height;
          height += "" + (paddingTop ? " - " + paddingTop : "") + (paddingBottom ? " - " + paddingBottom : "") + ")";
        }
      }

      return height;
    }

    function cssHeight() {
      return unit(options.height || rect(list).width * options.heightRatio);
    }

    function cssSlideWidth() {
      return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
    }

    function cssSlideHeight() {
      return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
    }

    function cssSlideSize() {
      var gap = unit(options.gap);
      return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
    }

    function listSize() {
      return rect(list)[resolve("width")];
    }

    function slideSize(index, withoutGap) {
      var Slide = getAt(index || 0);
      return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
    }

    function totalSize(index, withoutGap) {
      var Slide = getAt(index);

      if (Slide) {
        var right = rect(Slide.slide)[resolve("right")];
        var left = rect(list)[resolve("left")];
        return abs(right - left) + (withoutGap ? 0 : getGap());
      }

      return 0;
    }

    function sliderSize() {
      var firstSlide = getAt(0);
      var lastSlide = getAt(Slides.getLength(true) - 1);

      if (firstSlide && lastSlide) {
        return rect(lastSlide.slide)[resolve("right")] - rect(firstSlide.slide)[resolve("left")];
      }

      return 0;
    }

    function getGap() {
      var Slide = getAt(0);
      return Slide ? parseFloat(style(Slide.slide, resolve("marginRight"))) || 0 : 0;
    }

    function getPadding(right) {
      return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left"), true))) || 0;
    }

    return {
      mount: mount,
      listSize: listSize,
      slideSize: slideSize,
      sliderSize: sliderSize,
      totalSize: totalSize,
      getPadding: getPadding
    };
  }

  function Move(Splide2, Components2, options) {
    var _EventInterface6 = EventInterface(Splide2),
        on = _EventInterface6.on,
        emit = _EventInterface6.emit;

    var _Components2$Layout = Components2.Layout,
        slideSize = _Components2$Layout.slideSize,
        getPadding = _Components2$Layout.getPadding,
        totalSize = _Components2$Layout.totalSize,
        listSize = _Components2$Layout.listSize,
        sliderSize = _Components2$Layout.sliderSize;
    var _Components2$Directio = Components2.Direction,
        resolve = _Components2$Directio.resolve,
        orient = _Components2$Directio.orient;
    var _Components2$Elements3 = Components2.Elements,
        list = _Components2$Elements3.list,
        track = _Components2$Elements3.track;
    var looping;
    var waiting;
    var currPosition = 0;
    var positionRate = 0;

    function mount() {
      on([EVENT_RESIZE, EVENT_UPDATED, EVENT_REFRESH], reposition);
    }

    function reposition() {
      if (options.drag !== "free") {
        jump(Splide2.index);
      } else {
        if (!options[resolve("fixedWidth")] && !options[resolve("autoWidth")]) {
          translate(listSize() * positionRate);
        }

        if (isExceededMax(currPosition)) {
          translate(getLimit(true));
        }
      }
    }

    function move(dest, index, prev) {
      if (!isBusy()) {
        var position = getPosition();
        looping = dest !== index;
        waiting = options.waitForTransition;
        Splide2.state.set(MOVING);
        emit(EVENT_MOVE, index, prev, dest);
        Components2.Transition.start(dest, function () {
          onMoved(dest, index, prev, position);
        });
      }
    }

    function onMoved(dest, index, prev, oldPosition) {
      if (looping) {
        jump(index);
        looping = false;
      }

      waiting = false;
      Splide2.state.set(IDLE);
      emit(EVENT_MOVED, index, prev, dest);

      if (options.trimSpace === "move" && dest !== prev && oldPosition === getPosition()) {
        Components2.Controller.go(dest > prev ? ">" : "<");
      }
    }

    function jump(index) {
      translate(toPosition(index, true));
    }

    function translate(position) {
      currPosition = loop(position);
      positionRate = currPosition / listSize();
      Components2.Style.ruleBy(list, "transform", "translate" + resolve("X") + "(" + currPosition + "px)");
    }

    function loop(position) {
      if (!looping && Splide2.is(LOOP)) {
        var diff = position - currPosition;
        var exceededMin = isExceededMin(position);
        var exceededMax = isExceededMax(position);

        if (exceededMin && diff > 0 || exceededMax && diff < 0) {
          position += orient(sliderSize() * (exceededMin ? 1 : -1));
        }
      }

      return position;
    }

    function cancel() {
      translate(getPosition());
      Components2.Transition.cancel();
    }

    function toIndex(position) {
      var Slides = Components2.Slides.get();
      var index = 0;
      var minDistance = Infinity;

      for (var i = 0; i < Slides.length; i++) {
        var slideIndex = Slides[i].index;
        var distance = abs(toPosition(slideIndex) - position);

        if (distance < minDistance) {
          minDistance = distance;
          index = slideIndex;
        } else {
          break;
        }
      }

      return index;
    }

    function toPosition(index, trimming) {
      var position = orient(totalSize(index - 1) - offset(index));
      return trimming ? trim(position) : position;
    }

    function getPosition() {
      var left = resolve("left");
      return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
    }

    function trim(position) {
      if (options.trimSpace && Splide2.is(SLIDE)) {
        position = clamp(position, 0, orient(sliderSize() - listSize()));
      }

      return position;
    }

    function offset(index) {
      var focus = options.focus;

      if (focus === "center") {
        return (listSize() - slideSize(index, true)) / 2;
      }

      return (+focus || 0) * slideSize(index);
    }

    function getLimit(max) {
      var trimming = !!options.trimSpace;
      return max ? toPosition(Components2.Controller.getEnd(), trimming) : toPosition(0, trimming);
    }

    function isBusy() {
      return !!(looping || waiting);
    }

    function isExceededMin(position, offset2) {
      return orient(position) + (offset2 || 0) < orient(getLimit(false));
    }

    function isExceededMax(position, offset2) {
      return orient(position) + (offset2 || 0) > orient(getLimit(true));
    }

    function isExceeded() {
      return isExceededMin(currPosition) || isExceededMax(currPosition);
    }

    return {
      mount: mount,
      move: move,
      jump: jump,
      translate: translate,
      cancel: cancel,
      toIndex: toIndex,
      toPosition: toPosition,
      getPosition: getPosition,
      getLimit: getLimit,
      isBusy: isBusy,
      isExceededMin: isExceededMin,
      isExceededMax: isExceededMax,
      isExceeded: isExceeded
    };
  }

  function Controller(Splide2, Components2, options) {
    var _EventInterface7 = EventInterface(Splide2),
        on = _EventInterface7.on;

    var Move = Components2.Move;
    var _Components2$Slides = Components2.Slides,
        isEnough = _Components2$Slides.isEnough,
        getLength = _Components2$Slides.getLength;
    var isLoop = Splide2.is(LOOP);
    var currIndex = options.start || 0;
    var prevIndex = currIndex;
    var slideCount;
    var perMove;
    var perPage;

    function mount() {
      init();
      Move.jump(currIndex);
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on(EVENT_SCROLLED, function () {
        setIndex(Move.toIndex(Move.getPosition()));
      }, 0);
    }

    function init() {
      slideCount = getLength(true);
      perMove = options.perMove;
      perPage = options.perPage;
    }

    function go(control, allowSameIndex) {
      var dest = parse(control);
      var index = loop(dest);

      if (index > -1 && !Move.isBusy() && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move.move(dest, index, prevIndex);
      }
    }

    function parse(control) {
      var index = currIndex;

      if (isString(control)) {
        var _ref = control.match(/([+\-<>])(\d+)?/) || [],
            indicator = _ref[1],
            number = _ref[2];

        if (indicator === "+" || indicator === "-") {
          index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex, true);
        } else if (indicator === ">") {
          index = number ? toIndex(+number) : getNext(true);
        } else if (indicator === "<") {
          index = getPrev(true);
        }
      } else {
        if (isLoop) {
          index = clamp(control, -perPage, slideCount + perPage - 1);
        } else {
          index = clamp(control, 0, getEnd());
        }
      }

      return index;
    }

    function getNext(destination) {
      return getAdjacent(false, destination);
    }

    function getPrev(destination) {
      return getAdjacent(true, destination);
    }

    function getAdjacent(prev, destination) {
      var dest = computeDestIndex(currIndex + getPerMove() * (prev ? -1 : 1), currIndex);
      return destination ? dest : loop(dest);
    }

    function computeDestIndex(dest, from, incremental) {
      if (isEnough()) {
        var end = getEnd();

        if (dest < 0 || dest > end) {
          if (between(0, dest, from, true) || between(end, from, dest, true)) {
            dest = toIndex(toPage(dest));
          } else {
            if (isLoop) {
              dest = perMove ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
            } else if (options.rewind) {
              dest = dest < 0 ? end : 0;
            } else {
              dest = -1;
            }
          }
        } else {
          if (!isLoop && !incremental && dest !== from) {
            dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
          }
        }
      } else {
        dest = -1;
      }

      return dest;
    }

    function getEnd() {
      var end = slideCount - perPage;

      if (hasFocus() || isLoop && perMove) {
        end = slideCount - 1;
      }

      return max(end, 0);
    }

    function loop(index) {
      if (isLoop) {
        return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
      }

      return index;
    }

    function toIndex(page) {
      return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
    }

    function toPage(index) {
      if (!hasFocus()) {
        index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
        index = floor(index / perPage);
      }

      return index;
    }

    function getPerMove() {
      return perMove || hasFocus() ? 1 : perPage;
    }

    function setIndex(index) {
      if (index !== currIndex) {
        prevIndex = currIndex;
        currIndex = index;
      }
    }

    function getIndex(prev) {
      return prev ? prevIndex : currIndex;
    }

    function hasFocus() {
      return !isUndefined(options.focus) || options.isNavigation;
    }

    return {
      mount: mount,
      go: go,
      getNext: getNext,
      getPrev: getPrev,
      getEnd: getEnd,
      setIndex: setIndex,
      getIndex: getIndex,
      toIndex: toIndex,
      toPage: toPage,
      hasFocus: hasFocus
    };
  }

  var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
  var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
  var SIZE = 40;

  function Arrows(Splide2, Components2, options) {
    var _EventInterface8 = EventInterface(Splide2),
        on = _EventInterface8.on,
        bind = _EventInterface8.bind,
        emit = _EventInterface8.emit;

    var classes = options.classes,
        i18n = options.i18n;
    var Elements = Components2.Elements,
        Controller = Components2.Controller;
    var slider = Elements.slider,
        track = Elements.track;
    var wrapper = Elements.arrows;
    var prev = Elements.prev;
    var next = Elements.next;
    var created;
    var arrows = {};

    function mount() {
      init();
      on(EVENT_UPDATED, init);
    }

    function init() {
      if (options.arrows) {
        if (!prev || !next) {
          createArrows();
        }
      }

      if (prev && next) {
        if (!arrows.prev) {
          setAttribute(prev, ARIA_CONTROLS, track.id);
          setAttribute(next, ARIA_CONTROLS, track.id);
          arrows.prev = prev;
          arrows.next = next;
          listen();
          emit(EVENT_ARROWS_MOUNTED, prev, next);
        } else {
          display(wrapper, options.arrows === false ? "none" : "");
        }
      }
    }

    function destroy() {
      if (created) {
        remove(wrapper);
      } else {
        removeAttribute(prev, ALL_ATTRIBUTES);
        removeAttribute(next, ALL_ATTRIBUTES);
      }
    }

    function listen() {
      var go = Controller.go;
      on([EVENT_MOUNTED, EVENT_MOVE, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
      bind(next, "click", function () {
        go(">");
      });
      bind(prev, "click", function () {
        go("<");
      });
    }

    function createArrows() {
      var parent = options.arrows === "slider" && slider ? slider : Splide2.root;
      wrapper = create("div", classes.arrows);
      prev = createArrow(true);
      next = createArrow(false);
      created = true;
      append(wrapper, [prev, next]);
      before(wrapper, child(parent));
    }

    function createArrow(prev2) {
      var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
      return parseHtml(arrow);
    }

    function update() {
      var index = Splide2.index;
      var prevIndex = Controller.getPrev();
      var nextIndex = Controller.getNext();
      var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
    }

    return {
      arrows: arrows,
      mount: mount,
      destroy: destroy
    };
  }

  function Autoplay(Splide2, Components2, options) {
    var _EventInterface9 = EventInterface(Splide2),
        on = _EventInterface9.on,
        bind = _EventInterface9.bind,
        emit = _EventInterface9.emit;

    var _Components2$Elements4 = Components2.Elements,
        root = _Components2$Elements4.root,
        track = _Components2$Elements4.track,
        bar = _Components2$Elements4.bar,
        playButton = _Components2$Elements4.play,
        pauseButton = _Components2$Elements4.pause;
    var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
    var isPaused = interval.isPaused;
    var hovered;
    var focused;
    var paused;

    function mount() {
      var autoplay = options.autoplay;

      if (autoplay) {
        initButton(true);
        initButton(false);
        listen();

        if (autoplay !== "pause") {
          play();
        }
      }
    }

    function initButton(forPause) {
      var button = forPause ? pauseButton : playButton;

      if (button) {
        if (!isHTMLButtonElement(button)) {
          setAttribute(button, ROLE, "button");
        }

        setAttribute(button, ARIA_CONTROLS, track.id);
        setAttribute(button, ARIA_LABEL, options.i18n[forPause ? "pause" : "play"]);
        bind(button, "click", forPause ? pause : play);
      }
    }

    function listen() {
      if (options.pauseOnHover) {
        bind(root, "mouseenter mouseleave", function (e) {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }

      if (options.pauseOnFocus) {
        bind(root, "focusin focusout", function (e) {
          focused = e.type === "focusin";
          autoToggle();
        });
      }

      on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    }

    function play() {
      if (isPaused() && Components2.Slides.isEnough()) {
        interval.start(!options.resetProgress);
        focused = false;
        hovered = false;
        emit(EVENT_AUTOPLAY_PLAY);
      }
    }

    function pause(manual) {
      if (manual === void 0) {
        manual = true;
      }

      if (!isPaused()) {
        interval.pause();
        emit(EVENT_AUTOPLAY_PAUSE);
      }

      paused = manual;
    }

    function autoToggle() {
      if (!paused) {
        if (!hovered && !focused) {
          play();
        } else {
          pause(false);
        }
      }
    }

    function update(rate) {
      emit(EVENT_AUTOPLAY_PLAYING, rate);

      if (bar) {
        style(bar, {
          width: rate * 100 + "%"
        });
      }
    }

    return {
      mount: mount,
      destroy: interval.cancel,
      play: play,
      pause: pause,
      isPaused: isPaused
    };
  }

  function Cover(Splide2, Components2, options) {
    var _EventInterface10 = EventInterface(Splide2),
        on = _EventInterface10.on;

    function mount() {
      if (options.cover) {
        on(EVENT_LAZYLOAD_LOADED, function (img, Slide) {
          toggle(true, img, Slide);
        });
        on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
      }
    }

    function destroy() {
      apply(false);
    }

    function apply(cover) {
      Components2.Slides.forEach(function (Slide) {
        var img = child(Slide.container || Slide.slide, "img");

        if (img && img.src) {
          toggle(cover, img, Slide);
        }
      });
    }

    function toggle(cover, img, Slide) {
      Slide.rule("background", cover ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
      display(img, cover ? "none" : "");
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  var BOUNCE_DIFF_THRESHOLD = 10;
  var BOUNCE_DURATION = 600;
  var FRICTION_FACTOR = 0.6;
  var BASE_VELOCITY = 1.2;
  var MIN_DURATION = 800;

  function Scroll(Splide2, Components2, options) {
    var _EventInterface11 = EventInterface(Splide2),
        on = _EventInterface11.on,
        emit = _EventInterface11.emit;

    var Move = Components2.Move;
    var getPosition = Move.getPosition,
        getLimit = Move.getLimit;
    var interval;

    function mount() {
      on(EVENT_MOVE, clear);
      on([EVENT_UPDATED, EVENT_REFRESH], cancel);
    }

    function scroll(destination, duration, suppressConstraint) {
      var start = getPosition();
      var friction = 1;
      duration = duration || computeDuration(abs(destination - start));
      clear();
      interval = RequestInterval(duration, onScrolled, function (rate) {
        var position = getPosition();
        var target = start + (destination - start) * easing(rate);
        var diff = (target - getPosition()) * friction;
        Move.translate(position + diff);

        if (Splide2.is(SLIDE) && !suppressConstraint && Move.isExceeded()) {
          friction *= FRICTION_FACTOR;

          if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
            bounce(Move.isExceededMin(getPosition()));
          }
        }
      }, 1);
      emit(EVENT_SCROLL);
      interval.start();
    }

    function bounce(backwards) {
      scroll(getLimit(!backwards), BOUNCE_DURATION, true);
    }

    function onScrolled() {
      emit(EVENT_SCROLLED);
    }

    function computeDuration(distance) {
      return max(distance / BASE_VELOCITY, MIN_DURATION);
    }

    function clear() {
      if (interval) {
        interval.cancel();
      }
    }

    function cancel() {
      if (interval && !interval.isPaused()) {
        clear();
        onScrolled();
      }
    }

    function easing(t) {
      var easingFunc = options.easingFunc;
      return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
    }

    return {
      mount: mount,
      destroy: clear,
      scroll: scroll,
      cancel: cancel
    };
  }

  var FRICTION = 5;
  var SAMPLING_INTERVAL = 50;
  var POINTER_DOWN_EVENTS = "touchstart mousedown";
  var POINTER_MOVE_EVENTS = "touchmove mousemove";
  var POINTER_UP_EVENTS = "touchend touchcancel mouseup mouseleave";

  function Drag(Splide2, Components2, options) {
    var _EventInterface12 = EventInterface(Splide2),
        emit = _EventInterface12.emit,
        bind = _EventInterface12.bind,
        unbind = _EventInterface12.unbind;

    var track = Components2.Elements.track;
    var _Components2$Directio2 = Components2.Direction,
        resolve = _Components2$Directio2.resolve,
        orient = _Components2$Directio2.orient;
    var listSize = Components2.Layout.listSize;
    var _Components2$Controll = Components2.Controller,
        go = _Components2$Controll.go,
        getEnd = _Components2$Controll.getEnd;
    var Move = Components2.Move,
        Scroll = Components2.Scroll;
    var translate = Move.translate,
        toIndex = Move.toIndex,
        getPosition = Move.getPosition,
        isExceeded = Move.isExceeded;
    var isSlide = Splide2.is(SLIDE);
    var isFade = Splide2.is(FADE);
    var isFree = options.drag === "free";
    var startCoord;
    var lastTime;
    var basePosition;
    var baseCoord;
    var baseTime;
    var lastEvent;
    var moving;
    var isMouse;
    var target;
    var exceeded;

    function mount() {
      if (options.drag) {
        bind(track, POINTER_DOWN_EVENTS, onPointerDown);
      }
    }

    function onPointerDown(e) {
      isMouse = e.type === "mousedown";
      target = isMouse ? window : track;

      if (!(isMouse && e.button)) {
        if (!Move.isBusy()) {
          bind(target, POINTER_MOVE_EVENTS, onPointerMove);
          bind(target, POINTER_UP_EVENTS, onPointerUp);
          Move.cancel();
          Scroll.cancel();
          startCoord = getCoord(e);
        } else {
          prevent(e);
        }
      }
    }

    function onPointerMove(e) {
      if (e.cancelable) {
        var min2 = options.dragMinThreshold || 15;

        if (isMouse || abs(getCoord(e) - startCoord) > min2) {
          moving = true;
          onDrag();
        }

        if (moving) {
          onDragging(e);
          prevent(e, true);
        }
      } else {
        onPointerUp(e);
      }
    }

    function onPointerUp(e) {
      unbind(target, POINTER_MOVE_EVENTS + " " + POINTER_UP_EVENTS);
      moving = false;

      if (lastEvent) {
        onDragged(e);
        lastEvent = null;
      }
    }

    function onDrag() {
      bind(track, "click", function (e) {
        unbind(track, "click");
        prevent(e, true);
      }, {
        capture: true
      });
      emit(EVENT_DRAG);
    }

    function onDragging(e) {
      var timeStamp = e.timeStamp;
      var expired = !lastTime || timeStamp - lastTime > SAMPLING_INTERVAL;

      if (expired || isExceeded() !== exceeded) {
        basePosition = getPosition();
        baseCoord = getCoord(e);
        baseTime = timeStamp;
      }

      exceeded = isExceeded();
      lastTime = timeStamp;
      lastEvent = e;

      if (!isFade) {
        translate(basePosition + constrain(getCoord(e) - baseCoord));
      }

      emit(EVENT_DRAGGING);
    }

    function onDragged(e) {
      var velocity = computeVelocity(e);

      if (isFade) {
        go(Splide2.index + orient(sign(velocity)));
      } else {
        var destination = computeDestination(velocity);

        if (isFree) {
          Scroll.scroll(destination);
        } else {
          go(computeIndex(destination), true);
        }
      }

      lastTime = 0;
      emit(EVENT_DRAGGED);
    }

    function computeVelocity(e) {
      if (Splide2.is(LOOP) || !isExceeded()) {
        var diffCoord = getCoord(lastEvent) - baseCoord;
        var diffTime = lastEvent.timeStamp - baseTime;
        var isFlick = e.timeStamp - lastTime < SAMPLING_INTERVAL;

        if (diffTime && isFlick) {
          return diffCoord / diffTime;
        }
      }

      return 0;
    }

    function computeDestination(velocity) {
      var flickPower = options.flickPower || 600;
      return getPosition() + sign(velocity) * min(abs(velocity) * flickPower, isFree ? Infinity : listSize() * (options.flickMaxPages || 1));
    }

    function computeIndex(destination) {
      var dest = toIndex(destination);
      return isSlide ? clamp(dest, 0, getEnd()) : dest;
    }

    function getCoord(e) {
      return (isMouse ? e : e.touches[0])[resolve("pageX")];
    }

    function constrain(diff) {
      return diff / (exceeded && isSlide ? FRICTION : 1);
    }

    return {
      mount: mount
    };
  }

  var IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];

  function Keyboard(Splide2, Components2, options) {
    var _EventInterface13 = EventInterface(Splide2),
        on = _EventInterface13.on,
        bind = _EventInterface13.bind,
        unbind = _EventInterface13.unbind;

    var root = Components2.Elements.root;
    var resolve = Components2.Direction.resolve;
    var target;

    function mount() {
      init();
      on(EVENT_UPDATED, function () {
        destroy();
        init();
      });
    }

    function init() {
      var _options$keyboard = options.keyboard,
          keyboard = _options$keyboard === void 0 ? "global" : _options$keyboard;

      if (keyboard) {
        if (keyboard === "focused") {
          target = root;
          setAttribute(root, TAB_INDEX, 0);
        } else {
          target = window;
        }

        bind(target, "keydown", function (e) {
          var key = normalize(e.key);

          if (key === resolve("ArrowLeft")) {
            Splide2.go("<");
          } else if (key === resolve("ArrowRight")) {
            Splide2.go(">");
          }
        });
      }
    }

    function destroy() {
      if (target) {
        unbind(target, "keydown");

        if (isHTMLElement(target)) {
          removeAttribute(target, TAB_INDEX);
        }
      }
    }

    function normalize(key) {
      return includes(IE_ARROW_KEYS, key) ? "Arrow" + key : key;
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
  var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
  var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";

  function LazyLoad(Splide2, Components2, options) {
    var _EventInterface14 = EventInterface(Splide2),
        on = _EventInterface14.on,
        off = _EventInterface14.off,
        bind = _EventInterface14.bind,
        emit = _EventInterface14.emit;

    var isSequential = options.lazyLoad === "sequential";
    var images = [];
    var index = 0;

    function mount() {
      if (options.lazyLoad) {
        on([EVENT_MOUNTED, EVENT_REFRESH], function () {
          destroy();
          init();
        });

        if (!isSequential) {
          on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED], observe);
        }
      }
    }

    function init() {
      Components2.Slides.forEach(function (_Slide) {
        queryAll(_Slide.slide, IMAGE_SELECTOR).forEach(function (_img) {
          var src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
          var srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);

          if (src !== _img.src || srcset !== _img.srcset) {
            var _spinner = create("span", options.classes.spinner, _img.parentElement);

            setAttribute(_spinner, ROLE, "presentation");
            images.push({
              _img: _img,
              _Slide: _Slide,
              src: src,
              srcset: srcset,
              _spinner: _spinner
            });
            display(_img, "none");
          }
        });
      });

      if (isSequential) {
        loadNext();
      }
    }

    function destroy() {
      index = 0;
      images = [];
    }

    function observe() {
      images = images.filter(function (data) {
        if (data._Slide.isWithin(Splide2.index, options.perPage * ((options.preloadPages || 1) + 1))) {
          return load(data);
        }

        return true;
      });

      if (!images.length) {
        off(EVENT_MOVED);
      }
    }

    function load(data) {
      var _img = data._img;
      addClass(data._Slide.slide, CLASS_LOADING);
      bind(_img, "load error", function (e) {
        onLoad(data, e.type === "error");
      });
      ["src", "srcset"].forEach(function (name) {
        if (data[name]) {
          setAttribute(_img, name, data[name]);
          removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
        }
      });
    }

    function onLoad(data, error) {
      var _Slide = data._Slide;
      removeClass(_Slide.slide, CLASS_LOADING);

      if (!error) {
        remove(data._spinner);
        display(data._img, "");
        emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
        emit(EVENT_RESIZE);
      }

      if (isSequential) {
        loadNext();
      }
    }

    function loadNext() {
      if (index < images.length) {
        load(images[index++]);
      }
    }

    return {
      mount: mount,
      destroy: destroy
    };
  }

  function Pagination(Splide2, Components2, options) {
    var _EventInterface15 = EventInterface(Splide2),
        on = _EventInterface15.on,
        emit = _EventInterface15.emit,
        bind = _EventInterface15.bind,
        unbind = _EventInterface15.unbind;

    var Slides = Components2.Slides;
    var _Components2$Controll2 = Components2.Controller,
        go = _Components2$Controll2.go,
        toPage = _Components2$Controll2.toPage,
        hasFocus = _Components2$Controll2.hasFocus,
        getIndex = _Components2$Controll2.getIndex;
    var items = [];
    var list;

    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on([EVENT_MOVE, EVENT_SCROLLED], update);
    }

    function init() {
      destroy();

      if (options.pagination && Slides.isEnough()) {
        createPagination();
        emit(EVENT_PAGINATION_MOUNTED, {
          list: list,
          items: items
        }, getAt(Splide2.index));
        update();
      }
    }

    function destroy() {
      if (list) {
        remove(list);
        items.forEach(function (item) {
          unbind(item.button, "click");
        });
        empty(items);
        list = null;
      }
    }

    function createPagination() {
      var length = Splide2.length;
      var classes = options.classes,
          i18n = options.i18n,
          perPage = options.perPage;
      var _Components2$Elements5 = Components2.Elements,
          slider = _Components2$Elements5.slider,
          root = _Components2$Elements5.root;
      var parent = options.pagination === "slider" && slider ? slider : root;
      var max = hasFocus() ? length : ceil(length / perPage);
      list = create("ul", classes.pagination, parent);

      var _loop = function _loop(i) {
        var li = create("li", null, list);
        var button = create("button", {
          class: classes.page,
          type: "button"
        }, li);
        var controls = Slides.getIn(i).map(function (Slide) {
          return Slide.slide.id;
        });
        var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
        bind(button, "click", function () {
          go(">" + i);
        });
        setAttribute(button, ARIA_CONTROLS, controls.join(" "));
        setAttribute(button, ARIA_LABEL, format(text, i + 1));
        emit(EVENT_PAGINATION_PAGE, list, li, button, i);
        items.push({
          li: li,
          button: button,
          page: i
        });
      };

      for (var i = 0; i < max; i++) {
        _loop(i);
      }
    }

    function getAt(index) {
      return items[toPage(index)];
    }

    function update() {
      var prev = getAt(getIndex(true));
      var curr = getAt(getIndex());

      if (prev) {
        removeClass(prev.button, CLASS_ACTIVE);
        removeAttribute(prev.button, ARIA_CURRENT);
      }

      if (curr) {
        addClass(curr.button, CLASS_ACTIVE);
        setAttribute(curr.button, ARIA_CURRENT, true);
      }

      emit(EVENT_PAGINATION_UPDATED, {
        list: list,
        items: items
      }, prev, curr);
    }

    return {
      items: items,
      mount: mount,
      destroy: destroy,
      getAt: getAt
    };
  }

  var TRIGGER_KEYS = [" ", "Enter", "Spacebar"];

  function Sync(Splide2, Components2, options) {
    var splides = Splide2.splides;

    function mount() {
      if (options.isNavigation) {
        navigate();
      } else {
        sync();
      }
    }

    function sync() {
      var processed = [];
      splides.concat(Splide2).forEach(function (splide, index, instances) {
        EventInterface(splide).on(EVENT_MOVE, function (index2, prev, dest) {
          instances.forEach(function (instance) {
            if (instance !== splide && !includes(processed, splide)) {
              processed.push(instance);
              instance.go(instance.is(LOOP) ? dest : index2);
            }
          });
          empty(processed);
        });
      });
    }

    function navigate() {
      var _EventInterface16 = EventInterface(Splide2),
          on = _EventInterface16.on,
          emit = _EventInterface16.emit;

      on(EVENT_CLICK, function (Slide) {
        Splide2.go(Slide.index);
      });
      on(EVENT_SLIDE_KEYDOWN, function (Slide, e) {
        if (includes(TRIGGER_KEYS, e.key)) {
          Splide2.go(Slide.index);
          prevent(e);
        }
      });
      emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
    }

    return {
      mount: mount
    };
  }

  function Wheel(Splide2, Components2, options) {
    var _EventInterface17 = EventInterface(Splide2),
        bind = _EventInterface17.bind;

    function mount() {
      if (options.wheel) {
        bind(Components2.Elements.track, "wheel", onWheel);
      }
    }

    function onWheel(e) {
      var deltaY = e.deltaY;

      if (deltaY) {
        Splide2.go(deltaY < 0 ? "<" : ">");
        prevent(e);
      }
    }

    return {
      mount: mount
    };
  }

  var ComponentConstructors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Options: Options,
    Direction: Direction,
    Elements: Elements,
    Style: Style,
    Slides: Slides,
    Clones: Clones,
    Layout: Layout,
    Move: Move,
    Controller: Controller,
    Arrows: Arrows,
    Autoplay: Autoplay,
    Cover: Cover,
    Scroll: Scroll,
    Drag: Drag,
    Keyboard: Keyboard,
    LazyLoad: LazyLoad,
    Pagination: Pagination,
    Sync: Sync,
    Wheel: Wheel
  });
  var I18N = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay"
  };
  var DEFAULTS = {
    type: "slide",
    speed: 400,
    waitForTransition: true,
    perPage: 1,
    arrows: true,
    pagination: true,
    interval: 5e3,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: true,
    easing: "cubic-bezier(.42,.65,.27,.99)",
    drag: true,
    direction: "ltr",
    slideFocus: true,
    trimSpace: true,
    classes: CLASSES,
    i18n: I18N
  };

  function Fade(Splide2, Components2, options) {
    var _EventInterface18 = EventInterface(Splide2),
        on = _EventInterface18.on;

    var ruleBy = Components2.Style.ruleBy;

    function mount() {
      on([EVENT_MOUNTED, EVENT_REFRESH], function () {
        nextTick(function () {
          Components2.Slides.forEach(function (Slide) {
            ruleBy(Slide.slide, "transition", "opacity " + options.speed + "ms " + options.easing);
          });
        });
      });
    }

    function start(index, done) {
      var track = Components2.Elements.track;
      ruleBy(track, "height", unit(rect(track).height));
      nextTick(function () {
        done();
        ruleBy(track, "height", "");
      });
    }

    return {
      mount: mount,
      start: start,
      cancel: noop
    };
  }

  function Slide(Splide2, Components2, options) {
    var _EventInterface19 = EventInterface(Splide2),
        bind = _EventInterface19.bind;

    var Move = Components2.Move,
        Controller = Components2.Controller;
    var list = Components2.Elements.list;
    var endCallback;

    function mount() {
      bind(list, "transitionend", function (e) {
        if (e.target === list && endCallback) {
          cancel();
          endCallback();
        }
      });
    }

    function start(index, done) {
      var destination = Move.toPosition(index, true);
      var position = Move.getPosition();
      var speed = getSpeed(index);

      if (abs(destination - position) >= 1 && speed >= 1) {
        apply("transform " + speed + "ms " + options.easing);
        Move.translate(destination);
        endCallback = done;
      } else {
        Move.jump(index);
        done();
      }
    }

    function cancel() {
      apply("");
    }

    function getSpeed(index) {
      var rewindSpeed = options.rewindSpeed;

      if (Splide2.is(SLIDE) && rewindSpeed) {
        var prev = Controller.getIndex(true);
        var end = Controller.getEnd();

        if (prev === 0 && index >= end || prev >= end && index === 0) {
          return rewindSpeed;
        }
      }

      return options.speed;
    }

    function apply(transition) {
      Components2.Style.ruleBy(list, "transition", transition);
    }

    return {
      mount: mount,
      start: start,
      cancel: cancel
    };
  }

  var _Splide = /*#__PURE__*/function () {
    function _Splide(target, options) {
      this.event = EventBus();
      this.Components = {};
      this.state = State(CREATED);
      this.splides = [];
      this._options = {};
      this._Extensions = {};
      var root = isString(target) ? query(document, target) : target;
      assert(root, root + " is invalid.");
      this.root = root;
      merge(DEFAULTS, _Splide.defaults);
      merge(merge(this._options, DEFAULTS), options || {});
    }

    var _proto = _Splide.prototype;

    _proto.mount = function mount(Extensions, Transition) {
      var _this3 = this;

      this.state.set(CREATED);
      this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
      this._Extensions = Extensions || this._Extensions;
      var Constructors = assign({}, ComponentConstructors, this._Extensions, {
        Transition: this._Transition
      });
      var Components2 = this.Components;
      forOwn(Constructors, function (Component, key) {
        var component = Component(_this3, _this3.Components, _this3._options);
        Components2[key] = component;
        component.setup && component.setup();
      });
      forOwn(Components2, function (component) {
        component.mount && component.mount();
      });
      forOwn(Components2, function (component) {
        component.mounted && component.mounted();
      });
      this.emit(EVENT_MOUNTED);
      addClass(this.root, CLASS_INITIALIZED);
      this.state.set(IDLE);
      this.emit(EVENT_READY);
      return this;
    };

    _proto.sync = function sync(splide) {
      this.splides.push(splide);
      splide.splides.push(this);
      return this;
    };

    _proto.go = function go(control) {
      this.Components.Controller.go(control);
    };

    _proto.on = function on(events, callback) {
      this.event.on(events, callback);
      return this;
    };

    _proto.off = function off(events) {
      this.event.off(events);
      return this;
    };

    _proto.emit = function emit(event) {
      var _this$event;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      (_this$event = this.event).emit.apply(_this$event, [event].concat(args));

      return this;
    };

    _proto.add = function add(slides, index) {
      this.Components.Slides.add(slides, index);
      return this;
    };

    _proto.remove = function remove(matcher) {
      this.Components.Slides.remove(matcher);
      return this;
    };

    _proto.is = function is(type) {
      return this._options.type === type;
    };

    _proto.refresh = function refresh() {
      this.emit(EVENT_REFRESH);
      return this;
    };

    _proto.destroy = function destroy(completely) {
      var event = this.event,
          state = this.state;

      if (state.is(CREATED)) {
        event.on(EVENT_READY, this.destroy.bind(this, completely), this);
      } else {
        forOwn(this.Components, function (component) {
          component.destroy && component.destroy(completely);
        });
        event.emit(EVENT_DESTROY);
        event.destroy();
        empty(this.splides);
        state.set(DESTROYED);
      }

      return this;
    };

    _createClass(_Splide, [{
      key: "options",
      get: function get() {
        return this._options;
      },
      set: function set(options) {
        var _options = this._options;
        merge(_options, options);

        if (!this.state.is(CREATED)) {
          this.emit(EVENT_UPDATED, _options);
        }
      }
    }, {
      key: "length",
      get: function get() {
        return this.Components.Slides.getLength(true);
      }
    }, {
      key: "index",
      get: function get() {
        return this.Components.Controller.getIndex();
      }
    }]);

    return _Splide;
  }();

  var Splide = _Splide;
  Splide.defaults = {};
  Splide.STATES = STATES;
  return Splide;
});
//# sourceMappingURL=splide.js.map
