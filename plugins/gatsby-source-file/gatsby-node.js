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
 * https://www.npmjs.com/package/get-mp3-duration
 */
exports.onPostBuild = function (_a) {
    var actions = _a.actions, reporter = _a.reporter, graphql = _a.graphql;
    console.log(123, '---------------------------------------');
    // console.log(123, reporter)
    graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          fields {\n            slug\n          }\n          frontmatter {\n            title\n          }\n          mp3\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        var edges = result.data.allMarkdownRemark.edges;
        edges.forEach(function (edge) {
            console.log(JSON.stringify(edge.node));
            var item = "<item>\n        <title>" + edge.node.frontmatter.title + "</title>\n        <description>Here are the top 10 misunderstandings about the care, feeding, and breeding of these lovable striped animals.</description>\n        <pubDate>Tue, 14 Mar 2017 12:00:00 GMT</pubDate>\n        <enclosure url=\"" + edge.node.mp3 + "\" type=\"audio/mpeg\" length=\"34216300\"/>\n        <itunes:duration>30:00</itunes:duration>\n        <guid isPermaLink=\"false\">dzpodtop10</guid>\n      </item>";
            console.log(item);
        });
    });
};
/**
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Dafna's Zebra Podcast</title>
    <googleplay:author>Dafna</googleplay:author>
    <description>A pet-owner's guide to the popular striped equine.</description>
    <googleplay:image href="http://www.example.com/podcasts/dafnas-zebras/img/dafna-zebra-pod-logo.jpg"/>
    <language>en-us</language>
    <link>https://www.example.com/podcasts/dafnas-zebras/</link>
    <item>
      <title>Top 10 myths about caring for a zebra</title>
      <description>Here are the top 10 misunderstandings about the care, feeding, and breeding of these lovable striped animals.</description>
      <pubDate>Tue, 14 Mar 2017 12:00:00 GMT</pubDate>
      <enclosure url="https://www.example.com/podcasts/dafnas-zebras/audio/toptenmyths.mp3"
                 type="audio/mpeg" length="34216300"/>
      <itunes:duration>30:00</itunes:duration>
      <guid isPermaLink="false">dzpodtop10</guid>
    </item>
    <item>
      <title>Keeping those stripes neat and clean</title>
      <description>Keeping your zebra clean is time consuming, but worth the effort.</description>
      <pubDate>Fri, 24 Feb 2017 12:00:00 GMT</pubDate>
      <enclosure url="https://www.example.com/podcasts/dafnas-zebras/audio/cleanstripes.mp3"
                 type="audio/mpeg" length="26004388"/>
      <itunes:duration>22:48</itunes:duration>
      <guid>dzpodclean</guid>
    </item>
  </channel>
</rss>
 */
