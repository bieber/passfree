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

// [new|save|open|close]DB all accept success and failure callbacks.
// The success callback takes no arguments, the failure callback will
// be passed a status message.
function newDB(passwords, success, failure) {
    var masterPassword = passwords.master_password;
    var confirmPassword = passwords.confirm;
    if (masterPassword !== confirmPassword) {
        failure("Passwords must match.");
        return;
    }

    encData = CryptoJS.kdf.OpenSSL.execute(
        masterPassword,
        CryptoJS.algo.AES.keySize,
        CryptoJS.algo.AES.ivSize
    );
    db = {};
    db[STORAGE_PASSWORDS] = {};
    db[STORAGE_SETTINGS] = {};
    saveDB(success, failure);
}
