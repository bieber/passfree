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

eventServer.addListener(
    'status',
    getStatus.bind(null, eventServer.sendEvent.bind(eventServer, 'status'))
);
eventServer.addListener(
    'new_db',
    function (data) {
        newDB(
            data,
            eventServer.sendEvent.bind(eventServer, 'status', STATUS_OPEN),
            eventServer.sendEvent.bind(eventServer, 'status_message')
        );
    }
);
eventServer.addListener(
    'open_db',
    function (data) {
        openDB(
            data.master_password,
            eventServer.sendEvent.bind(eventServer, 'status', STATUS_OPEN),
            eventServer.sendEvent.bind(eventServer, 'status_message')
        );
    }
);
eventServer.addListener(
    'close_db',
    closeDB.bind(
        null,
        eventServer.sendEvent.bind(eventServer, 'status', STATUS_CLOSED),
        eventServer.sendEvent.bind(eventServer, 'status_message')
    )
);

eventServer.addIntercept(
    'status',
    function(status) {
        var icons = ICONS_LOCKED;
        if (status === STATUS_OPEN) {
            icons = ICONS_UNLOCKED;
        }
        chrome.browserAction.setIcon({path: icons});
    }
);
