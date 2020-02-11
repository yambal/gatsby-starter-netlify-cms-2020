"use strict";
exports.__esModule = true;
var text_to_speech_1 = require("@google-cloud/text-to-speech");
var getMp3 = function (ssml) {
    return new Promise(function (resolve, reject) {
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
            var audioContent = responses[0].audioContent;
            resolve(audioContent);
        });
    });
};
exports["default"] = getMp3;
