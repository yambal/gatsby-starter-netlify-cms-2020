import React from 'react'
import { PodCastEpisode } from './PodCastEpisode'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import { iPodCast } from './PodcastInterface'
import Container from '../Container'

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
      mp3: iPodCast
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

  const AudioRefs = {}

  const onPlayHandler = (track: number) => {
    console.log('play', track, JSON.stringify(AudioRefs, null, 2))
  }

  const onPauseHandler = (track: number) => {
    console.log('pause', track, JSON.stringify(AudioRefs, null, 2))
  }

  const onEndHandler = (track: number) => {
    console.log('end', track, JSON.stringify(AudioRefs, null, 2))
  }

  return (
    <div>
      <Helmet>
        <link rel="alternate" type="application/rss+xml" href={`/podcast-${props.channel}.rss`} title="WWW.YAMBAL.NET Podcast" />
      </Helmet>
      <Link to={`/podcasts`}>Podcasts</Link>
      <Container>
      {edges.map(
        (edge, index) => {
          return <PodCastEpisode
            key={index}
            id={edge.node.id}
            title={edge.node.frontmatter.title}
            description={edge.node.frontmatter.description}
            date={edge.node.frontmatter.date}
            mp3Url={edge.node.mp3.absoluteUrl}
            channel={edge.node.frontmatter.channel}
            track={index}
            onEndHandler={onEndHandler}
            onPauseHandler={onPauseHandler}
            onPlayHandler={onPlayHandler}
            ref={el => {
              if (el && el.track && !AudioRefs[el.track]) {
                AudioRefs[el.track] = el
              }
            }}
          />
        }
      )}
      </Container>
    </div>
  )
}
