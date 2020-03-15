import React from 'react'
import { PodCastEpisode } from './PodCastEpisode'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { iPodCast } from '../../pages/podcasts/index'

interface PodCastChannelRouterPageProps{
  path: string
  edges: {
    node: {
      id: string
      frontmatter: {
        title: string
        description:string
        date: string
        channel: string
      }
      mp3: iPodCast
    }
  }[]
  channel?: string
  id?
}

const Wrapper = styled.div``

export const PodCastEpisodeRouterPage:React.FC<PodCastChannelRouterPageProps> = props => {
  const edge = React.useMemo(
    () => {
      return props.edges.find(
        (edge) => {
          return edge.node.id === props.id
        }
      )
    },
    [props.edges, props.id]
  )

  return (
    <Wrapper>
      <Link to={`/podcasts/${props.channel}`}>{props.channel}</Link>
      <PodCastEpisode
        id={edge.node.id}
        title={edge.node.frontmatter.title}
        description={edge.node.frontmatter.description}
        date={edge.node.frontmatter.date}
        mp3Url={edge.node.mp3.url}
        channel={edge.node.frontmatter.channel}
      />
      <pre>50:{JSON.stringify(edge.node.mp3, null, 2)}</pre>
    </Wrapper>
  )
}
