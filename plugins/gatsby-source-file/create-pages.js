"use strict";
exports.__esModule = true;
var mp3_1 = require("./libs/mp3");
var html_to_ssml_1 = require("./libs/html-to-ssml");
var file_name_builder_1 = require("./libs/file-name-builder");
var option_parser_1 = require("./libs/option-parser");
var fs = require("fs");
module.exports = function (_a, pluginOptions, cb) {
    var cache = _a.cache, actions = _a.actions, graphql = _a.graphql;
    return graphql("\n    {\n      allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n        edges {\n          node {\n            id\n            fields {\n              slug\n            }\n            frontmatter {\n              slug\n              title\n            }\n            rawMarkdownBody\n            html\n          }\n        }\n      }\n    }\n    ").then(function (result) {
        if (result.errors) {
            result.errors.forEach(function (e) { return console.error(e.toString()); });
            return Promise.reject(result.errors);
        }
        var edges = result.data.allMarkdownRemark.edges;
        // MP3
        var edgeNum = edges.length;
        edges.forEach(function (edge) {
            var html = edge.node.html;
            var title = edge.node.frontmatter.title;
            cache.get('test')
                .then(function (cacheValue) {
                if (cacheValue) {
                    console.log(46, cacheValue);
                }
                else {
                    cache.set('test', 'test calue')
                        .then(function () {
                        console.log(52, 'cached');
                    });
                }
            });
            var fileName = file_name_builder_1.buildFileName(edge.node.frontmatter.slug, title, edge.node.rawMarkdownBody, 'mp3');
            var checkPath = process.cwd() + "/public/" + option_parser_1.getAudioPath(pluginOptions) + "/" + fileName;
            try {
                fs.statSync(checkPath);
                console.log(checkPath + " is exists (" + edgeNum + "/" + edges.length + ")");
                edgeNum--;
                edgeNum <= 0 && cb && cb();
            }
            catch (error) {
                return mp3_1["default"](html_to_ssml_1["default"](title, html), fileName, option_parser_1.getAudioPath(pluginOptions))
                    .then(function () {
                    console.log(checkPath + " saved (" + edgeNum + "/" + edges.length + ")");
                    edgeNum--;
                    edgeNum <= 0 && cb && cb();
                });
            }
            /*
            return cache.get(cacheKey)
              .then(
                nodeIdHash => {
                  console.log('cache check:', cacheKey, hash, nodeIdHash)
  
                  if (nodeIdHash !== hash){
                    return mp3(HtmlToSSML(title, html), fileName, getAudioPath(pluginOptions))
                      .then(
                        (response) => {
                          console.log(response)
                          return cache.set(cacheKey, hash)
                            .then(
                              () => {
                                console.log('cache saved:', cacheKey, hash)
                                cb && cb()
                              }
                            )
                        }
                      )
                  } else {
                    console.log(`\tskip: hash ${hash}`)
                    cb && cb()
                    return
                  }
                }
              )
            */
        });
    });
};
