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

chrome.browserAction.onClicked.addListener(
    function (tab) {
        locked = !locked;
        var path = locked ? LOCKED_ICONS : UNLOCKED_ICONS;
        chrome.browserAction.setIcon({path: path});
        console.log(tab);
    }
);

chrome.contextMenus.create({
    title: 'Pass Free',
    id: ROOT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(
    function (info, tab) {
        console.log(info, tab);
    }
);
