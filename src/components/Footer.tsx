import React from 'react'
import { Link } from 'gatsby'
import Container from './Container'
import styled from 'styled-components'

const Wrapper = styled.footer``

const Footer = class extends React.Component {
  render() {
    return (
      <Wrapper>
        <Container>
          Footer
        </Container>
      </Wrapper>
    )
  }
}

export default Footer
