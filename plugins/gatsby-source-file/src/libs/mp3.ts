import textToSpeech from '@google-cloud/text-to-speech'
import * as fs from 'fs'

import * as mkdirp from 'mkdirp-then'

// const getMp3 = (ssml: string, fileName: string, path: string) => {
const getMp3 = (ssml: string) => {
  return new Promise((resolve: (data) => void, reject) => {
    const client = new textToSpeech.TextToSpeechClient({
      projectId: 'texttospeach-261314',
      keyFilename: 'TextToSpeach-e373fcafd2ef.json'
    });
  
    const request: any = {
      input: {
        ssml
      },
      voice: {
        languageCode: 'ja-JP',
        name: 'ja-JP-Standard-A',
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    client.synthesizeSpeech(request)
      .then((responses) => {
        const response = responses[0]
        resolve(response)
        /*
            const writeFile = util.promisify(fs.writeFile);
            writeFile(mp3StaticFilePath, response.audioContent, 'binary')
              .then(
                () => {
                  console.log(mp3StaticFilePath);
                  resolve(uri)
                }
              )
        */
      })
  })
}

export default getMp3