const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');

module.exports = async function getMp3(ssml, slug) {
  console.group('getMp3')
  console.group(ssml)

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

  const dir = `./public/audio`

  console.log('dir', dir, process.cwd())
  await mkdirp(dir)

  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`${dir}/${slug}.mp3`, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${slug}.mp3`);
  console.groupEnd()
  
  return response.audioContent
}