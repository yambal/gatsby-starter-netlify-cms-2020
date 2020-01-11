import React from 'react'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Router, RouteComponentProps } from "@reach/router"
import { Link } from 'gatsby'
import StudyRouterPage from '../../components/morequles/StudyRouterPage'
import styled from 'styled-components'

interface iStudyIndexProps {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          id: string
          frontmatter: {
            title: string
            slug: string
            pages: any[]
          }
        }
      }[]
    }
  }
}

const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;

const StudyIndex: React.FC<iStudyIndexProps> = (props) => {
  let Home = () => <div>Home</div>
  let Dash = () => <div>Dash</div>

  const { data: { allMarkdownRemark: { edges } } } = props

  return(
    <Layout dark>
      <Container>
        <Link to="study">test</Link>
        <Link to="study/react-spring">react-spring</Link>
        <Link to="study/react-spring/0">0</Link>
        <Router>
          <StudyRouterPage
            path={`/study/:slug/*`}
            studies={edges}
          />
        </Router>
      </Container>
    </Layout>
  )
}

export const pageQuery = graphql`
query StudyIndexQuery {
  allMarkdownRemark(limit: 1000, filter: {frontmatter: {templateKey: {eq: "StudyPages"}}}) {
    edges {
      node {
        id
        frontmatter {
          pages {
            pagedescription
            pagetitle
            sections {
              sectionescription
              sectiontitle
            }
          }
          title
          slug
        }
      }
    }
  }
}
`

export default StudyIndex