"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var option_parser_1 = require("./option-parser");
var CACHE_DIR = '.podcast';
exports.buildMDHash = function (title, rawMarkdownBody) {
    return crypto.createHash('md5').update(title + "-" + rawMarkdownBody, 'utf8').digest('hex');
};
exports.edgeFileName = function (channel, slug, exe) {
    var channelFix = channel ? channel + "-" : '';
    var exeFix = exe ? "." + exe : '';
    return "podcast-" + channelFix + slug + exeFix;
};
exports.path = {
    cacheDir: process.cwd() + "/" + CACHE_DIR,
    publicDir: process.cwd() + "/public",
    publicMp3Dir: function (option) {
        var audioPath = option_parser_1.getAudioPath(option);
        return exports.path.publicDir + "/audio/" + audioPath;
    },
    cacheFilePath: function (key) {
        return exports.path.cacheDir + "/cache-" + key + ".txt";
    },
    edgeFileName: function (channel, slug, exe) {
        var channelFix = channel ? channel + "-" : '';
        var exeFix = exe ? "." + exe : '';
        return "podcast-" + channelFix + slug + exeFix;
    },
    edgeKey: function (channel, slug) {
        return exports.path.edgeFileName(channel, slug);
    },
    edgeMp3FileName: function (channel, slug) {
        return exports.path.edgeFileName(channel, slug, 'mp3');
    },
    edgeMp3CacheFilePath: function (channel, slug) {
        return exports.path.cacheDir + "/" + exports.path.edgeMp3FileName(channel, slug);
    },
    edgeMp3PublicFilePath: function (channel, slug, option) {
        return "" + exports.path.publicMp3Dir(option) + exports.path.edgeMp3FileName(channel, slug);
    },
    edgeMp3AbsoluteUrl: function (channel, slug, option) {
        var siteUrl = option_parser_1.getSiteUrl(option);
        var audioPath = option_parser_1.getAudioPath(option);
        return siteUrl ? siteUrl + "/" + audioPath + "/" + exports.path.edgeMp3FileName(channel, slug) : 'siteUrl not set @option';
    }
};
