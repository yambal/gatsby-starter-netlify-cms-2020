"use strict";
exports.__esModule = true;
var mp3_1 = require("./libs/mp3");
var html_to_ssml_1 = require("./libs/html-to-ssml");
var file_name_builder_1 = require("./libs/file-name-builder");
var option_parser_1 = require("./libs/option-parser");
module.exports = function (_a, pluginOptions, cb) {
    var cache = _a.cache, actions = _a.actions, graphql = _a.graphql;
    return graphql("\n    {\n      allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n        edges {\n          node {\n            id\n            fields {\n              slug\n            }\n            frontmatter {\n              slug\n              title\n            }\n            rawMarkdownBody\n            html\n          }\n        }\n      }\n    }\n    ").then(function (result) {
        if (result.errors) {
            result.errors.forEach(function (e) { return console.error(e.toString()); });
            return Promise.reject(result.errors);
        }
        var edges = result.data.allMarkdownRemark.edges;
        // MP3
        edges.forEach(function (edge) {
            var html = edge.node.html;
            var title = edge.node.frontmatter.title;
            var cacheKey = "podcast-" + edge.node.id;
            var hash = file_name_builder_1.buildMDHash(title, edge.node.rawMarkdownBody);
            var fileName = file_name_builder_1.buildFileName(edge.node.frontmatter.slug, title, edge.node.rawMarkdownBody, 'mp3');
            return cache.get(cacheKey)
                .then(function (nodeIdHash) {
                console.log('cache check:', cacheKey, hash, nodeIdHash);
                if (nodeIdHash !== hash) {
                    return mp3_1["default"](html_to_ssml_1["default"](title, html), fileName, option_parser_1.getAudioPath(pluginOptions))
                        .then(function (response) {
                        console.log(response);
                        return cache.set(cacheKey, hash)
                            .then(function () {
                            console.log('cache saved:', cacheKey, hash);
                            cb && cb();
                        });
                    });
                }
                else {
                    console.log("\tskip: hash " + hash);
                    cb && cb();
                    return;
                }
            });
        });
    });
};
