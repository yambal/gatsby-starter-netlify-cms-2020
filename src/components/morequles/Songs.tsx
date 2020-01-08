import React from 'react'
import Song, { iSong, iSongRef } from '../atoms/Song'

interface iSongs {
  songs: iSong[]
}

interface iSongsState {
  refs: iSongRef[]
}

class Songs extends React.Component<iSongs, iSongsState> {
  constructor(props: iSongs) {
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
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}

export default Songs
