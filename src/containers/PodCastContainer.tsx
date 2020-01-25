import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'

export const pageQuery = graphql`
  query PodCastContainer($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
      }
      rawMarkdownBody
      html
      mp3
    }
  }
`

interface iPodCastContainer {
  data: {
    markdownRemark: {
      rawMarkdownBody: string
      mp3: string
    }
  }
}

const PodCastContainer:React.FC<iPodCastContainer> = (props) => {

  const { data: { markdownRemark: { mp3 } }} = props

  return (
    <Layout>
      <a href={mp3}>MP3</a>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  )
}
  
  export default PodCastContainer
  