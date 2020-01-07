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
  track?: number
  onPlayHandler?: (track: number) => void
  onPauseHandler?: (track: number) => void
  onEndHandler?: (track: number) => void
}

/*
const SongBase: React.RefForwardingComponent<any, iSongCompo> = (props, ref) => {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [isCanplaythrough, setIsCanplaythrough] = React.useState<boolean>(false)
  const [currentTime, setCurrentTime] = React.useState<number>(0)
  const [duration, setDuration] = React.useState<number>(0)
  const audioRef = React.useRef(null)

  // - - - - - - - - - - - - - - - - - - - - - -
    const test = () => {
      console.log(29)
    };
    React.useImperativeHandle(ref, () => ({
      test
    }));
  // - - - - - - - - - - - - - - - - - - - - - -

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

  // 再生可能になった
  const onCanPlay = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setDuration(audioRef.current.duration)
    },
    []
  )

  // 途切れ無しで再生できそう
  const onCanPlayThrough = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setIsCanplaythrough(true)
    },
    []
  )

  // 一時停止されたとき
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
*/

export interface iSongRef {
  track: number
  pray: () => void 
  pause: () => void 
}

const SongBase: React.RefForwardingComponent<any, iSongCompo> = (props, ref) => {
  const audioRef = React.useRef(null)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [currentTime, setCurrentTime] = React.useState<number>(0)
  const [duration, setDuration] = React.useState<number>(0)

  // 再生
  const handlePlay = React.useCallback(
    () => {
      const audio:HTMLAudioElement = audioRef.current
      audioRef.current.currentTime = 0;
      audio.play()
      .then(() => {
        setIsPlaying(true)
        props.onPlayHandler && props.onPlayHandler(props.track)
      })
    },
    []
  )

  // 停止
  const handlePause = React.useCallback(
    () => {
      const audio:HTMLAudioElement = audioRef.current
      audio.pause()
      setIsPlaying(false)
      props.onPauseHandler && props.onPauseHandler(props.track)
    },
    []
  )

  const onEnd = React.useCallback(
    () => {
      audioRef.current.pause()
      props.onEndHandler && props.onEndHandler(props.track)
      setIsPlaying(false)
    },
    []
  )

  const onCanPlay = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setDuration(audioRef.current.duration)
    },
    []
  )

  const onTimeUpdate = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setCurrentTime(audioRef.current.currentTime)
    },
    []
  )

  // ref が使われた時に親コンポーネントに渡されるインスタンス値をカスタマイズする
  React.useImperativeHandle(ref, () => ({
    track: props.track,
    pray: handlePlay,
    pause: handlePause
  }));

  return (
    <div>
      {props.track}.{props.song.title}
      {!isPlaying && <button onClick={handlePlay}>play</button>}
      {isPlaying && <button onClick={handlePause}>pause</button>}
      {currentTime} / {duration} {Math.round(currentTime / duration * 100)}%
      <audio
        src={props.song.file.publicURL}
        ref={audioRef}
        onEnded={onEnd}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
      />
    </div>
  )
} 
const Song = React.forwardRef(SongBase);

export default Song
