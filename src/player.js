/* global define */

define([], function() {
    'use strict';

    function Player(playlist) {
        this.playlist = playlist;
    }

    Player.prototype.get_songs = function() {
        return this.playlist.map(function(s) { return s.name; });
    };

    return Player;
});
