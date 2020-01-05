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
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [isCanplaythrough, setIsCanplaythrough] = React.useState<boolean>(false)
  const [currentTime, setCurrentTime] = React.useState<number>(0)
  const [duration, setDuration] = React.useState<number>(0)
  const audioRef = React.useRef(null)

  const handlePlay = React.useCallback(
    () => {
      const a:HTMLAudioElement = audioRef.current
      a.play()
      .then(() => {
        setIsPlaying(true)
      })
    },
    []
  )

  const handleStop = React.useCallback(
    () => {
      const a:HTMLAudioElement = audioRef.current
      a.pause()
    },
    []
  )

  const handleBack = React.useCallback(
    () => {
      const a:HTMLAudioElement = audioRef.current
      audioRef.current.currentTime = 0;
    },
    []
  ) 

  const onEnded = React.useCallback(
    () => {
      setIsPlaying(false)
      audioRef.current.currentTime = 0;
      audioRef.current.pause()
    },
    []
  )

  const onTimeUpdate = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setCurrentTime(audioRef.current.currentTime)
    },
    []
  )

  /** 再生可能になった */
  const onCanPlay = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setDuration(audioRef.current.duration)
    },
    []
  )

  /**
   * 途切れ無しで再生できそう
   */
  const onCanPlayThrough = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setIsCanplaythrough(true)
    },
    []
  )

  /**
   * 一時停止されたとき
   **/
  const onPause = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setIsPlaying(false)
    },
    []
  )

  return (
    <div>
      <h2>{props.song.title}</h2>
      {!isPlaying && <div onClick={handlePlay} >play</div>}
      {isPlaying && <div onClick={handleStop} >stop</div>}
      {currentTime}/{duration}
      <audio
        src={props.song.file.publicURL}
        ref={audioRef}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
        onCanPlayThrough={onCanPlayThrough}
        onPause={onPause}
      />
    </div>
  )
}

export default Song