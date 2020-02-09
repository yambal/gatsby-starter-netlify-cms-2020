"use strict";
exports.__esModule = true;
var mp3_1 = require("./libs/mp3");
var html_to_ssml_1 = require("./libs/html-to-ssml");
var file_name_builder_1 = require("./libs/file-name-builder");
var option_parser_1 = require("./libs/option-parser");
var fs = require("fs");
var file_checker_1 = require("./file-checker");
var mkdirp = require("mkdirp-then");
var util = require("util");
var podcastCacheGet = function (key) {
    return new Promise(function (resolve) {
        var cacheDir = process.cwd() + "/podcast";
        var cacheFilePath = cacheDir + "/cache-" + key + ".txt";
        try {
            fs.statSync(cacheFilePath);
            fs.readFile(cacheFilePath, "utf-8", function (err, data) {
                if (!err) {
                    resolve(data);
                    return;
                }
                resolve(null);
            });
        }
        catch (error) {
            resolve(null);
        }
    });
};
var podcastCashSet = function (key, value) {
    return new Promise(function (resolve) {
        var cacheDir = process.cwd() + "/podcast";
        var cacheFilePath = cacheDir + "/cache-" + key + ".txt";
        mkdirp(cacheDir)
            .then(function () {
            fs.writeFile(cacheFilePath, value, 'utf8', function () {
                resolve();
            });
        });
    });
};
var podcastCacheCheck = function (edge, pluginOption) {
    console.log('\tpodcastCacheCheck');
    return new Promise(function (resolve) {
        var html = edge.node.html;
        var _a = edge.node.frontmatter, title = _a.title, date = _a.date, channel = _a.channel, slug = _a.slug;
        var fileName = file_name_builder_1.buildFileNameShort(channel, slug, 'mp3');
        var cacheKey = file_name_builder_1.buildFileNameShort(channel, slug);
        var chacheValue = file_name_builder_1.buildMpCacheValue(title, html, channel, date, slug);
        var cacheDir = process.cwd() + "/podcast";
        var publicDir = process.cwd() + "/public/" + option_parser_1.getAudioPath(pluginOption);
        var ssml = html_to_ssml_1["default"](title, html);
        podcastCacheGet(cacheKey)
            .then(function (cachedValue) {
            var res = {
                edge: edge,
                cacheDir: cacheDir,
                publicDir: publicDir,
                ssml: ssml,
                fileName: fileName,
                cacheKey: cacheKey,
                chacheValue: chacheValue,
                isNeedReflash: true
            };
            if (cachedValue) {
                if (cachedValue === chacheValue) {
                    // 変更なし
                    console.log("\t\tnot change:" + fileName);
                    res.isNeedReflash = false;
                }
                else {
                    // 変更あり
                    console.log("\t\tchange:" + fileName);
                    res.isNeedReflash = true;
                }
            }
            else {
                // キャッシュなし
                console.log("\t\tnone:" + fileName);
                res.isNeedReflash = true;
            }
            resolve(res);
        });
    });
};
var podcastBuildMp3 = function (i) {
    console.log('\tpodcastBuildMp3');
    return new Promise(function (resolve) {
        var cacheFilePath = i.cacheDir + "/" + i.fileName;
        if (i.isNeedReflash) {
            console.log("\t\tmake:" + i.fileName);
            mp3_1["default"](i.ssml)
                .then(function (data) {
                mkdirp(i.cacheDir)
                    .then(function () {
                    var writeFile = util.promisify(fs.writeFile);
                    writeFile(cacheFilePath, data, 'binary')
                        .then(function () {
                        i.cachedFilePath = cacheFilePath;
                        resolve(i);
                    });
                });
            });
        }
        else {
            console.log("\t\tskip:" + i.fileName);
            i.cachedFilePath = cacheFilePath;
            resolve(i);
        }
    });
};
var podcastCacheSaver = function (i) {
    console.log('\tpodcastCacheSaver');
    return new Promise(function (resolve) {
        podcastCashSet(i.cacheKey, i.chacheValue)
            .then(function () {
            resolve(i);
        });
    });
};
var cacheToPablic = function (i) {
    return new Promise(function (resolve) {
        var publicPath = i.publicDir + "/" + i.fileName;
        console.log('cacheToPablic');
        console.log("\t" + i.cachedFilePath);
        console.log("\t" + publicPath);
        mkdirp(i.publicDir)
            .then(function () {
            fs.copyFile(i.cachedFilePath, publicPath, function (err) {
                if (!err) {
                    resolve(i);
                    return;
                }
                resolve(i);
            });
        });
    });
};
var podcastEdgeToFile = function (edge, options) {
    console.log('podcastEdgeToFile');
    return new Promise(function (resolve) {
        return podcastCacheCheck(edge, options)
            .then(function (res) {
            return podcastBuildMp3(res);
        })
            .then(function (res) {
            return podcastCacheSaver(res);
        })
            .then(function (res) {
            return cacheToPablic(res);
        })
            .then(function (res) {
            resolve(res);
        });
    });
};
module.exports = function (_a, pluginOptions, cb) {
    var cache = _a.cache, actions = _a.actions, graphql = _a.graphql;
    return graphql("\n  {\n    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: \"PodCast\"}}}, limit: 10) {\n      edges {\n        node {\n          id\n          fields {\n            slug\n          }\n          frontmatter {\n            slug\n            title\n            date\n            channel\n          }\n          rawMarkdownBody\n          html\n        }\n      }\n    }\n  }\n  ").then(function (result) {
        if (result.errors) {
            result.errors.forEach(function (e) { return console.error(e.toString()); });
            return Promise.reject(result.errors);
        }
        var list = file_checker_1.listFiles(process.cwd() + "/podcast");
        console.log('file check', list.length);
        var edges = result.data.allMarkdownRemark.edges;
        Promise.all(edges.map(function (edge) {
            return podcastEdgeToFile(edge, pluginOptions);
        }))
            .then(function () {
            console.log('/podcast');
            cb && cb();
        });
    });
};
