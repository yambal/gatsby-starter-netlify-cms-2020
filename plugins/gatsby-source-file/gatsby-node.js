"use strict";
exports.__esModule = true;
var mp3_1 = require("./mp3");
var HtmlToSSML_1 = require("./HtmlToSSML");
var crypto = require("crypto");
var graphql_1 = require("gatsby/graphql");
var getITunesDuration_1 = require("./getITunesDuration");
var fs = require('fs');
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
                        .then(function (response) {
                        console.log(response);
                        return cache.set(cacheKey, hash)
                            .then(function () {
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
var MP3Type = new graphql_1.GraphQLObjectType({
    name: 'Mp3',
    fields: {
        absoluteUrl: { type: graphql_1.GraphQLString },
        url: { type: graphql_1.GraphQLString },
        path: { type: graphql_1.GraphQLString }
    }
});
exports.setFieldsOnGraphQLNodeType = function (_a, option) {
    var type = _a.type;
    var _b = option.siteUrl, siteUrl = _b === void 0 ? null : _b;
    if (type.name !== "MarkdownRemark") {
        return {};
    }
    return {
        mp3: {
            type: MP3Type,
            args: {
                prefix: {
                    type: graphql_1.GraphQLString
                }
            },
            resolve: function (MDNode, args) {
                var frontmatter = MDNode.frontmatter, rawMarkdownBody = MDNode.rawMarkdownBody;
                var templateKey = frontmatter.templateKey, slug = frontmatter.slug, title = frontmatter.title;
                var fileName = buildFileName(slug, title, rawMarkdownBody, 'mp3');
                var mp3FilePath = process.cwd() + "/public/" + audioPath + "/" + fileName;
                var absoluteUrl = siteUrl ? siteUrl + "/" + audioPath + "/" + fileName : 'siteUrl not set @option';
                if (templateKey === 'PodCast') {
                    return {
                        absoluteUrl: absoluteUrl,
                        url: "/" + audioPath + "/" + fileName,
                        path: mp3FilePath
                    };
                }
                return null;
            }
        }
    };
};
exports.onPostBuild = function (_a, option) {
    var actions = _a.actions, reporter = _a.reporter, graphql = _a.graphql;
    var _b = option.siteUrl, siteUrl = _b === void 0 ? null : _b;
    graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          fields {\n            slug\n          }\n          frontmatter {\n            title\n            description\n            date\n            channel\n          }\n          mp3 {\n            absoluteUrl\n            url\n            path\n          }\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        var edges = result.data.allMarkdownRemark.edges;
        var channelIndex = {};
        edges.forEach(function (edge) {
            var _a = edge.node, slug = _a.fields.slug, _b = _a.mp3, path = _b.path, url = _b.url, absoluteUrl = _b.absoluteUrl, _c = _a.frontmatter, pubDateStr = _c.date, description = _c.description, title = _c.title, channel = _c.channel;
            if (typeof channelIndex[channel] === 'undefined') {
                channelIndex[channel] = [];
            }
            /** Duration(MP3の長さ)を取得する */
            var iTunesDuration = getITunesDuration_1.getITunesDuration(path);
            /** Length(ファイルサイズ)を取得する */
            var size = fs.statSync(path).size;
            /** pubDate */
            var pubDateUTC = new Date(pubDateStr).toUTCString();
            /** Link 記事ページへのリンク */
            var link = siteUrl ? "" + siteUrl + slug : slug;
            /** MP3 ファイルのTRL */
            var enclosureUrl = siteUrl ? absoluteUrl : url;
            var item = "<item>\n  <title>" + title + "</title>\n  <description>" + description + "</description>\n  <pubDate>" + pubDateUTC + "</pubDate>\n  <enclosure url=\"" + enclosureUrl + "\" type=\"audio/mpeg\" length=\"" + size + "\"/>\n  <itunes:duration>" + iTunesDuration + "</itunes:duration>\n  <guid isPermaLink=\"false\">" + absoluteUrl + "</guid>\n  <link>" + link + "</link>\n</item>";
            channelIndex[channel].push(item);
        });
        console.log(channelIndex);
        Object.keys(channelIndex).forEach(function (key) {
            var rss = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<rss version=\"2.0\" xmlns:googleplay=\"http://www.google.com/schemas/play-podcasts/1.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\">\n  <channel>\n    <title>WWW.YAMBAL.NET</title>\n    <googleplay:author>June YAMAMOTO</googleplay:author>\n    <description>\u30C6\u30B9\u30C8\u3067\u3059</description>\n    <googleplay:image href=\"http://placehold.jp/36/99ccff/003366/600x600.png?text=WWW.YAMBAL.NET\"/>\n    <language>ja-JP</language>\n    <link>" + siteUrl + "/</link>\n    " + channelIndex[key].join('\n') + "\n  </channel>\n</rss>";
            var rssPath = key && key !== 'null' ? process.cwd() + "/public/podcast-" + key + ".rss" : process.cwd() + "/public/podcast.rss";
            fs.writeFileSync(rssPath, rss);
            console.log(rss, rssPath);
        });
    });
};
