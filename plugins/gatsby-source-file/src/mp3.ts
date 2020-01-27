import textToSpeech from '@google-cloud/text-to-speech'
import * as fs from 'fs'
import * as util from 'util'
import * as mkdirp from 'mkdirp-then'

const getMp3 = (ssml: string, fileName: string, path: string) => {
  return new Promise((resolve: (url: string) => void, reject) => {
    console.group('- - - - - -')
    console.log('\tgetMp3')

    const mp3FilePath = `./public/${path}/${fileName}`
    const uri = `/${path}/${fileName}`

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
  
    return client.synthesizeSpeech(request)
      .then((responses ) => {
        const response = responses[0]
        return mkdirp(`./public/${path}`)
          .then(made => {
            console.log(`mkdir -p:${made}`)
            const writeFile = util.promisify(fs.writeFile);
            return writeFile(mp3FilePath, response.audioContent, 'binary')
              .then(
                () => {
                  console.log(`\tAudio content written to file: ${fileName}`);
                  console.log('- - - - - -')
                  console.groupEnd()
                  resolve(uri)
                }
              )
          })
      })
  })

}

export default getMp3