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
    if (db === null) {
        storage.get(
            '0',
            function (result) {
                if (typeof result === 'object' && '0' in result) {
                    responseCallback(STATUS_CLOSED);
                } else {
                    responseCallback(STATUS_EMPTY);
                }
            }
        );
    } else {
        responseCallback(STATUS_OPEN);
    }
}

// TODO: Separate the UI message-sending code from the storage code
function saveDB() {
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
                attemptMessage(PORT_STATUS_MESSAGE, chrome.runtime.lastError);
                return;
            }
            attemptMessage(PORT_STATUS, STATUS_OPEN);
        }
    );
}

function openDB(message, cipherText) {
    console.log(message, cipherText);
    if (cipherText === undefined) {
        readCipherText(openDB.bind(null, message));
        return;
    }
    var masterPassword = message.master_password;
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
        attemptMessage(PORT_STATUS_MESSAGE, 'Invalid Password');
    } else {
        db = JSON.parse(clearText);
        attemptMessage(PORT_STATUS, STATUS_OPEN);
    }
}

function closeDB() {
    encData = null;
    db = null;
    attemptMessage(PORT_STATUS, STATUS_CLOSED);
}

function writeCipherText(cipherText, callback) {
    storage.set({0: cipherText}, callback);
}

function readCipherText(callback) {
    storage.get('0', function (data) {callback(data['0']);});
}
