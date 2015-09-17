/* global define */

define([], function() {
    'use strict';

    return function logging_proxy(target) {
        if (window.Proxy) {
            return new Proxy(target, {
                get: function(target, name) {
                    console.log(`${target}#${name}`);

                    return target[name];
                }
            });
        } else {
            return target;
        }
    };
});
