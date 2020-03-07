import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

interface PodCastEpisodeProps {
  id: string
  title: string
  description: string
  date: string
  channel: string
  mp3Url: string
}

const Wrapper = styled.div``

export const PodCastEpisode:React.FC<PodCastEpisodeProps> = props => {
  const {id, title, description, date, channel, mp3Url } = props
  return(
    <Wrapper>
      <h2><Link to={`/podcasts/${channel}/${id}`}>{title}</Link></h2>
      <div>{description}</div>
      <div>{date}</div>
      <div>{channel}</div>
      <div><Link to={mp3Url}>mp3</Link></div>
    </Wrapper>
  )
}
