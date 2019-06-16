/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "42663384a2ae7f32c0d6";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(/*! express */ \"express\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nconst logger = __webpack_require__(/*! morgan */ \"morgan\");\nconst compression = __webpack_require__(/*! compression */ \"compression\");\nconst swaggerUi = __webpack_require__(/*! swagger-ui-express */ \"swagger-ui-express\");\nconst passport = __webpack_require__(/*! passport */ \"passport\");\nconst moment = __webpack_require__(/*! moment */ \"moment\");\n\nconst swaggerDocument = __webpack_require__(/*! ./swagger.js */ \"./swagger.js\");\n\nconst indexRouter = __webpack_require__(/*! ./routes/index */ \"./routes/index.js\");\nconst usersRouter = __webpack_require__(/*! ./routes/user */ \"./routes/user.js\");\nconst authRouter = __webpack_require__(/*! ./routes/auth */ \"./routes/auth.js\");\nconst farmingRouter = __webpack_require__(/*! ./routes/farming */ \"./routes/farming.js\");\nconst manufactureRouter = __webpack_require__(/*! ./routes/manufacture */ \"./routes/manufacture.js\");\nconst animalsRouter = __webpack_require__(/*! ./routes/animals */ \"./routes/animals.js\");\n\nconst authenticate = __webpack_require__(/*! ./middlewares/authenticate */ \"./middlewares/authenticate.js\");\n\nconst initDictionaries = __webpack_require__(/*! ./util/initDictionaries */ \"./util/initDictionaries.js\");\n\nconst app = express();\n\n__webpack_require__(/*! ./passport/local */ \"./passport/local.js\");\n__webpack_require__(/*! ./passport/google */ \"./passport/google.js\");\n\n__webpack_require__(/*! ./validationSchemas/validation.module */ \"./validationSchemas/validation.module.js\");\n\nmoment.locale('ru');\n\napp.use(logger('dev'));\napp.use(express.json());\napp.use(express.urlencoded({ extended: false }));\napp.use(cookieParser());\napp.use(express.static(path.join(__dirname, 'public')));\napp.use(compression());\napp.use(passport.initialize());\n\napp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));\n\napp.use('/api/v1/auth', authRouter);\napp.use('/api/v1/user', authenticate(), usersRouter);\napp.use('/api/v1/farming', authenticate(), farmingRouter);\napp.use('/api/v1/manufacture', authenticate(), manufactureRouter);\napp.use('/api/v1/animals', authenticate(), animalsRouter);\napp.use('*', indexRouter);\n\ninitDictionaries();\n\nmodule.exports = app;\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./bin/www.js":
/*!********************!*\
  !*** ./bin/www.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar app = __webpack_require__(/*! ../app */ \"./app.js\");\nvar debug = __webpack_require__(/*! debug */ \"debug\")('foodhelperback:server');\nvar http = __webpack_require__(/*! http */ \"http\");\n\n/**\n * Get port from environment and store in Express.\n */\n\nvar port = normalizePort(process.env.PORT || '3000');\napp.set('port', port);\n\n/**\n * Create HTTP server.\n */\n\nvar server = http.createServer(app);\n\n/**\n * Listen on provided port, on all network interfaces.\n */\n\nserver.listen(port);\nserver.on('error', onError);\nserver.on('listening', onListening);\n\n/**\n * Normalize a port into a number, string, or false.\n */\n\nfunction normalizePort(val) {\n  var port = parseInt(val, 10);\n\n  if (isNaN(port)) {\n    // named pipe\n    return val;\n  }\n\n  if (port >= 0) {\n    // port number\n    return port;\n  }\n\n  return false;\n}\n\n/**\n * Event listener for HTTP server \"error\" event.\n */\n\nfunction onError(error) {\n  if (error.syscall !== 'listen') {\n    throw error;\n  }\n\n  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;\n\n  // handle specific listen errors with friendly messages\n  switch (error.code) {\n    case 'EACCES':\n      console.error(bind + ' requires elevated privileges');\n      process.exit(1);\n      break;\n    case 'EADDRINUSE':\n      console.error(bind + ' is already in use');\n      process.exit(1);\n      break;\n    default:\n      throw error;\n  }\n}\n\n/**\n * Event listener for HTTP server \"listening\" event.\n */\n\nfunction onListening() {\n  var addr = server.address();\n  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;\n  debug('Listening on ' + bind);\n}\n\nif (true) {\n  module.hot.accept();\n  module.hot.dispose(() => server.close());\n}\n\n\n//# sourceURL=webpack:///./bin/www.js?");

/***/ }),

/***/ "./db/db.module.js":
/*!*************************!*\
  !*** ./db/db.module.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nconst ProductDictionary = __webpack_require__(/*! ./schemas/dictionaries/ProductDictionary.schema */ \"./db/schemas/dictionaries/ProductDictionary.schema.js\");\nconst FactoryDictionary = __webpack_require__(/*! ./schemas/dictionaries/factoryDictionary.schema */ \"./db/schemas/dictionaries/factoryDictionary.schema.js\");\nconst ProductionLineDictionary = __webpack_require__(/*! ./schemas/dictionaries/productionLineDictionary.schema */ \"./db/schemas/dictionaries/productionLineDictionary.schema.js\");\nconst AnimalDictionary = __webpack_require__(/*! ./schemas/dictionaries/animalDictionary.schema */ \"./db/schemas/dictionaries/animalDictionary.schema.js\");\nconst HusbandryDictionary = __webpack_require__(/*! ./schemas/dictionaries/husbandryDictionary.schema */ \"./db/schemas/dictionaries/husbandryDictionary.schema.js\");\nconst LevelDictionary = __webpack_require__(/*! ./schemas/dictionaries/levelDictionary.schema */ \"./db/schemas/dictionaries/levelDictionary.schema.js\");\nconst HouseDictionary = __webpack_require__(/*! ./schemas/dictionaries/houseDictionary.schema */ \"./db/schemas/dictionaries/houseDictionary.schema.js\");\n\nconst User = __webpack_require__(/*! ./schemas/user.schema */ \"./db/schemas/user.schema.js\");\nconst Player = __webpack_require__(/*! ./schemas/player.schema */ \"./db/schemas/player.schema.js\");\nconst { Farming, Field } = __webpack_require__(/*! ./schemas/farming.schema */ \"./db/schemas/farming.schema.js\");\nconst { Manufacture, Factory } = __webpack_require__(/*! ./schemas/manufacture.schema */ \"./db/schemas/manufacture.schema.js\");\nconst {\n  AnimalHusbandry,\n  Animal,\n  AnimalHusbandryBuilding\n} = __webpack_require__(/*! ./schemas/animalHusbandry.schema */ \"./db/schemas/animalHusbandry.schema.js\");\nconst { House, HouseKeeping } = __webpack_require__(/*! ./schemas/houseKeeping.schema */ \"./db/schemas/houseKeeping.schema.js\");\n\nconst dbConfigUrl =\n   true\n    ? 'mongodb://yofi2tofi:ABF71824178907@ds137857.mlab.com:37857/farm-game-back-test'\n    : undefined;\n\nmongoose.connect(dbConfigUrl);\nvar db = mongoose.connection;\n\ndb.on('error', err => {\n  console.log('connection error:', err.message);\n});\n\ndb.once('open', () => {\n  console.log('Connected to DB!');\n});\n\nconst ProductDictionaryModel = mongoose.model(\n  'ProductDictionary',\n  ProductDictionary\n);\nconst FactoryDictionaryModel = mongoose.model(\n  'FactoryDictionary',\n  FactoryDictionary\n);\nconst ProductionLineDictionaryModel = mongoose.model(\n  'ProductionLineDictionary',\n  ProductionLineDictionary\n);\nconst AnimalDictionaryModel = mongoose.model(\n  'AnimalDictionary',\n  AnimalDictionary\n);\nconst HusbandryDictionaryModel = mongoose.model(\n  'HusbandryDictionary',\n  HusbandryDictionary\n);\nconst HouseDictionaryModel = mongoose.model('HouseDictionary', HouseDictionary);\n\nconst LevelDictionaryModel = mongoose.model('LevelDictionary', LevelDictionary);\n\nconst UserModel = mongoose.model('User', User);\nconst PlayerModel = mongoose.model('Player', Player);\nconst FarmingModel = mongoose.model('Farming', Farming);\nconst ManufactureModel = mongoose.model('Manufacture', Manufacture);\nconst AnimalHusbandryModel = mongoose.model('AnimalHusbandry', AnimalHusbandry);\nconst AnimalHusbandryBuildingModel = mongoose.model(\n  'AnimalHusbandryBuilding',\n  AnimalHusbandryBuilding\n);\nconst HouseKeepingModel = mongoose.model('HouseKeeping', HouseKeeping);\n\nconst FieldModel = mongoose.model('Field', Field);\nconst FactoryModel = mongoose.model('Factory', Factory);\nconst AnimalModel = mongoose.model('Animal', Animal);\nconst HouseModel = mongoose.model('House', House);\n\nmodule.exports = {\n  ProductDictionaryModel,\n  FactoryDictionaryModel,\n  ProductionLineDictionaryModel,\n  AnimalDictionaryModel,\n  HusbandryDictionaryModel,\n  AnimalHusbandryBuildingModel,\n  LevelDictionaryModel,\n  HouseDictionaryModel,\n  UserModel,\n  PlayerModel,\n  FarmingModel,\n  FieldModel,\n  ManufactureModel,\n  FactoryModel,\n  AnimalHusbandryModel,\n  AnimalModel,\n  HouseKeepingModel,\n  HouseModel\n};\n\n\n//# sourceURL=webpack:///./db/db.module.js?");

/***/ }),

/***/ "./db/schemas/animalHusbandry.schema.js":
/*!**********************************************!*\
  !*** ./db/schemas/animalHusbandry.schema.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst Animal = new Schema({\n  gathering: {\n    type: Date,\n    default: Date.now()\n  },\n  isBusy: {\n    type: Boolean,\n    default: false\n  },\n  animal: {\n    type: Schema.Types.ObjectId,\n    ref: 'AnimalDictionary'\n  },\n  husbandryBuildingId: {\n    type: Schema.Types.ObjectId,\n    ref: 'AnimalHusbandryBuilding'\n  }\n});\n\nconst AnimalHusbandryBuilding = new Schema(\n  {\n    animalHusbandryBuilding: {\n      type: Schema.Types.ObjectId,\n      ref: 'HusbandryDictionary'\n    },\n    animalHusbandryId: {\n      type: Schema.Types.ObjectId,\n      ref: 'AnimalHusbandry'\n    },\n    userId: {\n      type: Schema.Types.ObjectId\n    }\n  },\n  { toJSON: { virtuals: true } }\n);\n\nAnimalHusbandryBuilding.virtual('animals', {\n  ref: 'Animal',\n  localField: '_id',\n  foreignField: 'husbandryBuildingId',\n  justOne: false\n});\n\nconst AnimalHusbandry = new Schema(\n  {\n    cowshedId: {\n      type: Schema.Types.ObjectId,\n      default: mongoose.Types.ObjectId()\n    },\n    userId: {\n      type: Schema.Types.ObjectId\n    }\n  },\n  { toJSON: { virtuals: true } }\n);\n\nAnimalHusbandry.virtual('cowsheds', {\n  ref: 'AnimalHusbandryBuilding',\n  localField: 'cowshedId',\n  foreignField: 'animalHusbandryId',\n  justOne: false\n});\n\nmodule.exports = { AnimalHusbandry, AnimalHusbandryBuilding, Animal };\n\n\n//# sourceURL=webpack:///./db/schemas/animalHusbandry.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/ProductDictionary.schema.js":
/*!*************************************************************!*\
  !*** ./db/schemas/dictionaries/ProductDictionary.schema.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst ProductDictionary = new Schema({\n  _id: {\n    type: Schema.Types.ObjectId\n  },\n  name: String,\n  time: Number,\n  type: String,\n  price: Number,\n  sell: Number,\n  level: {\n    type: Schema.Types.ObjectId,\n    ref: 'LevelDictionary'\n  },\n  experience: Number\n});\n\nmodule.exports = ProductDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/ProductDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/animalDictionary.schema.js":
/*!************************************************************!*\
  !*** ./db/schemas/dictionaries/animalDictionary.schema.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst AnimalDictionary = new Schema(\n  {\n    _id: {\n      type: Schema.Types.ObjectId\n    },\n    id: Number,\n    name: String,\n    produced: {\n      count: Number,\n      product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }\n    },\n    material: {\n      count: Number,\n      product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }\n    }\n  },\n  { toJSON: { virtuals: true } }\n);\n\nmodule.exports = AnimalDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/animalDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/factoryDictionary.schema.js":
/*!*************************************************************!*\
  !*** ./db/schemas/dictionaries/factoryDictionary.schema.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst FactoryDictionary = new Schema(\n  {\n    _id: {\n      type: Schema.Types.ObjectId\n    },\n    id: Number,\n    name: String,\n    playerLevel: [{ type: Schema.Types.ObjectId, ref: 'LevelDictionary' }],\n    population: [Number],\n    cost: [Number],\n    buildTime: [Number],\n    experience: [Number]\n  },\n  { toJSON: { virtuals: true } }\n);\n\nFactoryDictionary.virtual('lines', {\n  ref: 'ProductionLineDictionary',\n  localField: '_id',\n  foreignField: 'factoryId',\n  justOne: false\n});\n\nmodule.exports = FactoryDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/factoryDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/houseDictionary.schema.js":
/*!***********************************************************!*\
  !*** ./db/schemas/dictionaries/houseDictionary.schema.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst HouseDictionary = new Schema({\n  _id: {\n    type: Schema.Types.ObjectId\n  },\n  name: String,\n  playerLevels: [\n    {\n      maxBuilding: Number,\n      level: { type: Schema.Types.ObjectId, ref: 'LevelDictionary' }\n    }\n  ],\n  population: Number,\n  cost: Number,\n  buildTime: Number,\n  experience: Number,\n  size: {\n    side: Number,\n    front: Number\n\t},\n\tisFirstFree: Boolean\n});\n\nmodule.exports = HouseDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/houseDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/husbandryDictionary.schema.js":
/*!***************************************************************!*\
  !*** ./db/schemas/dictionaries/husbandryDictionary.schema.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst AnimalCost = new Schema({\n  cost: {\n    type: Array\n  }\n});\n\nconst HusbandryDictionary = new Schema({\n  _id: {\n    type: Schema.Types.ObjectId\n  },\n  name: String,\n  cost: [Number],\n  experience: [Number],\n  animalCost: [AnimalCost],\n  buildTime: [Number],\n  defaultAnimalsCount: Number,\n  maxBuildings: Number,\n  linkAnimal: {\n    type: Schema.Types.ObjectId,\n    ref: 'AnimalDictionary'\n  }\n});\n\nmodule.exports = HusbandryDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/husbandryDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/levelDictionary.schema.js":
/*!***********************************************************!*\
  !*** ./db/schemas/dictionaries/levelDictionary.schema.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst LevelDictionary = new Schema({\n  _id: {\n    type: Schema.Types.ObjectId\n  },\n  level: Number,\n  experience: Number,\n  bonus: {\n    coins: Number,\n\t\tcash: Number,\n\t\twheat: Number\n  }\n});\n\nmodule.exports = LevelDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/levelDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/dictionaries/productionLineDictionary.schema.js":
/*!********************************************************************!*\
  !*** ./db/schemas/dictionaries/productionLineDictionary.schema.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst ProductionLineDictionary = new Schema({\n  _id: {\n    type: Schema.Types.ObjectId\n  },\n  name: String,\n  time: Number,\n  playerLevel: {\n    type: Schema.Types.ObjectId,\n    ref: 'LevelDictionary'\n  },\n  sell: Number,\n  experience: Number,\n  produced: {\n    count: Number,\n    product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }\n  },\n  materials: [\n    {\n      count: Number,\n      product: { type: Schema.Types.ObjectId, ref: 'ProductDictionary' }\n    }\n  ],\n  factoryId: {\n    type: Schema.Types.ObjectId\n  }\n});\n\nmodule.exports = ProductionLineDictionary;\n\n\n//# sourceURL=webpack:///./db/schemas/dictionaries/productionLineDictionary.schema.js?");

/***/ }),

/***/ "./db/schemas/farming.schema.js":
/*!**************************************!*\
  !*** ./db/schemas/farming.schema.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst Field = new Schema({\n  harvest: {\n    type: Date,\n    default: Date.now()\n  },\n  product: {\n    type: Schema.Types.ObjectId,\n    ref: 'ProductDictionary'\n  },\n  farmingId: {\n    type: Schema.Types.ObjectId,\n    ref: 'Farming'\n  },\n  userId: {\n    type: Schema.Types.ObjectId\n  }\n});\n\nconst Farming = new Schema(\n  {\n    wheatId: {\n      type: Schema.Types.ObjectId,\n      default: mongoose.Types.ObjectId()\n    }\n  },\n  { toJSON: { virtuals: true } }\n);\n\nFarming.virtual('wheat', {\n  ref: 'Field', // The model to use\n  localField: 'wheatId', // Find people where `localField`\n  foreignField: 'farmingId', // is equal to `foreignField`\n  justOne: false\n});\n\nmodule.exports = { Farming, Field };\n\n\n//# sourceURL=webpack:///./db/schemas/farming.schema.js?");

/***/ }),

/***/ "./db/schemas/houseKeeping.schema.js":
/*!*******************************************!*\
  !*** ./db/schemas/houseKeeping.schema.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst House = new Schema({\n  house: { type: Schema.Types.ObjectId, ref: 'HouseDictionary' },\n  houseKeepingId: { type: Schema.Types.ObjectId, ref: 'HouseKeeping' }\n});\n\nconst HouseKeeping = new Schema(\n  {\n    userId: {\n      type: Schema.Types.ObjectId\n    }\n  },\n  { toJSON: { virtuals: true } }\n);\n\nHouseKeeping.virtual('houses', {\n  ref: 'House',\n  localField: '_id',\n  foreignField: 'houseKeepingId',\n  justOne: false\n});\n\nmodule.exports = { HouseKeeping, House };\n\n\n//# sourceURL=webpack:///./db/schemas/houseKeeping.schema.js?");

/***/ }),

/***/ "./db/schemas/manufacture.schema.js":
/*!******************************************!*\
  !*** ./db/schemas/manufacture.schema.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst Factory = new Schema({\n  produced: {\n    type: Date,\n    default: Date.now()\n  },\n  isBusy: {\n    type: Boolean,\n    default: false\n  },\n  selectedLine: {\n    type: Schema.Types.ObjectId,\n    ref: 'ProductionLineDictionary'\n  },\n  factory: {\n    type: Schema.Types.ObjectId,\n    ref: 'FactoryDictionary'\n  },\n  manufactureId: {\n    type: Schema.Types.ObjectId,\n    ref: 'Manufacture'\n  },\n  userId: {\n    type: Schema.Types.ObjectId\n  }\n});\n\nconst Manufacture = new Schema(\n  {\n    feedFactoryId: {\n      type: Schema.Types.ObjectId,\n      default: mongoose.Types.ObjectId()\n    },\n    userId: {\n      type: Schema.Types.ObjectId\n    }\n  },\n  { toJSON: { virtuals: true } }\n);\n\nManufacture.virtual('feed', {\n  ref: 'Factory',\n  localField: 'feedFactoryId',\n  foreignField: 'manufactureId',\n  justOne: false\n});\n\nmodule.exports = { Manufacture, Factory };\n\n\n//# sourceURL=webpack:///./db/schemas/manufacture.schema.js?");

/***/ }),

/***/ "./db/schemas/player.schema.js":
/*!*************************************!*\
  !*** ./db/schemas/player.schema.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst Player = new Schema({\n  experience: {\n    type: Number,\n    default: 0\n  },\n  population: {\n    type: Number,\n    default: 0\n  },\n  level: {\n    type: Schema.Types.ObjectId,\n    ref: 'LevelDictionary'\n  },\n  coins: {\n    type: Number,\n    default: 0\n  },\n  cash: {\n    type: Number,\n    default: 0\n  },\n  wheat: {\n    type: Number,\n    default: 10\n  },\n  corn: { type: Number, default: 10 },\n  cowFood: { type: Number, default: 0 },\n  milk: { type: Number, default: 0 },\n  userId: {\n    type: Schema.Types.ObjectId\n  }\n});\n\nmodule.exports = Player;\n\n\n//# sourceURL=webpack:///./db/schemas/player.schema.js?");

/***/ }),

/***/ "./db/schemas/user.schema.js":
/*!***********************************!*\
  !*** ./db/schemas/user.schema.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst Schema = __webpack_require__(/*! mongoose */ \"mongoose\").Schema;\n\nconst User = new Schema(\n  {\n    method: String,\n    local: {\n      username: { type: String, unique: true },\n      salt: String,\n      hashedPassword: String\n    },\n    hash: String,\n    salt: String,\n    refreshToken: String\n  },\n  { toJSON: { virtuals: true } }\n);\n\nUser.virtual('resources', {\n  ref: 'Player', // The model to use\n  localField: '_id', // Find people where `localField`\n  foreignField: 'userId', // is equal to `foreignField`\n  justOne: true\n});\n\nUser.virtual('agricultures', {\n  ref: 'Farming', // The model to use\n  localField: '_id', // Find people where `localField`\n  foreignField: 'userId', // is equal to `foreignField`\n  justOne: true\n});\n\nUser.virtual('manufactures', {\n  ref: 'Manufacture', // The model to use\n  localField: '_id', // Find people where `localField`\n  foreignField: 'userId', // is equal to `foreignField`\n  justOne: true\n});\n\nUser.virtual('animalFactories', {\n  ref: 'AnimalHusbandry', // The model to use\n  localField: '_id', // Find people where `localField`\n  foreignField: 'userId', // is equal to `foreignField`\n  justOne: true\n});\n\nUser.virtual('houseKeeping', {\n  ref: 'HouseKeeping', // The model to use\n  localField: '_id', // Find people where `localField`\n  foreignField: 'userId', // is equal to `foreignField`\n  justOne: true\n});\n\nmodule.exports = User;\n\n\n//# sourceURL=webpack:///./db/schemas/user.schema.js?");

/***/ }),

/***/ "./middlewares/authenticate.js":
/*!*************************************!*\
  !*** ./middlewares/authenticate.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const passport = __webpack_require__(/*! passport */ \"passport\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst ExtractJwt = __webpack_require__(/*! passport-jwt */ \"passport-jwt\").ExtractJwt;\n\nconst { UserModel } = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\n// Мидлвер првоерки авторизации и обновления токена\nmodule.exports = () => {\n  return async (req, res, next) => {\n    const accessToken = ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req);\n    const refreshToken = req.headers.refresh_token;\n\n    try {\n      const verifiedAccessToken = jwt.verify(accessToken, 'secret');\n      const userId = verifiedAccessToken._id;\n\n      const newRefreshToken = jwt.sign({ _id: userId }, 'secret', {\n        expiresIn: '24h'\n      });\n\n      const updateUser = await UserModel.findByIdAndUpdate(userId, {\n        $set: { refreshToken: newRefreshToken }\n      }).exec();\n\n      res.append('refresh_token', newRefreshToken);\n\n      req.user = updateUser;\n      \n      next();\n    } catch (e) {\n      const decodedRefreshToken = jwt.decode(refreshToken, 'secret');\n      const userId = decodedRefreshToken._id;\n\n      const user = await UserModel.findById(userId);\n      const userRefreshToken = user.refreshToken;\n\n      if (refreshToken !== userRefreshToken) {\n        return res.status(401).json({ message: 'Вы не авторизованы' });\n      }\n\n      const newAccessToken = jwt.sign({ _id: userId }, 'secret', {\n        expiresIn: '24h'\n      });\n      const newRefreshToken = jwt.sign({ _id: userId }, 'secret', {\n        expiresIn: '24h'\n      });\n\n      const updateUser = await UserModel.findByIdAndUpdate(userId, {\n        $set: { refreshToken: newRefreshToken }\n      }).exec();\n\n      res.append('access_token', newAccessToken);\n      res.append('refresh_token', newRefreshToken);\n\n      req.user = updateUser;\n\n      return next();\n    }\n  };\n};\n\n\n//# sourceURL=webpack:///./middlewares/authenticate.js?");

/***/ }),

/***/ "./middlewares/userBodyValidator.js":
/*!******************************************!*\
  !*** ./middlewares/userBodyValidator.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const classValidator = __webpack_require__(/*! class-validator */ \"class-validator\");\n\nmodule.exports = (req, res, next) => {\n  classValidator\n    .validate('userLocalSchema', req.body, {\n      whitelist: true,\n      forbidNonWhitelisted: true\n    })\n    .then(errors => {\n      if (errors.length) {\n        const errorsMessages = errors.map(error => {\n          const key = error.property;\n          const messageRaw = error.constraints;\n\n          let message;\n          for (const key in messageRaw) {\n            message = messageRaw[key];\n          }\n\n          return { [key]: message };\n        });\n\n        return res.status(404).json(errorsMessages);\n      }\n\n      next();\n    });\n};\n\n\n//# sourceURL=webpack:///./middlewares/userBodyValidator.js?");

/***/ }),

/***/ "./mocks/dictionaries/animals.js":
/*!***************************************!*\
  !*** ./mocks/dictionaries/animals.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const animals = [\n  {\n    _id: '5d07ef5757a33507c6bd2c12',\n    id: 1,\n    name: 'Корова',\n    produced: {\n      count: 1,\n      product: '5d06ad2d91a82a25da732027'\n    },\n    material: {\n      count: 1,\n      product: '5d06ad2d91a82a25da737027'\n    }\n  }\n];\n\nmodule.exports = animals;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/animals.js?");

/***/ }),

/***/ "./mocks/dictionaries/factories.js":
/*!*****************************************!*\
  !*** ./mocks/dictionaries/factories.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const factories = [\n  {\n    _id: '5d07ef5757a05507c6bd2c12',\n    id: 1,\n    name: 'Фабрика корма',\n    playerLevel: [\n      '5d0e01ccba7c25e6d599db48',\n      '5d0e04a2b8319e2b84ee19d8',\n      '5d0e0c56f5508c28e19f3500'\n    ],\n    population: [60, 655, 4150],\n    cost: [125, 2800, 40000],\n    buildTime: [40 * 1000, 16 * 60 * 60 * 1000, 44 * 60 * 60 * 1000],\n    experience: [11, 120, 1655]\n  }\n];\n\nmodule.exports = factories;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/factories.js?");

/***/ }),

/***/ "./mocks/dictionaries/houses.js":
/*!**************************************!*\
  !*** ./mocks/dictionaries/houses.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const husbandry = [\n  {\n    _id: '5d07ef5757a44407c6bd2c12',\n    name: 'Cape Cod Cottage',\n    cost: 10,\n    playerLevels: [\n      {\n        maxBuilding: 1,\n        level: '5d0e01ccba7c25e6d599db48'\n      },\n      {\n        maxBuilding: 1,\n        level: '5d0e04a2b8319e2b84ee19d8'\n      },\n      {\n        maxBuilding: 1,\n        level: '5d0e0c56f5508c28e19f3500'\n      }\n    ],\n    experience: 10,\n    population: 10,\n    buildTime: 10 * 60 * 1000,\n    size: {\n      side: 1,\n      front: 1\n    },\n    isFirstFree: true\n  }\n];\n\nmodule.exports = husbandry;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/houses.js?");

/***/ }),

/***/ "./mocks/dictionaries/husbandry.js":
/*!*****************************************!*\
  !*** ./mocks/dictionaries/husbandry.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const husbandry = [\n  {\n    _id: '5d07ef5757a44407c6bd2c12',\n    name: 'Коровник',\n    cost: [0, 500, 10000],\n    playerLevel: [\n      '5d0e01ccba7c25e6d599db48',\n      '5d0e04a2b8319e2b84ee19d8',\n      '5d0e0c56f5508c28e19f3500'\n    ],\n    experience: [0, 1800, 3200],\n    animalCost: [\n      { cost: [30, 40, 50] },\n      { cost: [800, 1200, 1500] },\n      { cost: [2500, 4000, 8000] }\n    ],\n    buildTime: [0, 16 * 60 * 60 * 1000, 48 * 60 * 60 * 1000],\n    defaultAnimalsCount: 3,\n    maxBuildings: 3,\n    linkAnimal: '5d07ef5757a33507c6bd2c12'\n  }\n];\n\nmodule.exports = husbandry;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/husbandry.js?");

/***/ }),

/***/ "./mocks/dictionaries/levels.js":
/*!**************************************!*\
  !*** ./mocks/dictionaries/levels.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const levels = [\n  {\n    _id: '5d10795556b4a12e1dfbd642',\n    level: 0,\n    experience: 0,\n    bonus: {}\n  },\n  {\n    _id: '5d0e01ccba7c25e6d599db48',\n    level: 1,\n    experience: 9,\n    bonus: {\n      coins: 500,\n      cash: 35\n    }\n  },\n  {\n    _id: '5d0e04a2b8319e2b84ee19d8',\n    level: 2,\n    experience: 17,\n    bonus: {\n      coins: 100,\n      cash: 1,\n      wheat: 4\n    }\n  },\n  {\n    _id: '5d0e0c56f5508c28e19f3500',\n    level: 3,\n    experience: 44,\n    bonus: {\n      coins: 150,\n      cash: 1,\n      corn: 4\n    }\n  }\n];\n\nmodule.exports = levels;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/levels.js?");

/***/ }),

/***/ "./mocks/dictionaries/productionLines.js":
/*!***********************************************!*\
  !*** ./mocks/dictionaries/productionLines.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const productionLines = [\n  {\n    _id: '5d07f3dec78d7a092ff129e5',\n    name: 'Корм для коров',\n    time: 5 * 60 * 1000,\n    playerLevel: '5d0e01ccba7c25e6d599db48',\n    sell: 3,\n    experience: 1,\n    materials: [\n      {\n        count: 2,\n        product: '5d06ac6f8d82b625736035c1'\n      },\n      {\n        count: 1,\n        product: '5d06ac6f8d82b625736035c2'\n      }\n    ],\n\t\tfactoryId: '5d07ef5757a05507c6bd2c12',\n\t\tproduced: {\n      count: 3,\n      product: '5d06ad2d91a82a25da737027'\n    }\n  }\n];\n\nmodule.exports = productionLines;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/productionLines.js?");

/***/ }),

/***/ "./mocks/dictionaries/products.js":
/*!****************************************!*\
  !*** ./mocks/dictionaries/products.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const products = [\n  {\n    name: 'Пшеница',\n    type: 'wheat',\n    time: 2 * 60 * 1000,\n    price: 0,\n    sell: 1,\n    level: '5d0e01ccba7c25e6d599db48',\n    experience: 1,\n    _id: '5d06ac6f8d82b625736035c1'\n  },\n  {\n    name: 'Кукуруза',\n    type: 'corn',\n    time: 5 * 60 * 1000,\n    price: 1,\n    sell: 3,\n    level: '5d0e0c56f5508c28e19f3500',\n    experience: 1,\n    _id: '5d06ac6f8d82b625736035c2'\n  },\n  {\n    name: 'Корм для коров',\n    type: 'cowFood',\n    time: 5 * 60 * 1000,\n    price: 3,\n    sell: 3,\n    level: '5d0e01ccba7c25e6d599db48',\n    experience: 1,\n    _id: '5d06ad2d91a82a25da737027'\n  },\n  ,\n  {\n    name: 'Молоко',\n    type: 'milk',\n    time: 20 * 60 * 1000,\n    price: 3,\n    sell: 7,\n    level: '5d0e01ccba7c25e6d599db48',\n    experience: 3,\n    _id: '5d06ad2d91a82a25da732027'\n  }\n];\n\nmodule.exports = products;\n\n\n//# sourceURL=webpack:///./mocks/dictionaries/products.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + (err.stack || err.message));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\n\t\t\t\t\t\t\t\"warning\",\n\t\t\t\t\t\t\t\"[HMR] Update failed: \" + (err.stack || err.message)\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?100\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./passport/google.js":
/*!****************************!*\
  !*** ./passport/google.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const passport = __webpack_require__(/*! passport */ \"passport\");\nconst GoogleTokenStrategy = __webpack_require__(/*! passport-google-token */ \"passport-google-token\").Strategy;\n\npassport.use(\n  new GoogleTokenStrategy(\n    {\n      clientID:\n        '354513618601-ficclon4bei6lniem81rmno751fn8k90.apps.googleusercontent.com',\n      clientSecret: 'dOfP5aZKK4J69IlSFh75vq6r'\n    },\n    function(accessToken, refreshToken, profile, cb) {\n      console.log(accessToken, refreshToken, profile);\n      // User.findOrCreate({ googleId: profile.id }, function (err, user) {\n      //   return cb(err, user);\n      // });\n    }\n  )\n);\n\n\n//# sourceURL=webpack:///./passport/google.js?");

/***/ }),

/***/ "./passport/local.js":
/*!***************************!*\
  !*** ./passport/local.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const passport = __webpack_require__(/*! passport */ \"passport\");\nconst LocalStrategy = __webpack_require__(/*! passport-local */ \"passport-local\").Strategy;\n\nconst { UserModel } = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\nconst { generateSalt, generateHashedPassword } = __webpack_require__(/*! ../util/encryption */ \"./util/encryption.js\");\n\npassport.use(\n  'local-signup',\n  new LocalStrategy(\n    { usernameField: 'username', passwordField: 'password' },\n    async (username, password, done) => {\n      if (await UserModel.findOne({ 'local.username': username })) {\n        return done('Already exist', false);\n      }\n\n      try {\n        const salt = generateSalt();\n        const user = new UserModel({\n          method: 'local',\n          role: 'user',\n          local: {\n            username,\n            salt,\n            hashedPassword: generateHashedPassword(salt, password)\n          }\n        });\n\n        await user.save();\n\n        done(null, user);\n      } catch (error) {\n        done(error, false);\n      }\n    }\n  )\n);\n\npassport.use(\n  'local-signin',\n  new LocalStrategy(\n    { usernameField: 'username', passwordField: 'password' },\n    async (username, password, done) => {\n      try {\n        const user = await UserModel.findOne({\n          'local.username': username\n        });\n\n        if (!user) {\n          return done(\"User doesn't exist\", false);\n        }\n\n        if (\n          generateHashedPassword(user.local.salt, password) !==\n          user.local.hashedPassword\n        ) {\n          return done('password is wrong', false);\n        }\n\n        done(null, user);\n      } catch (error) {\n        done(error, false);\n      }\n    }\n  )\n);\n\n\n//# sourceURL=webpack:///./passport/local.js?");

/***/ }),

/***/ "./routes/animals.js":
/*!***************************!*\
  !*** ./routes/animals.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst moment = __webpack_require__(/*! moment */ \"moment\");\n\nconst {\n  AnimalHusbandryModel,\n  AnimalModel,\n  PlayerModel\n} = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\nrouter.get('/', async (req, res, next) => {\n  try {\n    const animalHusbandry = await AnimalHusbandryModel.findOne({\n      userId: req.user._id\n    })\n      .populate({\n        path: 'cowsheds',\n        populate: {\n          path: 'animals'\n        }\n      })\n      .exec();\n\n    return res.json({\n      data: animalHusbandry,\n      meta: null\n    });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.get('/:id', async (req, res, next) => {\n  try {\n    const animalId = req.params.id;\n    const animal = await AnimalModel.findById(animalId)\n      .populate({\n        path: 'animal',\n        populate: [\n          {\n            path: 'produced.product',\n            select: 'type time'\n          },\n          {\n            path: 'material.product',\n            select: 'type'\n          }\n        ]\n      })\n      .exec();\n\n    return res.json({\n      data: animal,\n      meta: null\n    });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.put('/:id', async (req, res, next) => {\n  try {\n    const userId = req.user._id;\n    const animalId = req.params.id;\n\n    const resources = await PlayerModel.findOne({ userId }).exec();\n    const animalUser = await AnimalModel.findById(animalId)\n      .populate({\n        path: 'animal',\n        populate: [\n          {\n            path: 'produced.product',\n            select: 'type time'\n          },\n          {\n            path: 'material.product',\n            select: 'type name'\n          }\n        ]\n      })\n      .exec();\n\n    const material = animalUser.animal.material;\n    const produced = animalUser.animal.produced;\n\n    if (animalUser.isBusy) {\n      return res.status(400).json({\n        message: `В данный момент животное занято.`\n      });\n    }\n\n    if (!resources[material.product.type]) {\n      return res\n        .status(400)\n        .json({ message: `Недостаточно ${material.product.name}` });\n    }\n\n    if (resources[material.product.type] - material.count < 0) {\n      return res\n        .status(400)\n        .json({ message: `Недостаточно ${material.product.name}` });\n    }\n\n    const resource = {\n      [material.product.type]: -material.count\n    };\n\n    await PlayerModel.findOneAndUpdate({ userId }, { $inc: resource }).exec();\n    await AnimalModel.findByIdAndUpdate(animalId, {\n      $set: {\n        isBusy: true,\n        gathering: new Date(Date.now() + produced.product.time).toISOString()\n      }\n    }).exec();\n\n    return res.json({ message: 'Производство запущенно!' });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.put('/produced/:id', async (req, res, next) => {\n  try {\n    const userId = req.user._id;\n    const animalId = req.params.id;\n\n    const animalUser = await AnimalModel.findById(animalId)\n      .populate({\n        path: 'animal',\n        populate: [\n          {\n            path: 'produced.product',\n            select: 'type experience'\n          }\n        ]\n      })\n      .exec();\n\n    if (!animalUser.isBusy) {\n      return res.status(400).json({ message: 'Животное ничего не производит' });\n    }\n\n    const producedMs = new Date(animalUser.gathering).getTime();\n    const currentMs = new Date().getTime();\n\n    if (producedMs > currentMs) {\n      const remainTime = moment(producedMs).from(moment(currentMs));\n      return res.status(400).json({\n        message: `Товар еще не произведен, нужно подождать, ${remainTime}`\n      });\n    }\n\n    const produced = animalUser.animal.produced;\n\n    await PlayerModel.findOneAndUpdate(\n      { userId },\n      {\n        $inc: {\n          [produced.product.type]: produced.count,\n          experience: produced.product.experience\n        }\n      }\n    ).exec();\n\n    await AnimalModel.findByIdAndUpdate(animalId, {\n      $set: {\n        isBusy: false\n      },\n      $currentDate: { gathering: { $type: 'date' } }\n    }).exec();\n\n    return res.json({ message: 'Товар успешно произведен!' });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./routes/animals.js?");

/***/ }),

/***/ "./routes/auth.js":
/*!************************!*\
  !*** ./routes/auth.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var express = __webpack_require__(/*! express */ \"express\");\nvar router = express.Router();\n\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst passport = __webpack_require__(/*! passport */ \"passport\");\n\nconst { UserModel } = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\nconst bodyValidator = __webpack_require__(/*! ../middlewares/userBodyValidator */ \"./middlewares/userBodyValidator.js\");\n\nrouter.post('/signup', bodyValidator, (req, res, next) => {\n  passport.authenticate('local-signup', async (err, user, info) => {\n    if (err === 'Already exist') {\n      return res.status(500).json({ message: 'Пользователь уже существует' });\n    }\n    if (err) {\n      return res.status(500).json({ message: 'Что-то пошло не так =(' });\n    }\n    if (user) {\n      const accessToken = jwt.sign({ _id: user._id }, 'secret', {\n        expiresIn: '24h'\n      });\n      const refreshToken = jwt.sign({ _id: user._id }, 'secret', {\n        expiresIn: '24h'\n      });\n\n      const updateUser = await UserModel.findByIdAndUpdate(user._id, {\n        $set: { refreshToken }\n      }).exec();\n\n      return res.json({ accessToken, refreshToken });\n    }\n  })(req, res, next);\n});\n\nrouter.post('/signin', bodyValidator, (req, res, next) => {\n  passport.authenticate('local-signin', async (err, user, info) => {\n    if (err === \"User doesn't exist\") {\n      return res.status(400).json({ message: 'Пользователь не существует' });\n    }\n    if (err === 'password is wrong') {\n      return res.status(400).json({ message: 'Пароль не верен' });\n    }\n    if (err) {\n      return res.status(500).json({ message: 'Что-то пошло не так =(' });\n    }\n    if (user) {\n      const accessToken = jwt.sign({ _id: user._id }, 'secret', {\n        expiresIn: '24h'\n      });\n      const refreshToken = jwt.sign({ _id: user._id }, 'secret', {\n        expiresIn: '24h'\n      });\n\n      const updateUser = await UserModel.findByIdAndUpdate(user._id, {\n        $set: { refreshToken }\n      }).exec();\n\n      return res.json({ accessToken, refreshToken });\n    }\n  })(req, res, next);\n});\n\nrouter.get(\n  '/google',\n  passport.authenticate('google-token', { session: false }),\n  function(req, res) {\n    res.send(req.user);\n  }\n);\n\n// router.get('/google/callback', passport.authenticate('google-token'), function(\n//   req,\n//   res\n// ) {\n//   // res.redirect('/');\n// });\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./routes/auth.js?");

/***/ }),

/***/ "./routes/farming.js":
/*!***************************!*\
  !*** ./routes/farming.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst moment = __webpack_require__(/*! moment */ \"moment\");\n\nconst { UserModel, PlayerModel, FieldModel } = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\nrouter.put('/:id', async (req, res, next) => {\n  try {\n    const farmingPropertyId = req.params.id;\n\n    const farmingProperty = await FieldModel.findById(farmingPropertyId)\n      .populate('product')\n      .exec();\n\n    const harvestTime = new Date(farmingProperty.harvest).getTime();\n    const nextHarvestTime = harvestTime + farmingProperty.product.time;\n    const currentTime = new Date().getTime();\n\n    if (nextHarvestTime > currentTime) {\n      const remainTime = moment(nextHarvestTime).from(moment(currentTime));\n      return res.status(403).json({\n        message: `Урожай не созрел, нужно подождать, ${remainTime}`\n      });\n    }\n\n    await FieldModel.findByIdAndUpdate(farmingPropertyId, {\n      $currentDate: { harvest: { $type: 'date' } }\n    });\n\n    await PlayerModel.findOneAndUpdate(\n      { userId: req.user.id },\n      {\n        $inc: {\n          [farmingProperty.product.type]: 1,\n          experience: farmingProperty.product.experience\n        }\n      }\n    ).exec();\n\n    return res.json({\n      message: `Урожай ${\n        farmingProperty.product.name\n      } в размере 1, собран! Вы заработали ${\n        farmingProperty.product.experience\n      } единиц опыта!`\n    });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./routes/farming.js?");

/***/ }),

/***/ "./routes/index.js":
/*!*************************!*\
  !*** ./routes/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var express = __webpack_require__(/*! express */ \"express\");\nvar router = express.Router();\n\n/**\n * @swagger\n * /:\n *    get:\n *      tags: [ \"Index\" ]\n *      description: This should return only message\n */\nrouter.get('/', function(req, res, next) {\n  res.json({ message: 'user' });\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./routes/index.js?");

/***/ }),

/***/ "./routes/manufacture.js":
/*!*******************************!*\
  !*** ./routes/manufacture.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst moment = __webpack_require__(/*! moment */ \"moment\");\n\nconst {\n  ManufactureModel,\n  FactoryDictionaryModel,\n  ProductionLineDictionaryModel,\n  PlayerModel,\n  FactoryModel\n} = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\nrouter.get('/', async (req, res, next) => {\n  try {\n    const manufacture = await ManufactureModel.findOne({\n      userId: req.user._id\n    })\n      .populate({\n        path: 'feed',\n        populate: {\n          path: 'factory',\n          populate: {\n            path: 'lines',\n            populate: {\n              path: 'materials.product',\n              model: 'ProductDictionary'\n            }\n          }\n        }\n      })\n      .exec();\n\n    return res.json({\n      data: manufacture,\n      meta: null\n    });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.get('/:factoryId', async (req, res, next) => {\n  try {\n    const factoryPropertyId = req.params.factoryId;\n    const factory = await FactoryDictionaryModel.findById(factoryPropertyId)\n      .populate({\n        path: 'lines',\n        populate: {\n          path: 'materials.product',\n          model: 'ProductDictionary'\n        }\n      })\n      .exec();\n\n    return res.json({\n      data: factory,\n      meta: null\n    });\n  } catch (e) {\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.put('/', async (req, res, next) => {\n  try {\n    const userId = req.user._id;\n    const { userFactoryId, lineId } = req.body;\n\n    const resources = await PlayerModel.findOne({ userId }).exec();\n    const productionLine = await ProductionLineDictionaryModel.findById(lineId)\n      .populate({ path: 'materials.product', select: 'name type time' })\n      .exec();\n\n    let factory = await FactoryModel.findById(userFactoryId).exec();\n    if (factory.isBusy) {\n      return res.status(400).json({\n        message: `Нельзя запускать фабрику, пока выполняется предыдущий заказ`\n      });\n    }\n\n    const materials = productionLine.materials;\n    const materialsLength = materials.length;\n    const resource = {};\n    for (let i = 0; i < materialsLength; i++) {\n      const material = materials[i];\n      if (!resources[material.product.type]) {\n        return res\n          .status(400)\n          .json({ message: `Недостаточно ${material.product.name}` });\n        break;\n      }\n\n      if (resources[material.product.type] - material.count < 0) {\n        return res\n          .status(400)\n          .json({ message: `Недостаточно ${material.product.name}` });\n        break;\n      }\n\n      resource[material.product.type] = -material.count;\n    }\n\n    await PlayerModel.findOneAndUpdate({ userId }, { $inc: resource }).exec();\n    await FactoryModel.findByIdAndUpdate(userFactoryId, {\n      $set: {\n        isBusy: true,\n        produced: new Date(Date.now() + productionLine.time).toISOString(),\n        selectedLine: lineId\n      }\n    }).exec();\n\n    return res.json({ message: 'Производство запущенно!' });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.put('/produced', async (req, res, next) => {\n  try {\n    const userId = req.user._id;\n    const { userFactoryId, lineId } = req.body;\n\n    const factory = await FactoryModel.findById(userFactoryId).exec();\n\n    if (!factory.isBusy) {\n      return res.status(400).json({ message: 'Фабрика ничего не производит' });\n    }\n\n    const producedMs = new Date(factory.produced).getTime();\n    const currentMs = new Date().getTime();\n\n    if (producedMs > currentMs) {\n      const remainTime = moment(producedMs).from(moment(currentMs));\n      return res.status(400).json({\n        message: `Товар еще не произведен, нужно подождать, ${remainTime}`\n      });\n    }\n\n    const productionLine = await ProductionLineDictionaryModel.findById(lineId)\n      .populate({ path: 'produced.product', select: 'name type time' })\n      .exec();\n    const { count, product } = productionLine.produced;\n\n    await PlayerModel.findOneAndUpdate(\n      { userId },\n      {\n        $inc: {\n          [product.type]: count,\n          experience: productionLine.experience\n        }\n      }\n    ).exec();\n\n    await FactoryModel.findByIdAndUpdate(userFactoryId, {\n      $set: {\n        isBusy: false,\n        selectedLine: null\n      },\n      $currentDate: { produced: { $type: 'date' } }\n    }).exec();\n\n    return res.json({ message: 'Товар успешно произведен!' });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./routes/manufacture.js?");

/***/ }),

/***/ "./routes/user.js":
/*!************************!*\
  !*** ./routes/user.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var express = __webpack_require__(/*! express */ \"express\");\nvar router = express.Router();\n\nconst {\n  UserModel,\n  PlayerModel,\n  FarmingModel,\n  FieldModel,\n  FactoryModel,\n  ManufactureModel,\n  ProductDictionaryModel,\n  AnimalHusbandryModel,\n  AnimalHusbandryBuildingModel,\n  AnimalModel,\n  HusbandryDictionaryModel,\n  LevelDictionaryModel,\n  HouseKeepingModel,\n  HouseModel,\n  HouseDictionaryModel\n} = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\nconst whiteFields = __webpack_require__(/*! ../util/whitefield */ \"./util/whitefield.js\");\n\n/**\n * @swagger\n * /user:\n *    get:\n *      tags: [ \"Users\" ]\n *      description: \"This should generated or get all info about user include: \\n\n *        resources with level, \\n\n *        manufactures with feed, \\n\n *        agricultures with wheat and with product \\n\n *        animalFactories with cowsheds and with animalHusbandryBuilding \\n\n *        houseKeeping with houses\"\n *        \n */\nrouter.get('/', async (req, res, next) => {\n  try {\n    const commonUserInfo = await UserModel.findById(req.user._id)\n      .populate({ path: 'resources', populate: { path: 'level' } })\n      .populate({\n        path: 'manufactures',\n        populate: {\n          path: 'feed'\n        }\n      })\n      .populate({\n        path: 'agricultures',\n        populate: {\n          path: 'wheat',\n          populate: {\n            path: 'product'\n          }\n        }\n      })\n      .populate({\n        path: 'animalFactories',\n        populate: {\n          path: 'cowsheds',\n          populate: {\n            path: 'animalHusbandryBuilding'\n          }\n        }\n      })\n      .populate({\n        path: 'houseKeeping',\n        populate: {\n          path: 'houses'\n        }\n      })\n      .select('resources agricultures')\n      .exec();\n\n    if (!commonUserInfo.resources) {\n      let playerStatistics = await new PlayerModel({\n        userId: req.user._id,\n        level: '5d10795556b4a12e1dfbd642'\n      }).save();\n\n      playerStatistics = await PlayerModel.findById(playerStatistics._id)\n        .populate('level')\n        .exec();\n\n      commonUserInfo.resources = playerStatistics;\n    }\n\n    if (!commonUserInfo.agricultures) {\n      const wheatDict = await ProductDictionaryModel.findById(\n        '5d06ac6f8d82b625736035c1'\n      ).exec();\n      const agricultures = await new FarmingModel({\n        userId: req.user._id\n      }).save();\n      const wheatUser = await new FieldModel({\n        product: wheatDict._id,\n        farmingId: agricultures.wheatId\n      }).save();\n\n      wheatUser.product = wheatDict;\n      agricultures.wheat = [wheatUser];\n      commonUserInfo.agricultures = agricultures;\n    }\n\n    if (!commonUserInfo.manufactures) {\n      const manufactures = await new ManufactureModel({\n        userId: req.user._id\n      }).save();\n\n      const factory = await new FactoryModel({\n        manufactureId: manufactures.feedFactoryId,\n        factory: '5d07ef5757a05507c6bd2c12',\n        userId: req.user._id\n      }).save();\n\n      manufactures.feed = [factory];\n      commonUserInfo.manufactures = manufactures;\n    }\n\n    if (!commonUserInfo.animalFactories) {\n      const animalHusbandry = await new AnimalHusbandryModel({\n        userId: req.user._id\n      }).save();\n\n      const husbandryBuilding = await new AnimalHusbandryBuildingModel({\n        userId: req.user._id,\n        animalHusbandryId: animalHusbandry.cowshedId,\n        animalHusbandryBuilding: '5d07ef5757a44407c6bd2c12'\n      }).save();\n\n      const husbandryBuildingDict = await HusbandryDictionaryModel.findById(\n        '5d07ef5757a44407c6bd2c12'\n      ).exec();\n\n      const length = husbandryBuildingDict.defaultAnimalsCount;\n      const animals = [];\n      for (let i = 0; i < length; i++) {\n        animals.push(\n          await new AnimalModel({\n            animal: '5d07ef5757a33507c6bd2c12',\n            husbandryBuildingId: husbandryBuilding._id\n          }).save()\n        );\n      }\n\n      husbandryBuilding.animals = [animals];\n      animalHusbandry.cowsheds = [husbandryBuilding];\n      commonUserInfo.animalFactories = animalHusbandry;\n    }\n\n    if (!commonUserInfo.houseKeeping) {\n      const houseKeeping = await new HouseKeepingModel({\n        userId: req.user._id\n      }).save();\n\n      const houseDict = await HouseDictionaryModel.findById(\n        '5d07ef5757a44407c6bd2c12'\n      ).exec();\n\n      const house = await new HouseModel({\n        house: houseDict._id,\n        houseKeepingId: houseKeeping._id\n      }).save();\n\n      await PlayerModel.findByIdAndUpdate(playerStatistics._id, {\n        $inc: { population: house.population }\n      }).exec();\n\n      houseKeeping.houses = [house];\n      commonUserInfo.houseKeeping = houseKeeping;\n    }\n\n    return res.json({\n      data: commonUserInfo,\n      meta: null\n    });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nrouter.get('/level', async (req, res, next) => {\n  try {\n    const userId = req.user._id;\n    let player = await PlayerModel.findOne({\n      userId\n    })\n      .populate('level')\n      .exec();\n\n    const { level } = player.level;\n    const upLevelDict = await LevelDictionaryModel.findOne({\n      level: level + 1\n    }).exec();\n\n    if (player.experience < upLevelDict.experience) {\n      return res.json({ data: null });\n    }\n\n    const resources = {};\n    const bonus = upLevelDict.bonus;\n    for (const key in bonus) {\n      if (\n        bonus.hasOwnProperty(key) &&\n        whiteFields.includes(key) &&\n        bonus[key]\n      ) {\n        resources[key] = bonus[key];\n      }\n    }\n\n    await PlayerModel.findByIdAndUpdate(player._id, {\n      $inc: {\n        ...resources\n      },\n      $set: {\n        level: upLevelDict._id\n      }\n    }).exec();\n\n    player = await PlayerModel.findById(player._id)\n      .populate('level')\n      .exec();\n\n    return res.json({\n      data: player,\n      meta: null\n    });\n  } catch (e) {\n    console.log(e);\n    return res.status(500).json({ message: 'Что-то пошло не так =(' });\n  }\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./routes/user.js?");

/***/ }),

/***/ "./swagger.js":
/*!********************!*\
  !*** ./swagger.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const swaggerJsdoc = __webpack_require__(/*! swagger-jsdoc */ \"swagger-jsdoc\");\n\nconst options = {\n  swaggerDefinition: {\n    // Like the one described here: https://swagger.io/specification/#infoObject\n    info: {\n      title: 'Test API',\n      version: '1.0.0',\n      description: 'Test Express API with autogenerated swagger doc'\n    }\n  },\n  host: 'localhost:3000',\n  basePath: '/api/v1',\n  apis: ['./routes/*.js']\n};\n\nmodule.exports = swaggerJsdoc(options);\n\n\n//# sourceURL=webpack:///./swagger.js?");

/***/ }),

/***/ "./util/encryption.js":
/*!****************************!*\
  !*** ./util/encryption.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nconst generateSalt = () => {\n  return crypto.randomBytes(128).toString('base64');\n};\n\nconst generateHashedPassword = (salt, password) => {\n  return crypto\n    .createHmac('sha256', salt)\n    .update(password)\n    .digest('hex');\n};\n\nmodule.exports = {\n\tgenerateSalt,\n\tgenerateHashedPassword\n};\n\n\n//# sourceURL=webpack:///./util/encryption.js?");

/***/ }),

/***/ "./util/initDictionaries.js":
/*!**********************************!*\
  !*** ./util/initDictionaries.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {\n  ProductDictionaryModel,\n  FactoryDictionaryModel,\n  ProductionLineDictionaryModel,\n  AnimalDictionaryModel,\n  HusbandryDictionaryModel,\n  LevelDictionaryModel,\n  HouseDictionaryModel\n} = __webpack_require__(/*! ../db/db.module */ \"./db/db.module.js\");\n\nconst products = __webpack_require__(/*! ../mocks/dictionaries/products */ \"./mocks/dictionaries/products.js\");\nconst factories = __webpack_require__(/*! ../mocks/dictionaries/factories */ \"./mocks/dictionaries/factories.js\");\nconst productionLines = __webpack_require__(/*! ../mocks/dictionaries/productionLines */ \"./mocks/dictionaries/productionLines.js\");\nconst animals = __webpack_require__(/*! ../mocks/dictionaries/animals */ \"./mocks/dictionaries/animals.js\");\nconst husbandry = __webpack_require__(/*! ../mocks/dictionaries/husbandry */ \"./mocks/dictionaries/husbandry.js\");\nconst levels = __webpack_require__(/*! ../mocks/dictionaries/levels */ \"./mocks/dictionaries/levels.js\");\nconst houses = __webpack_require__(/*! ../mocks/dictionaries/houses */ \"./mocks/dictionaries/houses.js\");\n\nconst initDictionaries = async () => {\n  await ProductDictionaryModel.deleteMany();\n  await FactoryDictionaryModel.deleteMany();\n  await ProductionLineDictionaryModel.deleteMany();\n  await AnimalDictionaryModel.deleteMany();\n  await HusbandryDictionaryModel.deleteMany();\n  await LevelDictionaryModel.deleteMany();\n  await HouseDictionaryModel.deleteMany();\n\n  products.forEach(\n    async product => await new ProductDictionaryModel(product).save()\n  );\n  factories.forEach(\n    async factory => await new FactoryDictionaryModel(factory).save()\n  );\n  productionLines.forEach(\n    async productionLine =>\n      await new ProductionLineDictionaryModel(productionLine).save()\n  );\n  animals.forEach(\n    async animal => await new AnimalDictionaryModel(animal).save()\n  );\n  husbandry.forEach(\n    async itemHusbandry =>\n      await new HusbandryDictionaryModel(itemHusbandry).save()\n  );\n  levels.forEach(async level => await new LevelDictionaryModel(level).save());\n  houses.forEach(async house => await new HouseDictionaryModel(house).save());\n};\n\nmodule.exports = initDictionaries;\n\n\n//# sourceURL=webpack:///./util/initDictionaries.js?");

/***/ }),

/***/ "./util/whitefield.js":
/*!****************************!*\
  !*** ./util/whitefield.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const whiteFields = [\n\t'coins', 'cash', 'wheat'\n];\n\nmodule.exports = whiteFields;\n\n\n//# sourceURL=webpack:///./util/whitefield.js?");

/***/ }),

/***/ "./validationSchemas/schemas/dish.validation.js":
/*!******************************************************!*\
  !*** ./validationSchemas/schemas/dish.validation.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  name: 'dishSchema',\n  properties: {\n    time: [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Должно быть указано время приготовления в миллисекундах'\n      }\n    ],\n    title: [\n      {\n        type: 'length',\n        constraints: [3, 30],\n        message: 'Должно быть длинной от 3 до 30'\n      }\n    ],\n    authorId: [\n      {\n        type: 'isMongoId',\n        constraints: [],\n        message: 'У блюда должен быть автор'\n      }\n    ],\n    coverImgUrl: [\n      {\n        type: 'isString',\n        constraints: [],\n        message: 'У блюда должна быть обложка'\n      }\n    ],\n    photos: [\n      {\n        type: 'isArray',\n        constraints: [],\n        message: 'Должен быть список фотографий'\n      },\n      {\n        type: 'arrayNotEmpty',\n        constraints: [],\n        message: 'Необходимо добавить больше фотографий'\n      },\n      {\n        type: 'arrayMinSize',\n        constraints: [3],\n        message: 'Фотографий должно быть не меньше 3х'\n      }\n    ],\n    videoUrl: [\n      {\n        type: 'isString',\n        constraints: [],\n        message: 'У блюда должна быть видео-обложка'\n      }\n    ],\n    complexity: [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'У блюда должна быть обложка'\n      },\n      {\n        type: 'min',\n        constraints: [0],\n        message: 'Сложность не может быть меньше 1'\n      },\n      ,\n      {\n        type: 'max',\n        constraints: [11],\n        message: 'Сложность не может быть больше 10'\n      }\n    ],\n    recipe: [\n      {\n        type: 'isString',\n        constraints: [],\n        message: 'Блюдо должно содержать рецепт приготовления'\n      }\n    ],\n    ingredients: [\n      {\n        type: 'isArray',\n        constraints: [],\n        message: 'Должен быть список ингредиентов'\n      }\n    ],\n    description: [\n      {\n        type: 'isString',\n        constraints: [],\n        message: 'Краткое описание блюда'\n      }\n    ],\n    price: [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Примерная цена продуктов для приготовления 1 порции'\n      }\n    ],\n    minutes: [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Должно быть указано время приготовления в минутах'\n      }\n    ]\n  }\n};\n\n\n//# sourceURL=webpack:///./validationSchemas/schemas/dish.validation.js?");

/***/ }),

/***/ "./validationSchemas/schemas/ingredient.validation.js":
/*!************************************************************!*\
  !*** ./validationSchemas/schemas/ingredient.validation.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  name: 'ingredientSchema',\n  properties: {\n    title: [\n      {\n        type: 'isString',\n        constraints: [],\n        message: 'У ингредиента должно быть название'\n      }\n    ],\n    coverImgUrl: [\n      {\n        type: 'isString',\n        constraints: [],\n        message: 'У ингредиента должна быть обложка'\n      }\n    ],\n    category: [\n      {\n        type: 'isMongoId',\n        constraints: [],\n        message: 'Не указана категория продукта'\n      }\n    ],\n    calories: [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Не указано количество калорий'\n      }\n    ],\n    'nutrients.carbohydrates': [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Не указано количество углеводов'\n      }\n    ],\n    'nutrients.fats': [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Не указано количество жиров'\n      }\n    ],\n    'nutrients.protein': [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Не указано количество белков'\n      }\n    ],\n    'nutrients.water': [\n      {\n        type: 'isNumber',\n        constraints: [],\n        message: 'Не указано количество воды'\n      }\n    ]\n  }\n};\n\n\n//# sourceURL=webpack:///./validationSchemas/schemas/ingredient.validation.js?");

/***/ }),

/***/ "./validationSchemas/schemas/user.validation.js":
/*!******************************************************!*\
  !*** ./validationSchemas/schemas/user.validation.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  name: 'userLocalSchema',\n  properties: {\n    username: [\n      {\n        type: 'isEmail',\n        constraints: [],\n        message: 'Должно быть почтой'\n      }\n    ],\n    password: [\n      {\n        type: 'length',\n        constraints: [6, 20],\n        message: 'Должно быть длинной от 6 до 20'\n      },\n      {\n        type: 'isAlphanumeric',\n        constraints: [],\n        message: 'Пароль должен содержать буквы и цифры'\n      }\n    ]\n  }\n};\n\n\n//# sourceURL=webpack:///./validationSchemas/schemas/user.validation.js?");

/***/ }),

/***/ "./validationSchemas/validation.module.js":
/*!************************************************!*\
  !*** ./validationSchemas/validation.module.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const classValidator = __webpack_require__(/*! class-validator */ \"class-validator\");\nconst { registerSchema } = classValidator;\n\nconst UserValidationSchema = __webpack_require__(/*! ./schemas/user.validation */ \"./validationSchemas/schemas/user.validation.js\");\nconst DishValidationSchema = __webpack_require__(/*! ./schemas/dish.validation */ \"./validationSchemas/schemas/dish.validation.js\");\nconst IngredientValidationSchema = __webpack_require__(/*! ./schemas/ingredient.validation */ \"./validationSchemas/schemas/ingredient.validation.js\");\n\nregisterSchema(UserValidationSchema);\nregisterSchema(DishValidationSchema);\nregisterSchema(IngredientValidationSchema);\n\n\n//# sourceURL=webpack:///./validationSchemas/validation.module.js?");

/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi webpack/hot/poll?100 ./bin/www.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?100 */\"./node_modules/webpack/hot/poll.js?100\");\nmodule.exports = __webpack_require__(/*! ./bin/www.js */\"./bin/www.js\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"class-validator\");\n\n//# sourceURL=webpack:///external_%22class-validator%22?");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"compression\");\n\n//# sourceURL=webpack:///external_%22compression%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"debug\");\n\n//# sourceURL=webpack:///external_%22debug%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"moment\");\n\n//# sourceURL=webpack:///external_%22moment%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport\");\n\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ }),

/***/ "passport-google-token":
/*!****************************************!*\
  !*** external "passport-google-token" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-google-token\");\n\n//# sourceURL=webpack:///external_%22passport-google-token%22?");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-jwt\");\n\n//# sourceURL=webpack:///external_%22passport-jwt%22?");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-local\");\n\n//# sourceURL=webpack:///external_%22passport-local%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "swagger-jsdoc":
/*!********************************!*\
  !*** external "swagger-jsdoc" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"swagger-jsdoc\");\n\n//# sourceURL=webpack:///external_%22swagger-jsdoc%22?");

/***/ }),

/***/ "swagger-ui-express":
/*!*************************************!*\
  !*** external "swagger-ui-express" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"swagger-ui-express\");\n\n//# sourceURL=webpack:///external_%22swagger-ui-express%22?");

/***/ })

/******/ });