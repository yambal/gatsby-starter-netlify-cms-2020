"use strict";
exports.__esModule = true;
var getI_itunes_duration_1 = require("./libs/getI-itunes-duration");
var option_parser_1 = require("./libs/option-parser");
var fs = require('fs');
module.exports = function (_a, option) {
    var actions = _a.actions, reporter = _a.reporter, graphql = _a.graphql;
    graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          fields {\n            slug\n          }\n          frontmatter {\n            title\n            description\n            date\n            channel\n          }\n          mp3 {\n            absoluteUrl\n            url\n            path\n          }\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        var siteUrl = option_parser_1.getSiteUrl(option);
        var edges = result.data.allMarkdownRemark.edges;
        var channelIndex = {};
        edges.forEach(function (edge) {
            var _a = edge.node, slug = _a.fields.slug, _b = _a.mp3, path = _b.path, url = _b.url, absoluteUrl = _b.absoluteUrl, _c = _a.frontmatter, pubDateStr = _c.date, description = _c.description, title = _c.title, channel = _c.channel;
            if (typeof channelIndex[channel] === 'undefined') {
                channelIndex[channel] = [];
            }
            /** Duration(MP3の長さ)を取得する */
            var iTunesDuration = getI_itunes_duration_1.getITunesDuration(path);
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
        Object.keys(channelIndex).forEach(function (key) {
            /** チャンネルのタイトル */
            var channelTitle = option_parser_1.getChannelTitle(key, option);
            var channelDescription = option_parser_1.getChannelDescription(key, option);
            /** rss の パス */
            var rssPath = key && key !== 'null' ? process.cwd() + "/public/podcast-" + key + ".rss" : process.cwd() + "/public/podcast.rss";
            var rss = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<rss version=\"2.0\" xmlns:googleplay=\"http://www.google.com/schemas/play-podcasts/1.0\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\">\n  <channel>\n    <title>" + channelTitle + "</title>\n    <googleplay:author>June YAMAMOTO</googleplay:author>\n    <description>" + channelDescription + "</description>\n    <googleplay:image href=\"http://placehold.jp/36/99ccff/003366/600x600.png?text=" + channelTitle + "\"/>\n    <itunes:image href=\"http://placehold.jp/36/99ccff/003366/1400x1400.png?text=" + channelTitle + "\"/>\n    <itunes:category>Technology</itunes:category>\n    <itunes:explicit>no</itunes:explicit>\n    <language>ja-JP</language>\n    <link>" + siteUrl + "/</link>\n    " + channelIndex[key].join('\n') + "\n  </channel>\n</rss>";
            fs.writeFileSync(rssPath, rss);
            // console.log(rss, rssPath)
        });
    });
};
