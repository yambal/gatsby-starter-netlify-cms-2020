const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');

module.exports = async function getMp3(ssml, fileName, path) {
  console.group('- - - - - -')
  console.log('\tgetMp3')
  console.log(ssml)

  const mp3FilePath = `./public/${path}/${fileName}`
  const uri = `/${path}/${fileName}`

  console.log(`\t${mp3FilePath}`)
  console.log(`\t${uri}`)

  const client = new textToSpeech.TextToSpeechClient({
    projectId: 'texttospeach-261314',
    keyFilename: 'TextToSpeach-e373fcafd2ef.json'
  });

  const request = {
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

  const [response] = await client.synthesizeSpeech(request);

  await mkdirp(`./public/${path}`)

  const writeFile = util.promisify(fs.writeFile);
  await writeFile(mp3FilePath, response.audioContent, 'binary');
  console.log(`\tAudio content written to file: ${fileName}`);
  console.log('- - - - - -')
  console.groupEnd()
  
  return uri
}