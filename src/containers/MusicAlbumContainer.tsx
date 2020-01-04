import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
export const pageQuery = graphql`
  query MusicAlbumByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        
        title
      }
    }
  }
`

interface iMusicAlbumContainer {
  data: {
    markdownRemark: {
      id: string
      frontmatter: {
        title: string
      }
    }
  }
  pageResources: {
    json: {
      pageContext: {
        songs: {
          file: any
          title: string
        }
      }
    }
  }
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data:{ markdownRemark:{ frontmatter: album }}} = props
  const { title: albumTitle } = album
  const { pageResources } = props
  let json
  if (pageResources) {
    json = pageResources.json
  }
  return (
    <Layout>
      <pre>{typeof json}</pre>
      <pre>{JSON.stringify(json, null, 2)}</pre>
      { albumTitle }
    </Layout>
  )
}

export default MusicAlbumContainer