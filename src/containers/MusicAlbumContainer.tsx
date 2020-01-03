import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'

/*
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
*/

const MusicAlbumContainer:React.FC = (props) => {
  return (
    <Layout>
        <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  )
}

export default MusicAlbumContainer