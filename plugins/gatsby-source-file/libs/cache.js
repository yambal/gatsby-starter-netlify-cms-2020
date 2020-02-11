"use strict";
exports.__esModule = true;
var fs = require("fs");
var filePath_1 = require("./filePath");
var mkdirp = require("mkdirp-then");
var crypto = require("crypto");
var util = require("util");
/** キャッシュを取得 */
exports.podcastCacheGet = function (key) {
    return new Promise(function (resolve) {
        var cacheFilePath = filePath_1.path.cacheFilePath(key);
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
/** キャッシュを保存 */
exports.podcastCashSet = function (key, value, channel, slug, audio) {
    return new Promise(function (resolve) {
        var cacheDir = filePath_1.path.cacheDir;
        var cacheFilePath = filePath_1.path.cacheFilePath(key);
        var edgeMp3CacheFilePath = filePath_1.path.edgeMp3CacheFilePath(channel, slug);
        mkdirp(cacheDir)
            .then(function () {
            fs.writeFile(cacheFilePath, value, 'utf8', function () {
                if (audio) {
                    var writeFile = util.promisify(fs.writeFile);
                    writeFile(edgeMp3CacheFilePath, audio, 'binary')
                        .then(function () {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            });
        });
    });
};
/** ハッシュ生成器 */
exports.buildMDHash = function (title, rawMarkdownBody) {
    return crypto.createHash('md5').update(title + "-" + rawMarkdownBody, 'utf8').digest('hex');
};
/** キャッシュ値 */
exports.buildMpCacheValue = function (title, body, channel, date, slug) {
    var hashSeed = title + "-" + body + "-" + channel + "-" + date + "-" + slug;
    return crypto.createHash('md5').update(hashSeed, 'utf8').digest('hex');
};
exports.checkCache = function (edge, pluginOption) {
    return new Promise(function (resolve) {
        var html = edge.node.html;
        var _a = edge.node.frontmatter, title = _a.title, date = _a.date, channel = _a.channel, slug = _a.slug;
        var cacheKey = filePath_1.path.edgeKey(channel, slug);
        exports.podcastCacheGet(cacheKey)
            .then(function (cachedValue) {
            var response = {
                hasCashe: false,
                isOld: false,
                cacheKey: filePath_1.path.edgeKey(channel, slug),
                cacheValue: exports.buildMpCacheValue(title, html, channel, date, slug),
                mp3CacheFilePath: filePath_1.path.edgeMp3CacheFilePath(channel, slug),
                mp3PublicDir: filePath_1.path.publicMp3Dir(pluginOption),
                mp3PublicFilePath: filePath_1.path.edgeMp3PublicFilePath(channel, slug, pluginOption),
                channel: channel,
                slug: slug
            };
            if (cachedValue) {
                response.hasCashe = true;
                if (cachedValue === response.cacheValue) {
                    // 変更なし
                    response.isOld = false;
                }
                else {
                    // 変更あり
                    response.isOld = true;
                }
            }
            else {
                // キャッシュなし
                response.isOld = false;
            }
            resolve(response);
        });
    });
};
exports.cacheToPablic = function (podcastCacheCheckResponse) {
    return new Promise(function (resolve) {
        mkdirp(podcastCacheCheckResponse.mp3PublicDir)
            .then(function () {
            fs.copyFile(podcastCacheCheckResponse.mp3CacheFilePath, podcastCacheCheckResponse.mp3PublicFilePath, function (err) {
                if (!err) {
                    resolve(podcastCacheCheckResponse);
                    return;
                }
                resolve(podcastCacheCheckResponse);
            });
        });
    });
};
