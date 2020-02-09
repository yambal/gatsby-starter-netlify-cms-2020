"use strict";
exports.__esModule = true;
var mp3_1 = require("./libs/mp3");
var html_to_ssml_1 = require("./libs/html-to-ssml");
var file_name_builder_1 = require("./libs/file-name-builder");
var option_parser_1 = require("./libs/option-parser");
var fs = require("fs");
var podcastCacheCheck = function (edge, pluginOption, cashier) {
    console.log('\tpodcastCacheCheck');
    return new Promise(function (resolve) {
        var html = edge.node.html;
        var _a = edge.node.frontmatter, title = _a.title, date = _a.date, channel = _a.channel, slug = _a.slug;
        var fileName = file_name_builder_1.buildFileNameShort(channel, slug, 'mp3');
        var chacheValue = file_name_builder_1.buildMpCacheValue(title, html, channel, date, slug);
        console.log("\t\t" + fileName + ":" + chacheValue);
        var mp3PublicPath = process.cwd() + "/public/" + option_parser_1.getAudioPath(pluginOption);
        var mp3PublicFilePath = mp3PublicPath + "/" + fileName;
        try {
            fs.statSync(mp3PublicFilePath);
            console.log('ファイル・ディレクトリは存在します。');
            // fs.copyFileSync(mp3PublicFilePath, mp3PublicFilePath);
            // console.log('コピー');
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                console.log('ファイル・ディレクトリは存在しません。');
            }
            else {
                console.log(error);
            }
        }
        cashier.get(fileName)
            .then(function (chachedValue) {
            console.log("\t\tchachedValue:" + chachedValue);
            if (!chachedValue) {
                resolve({
                    edge: edge,
                    option: pluginOption,
                    cashier: cashier,
                    reflesh: true,
                    title: title,
                    html: html,
                    fileName: fileName,
                    chacheValue: chacheValue
                });
                return;
            }
            if (chachedValue !== chacheValue) {
                resolve({
                    edge: edge,
                    option: pluginOption,
                    cashier: cashier,
                    reflesh: true,
                    title: title,
                    html: html,
                    fileName: fileName,
                    chacheValue: chacheValue
                });
                return;
            }
            resolve({
                edge: edge,
                option: pluginOption,
                cashier: cashier,
                reflesh: false,
                title: title,
                html: html,
                fileName: fileName,
                chacheValue: chacheValue
            });
        });
    });
};
var podcastBuildMp3 = function (i) {
    console.log('\tpodcastBuildMp3');
    return new Promise(function (resolve) {
        if (i.reflesh) {
            console.log("\t\tmake:" + i.fileName);
            mp3_1["default"](html_to_ssml_1["default"](i.title, i.html), i.fileName, option_parser_1.getAudioPath(i.option))
                .then(function () {
                resolve(i);
            });
        }
        else {
            console.log("\t\tskip:" + i.fileName);
            resolve(i);
        }
    });
};
var podcastCacheSaver = function (i) {
    console.log('\tpodcastCacheSaver');
    return new Promise(function (resolve) {
        if (i.reflesh) {
            i.cashier.set(i.fileName, i.chacheValue)
                .then(function () {
                console.log("\t\tcached:" + i.fileName + " - " + i.chacheValue);
                resolve(i);
            });
        }
        else {
            console.log("\t\tskip:" + i.fileName + " - " + i.chacheValue);
            resolve(i);
        }
    });
};
var podcastEdgeToFile = function (edge, options, cashier) {
    console.log('podcastEdgeToFile');
    return new Promise(function (resolve) {
        return podcastCacheCheck(edge, options, cashier)
            .then(function (res) {
            return podcastBuildMp3(res);
        })
            .then(function (res) {
            return podcastCacheSaver(res);
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
        var list = listFiles(process.cwd() + "/public");
        console.log(list);
        var edges = result.data.allMarkdownRemark.edges;
        Promise.all(edges.map(function (edge) {
            return podcastEdgeToFile(edge, pluginOptions, cache);
        }))
            .then(function () {
            console.log('/podcast');
            cb && cb();
        });
    });
};
var FileType = {
    File: 'file',
    Directory: 'directory',
    Unknown: 'unknown'
};
var getFileType = function (path) {
    try {
        var stat = fs.statSync(path);
        switch (true) {
            case stat.isFile():
                return FileType.File;
            case stat.isDirectory():
                return FileType.Directory;
            default:
                return FileType.Unknown;
        }
    }
    catch (e) {
        return FileType.Unknown;
    }
};
var listFiles = function (dirPath) {
    var ret = [];
    var paths = fs.readdirSync(dirPath);
    paths.forEach(function (a) {
        var path = dirPath + "/" + a;
        switch (getFileType(path)) {
            case FileType.File:
                ret.push(path);
                break;
            case FileType.Directory:
                ret.push.apply(ret, listFiles(path));
                break;
            default:
            /* noop */
        }
    });
    return ret;
};
