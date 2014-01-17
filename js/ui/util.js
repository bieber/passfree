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

function addClass(elem, className) {
    if (!elem.className) {
        elem.className = className;
        return;
    }
    var classes = elem.className.split(' ');
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] === className) {
            break;
        }
    }
    if (i === classes.length) {
        elem.className += ' ' + className;
    }
}

function removeClass(elem, className) {
    if (!elem.className) {
        return;
    }
    var classes = elem.className.split(' ');
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] === className) {
            classes.splice(i, 1);
            break;
        }
    }
    elem.className = classes.join(' ');
}

function domShow(elem) {
    removeClass(elem, 'hidden');
}

function domHide(elem) {
    addClass(elem, 'hidden');
}
