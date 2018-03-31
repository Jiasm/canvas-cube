/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*:: declare type Coord = {
  x: number,
  y: number
}*/


// init canvas
/*:: declare type RenderConfig = {
  context: any,
  origin: Coord,
  offset: Coord,
  boxWidth: number,
  boxHeight: number,
  colors: Array<string>
}*/
var $canvas /*: any*/ = document.querySelector('#canvas');

if ($canvas && $canvas.getContext) {

  /**
   * 渲染一个矩形到`canvas`
   * @param   {any}       context `canvas.getContext`
   * @returns {function}          render function
   */
  var getRender = function getRender(context) {
    return function render(x /*: number*/, y /*: number*/, width /*: number*/, height /*: number*/, color /*: string*/) /*: void*/ {
      context.beginPath();
      context.moveTo(x, y); // 左上
      context.lineTo(x + width, y); // 右上
      context.lineTo(x + width, y + height); // 右下
      context.lineTo(x, y + height); // 左下

      context.fillStyle = color;
      context.closePath();
      context.fill();
    };
  };

  var getBoxRender = function getBoxRender(render /*: Function*/, width /*: number*/, height /*: number*/) {
    return function boxRender(x /*: number*/, y /*: number*/, color /*: string*/) /*: void*/ {
      render(x, y, width, height, color);
    };
  };

  // init colors


  var throttle = function throttle(func, interval) {
    var _this = this;

    var identify = 0;
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (identify) return;
      identify = setTimeout(function () {
        return identify = 0;
      }, interval);
      func.apply(_this, args);
    };
  };

  var width /*:number*/ = $canvas.width = window.innerWidth;
  var height /*:number*/ = $canvas.height = window.innerHeight;

  var _context = $canvas.getContext('2d');

  var _boxWidth /*:number*/ = 40;
  var _boxHeight /*:number*/ = 40;

  var _render = getRender(_context);

  var _colors = ['#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688'];

  // get canvas origin
  var _origin /*: Coord*/ = {
    x: (width - _boxWidth) / 2,
    y: (height - _boxHeight) / 2

    // 六个面的渲染顺序：
    // 1. 背面
    // 2. 右|下
    // 3. 左|上
    // 4. 正面

  };var _offset /*: Coord*/ = {
    x: 0,
    y: 0
  };

  var BoxRender = function () {
    function BoxRender(config /*: RenderConfig*/) {
      _classCallCheck(this, BoxRender);

      this.setConfig(config);
    }

    _createClass(BoxRender, [{
      key: 'setConfig',
      value: function setConfig(config /*: RenderConfig*/) {
        this.config = config;
        this.context = config.context;
        this.origin = config.origin;
        this.offset = config.offset;
        this.boxWidth = config.boxWidth;
        this.boxHeight = config.boxHeight;
        this.colors = config.colors;
      }
    }, {
      key: 'update',
      value: function update(config /*: RenderConfig*/) {
        this.clean();
        this.setConfig(Object.assign({}, this.config, config));
        this.render();
      }
    }, {
      key: 'clean',
      value: function clean() {
        _context.canvas.width = _context.canvas.width;
      }
    }, {
      key: 'back',
      value: function back() {
        var colors = this.colors,
            origin = this.origin,
            offset = this.offset,
            boxWidth = this.boxWidth,
            boxHeight = this.boxHeight,
            context = this.context;

        var color = colors[0];
        context.moveTo(origin.x + offset.x, origin.y + offset.y);
        context.lineTo(origin.x + offset.x + boxWidth, origin.y + offset.y);
        context.lineTo(origin.x + offset.x + boxWidth, origin.y + offset.y + boxHeight);
        context.lineTo(origin.x + offset.x, origin.y + offset.y + boxHeight);

        context.fillStyle = color;
      }
    }, {
      key: 'right',
      value: function right() {
        var colors = this.colors,
            origin = this.origin,
            offset = this.offset,
            boxWidth = this.boxWidth,
            boxHeight = this.boxHeight,
            context = this.context;

        var color = colors[1];
        context.moveTo(origin.x + boxWidth, origin.y);
        context.lineTo(origin.x + boxWidth + offset.x, origin.y + offset.y);
        context.lineTo(origin.x + boxWidth + offset.x, origin.y + boxHeight + offset.y);
        context.lineTo(origin.x + boxWidth, origin.y + boxHeight);

        context.fillStyle = color;
      }
    }, {
      key: 'bottom',
      value: function bottom() {
        var colors = this.colors,
            origin = this.origin,
            offset = this.offset,
            boxWidth = this.boxWidth,
            boxHeight = this.boxHeight,
            context = this.context;

        var color = colors[2];
        context.moveTo(origin.x, origin.y + boxHeight);
        context.lineTo(origin.x + boxWidth, origin.y + boxHeight);
        context.lineTo(origin.x + boxWidth + offset.x, origin.y + boxHeight + offset.y);
        context.lineTo(origin.x + offset.x, origin.y + boxHeight + offset.y);

        context.fillStyle = color;
      }
    }, {
      key: 'left',
      value: function left() {
        var colors = this.colors,
            origin = this.origin,
            offset = this.offset,
            boxWidth = this.boxWidth,
            boxHeight = this.boxHeight,
            context = this.context;

        var color = colors[3];
        context.moveTo(origin.x, origin.y);
        context.lineTo(origin.x + offset.x, origin.y + offset.y);
        context.lineTo(origin.x + offset.x, origin.y + boxHeight + offset.y);
        context.lineTo(origin.x, origin.y + boxHeight);

        context.fillStyle = color;
      }
    }, {
      key: 'top',
      value: function top() {
        var colors = this.colors,
            origin = this.origin,
            offset = this.offset,
            boxWidth = this.boxWidth,
            boxHeight = this.boxHeight,
            context = this.context;

        var color = colors[4];
        context.moveTo(origin.x, origin.y);
        context.lineTo(origin.x + boxWidth, origin.y);
        context.lineTo(origin.x + boxWidth + offset.x, origin.y + offset.y);
        context.lineTo(origin.x + offset.x, origin.y + offset.y);

        context.fillStyle = color;
      }
    }, {
      key: 'front',
      value: function front() {
        var colors = this.colors,
            origin = this.origin,
            offset = this.offset,
            boxWidth = this.boxWidth,
            boxHeight = this.boxHeight,
            context = this.context;

        var color = colors[5];
        context.moveTo(origin.x, origin.y);
        context.lineTo(origin.x + boxWidth, origin.y);
        context.lineTo(origin.x + boxWidth, origin.y + boxHeight);
        context.lineTo(origin.x, origin.y + boxHeight);

        context.fillStyle = color;
      }
    }, {
      key: 'render',
      value: function render() {
        var offset = this.offset;


        var sort /*: Array<'left'|'right'|'bottom'|'top'|'front'|'back'>*/ = ['back'];

        var lefts = ['left', 'right'];
        var tops = ['top', 'bottom'];
        // 先渲染左，后渲染右
        sort = sort.concat(offset.x > 0 ? lefts.shift() : lefts.pop());

        // 先渲染上，后渲染下
        sort = sort.concat(offset.y > 0 ? tops.shift() : tops.pop());

        // 拼接剩余两个属性
        sort = sort.concat(lefts, tops);

        // 最后渲染front面
        sort = sort.concat('front');

        var methods /*: {
                            back: Function,
                            left: Function,
                            right: Function,
                            top: Function,
                            bottom: Function,
                            front: Function
                          }*/ = this;

        // render background
        _render(0, 0, width, height, 'gray');

        sort.forEach(function (method) {
          _context.beginPath();
          methods[method]();
          _context.closePath();
          _context.fill();
        });
      }
    }]);

    return BoxRender;
  }();

  var boxRender = new BoxRender({
    context: _context,
    origin: _origin,
    offset: _offset,
    boxWidth: _boxWidth,
    boxHeight: _boxHeight,
    colors: _colors
  });

  var offsetTop = $canvas.offsetTop;
  var offsetLeft = $canvas.offsetLeft;
  var originX = $canvas.width / 2;
  var originY = $canvas.height / 2;
  var scale = 10;
  $canvas.addEventListener('mousemove', function (e) {
    var x = e.x - offsetTop;
    var y = e.y - offsetLeft;

    boxRender.update({
      offset: {
        x: (originX - x) / scale,
        y: (originY - y) / scale
      }
    });
  });

  var initValue = {
    alpha: 0,
    beta: 0
  };

  var $output /*: HTMLElement | null*/ = document.querySelector('#output');
  if ($output) {
    window.addEventListener("deviceorientation", function (e) {
      if (!initValue.alpha && !initValue.beta) {
        initValue.alpha = e.alpha;
        initValue.beta = e.beta;
      }
      $output.innerHTML = '\n        alpha: ' + (initValue.alpha - e.alpha) + '<br/>\n        beta: ' + (initValue.beta - e.beta) + '<br/>\n      ';

      var offsetX = initValue.alpha - e.alpha;
      var offsetY = initValue.beta - e.beta;

      boxRender.update({
        offset: {
          x: offsetX > 0 ? Math.min(offsetX, 30) : Math.max(offsetX, -30),
          y: offsetY > 0 ? Math.min(offsetY, 30) : Math.max(offsetY, -30)
        }
      });
    });
  }

  boxRender.render();
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map