/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@alpinejs/persist/dist/module.esm.js":
/*!***********************************************************!*\
  !*** ./node_modules/@alpinejs/persist/dist/module.esm.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
// packages/persist/src/index.js
function src_default(Alpine) {
  let persist = () => {
    let alias;
    let storage = localStorage;
    return Alpine.interceptor((initialValue, getter, setter, path, key) => {
      let lookup = alias || `_x_${path}`;
      let initial = storageHas(lookup, storage) ? storageGet(lookup, storage) : initialValue;
      setter(initial);
      Alpine.effect(() => {
        let value = getter();
        storageSet(lookup, value, storage);
        setter(value);
      });
      return initial;
    }, (func) => {
      func.as = (key) => {
        alias = key;
        return func;
      }, func.using = (target) => {
        storage = target;
        return func;
      };
    });
  };
  Object.defineProperty(Alpine, "$persist", {get: () => persist()});
  Alpine.magic("persist", persist);
}
function storageHas(key, storage) {
  return storage.getItem(key) !== null;
}
function storageGet(key, storage) {
  return JSON.parse(storage.getItem(key, storage));
}
function storageSet(key, value, storage) {
  storage.setItem(key, JSON.stringify(value));
}

// packages/persist/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./resources/js/alpinetable.js":
/*!*************************************!*\
  !*** ./resources/js/alpinetable.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    // Data
    default_filters: {
      page: 1,
      per_page: '25',
      sort_by: null,
      sort_asc: null,
      search: '',
      filters: {}
    },
    filters: this.$persist({
      page: 1,
      per_page: '25',
      sort_by: null,
      sort_asc: null,
      search: '',
      filters: {}
    }).as((data.key || 'alpinetable') + '_filters'),
    route: data.route,
    rule: data.rule || null,
    columns: [],
    items: [],
    results: 0,
    total_results: 0,
    max_pages: 0,
    from: 1,
    to: 1,
    loading: false,
    show_search: false,
    show_filters: false,
    filtered: false,
    cancelToken: null,
    haltRequests: false,
    // Bindings
    // None so far...
    // Functions
    init: function init() {
      var _this = this;

      this.loadItems(true);
      this.$watch('filters.page', function () {
        return _this.loadItems();
      });
      this.$watch('filters.per_page', function () {
        return _this.resetPage();
      });
      this.$watch('filters.sort_by', function () {
        return _this.resetPage();
      });
      this.$watch('filters.sort_asc', function () {
        return _this.resetPage();
      });
      this.$watch('filters.search', function () {
        return _this.resetPage();
      });
      this.$watch('filters.filters', function () {
        return _this.resetPage();
      });

      if (this.filters.search.length) {
        this.show_search = true;
      }
    },
    pageUp: function pageUp() {
      this.filters.page = Math.min(this.max_pages, Number(this.filters.page) + 1);
    },
    pageDown: function pageDown() {
      this.filters.page = Math.max(1, Number(this.filters.page) - 1);
    },
    resetPage: function resetPage() {
      if (this.filters.page === 1) {
        this.loadItems();
      } else {
        this.filters.page = 1;
      }
    },
    refresh: function refresh() {
      this.clearIconStorage();
      this.loadItems();
    },
    resetFilters: function resetFilters() {
      var _this2 = this;

      // TODO Maybe make this more precise to reduce attempted extra loads
      this.haltRequests = true;
      this.filters = JSON.parse(JSON.stringify(this.default_filters));
      this.show_search = false;
      this.show_filters = false;
      this.filtered = false;
      this.$nextTick(function () {
        _this2.haltRequests = false;

        _this2.loadItems();
      });
    },
    getColumns: function getColumns() {
      var _this3 = this;

      window.axios.post(this.route, {
        get: 'columns'
      }).then(function (response) {
        _this3.columns = response.data;

        _this3.loadItems();
      })["catch"](function (error) {
        console.log('Error', error);
      });
    },
    loadItems: function loadItems(initial_load) {
      var _this4 = this;

      if (this.haltRequests) {
        return false;
      }

      if (JSON.stringify(this.filters) !== JSON.stringify(this.default_filters)) {
        this.filtered = true;
      }

      this.loading = true;
      var data = {
        alpine: this.filters,
        rule: this.rule
      };

      if (initial_load) {
        data.get = 'columns';
      }

      if (null !== this.cancelToken) {
        this.cancelToken.cancel('Operation canceled due to new request.');
      }

      this.cancelToken = window.axios.CancelToken.source();
      window.axios.post(this.route, data, {
        cancelToken: this.cancelToken.token
      }).then(function (response) {
        if (response.data.columns) {
          _this4.columns = response.data.columns;
        }

        _this4.results = response.data.count;
        _this4.total_results = response.data.total_count;
        _this4.from = (_this4.filters.page - 1) * _this4.filters.per_page + 1;
        _this4.to = Math.min(_this4.results, _this4.filters.page * _this4.filters.per_page);
        _this4.max_pages = Math.ceil(_this4.results / _this4.filters.per_page);
        _this4.items = response.data.items;

        _this4.$nextTick(_this4.replaceIcons);

        if ('undefined' !== typeof window.feather) {
          _this4.$nextTick(window.feather.replace);
        }
      })["catch"](function (error) {
        console.log('Error', error);
      })["finally"](function () {
        _this4.loading = false;
      });
    },
    pageString: function pageString() {
      if (this.items === null) {
        return '';
      } else if (!this.results) {
        return 'No results found';
      }

      var str = '';

      if (this.max_pages === 1) {
        str = 'Showing ' + this.results + ' results';
      } else {
        str = 'Showing ' + this.from + ' to ' + this.to + ' of ' + this.results + ' results';
      }

      if (this.results !== this.total_results) {
        str += ' (' + this.total_results + ' total)';
      }

      return str;
    },
    format: function format(value, _format) {
      var _this5 = this;

      if ('actions' === _format) {
        return this.render_actions(value);
      }

      if (null === value) {
        return '';
      } else if (Array.isArray(value)) {
        return value.map(function (item) {
          return _this5.format(item, _format);
        }).join('');
      } else if ('object' === _typeof(value)) {
        var output = value.value || value[0] || null;

        if (value.link) {
          var target = '';

          if ('undefined' !== typeof value.target) {
            target = ' target="' + value.target + '"';
          }

          output = '<a href="' + value.link + '" ' + target + ' class="hover:underline">' + output + '</a>';
        }

        return output;
      }

      if (_format instanceof Function) {
        value = _format(value);
      } else {
        switch (_format) {
          case 'date':
            value = value.split('T')[0];
            break;

          case 'currency':
            value = new Intl.NumberFormat('en-AU', {
              style: 'currency',
              currency: 'AUD'
            }).format(value);
            break;
        }
      }

      return value;
    },
    render_actions: function render_actions(actions) {
      var output = [];
      actions.actions.forEach(function (action) {
        output.push('<a href="' + action.link + '" title="' + action.title + '" ' + (action.attributes || '') + '>' + ('undefined' !== typeof action.feather ? '<i data-feather="' + action.feather + '"></i>' : '') + ('undefined' !== typeof action.icon ? '<i data-icon="' + action.icon + '"></i>' : '') + '</a>');
      });
      return output.join(' ');
    },
    render: function render(item, column) {
      return this.format(item[column.key], column.format);
    },
    clearIconStorage: function clearIconStorage() {
      Object.keys(window.localStorage).forEach(function (key) {
        if (key.substring(0, 5) === 'icon-') {
          window.localStorage.removeItem(key);
        }
      });
      this.$nextTick(this.replaceIcons);
    },
    replaceIcons: function replaceIcons() {
      document.querySelectorAll('[data-icon]').forEach(function ($icon) {
        var icon = $icon.getAttribute('data-icon'),
            attributes = $icon.getAttributeNames().reduce(function (acc, name) {
          return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, name, $icon.getAttribute(name)));
        }, {});

        if (!icon.includes('/')) {
          icon = 'outline/' + icon;
        }

        if (null !== window.localStorage.getItem('icon-' + icon)) {
          $icon.innerHTML = window.localStorage.getItem('icon-' + icon);
        } else {
          axios.get('/vendor/alpine-tables/icons/' + icon + '.svg').then(function (result) {
            window.localStorage.setItem('icon-' + icon, result.data);
            var newElement = document.createElement(result.data);
            Object.keys(attributes).forEach(function (key) {
              newElement.setAttribute(key, attributes[key]);
            });
            $icon.replaceWith(newElement);
          });
        }
      });
    },
    setSort: function setSort(key) {
      if (this.filters.sort_by === key) {
        this.filters.sort_asc = !this.filters.sort_asc;
      } else {
        this.filters.sort_by = key;
        this.filters.sort_asc = true;
      }
    },
    setFilter: function setFilter(column) {
      if ('' === this.filters.filters[column]) {
        delete this.filters.filters[column];
      }

      this.resetPage();
    },
    toggleSearch: function toggleSearch() {
      var _this6 = this;

      this.show_search = !this.show_search;

      if (this.show_search) {
        this.$nextTick(function () {
          _this6.$refs.search.focus();
        });
      } else {
        this.filters.search = '';
      }
    }
  };
}
;

/***/ }),

/***/ "./resources/js/script.js":
/*!********************************!*\
  !*** ./resources/js/script.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alpinejs_persist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @alpinejs/persist */ "./node_modules/@alpinejs/persist/dist/module.esm.js");
/* harmony import */ var _alpinetable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alpinetable.js */ "./resources/js/alpinetable.js");


document.addEventListener('alpine:init', function () {
  window.Alpine.plugin(_alpinejs_persist__WEBPACK_IMPORTED_MODULE_0__["default"]);
  window.Alpine.data('alpinetable', _alpinetable_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
});

/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/assets/js/script": 0,
/******/ 			"assets/css/alpinetables": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["assets/css/alpinetables"], () => (__webpack_require__("./resources/js/script.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["assets/css/alpinetables"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;