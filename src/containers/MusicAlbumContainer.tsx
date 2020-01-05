import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
import MusicAlbum from '../components/pages/MusicAlbum'
import { iSong } from '../components/atoms/Song'

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

export interface iReleaseSongFile {
  publicURL: string
  prettySize: string
  internal: {
    mediaType:string
    contentDigest: string
  }
}

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
        songs: iSong[]
      }
    }
  }
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data:{ markdownRemark:{ frontmatter: album }}} = props
  const { title: albumTitle } = album

  const { pageResources } = props
  let json
  if(pageResources){
    json = pageResources.json
  }
  return (
    <Layout>
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </Layout>
  )
}

export default MusicAlbumContainer

/*
<MusicAlbum albumTitle={albumTitle} songs={songs} />
*/