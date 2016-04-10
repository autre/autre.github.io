/* global define */

define(['React'], function(React) {
    'use strict';

    var elem = React.createElement,
        create = React.createClass,
        dom = React.DOM;

    var Song = create({
        displayName: 'Song',
        render: function() {
            return dom.span(null, this.props.name);
        }
    });

    var Playlist = create({
        displayName: 'PlaylistView',
        on_song_click: function(idx) {
            var app = this.props.app;

            return function(evt) {
                console.log('clicked', idx);
                app.selected_song(idx);
            };
        },
        render: function() {
            var self = this;
            var songs = this.props.app.get_playlist()
                .map(function(name) { return elem(Song, { name: name }); })
                .map(function(s, idx) { return dom.li({ key: idx, onClick: self.on_song_click(idx) }, s); });

            return dom.ul(null, songs);
        }
    });

    var PlayerView = create({
        displayName: 'PlayerView',
        render: function() {
            return elem(Playlist, { app: this.props.app });
        }
    });

    return {
        PlayerView: PlayerView
    };
});
