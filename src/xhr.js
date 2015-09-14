/* global define */

define([], function() {
    'use strict';

    function xhr(method, url, options) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();

            req.open(method, url, true);

            if (options.headers) {
                Object.keys(options.headers).forEach(function(key) {
                    req.setRequestHeader(key, options.headers[key]);
                });
            }

            req.addEventListener('error', function(e) {
                reject(e);
            }, false);

            req.addEventListener('load', function(e) {
                resolve([e.target.responseText, e.target.status]);
            }, false);

            req.send(options.data || void 0);
        });
    }

    var o = {};

    ['HEAD', 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'].forEach(function(method) {
        o[method.toLowerCase()] = function(url, options) {
            return xhr(method, url, options || {});
        };
    });

    o.xhr = xhr;

    return o;
});
