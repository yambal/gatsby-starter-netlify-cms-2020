"use strict";
exports.__esModule = true;
var graphql_1 = require("gatsby/graphql");
var filePath_1 = require("./libs/filePath");
var option_parser_1 = require("./libs/option-parser");
// =====================================================
var MP3Type = new graphql_1.GraphQLObjectType({
    name: 'Mp3',
    fields: {
        absoluteUrl: { type: graphql_1.GraphQLString },
        url: { type: graphql_1.GraphQLString },
        path: { type: graphql_1.GraphQLString }
    }
});
module.exports = function (_a, option) {
    var type = _a.type;
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
                var frontmatter = MDNode.frontmatter;
                var templateKey = frontmatter.templateKey, slug = frontmatter.slug, channel = frontmatter.channel;
                var audioPath = option_parser_1.getAudioPath(option);
                var fileName = filePath_1.path.edgeMp3FileName(channel, slug);
                var mp3PublicFilePath = filePath_1.path.edgeMp3PublicFilePath(channel, slug, option);
                var absoluteUrl = filePath_1.path.edgeMp3AbsoluteUrl(channel, slug, option);
                console.log(42, absoluteUrl);
                if (templateKey === 'PodCast') {
                    return {
                        absoluteUrl: absoluteUrl,
                        url: "/" + audioPath + "/" + fileName,
                        path: mp3PublicFilePath
                    };
                }
                return null;
            }
        }
    };
};
