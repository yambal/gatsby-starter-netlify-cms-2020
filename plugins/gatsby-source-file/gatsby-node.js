const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const crypto = require(`crypto`);

const getMp3 = async(ssml, name) =>{
  console.group('getMp3')
  console.group(ssml)
  const client = new textToSpeech.TextToSpeechClient({
      projectId: 'texttospeach-261314',
      keyFilename: 'TextToSpeach-e373fcafd2ef.json'
  });
  const request = {
    input: {text: ssml},
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await client.synthesizeSpeech(request);
  return response

  // https://www.gatsbyjs.org/packages/gatsby-source-filesystem/#createfilenodefrombuffer
  /*
  const audioBuffer = Buffer.from(response.audioContent)
  console.log(audioBuffer, Buffer.isBuffer(audioBuffer));
  */

  /*
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`${name}.mp3`, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${name}.mp3`);
  console.groupEnd()
  */
}

const createContentDigest = obj => crypto.createHash(`md5`).update(JSON.stringify(obj)).digest(`hex`);

exports.sourceNodes = async ({ actions, createNodeId, cache, store }) => {

  const ssml = 'こんにちわ'
  const id = "123"

  const seed = `${id}>>${ssml}`
  const cacheKey = createContentDigest(seed)
  let obj = await cache.get(cacheKey)
  console.log('----------------------------------------------')
  // https://www.gatsbyjs.org/docs/preprocessing-external-images/
  console.log(obj)
  if (!obj) {
    const response = await getMp3(ssml, cacheKey)
    const audioBuffer = Buffer.from(response.audioContent)
    console.log('audioBuffer', audioBuffer, Buffer.isBuffer(audioBuffer));

    /*
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`${name}.mp3`, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${name}.mp3`);
    console.groupEnd()
    */
  } else {
    console.log(obj)
  }

  /*
    const sampleImageUrls = ['https://placehold.jp/150x150.png']


    await Promise.all(sampleImageUrls.map(async sampleImageUrl => {

        // createRemoteFileNodeで外部の画像のファイルノードを作成する
        const fileNode = await createRemoteFileNode({
          url: sampleImageUrl,
          cache,
          store,
          createNode: actions.createNode,
          createNodeId: createNodeId,
        });
    
        // 他ファイルノードと区別するための識別子を付与
        await actions.createNodeField({
          node: fileNode,
          name: 'SampleImage',
          value: 'true',
        });
    
        // メタ情報として画像のURLを付与
        await actions.createNodeField({
          node: fileNode,
          name: 'link',
          value: sampleImageUrl,
        });
    
        return fileNode;
    }));
    */
}