import React from 'react'
import { Link } from 'gatsby'
import Container from './Container'
import styled from 'styled-components'
import Flex, { FlexItem } from './Flex'

const Wrapper = styled.footer`
  margin-top: 50px;

  & ${Flex} {
    border-top: solid 1px black;
  }
`

const Footer = class extends React.Component {
  render() {
    return (
      <Wrapper>
        <Container>
          <Flex row noWrap hBetween vCenter>
            <FlexItem >
              <Link to="/site/">このサイトについて</Link>
            </FlexItem>
            <FlexItem >
              <Link to="/site/">このサイトについて</Link>
            </FlexItem>
          </Flex>
        </Container>
      </Wrapper>
    )
  }
}

export default Footer
