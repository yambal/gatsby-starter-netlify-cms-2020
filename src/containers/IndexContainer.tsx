import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPageTemplate from '../components/Templates/IndexPageTemplate'

export const pageQuery = graphql`
  query IndexContainer {
    markdownRemark(frontmatter: { templateKey: { eq: "Index" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        subheading
        mainpitch {
          title
          description
        }
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`

interface iIndexContainer {
  data: {
    markdownRemark: {
      frontmatter: any
    }
  }
}

const IndexContainer:React.FC<iIndexContainer> = (props) => {
  const { frontmatter } = props.data.markdownRemark
  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
      />
    </Layout>
  )
}

export default IndexContainer