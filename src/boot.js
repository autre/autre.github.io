/* global requirejs */

requirejs.config({
    baseUrl: '../src',
    paths: {
        'React': '/lib/react-0.13.3-min',
    },
});

requirejs(['xhr', 'm3u', 'player', 'React', 'views', 'logging-proxy'], function(xhr, m3u, Player, React, views, logging) {
    'use strict';

    var devel = true;

    xhr.get('songs.m3u')
        .then(function(resp, status) { return m3u(resp); })
        .then(function(playlist) {
            var app = new Player(playlist);
            var proxy = devel ? logging(app) : app;
            var appView = React.createElement(views.PlayerView, { app: proxy });

            React.render(appView, document.getElementsByTagName('main')[0]);
        }).catch(function(err) {
            console.error(err);
            throw err;
        });
});
