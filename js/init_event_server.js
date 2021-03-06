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

var eventServer = Transceiver.Server();

initStatusChangeEvents(eventServer);
initStorageChangeEvents(eventServer);

function initStatusChangeEvents(eventServer) {
    var errorMessageCallback = function (error) {
        eventServer.sendEvent('status_message', error.message);
    }

    eventServer.addListener(
        'status',
        function () {
            DB.getStatus().then(
                eventServer.sendEvent.bind(eventServer, 'status')
            );
        }
    );
    eventServer.addListener(
        'new_db',
        function (data) {
            DB.newDB(data).then(
                eventServer.sendEvent.bind(
                    eventServer,
                    'status',
                    DB.statuses.OPEN
                ),
                errorMessageCallback
            );
        }
    );
    eventServer.addListener(
        'open_db',
        function (data) {
            DB.openDB(data.master_password).then(
                eventServer.sendEvent.bind(
                    eventServer,
                    'status',
                    DB.statuses.OPEN
                ),
                errorMessageCallback
            );
        }
    );
    eventServer.addListener(
        'close_db',
        function (data) {
            DB.closeDB().then(
                eventServer.sendEvent.bind(
                    eventServer,
                    'status',
                    DB.statuses.CLOSED
                ),
                errorMessageCallback
            );
        }
    );

    eventServer.addIntercept(
        'status',
        function(status) {
            var icons = {19: 'img/lock_19.png', 38: 'img/lock_38.png'};
            if (status === DB.statuses.OPEN) {
                icons = {19: 'img/unlock_19.png', 38: 'img/unlock_38.png'};
            }
            chrome.browserAction.setIcon({path: icons});
        }
    );
}

function initStorageChangeEvents(eventServer) {
    eventServer.addListener(
        'storage_method',
        function () {
            DBStorage.getMethod().then(
                eventServer.sendEvent.bind(eventServer, 'storage_method')
            );
        }
    );
    eventServer.addListener(
        'set_storage_method',
        function (data) {
            DBStorage.setMethod(data.method, data.transfer).then(function () {
                eventServer.sendEvent('storage_method', data.method);
                return DB.getStatus();
            }).then(eventServer.sendEvent.bind(eventServer, 'status'));
        }
    );
}
