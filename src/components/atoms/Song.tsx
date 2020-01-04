import React from 'react'
import { iReleaseSongFile } from '../../containers/MusicAlbumContainer'

interface iSong {
  songTitle: string
  songFile: iReleaseSongFile | string
}

const Song:React.FC<iSong> = (props) => {
  return (
    <div>
      {props.songTitle}
      {JSON.stringify(props.songFile, null, 2)}
    </div>
  )
}

export default Song