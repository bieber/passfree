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

var Transceiver = Transceiver || function() {
    var onMessageListener = function (message) {
        if (message.event in this) {
            this[message.event].forEach(function (listener, i, listeners) {
                listener(message.data);
            });
        }
    };
    var addListener = function (event, listener) {
        if (event in this) {
            this[event].push(listener);
        } else {
            this[event] = [listener];
        }
    }

    return {
        Server: function() {
            return function () {
                var ports = [];
                var listeners = {};
                var intercepts = {};
                var counter = 0;

                chrome.runtime.onConnect.addListener(function (port) {
                    ports[counter] = port;
                    port.onMessage.addListener(
                        onMessageListener.bind(listeners)
                    );
                    port.onDisconnect.addListener(function (index) {
                        delete ports[index];
                    }.bind(null, counter));
                    counter++;
                });

                var addIntercept = function (event, intercept) {
                    if (event in intercepts) {
                        intercepts[event].push(intercept);
                    } else {
                        intercepts[event] = [intercept];
                    }
                };

                var sendEvent = function (event, data) {
                    ports.forEach(function(port, i, ports) {
                        port.postMessage({event: event, data: data});
                    });
                    if (event in intercepts) {
                        intercepts[event].forEach(
                            function(intercept, i, intercepts) {
                                intercept(data);
                            }
                        );
                    }
                };

                return {
                    addListener: addListener.bind(listeners),
                    addIntercept: addIntercept,
                    sendEvent: sendEvent
                };
            }();
        },
        Client: function () {
            return function () {
                var listeners = {};
                var port = chrome.runtime.connect();

                port.onMessage.addListener(onMessageListener.bind(listeners));

                var sendEvent = function (event, data) {
                    port.postMessage({event: event, data: data});
                }

                return {
                    addListener: addListener.bind(listeners),
                    sendEvent: sendEvent
                };
            }();
        }
    };
}();
