"use strict";
exports.__esModule = true;
var text_to_speech_1 = require("@google-cloud/text-to-speech");
var getMp3Duration_1 = require("./getMp3Duration");
var arrayBufferToBuffer = require("arraybuffer-to-buffer");
var fs = require("fs");
var util = require("util");
var mkdirp = require("mkdirp-then");
var getMp3 = function (ssml, fileName, path) {
    return new Promise(function (resolve, reject) {
        console.group('- - - - - -');
        console.log('\tgetMp3');
        var mp3FilePath = "./public/" + path + "/" + fileName;
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
        return client.synthesizeSpeech(request)
            .then(function (responses) {
            var response = responses[0];
            var duration = getMp3Duration_1.getMp3Duration(arrayBufferToBuffer(response.audioContent.buffer));
            return mkdirp("./public/" + path)
                .then(function (made) {
                console.log("mkdir -p:" + made);
                var writeFile = util.promisify(fs.writeFile);
                return writeFile(mp3FilePath, response.audioContent, 'binary')
                    .then(function () {
                    console.log("\tAudio content written to file: " + fileName);
                    console.log('- - - - - -');
                    console.groupEnd();
                    resolve({
                        uri: uri,
                        dulation: duration
                    });
                });
            });
        });
    });
};
exports["default"] = getMp3;
