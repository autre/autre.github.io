/* global define */

define([], function() {
    'use strict';

    return function toList(text) {
        var lines = String(text).split(/[\r\n]/),
            list = [],
            i,
            name;

        for (i = 0; i < lines.length; ++i) {
            if (/^#EXTINF:/.test(lines[i])) {
                name = lines[i].split(',')[1].trim();

                while (++i < lines.length && lines[i].length === 0) {
                    // NOP
                }

                list.push({ name: name, url: lines[i].trim() });
            }
        }

        return list;
    };
});
