import textToSpeech from '@google-cloud/text-to-speech'
import * as fs from 'fs'
import * as util from 'util'
import * as mkdirp from 'mkdirp-then'

const getMp3 = (ssml: string, fileName: string, path: string) => {
  return new Promise((resolve: (uri: string) => void, reject) => {

    // const mp3FilePath = `${process.cwd()}/public/${path}/${fileName}`
    const mp3StaticPath = `${process.cwd()}/public/${path}`
    const mp3StaticFilePath = `${mp3StaticPath}/${fileName}`

    const mp3PodcastPath = `${process.cwd()}/podcast/${path}`
    const mp3PodcastFilePath = `${mp3PodcastPath}/${fileName}`


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
  
    client.synthesizeSpeech(request)
      .then((responses) => {
        const response = responses[0]
        mkdirp(mp3StaticPath)
          .then(made => {
            const writeFile = util.promisify(fs.writeFile);
            writeFile(mp3StaticFilePath, response.audioContent, 'binary')
              .then(
                () => {
                  console.log(mp3StaticFilePath);
                  resolve(uri)
                }
              )
          })
      })
  })
}

export default getMp3