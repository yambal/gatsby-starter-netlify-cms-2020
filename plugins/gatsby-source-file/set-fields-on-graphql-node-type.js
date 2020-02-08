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
                var audioPath = option_parser_1.getAudioPath(option);
                var fileName = file_name_builder_1.buildFileName(slug, title, rawMarkdownBody, 'mp3');
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
