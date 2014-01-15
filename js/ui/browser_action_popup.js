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

function filterForms(newForm, openForm, closeForm, deleteForm, status) {
    [newForm, openForm, closeForm].forEach(domHide);
    switch (status) {
    case STATUS_OPEN:
        domShow(closeForm);
        break;
    case STATUS_CLOSED:
        domShow(openForm);
        break;
    case STATUS_EMPTY:
        domShow(newForm);
        break;
    }
}

function setStatusMessage(message) {
    this.innerText = message.text;
}

function submitOverPort(port, event) {
    var data = {};
    var elements = event.target.elements;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].type !== 'submit') {
            data[elements[i].name] = elements[i].value;
        }
    }
    port.postMessage(data);
    event.preventDefault();
}

var newForm = document.getElementById('new_form');
var openForm = document.getElementById('open_form');
var closeForm = document.getElementById('close_form');
var deleteForm = document.getElementById('delete_form');

var statusPort = chrome.runtime.connect({name: PORT_STATUS});
statusPort.onMessage.addListener(
    filterForms.bind(null, newForm, openForm, closeForm, deleteForm)
);
statusPort.postMessage(true);

var statusMessageP = document.getElementById('status_message');
var statusMessagePort = chrome.runtime.connect({name: PORT_STATUS_MESSAGE});
statusMessagePort.onMessage.addListener(setStatusMessage.bind(statusMessageP));

var newSubmissionPort = chrome.runtime.connect({name: PORT_NEW_SUBMISSION});
newForm.addEventListener(
    "submit",
    submitOverPort.bind(null, newSubmissionPort)
);
