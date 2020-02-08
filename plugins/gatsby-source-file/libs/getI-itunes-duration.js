"use strict";
exports.__esModule = true;
var fs = require('fs');
var get_mp3_duration_1 = require("./get-mp3-duration");
exports.getITunesDuration = function (mp3FilePath) {
    var buffer = fs.readFileSync(mp3FilePath);
    var duration = get_mp3_duration_1.getMp3Duration(buffer); // ms
    var h = Math.floor(duration / 1000 / 3600);
    var m = Math.floor((duration / 1000 - h * 3600) / 60);
    var s = Math.floor(duration / 1000 - h * 3600 - m * 60) + 1;
    var strDuration = ('00' + h).slice(-2) + ":" + ('00' + m).slice(-2) + ":" + ('00' + s).slice(-2);
    return strDuration;
};