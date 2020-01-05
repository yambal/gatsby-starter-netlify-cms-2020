import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import IndexPagePage from '../components/pages/IndexPagePage'
import Container from '../components/Container'
import MusicAlbum from '../components/pages/MusicAlbum'
import { iSong } from '../components/atoms/Song'
import Img from "gatsby-image"
import Column from '../components/atoms/Column'

export const pageQuery = graphql`
  query MusicAlbumByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        description
        featuredimage {
          childImageSharp {
            fluid(maxWidth: 500, quality: 100) {
              ...GatsbyImageSharpFluid
              presentationWidth
            }
          }
        }
      }
    }
  }
`

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
        description: string
        featuredimage: any
      }
    }
  }
  pageResources: iMusicAlbumContainerPageResources
}

const MusicAlbumContainer:React.FC<iMusicAlbumContainer> = (props) => {
  const { data:{ markdownRemark:{ frontmatter: album }}} = props
  const { title: albumTitle, description } = album

  const { pageResources } = props

  const f = props.data.markdownRemark.frontmatter.featuredimage.childImageSharp.fluid

  if(pageResources && pageResources.json){
    const { json:{pageContext:{songs}}} = pageResources
    return (
      <Layout>
        <Container>
          <Column>
            <Img fluid={f} style={{width:'100%'}}/>
            <p>{description}</p>
            {songs && <MusicAlbum
              albumTitle={albumTitle}
              songs={songs}
            />}
          </Column>
        </Container>
      </Layout>
      )
  }
  return null
}

export default MusicAlbumContainer
