import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Router } from "@reach/router"
import PodCastIndex from '../../components/morequles/PodCastIndex'
import { PodCastChannelRouterPage } from '../../components/morequles/PodCastChannelRouterPage'
import { PodCastEpisodeRouterPage } from '../../components/morequles/PodCastEpisodeRouterPage'
import { iPodCast } from '../../components/morequles/PodcastInterface'


interface PodCastsIndexPageProps {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          id: string
          field: string
          frontmatter: {
            title: string
            description: string
            date: string
            channel: string
          }
          mp3: iPodCast
        }
      }[]
    }
  }
}

const PodCastsIndexPage:React.FC<PodCastsIndexPageProps> = props => {
  const { edges } = props.data.allMarkdownRemark

  return (
    <Layout>
      <Container>
        <h1>PODCASTS</h1>
        <Router>
          <PodCastEpisodeRouterPage
            path={`/podcasts/:channel/:id`}
            edges={edges}
          />
          <PodCastChannelRouterPage
            path={`/podcasts/:channel`}
            edges={edges}
          />
          <PodCastIndex
            path={`/podcasts`}
            edges={edges}
          />
        </Router>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query PodcastIndexQuery {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "PodCast"}}}, sort: {fields: frontmatter___date, order: DESC}) {
      edges {
        node {
          id
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
            url
            absoluteUrl
            headers {
              text
              level
            }
            links {
              href
              text
            }
          }
        }
      }
    }
  }
`

export default PodCastsIndexPage
