const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');

module.exports = async function getMp3(ssml, slug, path) {
  console.group('getMp3')
  console.group(ssml)

  const mp3FilePath = `./public/${path}/${slug}.mp3`
  const uri = `/${path}/${slug}.mp3`

  console.log(13, mp3FilePath)
  console.log(14, uri)

  const client = new textToSpeech.TextToSpeechClient({
    projectId: 'texttospeach-261314',
    keyFilename: 'TextToSpeach-e373fcafd2ef.json'
  });
  const request = {
    input: {text: ssml},
    voice: {languageCode: 'ja-JP', ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await client.synthesizeSpeech(request);

  await mkdirp(`./public/${path}`)

  const writeFile = util.promisify(fs.writeFile);
  await writeFile(mp3FilePath, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${slug}.mp3`);
  console.groupEnd()
  
  return uri
}