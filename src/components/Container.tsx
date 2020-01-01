import React from 'react'
import styled from 'styled-components'

const rem = (props: any, width:number) => {
  return Math.round( width / props.theme.fontSize.base * 100 ) / 100
}

interface iContainer {

}

export const Wrapper = styled.div`
  /* Extra small */
  padding-right:1rem;
  padding-left:1rem;
  margin-right: auto;
  margin-left: auto;
  max-width: calc( (100vmin + 100vmax ) / 2 );

  /* Small */
  /*
  @media (min-width: ${ props => rem(props, 576) }rem) {
    max-width: ${ props => rem(props, 540) }rem;
  }
  */
  /* Medium */
  /*
  @media (min-width: ${ props => rem(props, 768) }rem) {
    max-width: ${ props => rem(props, 720) }rem;
  }
  */
  /* Large */
  /*
  @media (min-width: ${ props => rem(props, 992) }rem) {
    max-width: ${ props => rem(props, 960) }rem;
  }
  */
  /* Extra large */
  /*
  @media (min-width: ${ props => rem(props, 1200) }rem) {
    max-width: calc(100vw * 0.61803);
  }
  */
`

const Container:React.FC<iContainer> = props => {
  return (
    <Wrapper>{props.children}</Wrapper>
  )
}

export default Container