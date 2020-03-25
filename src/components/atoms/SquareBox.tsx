import React from 'react'
import styled from 'styled-components'

const InnereInner = styled.div``
const Inner = styled.div``
export const Wrapper = styled.div`
  position: relative;
  &:before {
    display: block;
    content: '';
    padding-top: 100%;
  }

  & ${Inner} {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    & ${InnereInner} {
      position: relative;
    }
  }
`

interface iSquareBox {
  style?: React.CSSProperties
}

const SquareBox:React.FC<iSquareBox> = props => {
  return (
    <Wrapper style={props.style}>
      <Inner>
        {props.children}
      </Inner>
    </Wrapper> 
  )
}

export default SquareBox