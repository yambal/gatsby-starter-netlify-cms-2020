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
        songs {
          file
          title
        }
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
        songs: {
          file: File
          title: string
        }[]
      }
    }
  }
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  return (
    <Layout>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  )
}

export default MusicAlbumContainer