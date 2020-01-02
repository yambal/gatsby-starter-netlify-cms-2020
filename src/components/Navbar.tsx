import React from 'react'
import { Link } from 'gatsby'
import Container from './Container'
import useSiteMetadata from '../utils/SiteMetadata'
import styled from 'styled-components'
import Flex, { FlexItem } from './Flex'

const Wrapper = styled.header`
  & ${Flex} {
    height: ${props => 50 / props.theme.fontSize.basePx}rem;
  }
`

const Navbar:React.FC = () => {

  const { title, description } = useSiteMetadata()

  return (
    <Wrapper>
      <nav
        role="navigation"
        aria-label="main-navigation"
      >
        <Container>
          <Flex row noWrap hBetween vCenter>
            <FlexItem >
              <Link to="/">
                {title}
              </Link>
            </FlexItem>
            <FlexItem >
              <Link className="navbar-item" to="/about">
                About
              </Link>
              <Link className="navbar-item" to="/blog">
                Blog
              </Link>
            </FlexItem>
          </Flex>
        </Container>
      </nav>
    </Wrapper>
  )
}

export default Navbar
