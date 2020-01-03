import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
import MusicAlbum from '../components/pages/MusicAlbum'

export const pageQuery = graphql`
  query MusicAlbumByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        songs {
          songfile
          title
        }
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
        songs: {
          songfile: string
          title: string
        }
      }
    }
  }
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data: { markdownRemark: id } } = props
  const { data: { markdownRemark: { frontmatter } } } = props
  return (
    <Layout>
      <MusicAlbum
        albumTitle={frontmatter.title}
        songList={frontmatter.songs}
      />
    </Layout>
  )
}

export default MusicAlbumContainer