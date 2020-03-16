import React from 'react'
import { Link } from 'gatsby'
import { iPodCast } from './PodcastInterface'

interface iiPodCastIndexPage {
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
}

const PodCastIndexPage:React.FC<iiPodCastIndexPage> = (props) => {

  const channels = React.useMemo(
    () => {
      let c = {}
      props.edges.forEach(edge => {
        const channel = edge.node.frontmatter.channel
        if ( typeof c[channel] === 'undefined') {
          c[channel] = {
            title: 'title',
            desc: 'desc',
            edges: []
          }
        }
        c[channel].edges.push(edge)
      });
      return c
    },
    [props.edges]
  )

  return (
    <React.Fragment>
      {Object.keys(channels).map(
        (key) => {
          const channel = channels[key]
          return <div><Link to={`/podcasts/${key}`}>{key}:{channel.title}</Link></div>
        }
      )}
    </React.Fragment>
  )
}

export default PodCastIndexPage