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

function connectNavigation() {
    var selectedPage = localStorage['options_page'] || 'passwords';

    var divs = {};
    var divList = document.querySelectorAll('div.section');
    for (var i = 0; i < divList.length; i++) {
        var div = divList[i];
        var divName = div.id.split('_')[1];
        divs[divName] = div;
    }

    var showSection = function (section, event) {
        for (var i in divs) {
            domHide(divs[i]);
        }
        domShow(divs[section]);
        if (event) {
            event.preventDefault();
        }
    };
    var links = document.querySelectorAll('#nav_list a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var section = link.id.split('_')[1];
        link.addEventListener('click', showSection.bind(null, section));
    }
}
