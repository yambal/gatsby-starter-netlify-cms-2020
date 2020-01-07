import React from 'react'
import styled from 'styled-components'

interface iProgress {
  current:number,
  max:number
}

interface iInner {
  progress: number
}
const Inner = styled.div<iInner>`
  width: ${props => props.progress}%;
`
const Wrapper = styled.div`
  border: solid ${props => props.theme.fontSize.basePx / 5}px ${props => props.theme.color.font.base};
  & ${Inner} {
    background-color: ${props => props.theme.color.font.base};
    height: ${props => props.theme.fontSize.basePx / 5}px;
  }
`

const Progress:React.FC<iProgress> = props => {

  return (
    <Wrapper>
      <Inner progress={props.current / props.max * 100}/>
    </Wrapper>
  )
}

export default Progress