import React from 'react'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Router, RouteComponentProps } from "@reach/router"
import { Link } from 'gatsby'
import { graphql } from 'gatsby'
import { useTransition, animated } from 'react-spring'

interface iTopics {
  frontmatter: {
    title: string
    slug: string
    description: string
    pages: {
      pagetitle: string
      pagedescription: string
      sections: any[]
    }[]
  }
}

// Ruiter -------------------------------------------------
interface iTopicsRouter {
  path: string
  slug?: string
  topics: iTopics
}

const TopicsRouter: React.FC<iTopicsRouter> = (props) => {

  const getTopic = React.useMemo(
    () => (slug: string, topics):iTopics => {
      return topics.filter((topic) => {
        return topic.frontmatter.slug === slug
      })[0]
    },
    [props.topics]
  )

  const getPageIndex = React.useMemo(
    () => (pageIndexString: string): number => {
      if (pageIndexString.length > 0) {
        return parseInt(pageIndexString)
      } else {
        return null
      }
    },
    [props.topics]
  )

  /* Topic */
  const [topic, setTopic] = React.useState<iTopics>(getTopic(props.slug, props.topics))
  React.useEffect(
    () => {
      setTopic(getTopic(props.slug, props.topics))
    },
    [props.slug, props.topics]
  )

  /** PageIndex */
  const [pageIndex, setPageIndex] = React.useState(getPageIndex(props['*']))
  React.useEffect(
    () => {
      setPageIndex(getPageIndex(props['*']))
    },
    [props['*']]
  )

  const [pages, setPages] = React.useState([])
  const [pageComponants, setPageComponants] = React.useState([])
  React.useEffect(
    () => {
      setPages(topic.frontmatter.pages)

      const components = topic.frontmatter.pages.map(
        (page) => {
          return ({style}) => {
            return(
              <animated.div style={{ ...style }}>
                <h2>{page.pagetitle}</h2>
                <p>{page.pagedescription}</p>
                <pre>{JSON.stringify(page.sections, null, 2)}</pre>
                {topic.frontmatter.pages.map(
                  (page, index) => {
                    return <Link to={`/topics/test/${index}`} key={index}>hoge</Link>
                  }
                )}
              </animated.div>
            )
          }
        }
      )
      setPageComponants(components)
    },
    [topic]
  )

  const transitions = useTransition(pageIndex, p => p, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  })

  return (
    <div>
      <h1>{topic.frontmatter.title}</h1>
      <p>{topic.frontmatter.description}</p>
      
      {pageComponants.length > 0 && transitions.map(({ item, props, key }) => {
        const Page = pageComponants[item]
        return <Page style={props} key={key}/>
      })}
    </div>
  )
}

// ---------------------------------------------------------
interface iTopicsIndex {
  data: {
    allMarkdownRemark: {
      nodes: iTopics
    }
  }
}

const TopicsIndex: React.FC<iTopicsIndex> = (props) => {
  const { nodes: topics } = props.data.allMarkdownRemark
  return(
    <Layout dark>
      <Container>
        <Router>
          <TopicsRouter
            path={`/topics/:slug/*`}
            topics={topics}
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
          description
          pages {
            pagedescription
            pagetitle
            sections {
              body
              sectionescription
              sectiontitle
            }
          }
        }
        id
      }
    }
  }
`

export default TopicsIndex
