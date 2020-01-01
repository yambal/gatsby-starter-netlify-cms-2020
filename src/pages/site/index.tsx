import React from 'react'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import Container from '../../components/Container'
import Column from '../../components/atoms/Column'

const BlogIndexPage:React.FC = () => {
  return (
    <Layout>
      <Container>
        <h1>このサイトについて</h1>
        <Column>
          <h2>Netlify CMS</h2>
          <p>このサイトはCMSに <a href="https://www.netlifycms.org/">Netlify CMS</a> を利用しています</p>
          <a href="https://app.netlify.com/sites/gatsby-starter-netlify-cms-ci/deploys" rel="nofollow">
            <img
              src="https://camo.githubusercontent.com/d06493c6538378d9efb5b7474c143298a74e66f8/68747470733a2f2f6170692e6e65746c6966792e636f6d2f6170692f76312f6261646765732f62363534633934652d303861362d346237392d623434332d3738333735383162316438642f6465706c6f792d737461747573"
              alt="Netlify Status"
              data-canonical-src="https://api.netlify.com/api/v1/badges/b654c94e-08a6-4b79-b443-7837581b1d8d/deploy-status"
              style={{maxWidth: '100%' }}
            />
          </a>
        </Column>
      </Container>
    </Layout>
  )
}

export default BlogIndexPage
