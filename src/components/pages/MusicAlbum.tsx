import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'
import styled from 'styled-components';
import Container from '../Container';
import Column from '../atoms/Column';
import { Helmet } from 'react-helmet';
import PageTitle from '../atoms/PageTitle';
import Song, { iSong } from '../atoms/Song'

interface iMusicAlbum {
  albumTitle: string
  songs: iSong[]
}

export const MusicAlbum:React.FC<iMusicAlbum> = (props) => {
  return (
    <Container>
      <h1>{ props.albumTitle }</h1>
      <pre>{JSON.stringify(props.songs, null, 2)}</pre>
    </Container>
  )
}

export default MusicAlbum

/*
{props.songs.map((song, index) => {
        return(
          <Song song={song} key={`song-${index}`}/>
        )
      })}
*/
