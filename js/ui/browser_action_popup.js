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

var newForm = document.getElementById('new_form');
var openForm = document.getElementById('open_form');
var closeForm = document.getElementById('close_form');
var deleteForm = document.getElementById('delete_form');
var optionalForms = [newForm, openForm, closeForm];

function filterForms(status) {
    optionalForms.forEach(domHide);
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

var statusPort = chrome.runtime.connect({name: PORT_STATUS});
statusPort.onMessage.addListener(filterForms);
statusPort.postMessage(true);
