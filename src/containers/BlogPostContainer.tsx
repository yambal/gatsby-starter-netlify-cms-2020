import React from 'react'
import Helmet from 'react-helmet'
import { graphql} from 'gatsby'
import Layout from '../components/Layout'
import { HTMLContent } from '../components/Content'
import BlogPostPage from '../components/pages/BlogPostPage'

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date
        title
        description
        tags
      }
    }
  }
`

interface iBlogPost {
  data:{
    markdownRemark: {
      html: any
      frontmatter: {
        date: string
        title: string
        description: string
        tags: string[]
      }
    }
  }
}

const BlogPost:React.FC<iBlogPost> = (props) => {

  const { data: { markdownRemark: post } } = props

  return (
    <Layout>
      <BlogPostPage
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        date={new Date(post.frontmatter.date)}
      />
    </Layout>
  )

}

export default BlogPost
