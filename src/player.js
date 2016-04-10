/* global define */

define([], function() {
    'use strict';

    function AudioPlayer(playlist) {
        this.playlist = playlist;
        this.audio_player = this.make_dom_player();
        this.is_playing = false;
        this.current = -1;
    }

    AudioPlayer.prototype.get_playlist = function() {
        return this.playlist.map(function(s) { return s.name; });
    };

    AudioPlayer.prototype.selected_song = function(idx) {
        if (idx === this.current) {
            if (this.is_playing) {
                this.pause();
            } else {
                this.play();
            }

            return;
        }

        this.load(idx);
        this.play();
    };

    AudioPlayer.prototype.make_dom_player = function() {
        var audio = document.createElement('audio');

        audio.style = 'display: none;';
        audio.setAttribute('preload', 'auto');
        audio.setAttribute('volume', '1');

        audio.addEventListener('ended', this.on_ended.bind(this), false);
        audio.addEventListener('error', this.on_error.bind(this), false);

        document.body.appendChild(audio);

        return audio;
    };

    AudioPlayer.prototype.on_error = function(e) {
        console.error(e);
        console.info('unable to load song:', this.playlist[this.current]);
        this.play_next();
    };

    AudioPlayer.prototype.on_ended = function(e) {
        this.play_next();
    };

    AudioPlayer.prototype.play_next = function() {
        if (this.load_next()) {
            this.play();
        }
    };

    AudioPlayer.prototype.load = function(idx) {
        this.audio_player.src = this.playlist[idx].url;
        this.current = idx;
    };

    AudioPlayer.prototype.play = function() {
        this.audio_player.play();
        this.is_playing = true;
    };

    AudioPlayer.prototype.pause = function() {
        this.audio_player.pause();
        this.is_playing = false;
    };

    AudioPlayer.prototype.load_next = function() {
        if (this.current < this.playlist.length) {
            this.current += 1;
            this.load(this.current);

            return true;
        }

        return false;
    };

    return AudioPlayer;
});
