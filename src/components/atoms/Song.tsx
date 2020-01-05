import React from 'react'

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
  const audioRef = React.useRef(null)

  const handlePlay = React.useCallback(
    () => {
      const a:HTMLAudioElement = audioRef.current
      a.play()
    },
    []
  )

  return (
    <div>
      <h2>{props.song.title}</h2>
      <pre>{JSON.stringify(props.song.file.publicURL, null, 2)}</pre>
      <div onClick={handlePlay} >play</div>
      <audio src={props.song.file.publicURL} ref={audioRef}/>
    </div>
  )
}

export default Song