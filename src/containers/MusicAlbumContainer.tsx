import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
import Song from '../components/atoms/Song'
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
        songs: {
          file: iReleaseSongFile | string
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
  let songs = []
  if (pageResources) {
    json = pageResources.json
    if(json){
      pageContext = json.pageContext
      if(pageContext){
        songs = pageContext.songs
      }
    }
  }
  return (
    <Layout>
      { albumTitle }
      <pre>{JSON.stringify(songs, null, 2)}</pre>
      {songs.map((song, index) => {
        console.log(JSON.stringify(song, null, 2))
        return(
          <Song songTitle={song.title} songFile={song.file} key={`song-${index}`}/>
        )
      })}
    </Layout>
  )
}

export default MusicAlbumContainer