/* global require */

require.config({
    paths: {
        React: '../lib/react-0.11.2.min',
    }
});

require(['React', 'native-audio-player', 'player', 'xhr', 'm3u'], function(React, NativeAudioPlayer, Player, xhr, toList) {
    'use strict';

    var main = document.getElementsByTagName('main')[0],
        phone = [/iPhone/, /iPad/, /Android/].some(function(r) { return r.test(navigator.userAgent); }),
        desktop = [/Firefox/, /Chrome/, /Safari/].some(function(r) { return r.test(navigator.userAgent); });

    React.initializeTouchEvents(true);

    xhr
        .get('noise.m3u', { headers: { 'Accept': 'text/plain' } })
        .then(function(data) {
            var songList = toList(data);

            React.renderComponent(Player({ isDesktop: desktop && !phone, player: NativeAudioPlayer, songs: songList }), main);
        });
});
