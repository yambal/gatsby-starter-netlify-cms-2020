import React from 'react'
import styled from 'styled-components'
import Img from "gatsby-image"
import SquareBox from './SquareBox'

const Over = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`

interface iSquareBoxImg {
  style: React.CSSProperties
  fluid: any
}

const SquareBoxImg:React.FC<iSquareBoxImg> = props => {
  return (
    <SquareBox>
      <Img fluid={props.fluid} style={{width:'100%', height:'100%'}}/>
      <Over>{props.children}</Over>
    </SquareBox>
  )
}

export default SquareBoxImg