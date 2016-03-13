/* global console */

(function() {
    'use strict';

    // utils
    function l(msg) { console.log(msg); }
    function forEach(arr, fun) { return Array.prototype.forEach.call(arr, fun); }

    // dom utils
    function $(selector) { return document.querySelector(selector); }
    function on(elem, type, fn) { elem.addEventListener(type, fn, false); }
    function off(elem, type, fn) { elem.removeEventListener(type, fn, false); }
    function append(parent, child) { return parent.appendChild(child); }

    function create(tag, props) {
        var frag = document.createDocumentFragment();
        var elem = document.createElement(tag);

        if (props) {
            if (props.text) {
                elem.textContent = props.text;
                delete props.text;
            }

            forEach(Object.getOwnPropertyNames(props), function(name) {
                elem.setAttribute(name, props[name]);
            });
        }

        return {
            appendTo: function(parent) {
                append(frag, elem);
                append(parent, frag);

                return elem;
            }
        };
    }

    function ajax(url, method, cb) {
        var req = new XMLHttpRequest();

        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    cb(req.responseText);
                } else {
                    cb(new Error(req.statusText));
                }
            }
        };

        req.open(method, url);
        req.send();
    }

    function log_request() {
        // ajax('https://147.102.19.243:8002', 'POST', function ignored() {});
    }

    function post_notice() {
        var player = $('#player');
        var notice = create('div', { id: 'notice', class: 'box',
            text: "Δεν μπορούμε να παίξουμε mp3 σ' αυτή τη συσκευή, αλλά " +
            "μπορείτε να κατεβάσετε τη λίστα με τα τραγούδια εδώ: " }).appendTo(player);

        create('a', { text: 'pop13', href: 'pop13.m3u' }).appendTo(notice);
    }

    function m3u_to_json(text) {
        var lines = String(text).split(/[\r\n]/),
            m3u_list = [],
            i,
            name,
            url;

        for (i = 0; i < lines.length; ++i) {
            if (lines[i].match(/^#EXTINF/)) {
                name = lines[i].split(',')[1].trim();

                // skip any empty lines
                while (++i < lines.length && lines[i].length === 0)
                    ;

                m3u_list.push({ name: name, url: lines[i].trim() });
            }
        }

        return m3u_list;
    }

    // the view...
    var song_list_view = {
        elem: $('.box ul'),

        populate_with: function(arr) {
            var self = this;

            forEach(arr, function(song) {
                var song_title = self.transform(song.name);

                create('li', { text: song_title }).appendTo(self.elem);
            });

            this.elem.volume = 1.0;
        },

        transform: function(song_name) {
            return song_name.replace(/(.*) - (.*)/, "$2 ~ $1");
        },

        render: function() {
            this.render_children();
        },

        render_children: function() {
            forEach(this.elem.children, function(e) {
                ['box', 'song'].forEach(function(cls) {
                    e.classList.add(cls);
                });
            });
        },

        bind_to: function(player) {
            var self = this;

            forEach(this.elem.children, function(e, i) {
                on(e, 'click', function() {
                    player.play_by_index(i);
                });
            });
        },

        toggle: function(e) { e.classList.toggle('playing'); }
    };

    var native_player = {
        elem: null,

        songs: [],

        current_song_index: -1,

        paused: true,

        populate_with: function(arr) {
            this.songs = arr.concat();

            var self = this;

            on(this.elem, 'ended', function() {
                self.play_next();
            });
        },

        load_song_from_url: function(url) {
            this.elem.src = url;
        },

        play_next: function() {
            if (this.current_song_index + 1 >= this.songs.length) {
                return;
            }

            this.play_by_index(this.current_song_index + 1);
        },

        toggle: function(idx) {
            if (idx >= 0 && idx < this.songs.length) {
                song_list_view.toggle(song_list_view.elem.children[idx]);
            }
        },

        play_by_index: function(idx) {
            if (idx === this.current_song_index) {
                if (this.paused) {
                    this.play();
                } else {
                    this.pause();
                }

                return;
            }

            this.pause();
            this.toggle(this.current_song_index);
            this.load_song_from_url(this.songs[idx].url);
            this.current_song_index = idx;
            this.toggle(this.current_song_index);
            this.play();
        },

        play: function() {
            this.elem.play();
            this.paused = false;
        },

        pause: function() {
            this.elem.pause();
            this.paused = true;
        }
    };

    var flash_player = {
        elem: null,

        songs: [],

        current_song_index: -1,

        populate_with: function(arr) {
            this.songs = arr.concat();

            var self = this;
            window._player = this; // flash event registration always sets "window" as "this"

            // wait a bit for the flash player to be initialized
            setTimeout(function() {
                self.register('onSongOver', '_player.play_next()');
                l('registered play_next');
            }, 350);
        },

        play_next: function() {
            this.pause();
            song_list_view.toggle(song_list_view.elem.children[this.current_song_index]);

            if (this.current_song_index + 1 >= this.songs.length) {
                return;
            }

            ++this.current_song_index;
            this.load_song_from_url(this.songs[this.current_song_index].url);
            song_list_view.toggle(song_list_view.elem.children[this.current_song_index]);
            this.play();
        },

        pause: function() {
            this.elem.TCallLabel('/', 'pause');
        },

        play: function() {
            this.elem.TCallLabel('/', 'play');
        },

        play_by_index: function(idx) {
            this.pause();

            if (idx === this.current_song_index) {
                if (this.paused) {
                    this.paused = false;
                    this.play();
                } else {
                    this.paused = true;
                }

                return;
            }

            if (this.current_song_index >= 0) {
                song_list_view.toggle(song_list_view.elem.children[this.current_song_index]);
            }

            this.load_song_from_url(this.songs[idx].url);
            this.current_song_index = idx;
            song_list_view.toggle(song_list_view.elem.children[this.current_song_index]);
            this.play();
        },

        load_song_from_url: function(url) {
            this.elem.SetVariable('currentSong', url);
            this.elem.TCallLabel('/', 'load');
        },

        register: function(name, fn) {
            this.elem.SetVariable(name, fn);
        }
    };

    var select_player = {
        browser_supports_natively: function(type) {
            var native_audio = new Audio();

            return native_audio.canPlayType(type) !== '';
        },

        browser_supports_flash: function() {
            try {
                var fo = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');

                if (fo) {
                    return true;
                }
            } catch(e) {
                if (navigator.mimeTypes['application/x-shockwave-flash'] !== undefined) {
                    return true;
                }
            }

            return false;
        },

        setup_native_audio_under: function(parent) {
            return create('audio', { autoplay: true, preload: 'metadata', src: null }).appendTo(parent);
        },

        setup_flash_audio_under: function(parent) {
            var obj = create('object', { width: '1px', height: '1px' }).appendTo(parent);

            create('param', { name: 'movie', value: 'niftyplayer.swf' }).appendTo(obj);

            return create('embed', { src: 'niftyplayer.swf', width: '1px', height: '1px', type: 'application/x-shockwave-flash', swLiveConnect: 'true' }).appendTo(obj);
        },

        container: $('#player-container'),

        setup: function() {
            var player;

            if (this.browser_supports_natively('audio/mpeg')) {
                player = native_player;

                player.elem = this.setup_native_audio_under(this.container);

                return player;
            }
            if (this.browser_supports_flash()) {
                player = flash_player;

                player.elem = this.setup_flash_audio_under(this.container);

                return player;
            }

            throw 'cannot play mp3s';
        }
    };

    ///
    ///
    ///

    log_request();
    var player;

    try {
        player = select_player.setup();
    } catch (e) {
        post_notice();
        return;
    }

    ajax('pop13.m3u', 'GET', function(data) {
        var song_list = m3u_to_json(data);

        player.populate_with(song_list);
        song_list_view.populate_with(song_list);
        song_list_view.bind_to(player);
        song_list_view.render();
    });
})();
