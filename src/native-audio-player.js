/* global define */

define(['React'], function(React) {
    'use strict';

    var dom = React.DOM,
        create = React.createClass;

     return create({
        displayName: 'NativeAudioPlayer',
        render: function() {
            return dom.audio({ preload: 'auto', volume: 1 });
        },
        componentDidMount: function() {
            var audio = this.getDOMNode();

            audio.addEventListener('ended', this.props.onEnded, false);
            audio.addEventListener('error', this.props.onError, false);
        },
        load: function(url) { this.getDOMNode().src = url; },
        play: function() { this.getDOMNode().play(); },
        pause: function() { this.getDOMNode().pause(); }
    });
});
