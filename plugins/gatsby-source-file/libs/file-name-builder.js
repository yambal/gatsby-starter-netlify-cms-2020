"use strict";
exports.__esModule = true;
var crypto = require("crypto");
exports.buildMDHash = function (title, rawMarkdownBody) {
    return crypto.createHash('md5').update(title + "-" + rawMarkdownBody, 'utf8').digest('hex');
};
exports.buildFileName = function (slag, title, rawMarkdownBody, exe) {
    return slag + "-" + exports.buildMDHash(title, rawMarkdownBody) + "." + exe;
};
