import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import {DateView} from '../atoms/DateView'
import { AudioPlayerWithRef } from '../atoms/AudioPlayer'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

interface PodCastEpisodeProps {
  id: string
  title: string
  description: string
  date: string
  channel: string
  mp3Url: string
  track?:number
  onPlayHandler?: (track: number) => void
  onPauseHandler?: (track: number) => void
  onEndHandler?: (track: number) => void
}

const Wrapper = styled.div``

export const PodCastEpisodeBase: React.RefForwardingComponent<any, PodCastEpisodeProps> = (props, ref) => {
  const {
    id,
    title,
    description,
    date,
    channel,
    mp3Url,
    track,
    onPlayHandler,
    onPauseHandler,
    onEndHandler
  } = props

  return(
    <Wrapper>
      <AudioPlayerWithRef
        audioFile={mp3Url}
        track={track}
        onPlayHandler={onPlayHandler}
        onPauseHandler={onPauseHandler}
        onEndHandler={onEndHandler}
        ref={ref}
        /* backText={<DateView rfc={date} />}*/
      >
        <React.Fragment>
          <ResponsiveEllipsis
            maxLine='1'
            component="h2"
            text={title}
          />
          <ResponsiveEllipsis
            text={description}
            maxLine='2'
            ellipsis='...'
            trimRight
            basedOn='letters'
          />
          <Link to={`/podcasts/${channel}/${id}`}>More</Link>
        </React.Fragment>
      </AudioPlayerWithRef>
    </Wrapper>
  )
}

export const PodCastEpisode = React.forwardRef(PodCastEpisodeBase);

/* <Link to={`/podcasts/${channel}/${id}`}></Link>*/
