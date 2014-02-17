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

var Settings = Settings || function () {
    var module = {
        get: function (setting) {
            return new Promise(function(resolve, reject) {
                switch (setting) {
                case 'storage_method':
                    resolve(localStorage[setting]);
                    break;
                default:
                    reject(new Error(setting + ' is not a valid setting'));
                }
            });
        },

        set: function (setting, value) {
            switch(setting) {
            case 'storage_method':
                return DBStorage.setMethod(value);
                break;
            default:
                return Promise.reject(
                    new Error(setting + ' is not a valid setting')
                );
            }
        }
    };
    Object.freeze(module);
    return module;
}();
