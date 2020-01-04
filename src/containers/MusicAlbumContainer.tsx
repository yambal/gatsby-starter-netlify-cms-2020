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
        }[]
      }
    }
  }
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data:{ markdownRemark:{ frontmatter: album }}} = props
  const { title: albumTitle } = album
  const { pageResources } = props
  let json
  let pageContext
  let songs
  if (pageResources) {
    json = pageResources.json
    if(json){
      pageContext = json.pageContext
      if(pageContext){
        songs= pageContext.songs
      }
    }
  }
  return (
    <Layout>
      <pre>{typeof songs}</pre>
      <pre>{JSON.stringify(songs, null, 2)}</pre>
      { albumTitle }
    </Layout>
  )
}

export default MusicAlbumContainer