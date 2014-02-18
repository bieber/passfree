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

var StorageSettings = StorageSettings || React.createClass({
    storageMethodChanged: function (method) {
        this.setState({method: method});
    },

    initChange: function () {
        this.setState({changeInProgress: true});
    },
    cancelChange: function () {
        this.setState({changeInProgress: false});
    },

    completeWithTransfer: function() {
        var newMethod = this.state.method === DBStorage.methods.LOCAL ?
            DBStorage.methods.SYNC :
            DBStorage.methods.LOCAL;
        this.state.client.sendEvent(
            'set_storage_method',
            {method: newMethod, transfer:true}
        );
        this.setState({changeInProgress: false});
    },
    completeWithoutTransfer: function() {
        var newMethod = this.state.method === DBStorage.methods.LOCAL ?
            DBStorage.methods.SYNC :
            DBStorage.methods.LOCAL;
        this.state.client.sendEvent(
            'set_storage_method',
            {method: newMethod, transfer:false}
        );
        this.setState({changeInProgress: false});
    },

    getInitialState: function () {
        return {
            client: Transceiver.Client(),
            method: null,
            changeInProgress: false
        };
    },

    componentDidMount: function() {
        this.state.client.addListener(
            'storage_method',
            this.storageMethodChanged
        );
        this.state.client.sendEvent('storage_method', null);
    },

    render: function () {
        var control = 'Waiting for storage type...';

        if (this.state.method && this.state.changeInProgress) {
            switch (this.state.method) {
            case DBStorage.methods.LOCAL:
                control = [
                    <p>
                        Do you want to transfer your local password database to
                        sync storage?  If you choose to transfer passwords, any
                        existing passwords synced from other browsers will be
                        deleted.  Your local passwords will also remain on this
                        computer unless you explicitly delete them.
                    </p>
                ];
                break;
            case DBStorage.methods.SYNC:
                control = [
                    <p>
                        Do you want to transfer your synced password database to
                        local storage?  If you choose to transfer passwords, any
                        existing passwords on your local browser will be
                        deleted.  Your synced passwords will also remain in
                        your account unless you explicitly delete them.
                    </p>
                ];
                break;
            }
            control.push(
                <input
                    type="button"
                    value="Transfer Passwords"
                    onClick={this.completeWithTransfer}
                />
            );
            control.push(
                <input
                    type="button"
                    value="Don't Transfer Passwords"
                    onClick={this.completeWithoutTransfer}
                />
            );
            control.push(
                <input
                    type="button"
                    value="Cancel"
                    onClick={this.cancelChange}
                />
            );
        } else if (this.state.method) {
            switch (this.state.method) {
            case DBStorage.methods.LOCAL:
                control = [
                    <p>
                        Passwords are currently stored on your local computer.
                        They will not be visible on any other browser.
                    </p>,
                    <input
                        type="button"
                        value="Switch to Sync Storage"
                        onClick={this.initChange}
                    />
                ];
                break;

            case DBStorage.methods.SYNC:
                control = [
                    <p>
                        Passwords are currently stored in sync storage.  They
                        will be available on any browser connected to your
                        account with PassFree set to sync storage.
                    </p>,
                    <input
                        type="button"
                        value="Switch to Local Storage"
                        onClick={this.initChange}
                    />
                ];
            }
        }

        return (
            <div>
                <h3>Storage Method</h3>
                {control}
            </div>
        );
    }
});
