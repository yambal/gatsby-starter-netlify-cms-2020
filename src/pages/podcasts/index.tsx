import React from 'react'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import Container from '../../components/Container'
import Column from '../../components/atoms/Column'
import { Helmet } from 'react-helmet'

const BlogIndexPage:React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" href="/podcast.rss" title="WWW.YAMBAL.NET Podcast" />
      </Helmet>
      <Container>
        <h1>PODCASTS</h1>
      </Container>
    </Layout>
  )
}

export default BlogIndexPage
