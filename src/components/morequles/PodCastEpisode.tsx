import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import {DateView} from '../atoms/DateView'
import { AudioPlayerWithRef } from '../atoms/AudioPlayer'

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
      <h2><Link to={`/podcasts/${channel}/${id}`}>{title}</Link></h2>
      <div>{description}</div>
      <DateView rfc={date} />
      <div>{channel}</div>
      <AudioPlayerWithRef
        audioFile={mp3Url}
        track={track}
        onPlayHandler={onPlayHandler}
        onPauseHandler={onPauseHandler}
        onEndHandler={onEndHandler}
        ref={ref}
      />
    </Wrapper>
  )
}

export const PodCastEpisode = React.forwardRef(PodCastEpisodeBase);
