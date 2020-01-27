"use strict";
exports.__esModule = true;
var text_to_speech_1 = require("@google-cloud/text-to-speech");
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
                name: 'ja-JP-Wavenet-A', // ja-JP-Standard-A
                ssmlGender: 'FEMALE' // MALE, FEMALE, NEUTRAL
            },
            audioConfig: { audioEncoding: 'MP3' }
        };
        return client.synthesizeSpeech(request)
            .then(function (responses) {
            var response = responses[0];
            return mkdirp("./public/" + path)
                .then(function (made) {
                console.log("mkdir -p:" + made);
                var writeFile = util.promisify(fs.writeFile);
                return writeFile(mp3FilePath, response.audioContent, 'binary')
                    .then(function () {
                    console.log("\tAudio content written to file: " + fileName);
                    console.log('- - - - - -');
                    console.groupEnd();
                    resolve(uri);
                });
            });
        });
    });
};
exports["default"] = getMp3;
