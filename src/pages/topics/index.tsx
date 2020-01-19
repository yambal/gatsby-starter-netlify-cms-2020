import React from 'react'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Router, RouteComponentProps } from "@reach/router"
import { Link } from 'gatsby'
import StudyRouterPage from '../../components/morequles/StudyRouterPage'
import { graphql } from 'gatsby'



// Ruiter -------------------------------------------------
interface iTopicsRouter {
  path: string
  slug?: string
  topics: any
}
const TopicsRouter: React.FC<iTopicsRouter> = (props) => {
  return (
    <pre>{JSON.stringify(props, null, 2)}</pre>
  )
}

// ---------------------------------------------------------
interface iTopicsIndex {
  data: {
    allMarkdownRemark: {
      nodes: any[]
    }
  }
}

const TopicsIndex: React.FC<iTopicsIndex> = (props) => {
  const { nodes } = props.data.allMarkdownRemark
  return(
    <Layout dark>
      <Container>
        <Router>
          <TopicsRouter
            path={`/topics/:slug/*`}
            topics={nodes}
            slug={props['*']}
          />
          
        </Router>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
  query TopicsIndexQuery {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "TopicPages"}}}) {
      nodes {
        frontmatter {
          title
          slug
          templateKey
        }
        id
      }
    }
  }
`

export default TopicsIndex
