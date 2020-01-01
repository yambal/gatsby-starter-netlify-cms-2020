import React from 'react'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import Container from '../../components/Container'
import Column from '../../components/atoms/Column'

const BlogIndexPage:React.FC = () => {
  return (
    <Layout>
      <Container>
        <h1>Latest Stories</h1>
        <Column>
          <BlogRoll />
        </Column>
      </Container>
    </Layout>
  )
}

export default BlogIndexPage
