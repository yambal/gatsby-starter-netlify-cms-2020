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

  const { pageResources } = props

  if(pageResources && pageResources.json){
    const { json:{pageContext:{songs}}} = pageResources
    return (
      <Layout>
        {songs && <MusicAlbum albumTitle={albumTitle} songs={songs} />}
      </Layout>
      )
  }
  return null
}

export default MusicAlbumContainer
