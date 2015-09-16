/* global define */

define([], function() {
    'use strict';

    function Player(playlist) {
        this.audio_player = this.make_dom_player();
        this.playlist = playlist;
        this.is_playing = false;
        this.playing_index = -1;
    }

    Player.prototype.make_dom_player = function() {
        var audio = document.createElement('audio');

        audio.style = 'display: none;';
        audio.setAttribute('preload', 'auto');
        audio.setAttribute('volume', '1');

        audio.addEventListener('ended', this.on_ended, false);
        audio.addEventListener('error', this.on_error, false);

        document.body.appendChild(audio);

        return audio;
    };

    Player.prototype.on_error = function(e) {
        console.error(e);
        throw e;
    };

    Player.prototype.on_ended = function(e) {
        this.play_next();
    };

    Player.prototype.play_next = function() {
        this.load_next() && this.audio_player.play();
    };

    Player.prototype.play = function() {
        this.audio_player.play();
        this.is_playing = true;
    };

    Player.prototype.pause = function() {
        this.audio_player.pause();
        this.is_playing = false;
    };

    Player.prototype.load_next = function() {
        if (this.playing_index < this.playlist.length) {
            this.playing_index += 1;
            this.load(this.playing_index);

            return true;
        }

        return false;
    };

    Player.prototype.load = function(idx) {
        this.audio_player.src = this.playlist[idx].url;
    };

    Player.prototype.get_songs = function() {
        return this.playlist.map(function(s) { return s.name; });
    };

    Player.prototype.has_selected_song = function(idx) {
        if (this.is_playing) {
            if (this.playing_index === idx) {
                this.pause();
            } else {
                this.load(idx);
                this.play();
            }
        } else {
            if (this.playing_index !== idx) {
                this.load(idx);
            }

            this.play();
        }
    };

    return Player;
});
