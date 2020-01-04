import React from 'react'
import { iReleaseSongFile } from '../../containers/MusicAlbumContainer'

interface iSong {
  songTitle: string
  songFile: iReleaseSongFile | string
}

const Song:React.FC<iSong> = (props) => {
  return (
    <div>
      <h2>{props.songTitle}</h2>
      {JSON.stringify(props.songFile, null, 2)}
    </div>
  )
}

export default Song