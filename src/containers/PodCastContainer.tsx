import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'

// const textToSpeech = require('@google-cloud/text-to-speech');
/*
const fs = require('fs');
const util = require('util');

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
}
*/
export const pageQuery = graphql`
  query PodCastContainer($id: String!) {
    markdownRemark(id: { eq: $id }) {
        id
        frontmatter {
          title
        }
        rawMarkdownBody
        html
    }
  }
`

interface iPodCastContainer {
  data: {
    markdownRemark: {
      rawMarkdownBody: string
    }
  }
}

const PodCastContainer:React.FC<iPodCastContainer> = (props) => {

  const { data: { markdownRemark: { rawMarkdownBody: body } }} = props

  return (
    <Layout>
      <pre>{JSON.stringify(body, null, 2)}</pre>
    </Layout>
  )
}
  
  export default PodCastContainer
  