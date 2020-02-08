import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import Container from '../../components/Container'
import Column from '../../components/atoms/Column'
import { Helmet } from 'react-helmet'

const BlogIndexPage:React.FC = props => {
  return (
    <Layout>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" href="/podcast.rss" title="WWW.YAMBAL.NET Podcast" />
      </Helmet>
      <Container>
        <h1>PODCASTS</h1>
        <pre>{JSON.stringify(props)}</pre>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query PodcastIndexQuery {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "PodCast"}}}, limit: 10) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
            channel
          }
          mp3 {
            absoluteUrl
            url
            path
          }
        }
      }
    }
  }
`

export default BlogIndexPage
