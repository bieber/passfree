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

function portConnector(port) {
    port.onMessage.addListener(messageHandler);
    port.onDisconnect.addListener(portDisconnector);
    ports[port.name] = port;
}

function portDisconnector(port) {
    if (port.name in ports) {
        delete ports[port.name];
    }
}

function messageHandler(message, port) {
    switch (port.name) {
    case PORT_STATUS:
        getStatus(port.postMessage.bind(port));
        break;
    case PORT_NEW_SUBMISSION:
        console.log(message);
        break;
    }
}

function attemptMessage(portName, message) {
    if (portName in ports) {
        ports[portName].postMessage(message);
        return true;
    }
    return false;
}
