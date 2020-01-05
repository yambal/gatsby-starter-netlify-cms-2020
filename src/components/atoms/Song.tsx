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
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null)
  React.useEffect(
    () => {
      if(audio) {
        audio.pause()
      }
      setAudio(new Audio(props.song.file.publicURL))
    },
    [props.song.file.publicURL]
  )

  return (
    <div>
      <h2>{props.song.title}</h2>
      <pre>{JSON.stringify(props.song.file.publicURL, null, 2)}</pre>
    </div>
  )
}

export default Song