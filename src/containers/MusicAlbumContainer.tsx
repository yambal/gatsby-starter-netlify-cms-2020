import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
import useSiteMetadata from '../utils/SiteMetadata'

const { activeEnv } = useSiteMetadata()

const file = `file {
  publicURL
  prettySize
  internal {
    mediaType
    contentDigest
  }
}`

export const pageQuery = graphql`
  query MusicAlbumByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        songs {
          ${file}
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
        title: string
        songs: {
          title: string
          file: {
            publicURL: string
            prettySize: string
            internal: {
              mediaType: string
              contentDigest: string
            }
          }
        }[]
      }
    }
  }
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data: { markdownRemark: {frontmatter: album} } } = props
  const { title: albumTitle, songs: songFiles } = album
  return (
    <Layout>
      { activeEnv }
      { albumTitle }
      { songFiles.map((songFile, index) => {
        const { title: songTitle, file: {publicURL, prettySize, internal: {mediaType, contentDigest} } } = songFile
        return (
          <React.Fragment>
            {index} {songTitle} {publicURL} {prettySize} {mediaType} {contentDigest}
            <audio src={publicURL} controls></audio>
          </React.Fragment>
        )
      }) }
    </Layout>
  )
}

export default MusicAlbumContainer