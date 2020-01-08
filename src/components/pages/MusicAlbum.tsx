import React from 'react'
import Container from '../Container';
import { iSong, iSongRef } from '../atoms/Song'
import SquareBoxImg from '../atoms/SquareBoxImg';
import Songs from '../morequles/Songs';
import styled from 'styled-components';
import { Border } from '../atoms/font';

interface iMusicAlbum {
  fluid: any
  albumTitle: string
  description: string
  songs: iSong[]
}

interface iMusicAlbumState {
  refs: iSongRef[]
}

const AlbumTitle = styled.h1`
  margin-bottom: 0;
  mix-blend-mode: normal;
  top: 0;
`
const AlbumTitleWrapper = styled.div`
  position: absolute;
  mix-blend-mode: difference;
  padding: 2rem;
  background-color: ${props => props.theme.color.background.dark};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Paper = styled.div`
  position: relative;
  max-width: calc(100vmin - 150px);
  margin-left: auto;
  margin-right: auto;

  &:before,
  &:after {
    z-index: -1;
    position: absolute;
    content: "";
    bottom: 15px;
    left: 10px;
    width: 50%;
    top: 80%;
    max-width:300px;
    background: #000;
    box-shadow: 0 15px 10px #000;
    transform: rotate(-3deg);
    mix-blend-mode: multiply;
  }
  &:after {
    transform: rotate(3deg);
    right: 10px;
    left: auto;
    mix-blend-mode: multiply;
  }
`

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
        <Paper>
        <SquareBoxImg
          fluid={this.props.fluid}
          style={{
            backgroundColor: 'black'
          }}
        >
          <div style={{
            height: '100%',
          }}>
            <div style={{position: 'relative', marginTop: '4rem', padding: '2rem'}}>
              <AlbumTitle>{ this.props.albumTitle }</AlbumTitle>
              <AlbumTitleWrapper />
            </div>
            {this.props.description}
            <Songs songs={this.props.songs} />
          </div>
        </SquareBoxImg>
        </Paper>
      </Container>
    )
  }
}

export default MusicAlbum
