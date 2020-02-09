"use strict";
exports.__esModule = true;
var graphql_1 = require("gatsby/graphql");
var file_name_builder_1 = require("./libs/file-name-builder");
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
    var siteUrl = option_parser_1.getSiteUrl(option);
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
                var templateKey = frontmatter.templateKey, slug = frontmatter.slug, title = frontmatter.title, channel = frontmatter.channel;
                var audioPath = option_parser_1.getAudioPath(option);
                var fileName = file_name_builder_1.buildFileNameShort(channel, slug, 'mp3'); // (slug, title, rawMarkdownBody, 'mp3')
                var mp3FilePath = process.cwd() + "/.cache/" + audioPath + "/" + fileName;
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
