import React from 'react'
import { PodCastEpisode } from './PodCastEpisode'
import { Link } from 'gatsby'

interface PodCastChannelRouterPageProps{
  path: string
  channel?: string
  edges: {
    node: {
      id: string
      frontmatter: {
        title: string
        description:string
        date: string
        channel: string
      }
      mp3: {
        url: string
        absoluteUrl: string
      }
    }
  }[] 
}
export const PodCastChannelRouterPage:React.FC<PodCastChannelRouterPageProps> = props => {
  const edges = React.useMemo(
    () => {
      return props.edges.filter(
        edge => {
          return edge.node.frontmatter.channel === props.channel
        }
      )
    },
    [props.channel, props.edges]
  )

  return (
    <div>
      <Link to={`/podcasts`}>Podcasts</Link>
      {edges.map(
        edge => {
          return <PodCastEpisode
            id={edge.node.id}
            title={edge.node.frontmatter.title}
            description={edge.node.frontmatter.description}
            date={edge.node.frontmatter.date}
            mp3Url={edge.node.mp3.absoluteUrl}
            channel={edge.node.frontmatter.channel}
          />
        }
      )}
    </div>
  )
}
