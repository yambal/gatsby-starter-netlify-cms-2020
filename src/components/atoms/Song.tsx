import React from 'react'
import { iReleaseSongFile } from '../../containers/MusicAlbumContainer'

export interface iSong {
    file: {
      publicURL: string
      prettySize: string
      internal: {
        mediaType: string
        contentDigest: string
      }

    }
    title: string
}

interface iSongCompo {
  song: iSong
}

const Song:React.FC<iSongCompo> = (props) => {
  console.log(props.song.file.publicURL)
  return (
    <div>
      <pre>{JSON.stringify(props.song.file.publicURL, null, 2)}</pre>
    </div>
  )
}

export default Song
/*
<audio src={props.songFile.publicURL} controls/>
*/