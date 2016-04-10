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
            var self = this;

            return function(evt) {
                self.props.on_song_click(idx);
            };
        },
        render: function() {
            var self = this;
            var songs = this.props.playlist
                .map(function(name) { return elem(Song, { name: name }); })
                .map(function(s, idx) {
                    var currently_selected = idx === self.props.current;
                    var is_playing = self.props.is_playing;

                    if (!currently_selected) {
                        return dom.li({ key: idx, onClick: self.on_song_click(idx) }, s);
                    }

                    return dom.li({ className: is_playing ? 'now-playing' : 'paused', key: idx, onClick: self.on_song_click(idx) }, s);
                });

            return dom.ul({ id: 'playlist' }, songs);
        }
    });

    var PlayerView = create({
        displayName: 'PlayerView',
        getInitialState: function() {
            var app = this.props.app;

            return { current: app.current, is_playing: app.is_playing };
        },
        on_song_click: function(idx) {
            var app = this.props.app;

            app.selected_song(idx);
            this.setState({ current: app.current, is_playing: app.is_playing });
        },
        render: function() {
            var app = this.props.app;

            return elem(Playlist, {
                playlist: app.get_playlist(),
                current: this.state.current,
                is_playing: this.state.is_playing,
                on_song_click: this.on_song_click
            });
        }
    });

    return {
        PlayerView: PlayerView
    };
});
