/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "js/" + ({"about":"about"}[chunkId]||chunkId) + ".js"
/******/ 	}
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"chunk-vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"1de2dfa0-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vuetify-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=template&id=7ba5bd90&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"1de2dfa0-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vuetify-loader/lib/loader.js??ref--18-0!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"router-view\")\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/App.vue?./node_modules/cache-loader/dist/cjs.js?%7B%22cacheDirectory%22:%22node_modules/.cache/vue-loader%22,%22cacheIdentifier%22:%221de2dfa0-vue-loader-template%22%7D!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vuetify-loader/lib/loader.js??ref--18-0!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/App.vue":
/*!*********************!*\
  !*** ./src/App.vue ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _App_vue_vue_type_template_id_7ba5bd90___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=template&id=7ba5bd90& */ \"./src/App.vue?vue&type=template&id=7ba5bd90&\");\n/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\nvar script = {}\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\n  script,\n  _App_vue_vue_type_template_id_7ba5bd90___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _App_vue_vue_type_template_id_7ba5bd90___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/App.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/App.vue?");

/***/ }),

/***/ "./src/App.vue?vue&type=template&id=7ba5bd90&":
/*!****************************************************!*\
  !*** ./src/App.vue?vue&type=template&id=7ba5bd90& ***!
  \****************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_1de2dfa0_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vuetify_loader_lib_loader_js_ref_18_0_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_7ba5bd90___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"1de2dfa0-vue-loader-template\"}!../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/vuetify-loader/lib/loader.js??ref--18-0!../node_modules/cache-loader/dist/cjs.js??ref--0-0!../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=template&id=7ba5bd90& */ \"./node_modules/cache-loader/dist/cjs.js?{\\\"cacheDirectory\\\":\\\"node_modules/.cache/vue-loader\\\",\\\"cacheIdentifier\\\":\\\"1de2dfa0-vue-loader-template\\\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vuetify-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/App.vue?vue&type=template&id=7ba5bd90&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_1de2dfa0_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vuetify_loader_lib_loader_js_ref_18_0_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_7ba5bd90___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_1de2dfa0_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vuetify_loader_lib_loader_js_ref_18_0_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_7ba5bd90___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/App.vue?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm.js\");\n/* harmony import */ var vue_resource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-resource */ \"./node_modules/vue-resource/dist/vue-resource.esm.js\");\n/* harmony import */ var _App_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App.vue */ \"./src/App.vue\");\n/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./router */ \"./src/router.js\");\n/* harmony import */ var _plugins_vuetify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugins/vuetify */ \"./src/plugins/vuetify.js\");\n\n\n\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].use(vue_resource__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].config.productionTip = false;\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].http.options.xhr = {\n  withCredentials: true\n}; // Get the current financial year (From 1 Apr to 31 March)\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.financialYearList = function () {\n  var today = new Date();\n  var resultList = {\n    financial_year: [],\n    quarters: []\n  };\n  var currentMonth = today.getMonth();\n  var currentYear = today.getFullYear() + '';\n  var previousYear = today.getFullYear() - 1 + '';\n  var nextYear = today.getFullYear() + 1 + '';\n  var result;\n\n  if (currentMonth >= 4) {\n    // eslint-disable-next-line radix\n    result = currentYear + '-' + nextYear.charAt(2) + nextYear.charAt(3);\n  } else {\n    result = previousYear + '-' + currentYear.charAt(2) + currentYear.charAt(3);\n  }\n\n  var i = parseInt(result.split('-')[0], 10);\n  var j = parseInt(result.split('-')[1], 10);\n\n  for (var k = i; k >= 2016; k--) {\n    resultList.financial_year.push(k + '-' + j);\n    resultList.quarters.push({\n      name: 'Oct-Dec ' + k,\n      quarterValue: 4,\n      yearValue: k\n    });\n    resultList.quarters.push({\n      name: 'Jul-Sep ' + k,\n      quarterValue: 3,\n      yearValue: k\n    });\n    resultList.quarters.push({\n      name: 'Apr-Jun ' + k,\n      quarterValue: 2,\n      yearValue: k\n    });\n    resultList.quarters.push({\n      name: 'Jan-Mar ' + k,\n      quarterValue: 1,\n      yearValue: k\n    });\n    j--;\n  }\n\n  return resultList;\n}; // Set current financial year from generated list\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.currentlySelectedFinancialYear = localStorage['financial-year'];\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.calendarDate = function (date) {\n  var dateObj = new Date(date).toDateString().split(' ');\n  return dateObj[2] + ' ' + dateObj[1] + ', ' + dateObj[3];\n};\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.formattedMonth = function (numericalMonth) {\n  return numericalMonth;\n}; // Define postage, courier & labour charges list\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.postageOptionsList = function () {\n  return {\n    0: 'Postage & Courier charges',\n    1: 'Labour charges',\n    2: 'Postage & Courier & Labour charges'\n  };\n}; // Get postage options key by looking up value\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.postageOptionsKeyByValue = function (value) {\n  var valueList = Object.values(vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.postageOptionsList());\n\n  for (var i = 0; i < valueList.length; i++) {\n    if (valueList[i] === value) {\n      return i;\n    }\n  }\n}; // Check if user as a superuser\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.userDetails = function () {\n  if (localStorage.user_info !== undefined && localStorage.user_info !== null) {\n    var retrievedData = JSON.parse(localStorage.user_info);\n    var initials = retrievedData.first_name.substring(0, 1) + retrievedData.last_name.substring(0, 1);\n    retrievedData.intitals = initials;\n    return retrievedData;\n  }\n\n  return false;\n}; // Form validation rules\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.validateFormRules = function (value, opType, limit, msg) {\n  if (value !== undefined && value !== null) {\n    // Check the operation type e.g. gt, gte, lt, lte or e\n    if (opType === 'gt') {\n      return value.length > limit || msg;\n    }\n\n    if (opType === 'gte') {\n      return value.length >= limit || msg;\n    }\n\n    if (opType === 'lt') {\n      return value.length < limit || msg;\n    }\n\n    if (opType === 'lte') {\n      return value.length <= limit || msg;\n    }\n\n    if (opType === 'e') {\n      return value.length === limit || msg;\n    }\n  } else {\n    return msg;\n  }\n}; // Set user log in status\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.isLoggedIn = function () {\n  return !!localStorage.user_info;\n}; // Export formatted data to CSV\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.convertToCSV = function (filename, rows) {\n  var processRow = function processRow(row) {\n    var finalVal = '';\n\n    for (var j = 0; j < row.length; j++) {\n      var innerValue = row[j] === null ? '' : row[j].toString();\n\n      if (row[j] instanceof Date) {\n        innerValue = row[j].toLocaleString();\n      }\n\n      var result = innerValue.replace(/\"/g, '\"\"');\n\n      if (result.search(/(\"|,|\\n)/g) >= 0) {\n        result = '\"' + result + '\"';\n      }\n\n      if (j > 0) {\n        finalVal += ',';\n      }\n\n      finalVal += result;\n    }\n\n    return finalVal + '\\n';\n  };\n\n  var csvFile = '';\n\n  for (var i = 0; i < rows.length; i++) {\n    csvFile += processRow(rows[i]);\n  }\n\n  var blob = new Blob([csvFile], {\n    type: 'text/csv;charset=utf-8;'\n  });\n\n  if (navigator.msSaveBlob) {\n    // IE 10+\n    navigator.msSaveBlob(blob, filename);\n  } else {\n    var link = document.createElement('a');\n\n    if (link.download !== undefined) {\n      // feature detection\n      // Browsers that support HTML5 download attribute\n      var url = URL.createObjectURL(blob);\n      link.setAttribute('href', url);\n      link.setAttribute('download', filename);\n      link.style.visibility = 'hidden';\n      document.body.appendChild(link);\n      link.click();\n      document.body.removeChild(link);\n    }\n  }\n};\n\nnew vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n  router: _router__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  vuetify: _plugins_vuetify__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n  render: function render(h) {\n    return h(_App_vue__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n  }\n}).$mount('#app');\n/* check for logged in user details before any transition */\n\n_router__WEBPACK_IMPORTED_MODULE_3__[\"default\"].beforeEach(function (to, from, next) {\n  // Check for token validity when going from login to dashboard\n  if (from.name === 'login') {\n    if (!vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prototype.isLoggedIn()) {\n      next({\n        name: 'login'\n      });\n    } else {\n      next();\n    }\n  } else {\n    next();\n  }\n});\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].http.interceptors.push(function (request) {\n  // modify headers\n  if (localStorage['access-token'] !== undefined && localStorage['access-token'] !== null) {\n    request.headers.set('access-token', localStorage['access-token']);\n  }\n\n  if (localStorage.client !== undefined && localStorage.client !== null) {\n    request.headers.set('client', localStorage.client);\n  }\n\n  if (localStorage.uid !== undefined && localStorage.uid !== null) {\n    request.headers.set('uid', localStorage.uid);\n  } // return response callback\n\n\n  return function (response) {\n    // if unauthorized response or token expired, redirect to login page.\n    if (response.status === 401) {\n      localStorage.clear();\n      localStorage.isUserSessionTimedOut = true;\n      this.$router.push({\n        name: 'login'\n      }); // Navigate to login using router property\n    }\n  };\n});\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/plugins/vuetify.js":
/*!********************************!*\
  !*** ./src/plugins/vuetify.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mdi_font_css_materialdesignicons_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mdi/font/css/materialdesignicons.css */ \"./node_modules/@mdi/font/css/materialdesignicons.css\");\n/* harmony import */ var _mdi_font_css_materialdesignicons_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_mdi_font_css_materialdesignicons_css__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm.js\");\n/* harmony import */ var vuetify_lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuetify/lib */ \"./node_modules/vuetify/lib/index.js\");\n\n\n\nvue__WEBPACK_IMPORTED_MODULE_1__[\"default\"].use(vuetify_lib__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n/* harmony default export */ __webpack_exports__[\"default\"] = (new vuetify_lib__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n  theme: {\n    themes: {\n      light: {\n        primary: '#673ab7',\n        secondary: '#CFD8DC',\n        accent: '#82B1FF',\n        error: '#FF5252',\n        info: '#2196F3',\n        success: '#4CAF50',\n        warning: '#FFC107'\n      }\n    }\n  },\n  icons: {\n    iconfont: 'mdi'\n  }\n}));\n\n//# sourceURL=webpack:///./src/plugins/vuetify.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.runtime.esm.js\");\n/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ \"./node_modules/vue-router/dist/vue-router.esm.js\");\n\n\nvue__WEBPACK_IMPORTED_MODULE_0__[\"default\"].use(vue_router__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n/* harmony default export */ __webpack_exports__[\"default\"] = (new vue_router__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n  mode: 'history',\n  base: \"/\",\n  routes: [{\n    path: '/',\n    name: 'login',\n    component: function component() {\n      return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Login */ \"./src/views/Login.vue\"));\n    }\n  }, {\n    path: '/dashboard',\n    name: 'template',\n    component: function component() {\n      return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Template */ \"./src/views/Dashboard/Template.vue\"));\n    },\n    children: [{\n      path: 'main',\n      name: 'main',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Main */ \"./src/views/Dashboard/Children/Main.vue\"));\n      }\n    }, {\n      path: 'items',\n      name: 'items',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Items.vue */ \"./src/views/Dashboard/Children/Items.vue\"));\n      }\n    }, {\n      path: 'transports',\n      name: 'transports',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Transports.vue */ \"./src/views/Dashboard/Children/Transports.vue\"));\n      }\n    }, {\n      path: 'users',\n      name: 'users',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Users.vue */ \"./src/views/Dashboard/Children/Users.vue\"));\n      }\n    }, {\n      path: 'companies',\n      name: 'companies',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Companies.vue */ \"./src/views/Dashboard/Children/Companies.vue\"));\n      }\n    }, {\n      path: 'customers',\n      name: 'customers',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Customers.vue */ \"./src/views/Dashboard/Children/Customers.vue\"));\n      }\n    }, {\n      path: 'newInvoice',\n      name: 'newInvoice',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/NewInvoice.vue */ \"./src/views/Dashboard/Children/NewInvoice.vue\"));\n      }\n    }, {\n      path: 'invoices',\n      name: 'invoices',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Invoices.vue */ \"./src/views/Dashboard/Children/Invoices.vue\"));\n      }\n    }, {\n      path: 'editInvoice/:id',\n      name: 'editInvoice',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/EditInvoice.vue */ \"./src/views/Dashboard/Children/EditInvoice.vue\"));\n      }\n    }, {\n      path: 'viewInvoice/:id',\n      name: 'viewInvoice',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/ViewInvoice.vue */ \"./src/views/Dashboard/Children/ViewInvoice.vue\"));\n      }\n    }, {\n      path: 'hsnSummary',\n      name: 'hsnSummary',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/HSNSummary.vue */ \"./src/views/Dashboard/Children/HSNSummary.vue\"));\n      }\n    }, {\n      path: 'analysis',\n      name: 'analysis',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/Analysis.vue */ \"./src/views/Dashboard/Children/Analysis.vue\"));\n      }\n    }, {\n      path: 'notFound',\n      name: 'notFound',\n      component: function component() {\n        return __webpack_require__.e(/*! import() | about */ \"about\").then(__webpack_require__.bind(null, /*! ./views/Dashboard/Children/NotFound.vue */ \"./src/views/Dashboard/Children/NotFound.vue\"));\n      }\n    }]\n  }]\n}));\n\n//# sourceURL=webpack:///./src/router.js?");

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/main.js */\"./src/main.js\");\n\n\n//# sourceURL=webpack:///multi_./src/main.js?");

/***/ }),

/***/ 1:
/*!*********************!*\
  !*** got (ignored) ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///got_(ignored)?");

/***/ })

/******/ });