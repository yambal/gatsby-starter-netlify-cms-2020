import React from 'react'
import styled, { css } from 'styled-components'
import { lighten, modularScale } from 'polished'
import Container from '../Container'
import Column, { ColumnNoBreak } from './Column'

const Title = styled.h1`
  font-size: 4rem;
  line-height: calc(3rem * 1.3);
  margin: 0;
  /* font-weight: normal; */
`

const Wrapper = styled.div`
  background-color: rgb(77,106,168);
  padding: 3rem 0;
  color: white;

  & ${ Column } {
    column-rule: 1px solid white;
  }
`

interface iPageTitle {
  description?: string
  date?:Date
}

const PageTitle:React.FC<iPageTitle> = props => {
  return (
    <Wrapper>
      <Container>
        <Title>{props.children}</Title>
        <Column>
          {props.description && <ColumnNoBreak>{props.description}</ColumnNoBreak>}
          {props.date && props.date.toString()}
        </Column>
      </Container>
    </Wrapper>
  )
}

export default PageTitle
