import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'
import styled from 'styled-components';
import Container from '../Container';
import Column from '../atoms/Column';
import { Helmet } from 'react-helmet';
import PageTitle from '../atoms/PageTitle';
import Song, { iSong, iSongRef } from '../atoms/Song'
import { number } from 'prop-types';

interface iMusicAlbum {
  albumTitle: string
  songs: iSong[]
}

interface iMusicAlbumState {
  refs: iSongRef[]
}

class MusicAlbum extends React.Component<iMusicAlbum, iMusicAlbumState> {
  constructor(props: iMusicAlbum) {
    super(props);
    this.state = {
      refs: []
    }
  }
  

  pushRef = (newRef: iSongRef) => {
    if(newRef) {
      const checkRef = this.state.refs.filter((ref) => {
        return ref.track === newRef.track
      })
      checkRef.length === 0 && this.state.refs.push(newRef)
    }
  }

  onPlay = (track: number) => {
    this.state.refs.map((ref) => {
      if(ref.track !== track) {
        ref.pause()
      }
    })
  }

  onPause = (track: number) => {
    console.log('pause', track)
  }

  onEnd = (track: number) => {
    const nextRef = this.state.refs.filter(
      (ref) => {
        return ref.track === track + 1
      }
    )
    if (nextRef.length !== 0) {
      this.state.refs[nextRef[0].track].pray()
      return
    }
    this.state.refs[0].pray()
  }

  render() {
    return (
      <Container>
        <h1>{ this.props.albumTitle }</h1>
        {this.props.songs.map((song, index) => {
          return(
            <Song
              song={song}
              key={`song-${index}`}
              track={index}
              ref={this.pushRef}
              onPlayHandler={(track: number) => {
                this.onPlay(track)
              }}
              onPauseHandler={this.onPause}
              onEndHandler={this.onEnd}
            />
          )
        })}
      </Container>
    )
  }
}

export default MusicAlbum
