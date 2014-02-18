/** @jsx React.DOM */
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

var Options = Options || function () {
    var Tabs = TabbedArea.Container;
    var Tab = TabbedArea.Tab;

    return React.createClass({
        statusChangeHandler: function (status) {
            this.setState({dbStatus: status});
        },

        getInitialState: function () {
            return {
                client: Transceiver.Client(),
                dbStatus: null
            };
        },
        componentDidMount: function () {
            this.state.client.addListener('status', this.statusChangeHandler);
            this.state.client.sendEvent('status', null);
        },
        render: function () {
            var passwordsTab = this.state.dbStatus === DB.statuses.OPEN ?
                React.DOM.p(null, "Passwords") :
                DBManager(null );
            var passwordTypesTab = this.state.dbStatus === DB.statuses.OPEN ?
                React.DOM.p(null, "Password Types") :
                DBManager(null );

            return (
                Tabs( {id:"options_toplevel"}, 
                    Tab( {id:"passwords", label:"Passwords"}, 
                        passwordsTab
                    ),
                    Tab( {id:"password_types", label:"Password Types"}, 
                        passwordTypesTab
                    ),
                    Tab( {id:"settings", label:"Settings"}, 
                        StorageSettings(null )
                    )
                )
            );
        }
    });
}();
