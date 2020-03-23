import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
import { Helmet } from 'react-helmet'
import Img from 'gatsby-image'

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
        description
      }
    }
  }
`

interface iIndexContainer {
  data: {
    markdownRemark: {
      frontmatter: {
        title: string
        description: string
        image: any
      }
    }
  }
}

const IndexContainer:React.FC<iIndexContainer> = (props) => {
  const { frontmatter: { title, description } } = props.data.markdownRemark
  return (
    <Layout>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" href="/podcast.rss" title="WWW.YAMBAL.NET Podcast" />
      </Helmet>
      <pre>{JSON.stringify(props.data.markdownRemark.frontmatter.image.childImageSharp.fluid, null, 2)}</pre>
      <Container>
        {title}
        {description}
        <Img
          style={{width: '100%', height: '200px'}}
          fixed={props.data.markdownRemark.frontmatter.image.childImageSharp.fluid}
        />
      </Container>
    </Layout>
  )
}

export default IndexContainer

/*

      <IndexPagePage
        image={frontmatter.image}
        title={frontmatter.title}
        heading={frontmatter.heading}
        subheading={frontmatter.subheading}
        mainpitch={frontmatter.mainpitch}
        description={frontmatter.description}
        intro={frontmatter.intro}
      />*/
