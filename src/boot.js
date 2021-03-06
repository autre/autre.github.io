/* global requirejs */

requirejs.config({
    baseUrl: '../src',
    paths: {
        'React': '/lib/react-0.13.3-min',
    },
});

requirejs(['xhr', 'm3u', 'player', 'React', 'views'], function(xhr, m3u, Player, React, views) {
    'use strict';

    xhr.get('songs.m3u')
        .then(function(resp, status) { return m3u(resp); })
        .then(function(playlist) {
            var player = new Player(playlist);
            var appView = React.createElement(views.PlayerView, { app: player });

            React.render(appView, document.getElementsByTagName('main')[0]);
            player.play_next();
        }).catch(function(err) {
            console.error(err);
            throw err;
        });
});
