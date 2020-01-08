import React from 'react'
import Progress from './Progress'
import styled from 'styled-components'

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

const Wrapper = styled.div``

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

  // 再生(最初から)
  const handleStart = React.useCallback(
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

  // 再生
  const handlePlay = React.useCallback(
    () => {
      const audio:HTMLAudioElement = audioRef.current
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
      audioRef.current.currentTime = 0;
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
    pray: handleStart,
    pause: handlePause
  }));

  return (
    <Wrapper style={{
      background: `linear-gradient(to right, red 0%, red ${currentTime / duration * 100}%, transparent ${currentTime / duration * 100}%, transparent 100% )`
    }}>
      {props.track}.{props.song.title}
      {!isPlaying && <button onClick={handlePlay}>play</button>}
      {isPlaying && <button onClick={handlePause}>pause</button>}
      <audio
        src={props.song.file.publicURL}
        ref={audioRef}
        onEnded={onEnd}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
      />
    </Wrapper>
  )
} 
const Song = React.forwardRef(SongBase);

export default Song
