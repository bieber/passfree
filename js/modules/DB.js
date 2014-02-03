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

var DB = DB || function () {
    var statuses = {
        OPEN: 'open',
        CLOSED: 'closed',
        EMPTY: 'empty'
    };
    Object.freeze(statuses);

    var storageKeys = {
        STORAGE_PASSWORDS: 'p',
        STORAGE_SETTINGS: 's'
    };
    Object.freeze(storageKeys);

    var storage = chrome.storage.local;
    var encData = null;
    var db = null;

    var getStorage = function (keys) {
        return new Promise(function (resolve, reject) {
            storage.get(
                keys,
                function (results) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    };

    var setStorage = function (items) {
        return new Promise(function (resolve, reject) {
            storage.set(
                items,
                function () {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                }
            );
        });
    };

    var removeStorage = function (keys) {
        return new Promise(function (resolve, reject) {
            storage.remove(
                keys,
                function () {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                }
            );
        });
    };

    var clearStorage = function () {
        return new Promise(function (resolve, reject) {
            storage.clear(function () {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    };

    var readCipherText = function () {
        return new Promise(function (resolve, reject) {
            getStorage(null).then(function (values) {
                if (0 in values) {
                    resolve(values[0]);
                } else {
                    reject(new Error('No cipher text found'));
                }
            }).catch(function (error) {
                reject(error);
            });
        });
        return getStorage(null).then(function (values) { return values[0]; })
    };

    var writeCipherText = function (cipherText) {
        return setStorage({0: cipherText});
    };

    var saveDB = function () {
        enc = CryptoJS.AES.encrypt(
            JSON.stringify(db),
            encData.key,
            {iv: encData.iv}
        );
        enc.salt = encData.salt;
        return writeCipherText(enc.toString());
    };

    var getStatus = function () {
        return new Promise(function (resolve, reject) {
            if (db === null) {
                readCipherText().then(
                    resolve.bind(null, statuses.CLOSED),
                    resolve.bind(null, statuses.EMPTY)
                );
            } else {
                resolve(statuses.OPEN);
            }
        });
    };

    var newDB = function (passwords) {
        var masterPassword = passwords.master_password;
        var confirmPassword = passwords.confirm;
        if (masterPassword !== confirmPassword) {
            return Promise.reject(new Error('Passwords must match'));
        };

        encData = CryptoJS.kdf.OpenSSL.execute(
            masterPassword,
            CryptoJS.algo.AES.keySize,
            CryptoJS.algo.AES.ivSize
        );
        db = {};
        db[storageKeys.PASSWORDS] = {};
        db[storageKeys.SETTINGS] = {};
        return saveDB();
    };

    var openDB = function (password) {
        return new Promise(function (resolve, reject) {
            readCipherText().then(function (cipherText) {
                var salt = CryptoJS.format.OpenSSL.parse(cipherText).salt;
                encData = CryptoJS.kdf.OpenSSL.execute(
                    password,
                    CryptoJS.algo.AES.keySize,
                    CryptoJS.algo.AES.ivSize,
                    salt
                );
                var clearText = CryptoJS.AES.decrypt(
                    cipherText,
                    encData.key,
                    {iv: encData.iv}
                ).toString(CryptoJS.enc.Utf8);
                if (clearText === '') {
                    encData = null;
                    reject(new Error('Invalid password'));
                } else {
                    db = JSON.parse(clearText);
                    resolve();
                }
            }).catch(reject);
        });
    };

    var closeDB = function () {
        encData = null;
        db = null;
        return Promise.cast(null);
    };

    var module = {
        statuses: statuses,
        getStatus: getStatus,
        newDB: newDB,
        openDB: openDB,
        closeDB: closeDB
    };
    Object.freeze(module);
    return module;
}();
