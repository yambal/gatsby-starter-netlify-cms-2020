import React from 'react'
import styled from 'styled-components'

interface iSongCompo {
  audioFile: string
  track?: number
  onEndHandler?: (track: number) => void
  onPlayHandler?: (track: number) => void
  onPauseHandler?: (track: number) => void
}

const Wrapper = styled.div``

const AudioPlayerBase: React.RefForwardingComponent<any, iSongCompo> = (props, ref) => {
  const { audioFile, onEndHandler } = props

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
      onEndHandler && onEndHandler(props.track)
      setIsPlaying(false)
      audioRef.current.currentTime = 0;
    },
    []
  )

  const onTimeUpdate = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setCurrentTime(audioRef.current.currentTime)
    },
    []
  )

  const onCanPlay = React.useCallback(
    (e:React.StyleHTMLAttributes<HTMLAudioElement>) => {
      setDuration(audioRef.current.duration)
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
    <Wrapper>
      {audioFile}
      <audio
        src={audioFile}
        ref={audioRef}
        onEnded={onEnd}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
      />
      {!isPlaying && <button onClick={handlePlay}>play</button>}
      {isPlaying && <button onClick={handlePause}>pause</button>}
    </Wrapper>
  )
}

export const AudioPlayerWithRef = React.forwardRef(AudioPlayerBase);

