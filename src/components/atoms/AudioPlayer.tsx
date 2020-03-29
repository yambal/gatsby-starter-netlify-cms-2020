import React from 'react'
import styled from 'styled-components'
import SquareBox, {Wrapper as SquareBoxWrapper} from './SquareBox'
import { lighten, modularScale } from 'polished'

interface iAudioPlayerBase {
  audioFile: string
  children?: React.ReactNode
  track?: number
  onEndHandler?: (track: number) => void
  onPlayHandler?: (track: number) => void
  onPauseHandler?: (track: number) => void
  backText?: React.ReactNode
  colorNum: number
}

interface iProgress {
  parcent: number
  angle: number
  color: string
}

const ProgressBack = styled.div``
const ProgressInner = styled.div``
const ChildWrapper = styled.div``
const PlayButtonOuter = styled.div``
const PlayButtonInner = styled.div``

const Progress = styled.div<iProgress>`
  height: 100%;
  width: 100%;
  background:linear-gradient(${props => props.angle}deg, rgb(182,198,206) ${props => props.parcent}%, ${props => props.color} ${props => props.parcent}%);
  position: relative;
  overflow: hidden;

  & ${ProgressBack} {
    position: absolute;
    top: 135px;
    right: 0;
    bottom: 0px;
    font-family: 'Stardos Stencil', cursive;
    font-size:180px;
    font-height: 150px;
    white-space: nowrap;
    mix-blend-mode: overlay;
    text-align: right;
    color: ${props => lighten(0.08, props.theme.color.font.base)};
    filter: blur(0.5px);
  }

  & ${ProgressInner} {
    display: flex;
  }

  & ${ChildWrapper} {
    padding: 1rem;
    color: white;
  }
`

const Wrapper = styled.div`
  & ${SquareBoxWrapper} {
    width: 200px;
    max-width: 20vw;
    height: 200px;
    flex-shrink: 0;

    & ${PlayButtonOuter} {
      display: flex;
      height: calc(100% - 12px);
      align-items: center;
      cursor: pointer;

      margin: 6px;
      border: dashed 3px ${props => lighten(0.2, props.theme.color.font.base)};
      &:hover {
        border: dashed 3px ${props => props.theme.color.font.base};
      }

      mix-blend-mode: overlay;
      transition: border 0.5s;
      
      & ${PlayButtonInner} {
        
      }
    }
  }
`

const AudioPlayerBase: React.RefForwardingComponent<any, iAudioPlayerBase> = (props, ref) => {
  const { audioFile, onEndHandler, backText } = props

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
        'rgb(184,161,54)',
        'rgb(94,96,97)',
        'rgb(62,110,144)',
        'rgb(103,157,174)',
        'rgb(127,162,90)',
        'rgb(148,58,77)',
        'rgb(205,152,134)',
        'rgb(146,138,126)',
        'rgb(172,68,58)',
        'rgb(66,143,112)',
        'rgb(242,187,29)'
      ]
      return colors[props.colorNum % colors.length]
    },
    [props.colorNum]
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
    <Wrapper className="Wapper">
      <Progress
        parcent={progressParcent}
        angle={angle}
        color={color}
      >
        <ProgressBack>
          {backText}
        </ProgressBack>
        <ProgressInner>
          <SquareBox>
            <PlayButtonOuter onClick={togglePlay}>
              <PlayButtonInner>
                {isPlaying ? 'pause' : 'play'}
              </PlayButtonInner>
            </PlayButtonOuter>
          </SquareBox>
          <ChildWrapper>{props.children}</ChildWrapper>
        </ProgressInner>
      </Progress>
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

