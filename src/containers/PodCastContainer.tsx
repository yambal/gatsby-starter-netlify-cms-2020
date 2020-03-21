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

  return (
    <Layout>
    ???
    </Layout>
  )
}
  
  export default PodCastContainer
  