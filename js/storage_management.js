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

function getStatus(responseCallback) {
    wrappedCallback = function (status) {
        setBrowserActionIcons(status);
        responseCallback(status);
    };
    if (db === null) {
        storage.get(
            '0',
            function (result) {
                if (typeof result === 'object' && '0' in result) {
                    wrappedCallback(STATUS_CLOSED);
                } else {
                    wrappedCallback(STATUS_EMPTY);
                }
            }
        );
    } else {
        responseCallback(STATUS_OPEN);
    }
}

// [new|save|open|close]DB all accept success and failure callbacks.
// The success callback takes no arguments, the failure callback will
// be passed a status message.
function saveDB(success, failure) {
    enc = CryptoJS.AES.encrypt(
        JSON.stringify(db),
        encData.key,
        {iv: encData.iv}
    );
    enc.salt = encData.salt;
    writeCipherText(
        enc.toString(),
        function () {
            if (chrome.runtime.lastError !== undefined) {
                failure(chrome.runtime.lastError);
                return;
            }
            success();
        }
    );
}

function openDB(masterPassword, success, failure, cipherText) {
    if (cipherText === undefined) {
        readCipherText(openDB.bind(null, masterPassword, success, failure));
        return;
    }
    var salt = CryptoJS.format.OpenSSL.parse(cipherText).salt;
    encData = CryptoJS.kdf.OpenSSL.execute(
        masterPassword,
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
        setBrowserActionIcons(STATUS_CLOSED);
        failure('Invalid password.');
    } else {
        db = JSON.parse(clearText);
        setBrowserActionIcons(STATUS_OPEN);
        success();
    }
}

function closeDB(success, failure) {
    encData = null;
    db = null;
    setBrowserActionIcons(STATUS_CLOSED);
    success();
}

function writeCipherText(cipherText, callback) {
    storage.set({0: cipherText}, callback);
}

function readCipherText(callback) {
    storage.get('0', function (data) {callback(data['0']);});
}
