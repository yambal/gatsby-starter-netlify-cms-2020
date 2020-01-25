const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util')
const crypto = require(`crypto`);

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
} = require(`gatsby/graphql`);

exports.onCreatePage = (props) => {
   console.log(18, Object.keys(props.page))
 }

const getMp3 = async(ssml) =>{
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
  return response
}

exports.setFieldsOnGraphQLNodeType = (props) => {
  const {type} = props

  /** MarkdownRemark にノードを追加する */
  if (type.name !== `MarkdownRemark`) {
    return {}
  }

  console.log(Object.keys(props))
  console.log('traceId', props.traceId, JSON.stringify(props.traceId))

  /*
  const ssml = `hello No.${}`
  const seed = `${id}>>${ssml}`
  const cacheKey = createContentDigest(seed)
  let obj = await cache.get(cacheKey)
  const response = await getMp3(ssml, cacheKey)
  const audioBuffer = Buffer.from(response.audioContent)
  console.log('audioBuffer', audioBuffer, Buffer.isBuffer(audioBuffer));
  */

  console.log(52)

  return {
    mp3: {
      type: GraphQLString,
      args: {
        prefix: {
          type: GraphQLString,
        }
      },
      resolve: (MDNode, args) => {
        // console.log(JSON.stringify(MDNode, null, 2))
        const {
          id,
          parent,
          children,
          internal,
          rawMarkdownBody,
          fileAbsolutePath,
          fields,
          frontmatter
        } = MDNode

        const response = await getMp3(`Hello ${id}`, cacheKey)
        const audioBuffer = Buffer.from(response.audioContent)
        console.log('audioBuffer', audioBuffer, Buffer.isBuffer(audioBuffer));

        return `node-id:${id} ${args.prefix}`
      }
    }
  }
}