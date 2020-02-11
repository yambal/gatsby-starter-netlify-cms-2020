"use strict";
exports.__esModule = true;
var mp3_1 = require("./libs/mp3");
var html_to_ssml_1 = require("./libs/html-to-ssml");
var file_checker_1 = require("./file-checker");
var cache_1 = require("./libs/cache");
var option_parser_1 = require("./libs/option-parser");
var podcastBuildMp3 = function (checkCacheResponse, ssml) {
    return new Promise(function (resolve) {
        if (!checkCacheResponse.hasCashe || checkCacheResponse.isOld) {
            console.log('podcast: make mp3');
            mp3_1["default"](ssml)
                .then(function (audioData) {
                console.log('podcast: make mp3 success');
                checkCacheResponse.audioData = audioData;
                resolve(checkCacheResponse);
            });
        }
        else {
            console.log('podcast: make mp3 skip');
            resolve(checkCacheResponse);
        }
    });
};
var podcastCacheSaver = function (checkCacheResponse) {
    return new Promise(function (resolve) {
        if (checkCacheResponse.audioData) {
            cache_1.podcastCashSet(checkCacheResponse.cacheKey, checkCacheResponse.cacheValue, checkCacheResponse.channel, checkCacheResponse.slug, checkCacheResponse.audioData)
                .then(function () {
                console.log('podcast: cached');
                resolve(checkCacheResponse);
            });
        }
        else {
            console.log('podcast: cacheing skip');
            resolve(checkCacheResponse);
        }
    });
};
var podcastEdgeToFile = function (edge, options) {
    return new Promise(function (resolve) {
        return cache_1.checkCache(edge, options)
            .then(function (checkCacheResponse) {
            var html = edge.node.html;
            var _a = edge.node.frontmatter, title = _a.title, channel = _a.channel;
            var channelTitle = option_parser_1.getChannelTitle(channel, options);
            var channelDescription = option_parser_1.getChannelDescription(channel, options);
            var ssml = html_to_ssml_1["default"](channelTitle, channelDescription, title, html);
            return podcastBuildMp3(checkCacheResponse, ssml);
        })
            .then(function (res) {
            return podcastCacheSaver(res);
        })
            .then(function (res) {
            return cache_1.cacheToPablic(res);
        })
            .then(function (res) {
            resolve(res);
        });
    });
};
module.exports = function (_a, pluginOptions, cb) {
    var cache = _a.cache, actions = _a.actions, graphql = _a.graphql;
    return graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          id\n          fields {\n            slug\n          }\n          frontmatter {\n            slug\n            title\n            date\n            channel\n          }\n          rawMarkdownBody\n          html\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        if (result.errors) {
            result.errors.forEach(function (e) { return console.error(e.toString()); });
            return Promise.reject(result.errors);
        }
        var list = file_checker_1.listFiles(process.cwd() + "/podcast");
        console.log('file check', list.length);
        var edges = result.data.allMarkdownRemark.edges;
        Promise.all(edges.map(function (edge) {
            return podcastEdgeToFile(edge, pluginOptions);
        }))
            .then(function () {
            console.log('/podcast');
            cb && cb();
        });
    });
};
