"use strict";
exports.__esModule = true;
var mp3_1 = require("./mp3");
var HtmlToSSML_1 = require("./HtmlToSSML");
var crypto = require("crypto");
var graphql_1 = require("gatsby/graphql");
var audioPath = 'audio';
var buildMDHash = function (title, rawMarkdownBody) {
    return crypto.createHash('md5').update(title + "-" + rawMarkdownBody, 'utf8').digest('hex');
};
var buildFileName = function (slag, title, rawMarkdownBody, exe) {
    return slag + "-" + buildMDHash(title, rawMarkdownBody) + "." + exe;
};
exports.createPages = function (_a, pluginOptions, cb) {
    var cache = _a.cache, actions = _a.actions, graphql = _a.graphql;
    return graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          id\n          fields {\n            slug\n          }\n          frontmatter {\n            slug\n            title\n          }\n          rawMarkdownBody\n          html\n        }\n      }\n    }\n  }\n  ").then(function (result) {
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
            var hash = buildMDHash(title, edge.node.rawMarkdownBody);
            var fileName = buildFileName(edge.node.frontmatter.slug, title, edge.node.rawMarkdownBody, 'mp3');
            return cache.get(cacheKey)
                .then(function (nodeIdHash) {
                if (nodeIdHash !== hash) {
                    return mp3_1["default"](HtmlToSSML_1["default"](title, html), fileName, audioPath)
                        .then(function (uri) {
                        return cache.set(cacheKey, hash)
                            .then(function () {
                            console.log("\tmake cache:" + cacheKey + " = " + hash);
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
// =====================================================
exports.setFieldsOnGraphQLNodeType = function (_a) {
    var type = _a.type;
    console.log(52, 'setFieldsOnGraphQLNodeType');
    if (type.name !== "MarkdownRemark") {
        return {};
    }
    return {
        mp3: {
            type: graphql_1.GraphQLString,
            args: {
                prefix: {
                    type: graphql_1.GraphQLString
                }
            },
            resolve: function (MDNode, args) {
                var frontmatter = MDNode.frontmatter, rawMarkdownBody = MDNode.rawMarkdownBody;
                var templateKey = frontmatter.templateKey, slug = frontmatter.slug, title = frontmatter.title;
                var fileName = buildFileName(slug, title, rawMarkdownBody, 'mp3');
                if (templateKey === 'PodCast') {
                    return "/" + audioPath + "/" + fileName;
                }
                return null;
            }
        }
    };
};
/**
 * https://www.gatsbyjs.org/docs/node-apis/#onPostBuild
 * ビルドプロセスの他のすべての部分が完了した後に呼び出される最後の拡張ポイント。
 */
exports.onPostBuild = function (_a) {
    var actions = _a.actions, reporter = _a.reporter, graphql = _a.graphql;
    console.log(123, '---------------------------------------');
    // console.log(123, reporter)
    graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          frontmatter {\n            title\n          }\n          mp3\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        var edges = result.data.allMarkdownRemark.edges;
        edges.forEach(function (edge) {
            console.log(JSON.stringify(edge.node));
        });
    });
};
