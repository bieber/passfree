/*
 * Copyright (c) 2014 Robert Bieber
 *
 * This file is part of passfree.
 *
 * passfree is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var DBStorage = DBStorage || function () {
    var methods = {
        LOCAL: 'local',
        SYNC: 'sync'
    };
    Object.freeze(methods);

    function methodIsValid(method) {
        for (var i in methods) {
            if (!methods.hasOwnProperty(i)) {
                continue;
            }
            if (methods[i] === method) {
                return true;
            }
        }
        return false;
    }

    if (!methodIsValid(localStorage['storage_method'])) {
        localStorage['storage_method'] = methods.LOCAL;
    }
    var storage = chrome.storage[localStorage['storage_method']];

    function writeStorage(data) {
        return new Promise(function (resolve, reject) {
            if ('QUOTA_BYTES_PER_ITEM' in storage) {
                var toWrite = {};
                for (var index = 0; data !== ''; index++) {
                    var stringIndex = index.toString(36);
                    var maxSize = storage.QUOTA_BYTES_PER_ITEM
                        - stringIndex.length
                        - 2;
                    var slice = data.substring(0, maxSize);
                    toWrite[stringIndex] = slice;
                    data = data.substring(maxSize);
                }
                storage.clear(function () {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        storage.set(toWrite, function () {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve(null);
                            }
                        });
                    }
                });
            } else {
                storage.clear(function () {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        storage.set(
                            {0:data},
                            function () {
                                if (chrome.runtime.lastError) {
                                    reject(chrome.runtime.lastError);
                                } else {
                                    resolve(null);
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    function readStorage() {
        return new Promise(function (resolve, reject) {
            storage.get(null, function (data) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    var combined = '';
                    for (var index = 0; index.toString(36) in data; index++) {
                        combined += data[index.toString(36)];
                    }
                    resolve(combined);
                }
            });
        });
    }

    function clearStorage(overrideStorage) {
        if (overrideStorage === undefined) {
            overrideStorage = storage;
        }
        return new Promise(function (resolve, reject) {
            overrideStorage.clear(function () {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(null);
                }
            });
        });
    }

    function setMethod(method) {
        return new Promise(function (resolve, reject) {
            if (!(methodIsValid(method))) {
                reject(new Error('Invalid storage method'));
                return;
            }
            if (method === localStorage['storage_method']) {
                resolve(null);
            }

            var oldMethod = localStorage['storage_method'];
            readStorage().then(function (data) {
                localStorage['storage_method'] = method;
                storage = chrome.storage[method];
                writeStorage(data).then(function () {
                    clearStorage(chrome.storage[oldMethod])
                        .then(accept)
                        .catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }

    var module = {
        methods: methods,

        setMethod: setMethod,
        read: readStorage,
        write: writeStorage,
        clear: clearStorage
    };
    Object.freeze(module);
    return module;
}();
