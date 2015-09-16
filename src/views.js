/* global define */

define(['React'], function(React) {
    'use strict';

    var elem = React.createElement,
        create = React.createClass,
        dom = React.DOM;

    // low level stuff
    var ClickableListEment = create({
        displayName: 'ClickableListEment',
        render: function() {
            return dom.li({ onClick: this.props.on_click }, this.props.value);
        }
    });

    var UnorderedList = create({
        displayName: 'UnorderedList',
        render: function() {
            return dom.ul(null, this.props.elems);
        }
    });

    // app stuff
    var Song = create({
        displayName: 'Song',
        on_click: function(e) {
            this.props.on_click(this.props.idx);
        },
        render: function() {
            return elem(ClickableListEment, { value: this.props.name, on_click: this.on_click });
        }
    });

    var Playlist = create({
        displayName: 'Playlist',
        clicked_song: function(idx) {
            this.props.has_selected_song(idx);
        },
        render: function() {
            var self = this;
            var songs = this.props.songs.map(function(name, idx) {
                return elem(Song, { key: idx, idx: idx, name: name, on_click: self.clicked_song });
            });

            return elem(UnorderedList, { elems: songs });
        }
    });

    var PlayerView = create({
        displayName: 'PlayerView',
        render: function() {
            var app = this.props.app;

            return dom.div(null,
                dom.p(null, 'wip - migrating to github'),
                elem(Playlist, { songs: app.get_songs(), has_selected_song: app.has_selected_song.bind(app) })
            );
        }
    });

    return {
        PlayerView: PlayerView
    };
});
