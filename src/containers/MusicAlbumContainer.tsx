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

/*
export interface iReleaseSongFile {
  publicURL: string
  prettySize: string
  internal: {
    mediaType:string
    contentDigest: string
  }
}
*/

interface iMusicAlbumContainerPageResourcesJsonPageContext {
  songs: iSong[]
}

interface iMusicAlbumContainerPageResourcesJson {
  pageContext: iMusicAlbumContainerPageResourcesJsonPageContext
}

interface iMusicAlbumContainerPageResources {
  json: iMusicAlbumContainerPageResourcesJson
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
  pageResources: iMusicAlbumContainerPageResources
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data:{ markdownRemark:{ frontmatter: album }}} = props
  const { title: albumTitle } = album

  const pageResources = props.pageResources
  let json:iMusicAlbumContainerPageResourcesJson
  let pageContext:iMusicAlbumContainerPageResourcesJsonPageContext
  let songs:iSong[]
  if(pageResources){
    json = pageResources.json
    if(json) {
      pageContext = json.pageContext
      if(pageContext){
        songs = pageContext.songs
      }
    }
  }
  return (
    <Layout>
      <MusicAlbum albumTitle={albumTitle} songs={songs} />
    </Layout>
  )
}

export default MusicAlbumContainer
