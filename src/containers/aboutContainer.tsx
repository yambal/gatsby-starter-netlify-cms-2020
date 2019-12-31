import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import { HTMLContent } from '../components/Content'
import AboutPageTemplate from '../components/Templates/AboutPageTemplate'

interface iAboutContainer {
  data: {
    markdownRemark: any
  }
}

const AboutPage:React.FC<iAboutContainer> = (props) => {
  const { markdownRemark: post } = props.data

  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
