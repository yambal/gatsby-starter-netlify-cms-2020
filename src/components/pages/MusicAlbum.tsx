import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'
import styled from 'styled-components';
import Container from '../Container';
import Column from '../atoms/Column';
import { Helmet } from 'react-helmet';
import PageTitle from '../atoms/PageTitle';
import { iSongs } from '../../containers/MusicAlbumContainer';

interface iMusicAlbum {
  albumTitle: string
  songList : iSongs[]
}

export const MusicAlbum:React.FC<iMusicAlbum> = (props) => {
  return (
    <React.Fragment>
      {props.albumTitle}
      {JSON.stringify(props.songList, null, 2)}
    </React.Fragment>
  )
}

export default MusicAlbum
