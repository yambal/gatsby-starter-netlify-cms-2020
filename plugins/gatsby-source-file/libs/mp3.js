"use strict";
exports.__esModule = true;
var text_to_speech_1 = require("@google-cloud/text-to-speech");
var fs = require("fs");
var util = require("util");
var mkdirp = require("mkdirp-then");
var getMp3 = function (ssml, fileName, path) {
    return new Promise(function (resolve, reject) {
        // const mp3FilePath = `${process.cwd()}/public/${path}/${fileName}`
        var mp3StaticPath = process.cwd() + "/.cache/" + path;
        var mp3StaticFilePath = mp3StaticPath + "/" + fileName;
        var uri = "/" + path + "/" + fileName;
        var client = new text_to_speech_1["default"].TextToSpeechClient({
            projectId: 'texttospeach-261314',
            keyFilename: 'TextToSpeach-e373fcafd2ef.json'
        });
        var request = {
            input: {
                ssml: ssml
            },
            voice: {
                languageCode: 'ja-JP',
                name: 'ja-JP-Standard-A',
                ssmlGender: 'NEUTRAL'
            },
            audioConfig: { audioEncoding: 'MP3' }
        };
        client.synthesizeSpeech(request)
            .then(function (responses) {
            var response = responses[0];
            mkdirp(mp3StaticPath)
                .then(function (made) {
                var writeFile = util.promisify(fs.writeFile);
                writeFile(mp3StaticFilePath, response.audioContent, 'binary')
                    .then(function () {
                    console.log(mp3StaticFilePath);
                    resolve(uri);
                });
            });
        });
    });
};
exports["default"] = getMp3;
