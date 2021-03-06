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

var TabbedArea = TabbedArea || function () {
    var Container = React.createClass({displayName: 'Container',
        clickHandler: function (event) {
            var tab_id = event.target.dataset['tab_id'];
            localStorage['tabbed_area_' + this.props.id] = tab_id;
            this.setState({selected: tab_id});
            event.preventDefault();
        },

        getInitialState: function () {
            var selected = localStorage['tabbed_area_' + this.props.id];
            if (!selected) {
                selected = this.props.children[0].props.id;
            }
            return {selected: selected};
        },
        render: function () {
            var options = [];
            var selected = null;
            for (var i = 0; i < this.props.children.length; i++) {
                var child = this.props.children[i];
                options.push(
                    React.DOM.li(null, 
                        React.DOM.a(
                            {href:"#",
                            onClick:this.clickHandler,
                            'data-tab_id':child.props.id}
                        , 
                            child.props.label
                        )
                    )
                );
                if (child.props.id === this.state.selected) {
                    selected = child;
                }
            }

            return (
                React.DOM.div( {className:"tabbed_area"}, 
                    React.DOM.ul( {className:"tabbed_area_selector"}, options),
                    selected
                )
            );
        }
    });

    var Tab = React.createClass({displayName: 'Tab',
        render: function () {
            return (
                React.DOM.div( {className:"tabbed_area_tab"}, 
                    React.DOM.h2(null, this.props.label),
                    this.props.children
                )
            );
        }
    });

    return {Container: Container, Tab: Tab};
}();
