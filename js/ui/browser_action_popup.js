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

var client = Transceiver.Client();

function filterForms(
    newForm,
    openForm,
    closeForm,
    statusNode,
    status
) {
    [newForm, openForm, closeForm].forEach(domHide);
    [newForm, openForm].forEach(clearForm);
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
    statusNode.innerText = '';
}

function setStatusMessage(message) {
    this.innerText = message;
}

function clearForm(form) {
    for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i].type === 'password') {
            form.elements[i].value = '';
        }
    }
}

function submitForm(eventType, event) {
    var data = {};
    var elements = event.target.elements;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].type !== 'submit') {
            data[elements[i].name] = elements[i].value;
        }
    }
    client.sendEvent(eventType, data);
    event.preventDefault();
}

var statusMessageP = document.getElementById('status_message');

var newForm = document.getElementById('new_form');
var openForm = document.getElementById('open_form');
var closeForm = document.getElementById('close_form');
newForm.addEventListener(
    'submit',
    submitForm.bind(null, 'new_db')
);
openForm.addEventListener(
    'submit',
    submitForm.bind(null, 'open_db')
);
closeForm.addEventListener(
    'submit',
    submitForm.bind(null, 'close_db')
);

client.addListener(
    'status_message',
    function (message) { statusMessageP.innerText = message; }
);
client.addListener(
    'status',
    filterForms.bind(
        null,
        newForm,
        openForm,
        closeForm,
        statusMessageP
    )
);
client.sendEvent('status', null);
