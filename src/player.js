/* global define */

define(['React'], function(React) {
    'use strict';

    var dom = React.DOM,
        create = React.createClass;

    var Message = create({
        displayName: 'Message',
        render: function() {
            var content = this.props.isDesktop ? '(click to play)' : '(touch to play)';
            var transparent = this.props.started ? 'transparent' : '';

            return dom.div({ className: 'message ' + transparent }, content);
        },
    });

    var Song = create({
        displayName: 'Song',
        render: function() {
            var status = this.props.selected ? (this.props.isPlaying ? 'now-playing' : 'paused') : '',
                first = dom.span({ className: 'marker ' + status, width: 10 }),
                second = dom.span({ onClick: this.handleClick, onTouchEnd: this.handleClick }, this.props.song.name);

            return dom.li({ key: this.props.key }, first, second);
        },
        handleClick: function(e) {
            this.props.handleClick(this.props.key);
        }
    });

    var SongList = create({
        displayName: 'SongList',
        render: function() {
            var self = this;
            var list = this.props.songs.map(function(o, i) {
                return Song({
                    song: o,
                    key: i,
                    handleClick: self.props.handleClick,
                    selected: o.selected,
                    isPlaying: o.isPlaying
                });
            });

            return dom.ul({ id: 'song-list' }, list);
        }
    });

    var Player = create({
        displayName: 'Player',
        getInitialState: function() {
            return { isPlaying: false, songIndex: -1, started: false };
        },
        render: function() {
            var self = this;
            var songs = this.props.songs.map(function(o, ind) {
                o.isPlaying = self.state.isPlaying;
                o.selected = ind === self.state.songIndex;
                return o;
            });

            return dom.div(null,
                Message({ isDesktop: this.props.isDesktop, started: this.state.started }),
                SongList({ songs: songs, handleClick: this.handleInput }),
                this.props.player({ ref: 'player', onEnded: this.onEnded, onError: this.onError })
            );
        },
        handleInput: function(ind, after_set_state) {
            var self = this;

            if (ind === this.state.songIndex) {
                if (this.state.isPlaying) {
                    this.pause();
                    return;
                } else {
                    this.play();
                    return;
                }
            }

            if (!after_set_state) {
                after_set_state = this.play;
            }

            this.setState({ isPlaying: this.state.isPlaying, songIndex: ind, started: true }, function() {
                self.load(self.props.songs[self.state.songIndex].url);
                after_set_state();
            });
        },
        playNext: function() {
            var self = this;

            if (this.state.songIndex + 1 >= this.props.songs.length) {
                this.setState({ isPlaying: false, songIndex: this.state.songIndex, started: true });
                return;
            }

            this.handleInput(this.state.songIndex + 1, function() { self.play(); });
        },
        load: function(url) {
            this.refs.player.load(url);
        },
        play: function() {
            this.refs.player.play();
            this.setState({ isPlaying: true, songIndex: this.state.songIndex, started: true });
        },
        pause: function() {
            this.refs.player.pause();
            this.setState({ isPlaying: false, songIndex: this.state.songIndex, started: true });
        },
        onEnded: function(e) {
            this.playNext();
        },
        onError: function(e) {
            console.error('error: cannot not load: "' + this.props.songs[this.state.songIndex].name + '"');
            this.playNext();
        }
    });

    return Player;
});
