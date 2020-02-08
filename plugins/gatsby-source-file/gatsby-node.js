"use strict";
exports.__esModule = true;
var mp3_1 = require("./mp3");
var HtmlToSSML_1 = require("./HtmlToSSML");
var crypto = require("crypto");
var graphql_1 = require("gatsby/graphql");
var getMp3Duration_1 = require("./getMp3Duration");
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
        url: { type: graphql_1.GraphQLString },
        path: { type: graphql_1.GraphQLString }
    }
});
exports.setFieldsOnGraphQLNodeType = function (_a) {
    var type = _a.type;
    console.log(52, 'setFieldsOnGraphQLNodeType');
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
                if (templateKey === 'PodCast') {
                    return {
                        url: "/" + audioPath + "/" + fileName,
                        path: mp3FilePath
                    };
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
    graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          fields {\n            slug\n          }\n          frontmatter {\n            title\n            description\n            date\n          }\n          mp3 {\n            url\n            path\n          }\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        var edges = result.data.allMarkdownRemark.edges;
        var items = [];
        edges.forEach(function (edge) {
            /** Duration(MP3の長さ)を取得する */
            var path = edge.node.mp3.path;
            var buffer = fs.readFileSync(path);
            var duration = getMp3Duration_1.getMp3Duration(buffer); // ms
            var h = Math.floor(duration / 1000 / 3600);
            var m = Math.floor((duration / 1000 - h * 3600) / 60);
            var s = Math.floor(duration / 1000 - h * 3600 - m * 60) + 1;
            var strDuration = ('00' + h).slice(-2) + ":" + ('00' + m).slice(-2) + ":" + ('00' + s).slice(-2);
            /** Length(ファイルサイズ)を取得する */
            var size = fs.statSync(path).size;
            /** pubDate */
            var pub = new Date(edge.node.frontmatter.date);
            var UTCPubDate = pub.toUTCString();
            var item = "<item>\n        <title>" + edge.node.frontmatter.title + "</title>\n        <description>" + edge.node.frontmatter.description + "</description>\n        <pubDate>" + UTCPubDate + "</pubDate>\n        <enclosure url=\"" + edge.node.mp3.url + "\" type=\"audio/mpeg\" length=\"" + size + "\"/>\n        <itunes:duration>" + strDuration + "</itunes:duration>\n        <guid isPermaLink=\"false\">" + edge.node.mp3.url + "</guid>\n        <link>" + edge.node.fields.slug + "</link>\n      </item>";
            items.push(item);
        });
        var rss = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n    <rss version=\"2.0\" xmlns:googleplay=\"http://www.google.com/schemas/play-podcasts/1.0\"\n         xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\">\n      <channel>\n        <title>Dafna's Zebra Podcast</title>\n        <googleplay:author>Dafna</googleplay:author>\n        <description>A pet-owner's guide to the popular striped equine.</description>\n        <googleplay:image href=\"http://www.example.com/podcasts/dafnas-zebras/img/dafna-zebra-pod-logo.jpg\"/>\n        <language>en-us</language>\n        <link>https://www.example.com/podcasts/dafnas-zebras/</link>\n        " + items.join('\n') + "\n      </channel>\n    </rss>";
        var path = process.cwd() + "/public/podcast.rss";
        fs.writeFileSync(path, rss);
        console.log(rss, path);
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
