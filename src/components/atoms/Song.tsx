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
      {typeof props.songFile === 'object' ? <pre>
        {JSON.stringify(props.songFile, null, 2)}
        <audio src={props.songFile.publicURL} controls/>
      </pre> : <p>Dummy</p>}
    </div>
  )
}

export default Song