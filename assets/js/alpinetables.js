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
    filters: this.$persist({
      page: 1,
      per_page: 3,
      sort_by: null,
      sort_asc: true,
      search: '',
      filters: {}
    }).as((data.key || 'alpine') + '_filters'),
    route: data.route,
    columns: [],
    //data.columns,
    items: null,
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
      this.$watch('filters.page', function () {
        return _this.loadItems();
      }); //this.$watch('filters.per_page, filters.sort_by, filters.sort_asc, filters.search, filters.filters', () => this.resetPage());

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
    getColumns: function getColumns() {
      var _this2 = this;

      axios.post(this.route, {
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

      axios.post(this.route, data).then(function (response) {
        if (response.data.columns) {
          _this3.columns = response.data.columns;
        }

        _this3.results = response.data.count;
        _this3.total_results = response.data.total_count;
        _this3.from = (_this3.filters.page - 1) * _this3.filters.per_page + 1;
        _this3.to = Math.min(_this3.results, _this3.filters.page * _this3.filters.per_page);
        _this3.max_pages = Math.ceil(_this3.results / _this3.filters.per_page); //this.items = [];
        //this.$nextTick(() => this.items = response.data.items);

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

      switch (_format) {
        case 'currency':
          value = new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD'
          }).format(value);
          break;
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
/* SAFELIST
w-0
 */

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
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./resources/js/cdn.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alpinejs_persist__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @alpinejs/persist */ "./node_modules/@alpinejs/persist/dist/module.esm.js");
/* harmony import */ var _alpinetable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alpinetable.js */ "./resources/js/alpinetable.js");


document.addEventListener('alpine:init', function () {
  window.Alpine.plugin(_alpinejs_persist__WEBPACK_IMPORTED_MODULE_0__["default"]);
  window.Alpine.data('alpinetable', _alpinetable_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
});
})();

/******/ })()
;