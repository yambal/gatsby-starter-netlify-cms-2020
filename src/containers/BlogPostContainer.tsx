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
        date(formatString: "MMMM DD, YYYY")
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
      frontmatter: any
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
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  )

}

export default BlogPost
