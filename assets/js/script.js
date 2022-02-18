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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    // Data
    page: this.$persist(1).as((data.key || 'alpinetable') + '_page'),
    filters: this.$persist({
      per_page: 3,
      sort_by: null,
      sort_asc: true,
      search: '',
      filters: {}
    }).as((data.key || 'alpinetable') + '_filters'),
    route: data.route,
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
    // Bindings
    // None so far...
    // Functions
    init: function init() {
      var _this = this;

      this.loadItems(true);
      this.$watch('page', function () {
        return _this.loadItems();
      });
      this.$watch('filters', function () {
        return _this.resetPage();
      });

      if (this.filters.search.length) {
        this.show_search = true;
      }
    },
    pageUp: function pageUp() {
      this.page = Math.min(this.max_pages, Number(this.page) + 1);
    },
    pageDown: function pageDown() {
      this.page = Math.max(1, Number(this.page) - 1);
    },
    resetPage: function resetPage() {
      if (this.page === 1) {
        this.loadItems();
      } else {
        this.page = 1;
      }
    },
    getColumns: function getColumns() {
      var _this2 = this;

      window.axios.post(this.route, {
        get: 'columns'
      }).then(function (response) {
        _this2.columns = response.data;

        _this2.loadItems();
      })["catch"](function (response) {})["finally"](function () {});
    },
    loadItems: function loadItems(initial_load) {
      var _this3 = this;

      this.loading = true;
      var data = {
        alpine: this.filters
      };

      if (initial_load) {
        data.get = 'columns';
      }

      window.axios.post(this.route, data).then(function (response) {
        if (response.data.columns) {
          _this3.columns = response.data.columns;
        }

        _this3.results = response.data.count;
        _this3.total_results = response.data.total_count;
        _this3.from = (_this3.page - 1) * _this3.filters.per_page + 1;
        _this3.to = Math.min(_this3.results, _this3.page * _this3.filters.per_page);
        _this3.max_pages = Math.ceil(_this3.results / _this3.filters.per_page);
        _this3.items = response.data.items;
      })["catch"](function (response) {})["finally"](function () {
        _this3.loading = false;
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
      var _this4 = this;

      if (Array.isArray(value)) {
        return value.map(function (item) {
          return _this4.format(item, _format);
        }).join(', ');
      } else if ('object' === _typeof(value)) {
        var output = value.value || value[0] || null;

        if (value.link) {
          output = '<a href="' + value.link + '" class="hover:underline">' + output + '</a>';
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
    render: function render(item, column) {
      return this.format(item[column.key], column.format);
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
      var _this5 = this;

      this.show_search = !this.show_search;

      if (this.show_search) {
        this.$nextTick(function () {
          _this5.$refs.search.focus();
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