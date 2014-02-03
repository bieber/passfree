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

// Icon URIs.
var ICONS_UNLOCKED = {19: 'img/unlock_19.png', 38: 'img/unlock_38.png'};
var ICONS_LOCKED = {19: 'img/lock_19.png', 38: 'img/lock_38.png'};

// Context menu IDs.
var ROOT_MENU_ID = 'root';

// Database status constants.
var STATUS_OPEN = 'open';
var STATUS_CLOSED = 'closed';
var STATUS_EMPTY = 'empty';

// Object keys for storage.  Using short keys to save space.
var STORAGE_PASSWORDS = 'p';
var STORAGE_SETTINGS = 's';
