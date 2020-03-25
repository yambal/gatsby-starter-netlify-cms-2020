import React from 'react'
import styled from 'styled-components'
import SquareBox, {Wrapper as SquareBoxWrapper} from './SquareBox'

interface iSongCompo {
  audioFile: string
  track?: number
  onEndHandler?: (track: number) => void
  onPlayHandler?: (track: number) => void
  onPauseHandler?: (track: number) => void
}

const Front = styled.div``

interface iProgress {
  parcent: number
  angle: number
  color: string
}
const Progress = styled.div<iProgress>`
  cursor: pointer;
  height: 100%;
  /* border: solid 4px ${props => props.color}; */
  background:linear-gradient(${props => props.angle}deg, rgba(0, 0, 0, 0.01) ${props => props.parcent}%, ${props => props.color} ${props => props.parcent}%);
`

const Wrapper = styled.div`
  position: relative;
  & ${SquareBoxWrapper} {
    width: 150px;
    height: 150px;
  }
  & ${Front} {
    position: absolute;
    top: 0;
    bottom: 0;
    mix-blend-mode: color-dodge;
    color: rgb(155,55,56);
  }
`

const AudioPlayerBase: React.RefForwardingComponent<any, iSongCompo> = (props, ref) => {
  const { audioFile, onEndHandler } = props

  const audioRef = React.useRef(null)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [canPlaying, setCanPlay] = React.useState<boolean>(false)
  const [currentTime, setCurrentTime] = React.useState<number>(0)
  const [duration, setDuration] = React.useState<number>(0)

  const progressParcent = React.useMemo(
    () => {
      if (!canPlaying) {
        return 0
      }
      return Math.round(currentTime / duration * 100)
    },
    [currentTime, duration, canPlaying]
  )

  const angle = React.useMemo(
    () => {
      return Math.floor(Math.random() * 361)
    },
    [props]
  )

  const color = React.useMemo(
    () => {
      const colors = [
        'rgb(77,106,168)',
        'rgb(64,110,88)',
        'rgb(212,108,64)',
        'rgb(155,55,56)',
        'rgb(139,77,62)',
        'rgb(76,66,61)',
        'rgb(184,161,54)'
      ]
      return colors[props.track % colors.length]
    },
    [props.track]
  )

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
      setCanPlay(true)
      setDuration(audioRef.current.duration)
    },
    []
  )

  const togglePlay = React.useCallback(
    () => {
      if (isPlaying) {
        handlePause()
      } else {
        handlePlay()
      }
    },
    [isPlaying]
  )

  // ref が使われた時に親コンポーネントに渡されるインスタンス値をカスタマイズする
  React.useImperativeHandle(ref, () => ({
    track: props.track,
    pray: handleStart,
    pause: handlePause
  }));
  return (
    <Wrapper>
      <SquareBox>
        <Progress
          onClick={togglePlay}
          parcent={progressParcent}
          angle={angle}
          color={color}
        >
          {isPlaying ? 'pause' : 'play'}
        </Progress>
      </SquareBox>
      <audio
        src={audioFile}
        ref={audioRef}
        onEnded={onEnd}
        onTimeUpdate={onTimeUpdate}
        onCanPlay={onCanPlay}
      />
    </Wrapper>
  )
}

export const AudioPlayerWithRef = React.forwardRef(AudioPlayerBase);

