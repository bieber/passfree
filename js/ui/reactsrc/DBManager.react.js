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

var DBManager = DBManager || React.createClass({
    statusHandler: function (status) {
        this.setState({status: status, message: null});
    },
    messageHandler: function (message) {
        this.setState({message: message});
    },
    submitHandler: function (event) {
        var data = {};
        var elements = event.target.elements;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].type !== 'submit') {
                data[elements[i].name] = elements[i].value;
            }
        }

        var submissionType = null;
        switch (this.state.status) {
        case DB.statuses.OPEN:
            submissionType = 'close_db';
            break;
        case DB.statuses.CLOSED:
            submissionType = 'open_db';
            break;
        case DB.statuses.EMPTY:
            submissionType = 'new_db';
            break;
        default:
            event.preventDefault();
            return;
        }

        this.state.client.sendEvent(submissionType, data);
        event.preventDefault();
    },

    getInitialState: function () {
        return {
            status: null,
            message: null,
            client: Transceiver.Client()
        };
    },
    componentDidMount: function () {
        this.state.client.addListener('status', this.statusHandler);
        this.state.client.addListener('status_message', this.messageHandler);
        this.state.client.sendEvent('status', null);
    },
    render: function () {
        var messageLine = null;
        if (this.state.message) {
            messageLine = React.DOM.p(null, this.state.message);
        }

        var form = <span />;
        if (this.state.status) {
            var contents = null;
            switch (this.state.status) {
            case DB.statuses.CLOSED:
                contents = [
                    <label>
                        Password:
                        <input type="password" name="master_password" />
                    </label>,
                    <input type="submit" value="Open Database" />
                ];
                break;
            case DB.statuses.OPEN:
                contents = <input type="submit" value="Close Database" />;
                break;
            case DB.statuses.EMPTY:
                contents = [
                    <label>
                        Password:
                        <input type="password" name="master_password" />
                    </label>,
                    <label>
                        Confirm:
                        <input type="password" name="confirm" />
                    </label>,
                    <input type="submit" value="Open Database" />
                ];
                break;
            }

            form = <form onSubmit={this.submitHandler}>{contents}</form>;
        }

        return <div>{form}{messageLine}</div>;
    }
});
