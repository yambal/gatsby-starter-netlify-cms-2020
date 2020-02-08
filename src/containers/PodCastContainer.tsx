import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

export const pageQuery = graphql`
  query PodCastContainer($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
      }
      rawMarkdownBody
      html
      mp3 {
        url
      }
    }
  }
`

interface iPodCastContainer {
  data: {
    markdownRemark: {
      rawMarkdownBody: string
      mp3: {
        url: string
      }
    }
  }
}

const PodCastContainer:React.FC<iPodCastContainer> = (props) => {

  const { data: { markdownRemark: { mp3 } }} = props

  
  return (
    <Layout>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" href="/podcast.rss" title="WWW.YAMBAL.NET" />
      </Helmet>
      <a href={mp3.url}>MP3</a>
    </Layout>
  )
}
  
  export default PodCastContainer
  