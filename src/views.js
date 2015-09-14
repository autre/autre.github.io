/* global define */

define(['React'], function(React) {
    'use strict';

    var elem = React.createElement,
        create = React.createClass,
        dom = React.DOM;

    var Song = create({
        displayName: 'Song',
        render: function() {
            return dom.li(null, this.props.name);
        }
    });

    var Playlist = create({
        displayName: 'Playlist',
        render: function() {
            var songs = this.props.songs.map(function(name, idx) {
                return elem(Song, { key: idx, idx: idx, name: name });
            });

            return dom.ul({ id: 'playlist' }, songs);
        }
    });

    var PlayerView = create({
        displayName: 'PlayerView',
        render: function() {
            return dom.div(null,
                dom.p(null, 'wip - migrating to github'),
                elem(Playlist, { songs: this.props.app.get_songs() })
            );
        }
    });

    return {
        PlayerView: PlayerView
    };
});
