"use strict";
exports.__esModule = true;
var fs = require("fs");
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
exports.listFiles = function (dirPath) {
    var ret = [];
    try {
        var paths = fs.readdirSync(dirPath);
        paths.forEach(function (a) {
            var path = dirPath + "/" + a;
            switch (getFileType(path)) {
                case FileType.File:
                    ret.push(path);
                    break;
                case FileType.Directory:
                    ret.push.apply(ret, exports.listFiles(path));
                    break;
                default:
                /* noop */
            }
        });
        return ret;
    }
    catch (e) {
        return [];
    }
};
