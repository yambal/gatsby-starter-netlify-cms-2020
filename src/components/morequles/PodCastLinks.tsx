import React from 'react'
import styled from 'styled-components'
import { iLinks } from './PodcastInterface'


interface iPodCastLinksProps {
  links: iLinks[]
  allLevel?: boolean
}

const Wrapper = styled.div``

export const PodCastLinks:React.FC<iPodCastLinksProps> = props => {
  return (
    <React.Fragment>
      {
        props.links.length > 0 &&
        <Wrapper>
          <h3>参照</h3>
          <ul>
            {props.links.map(
              link => {
                return <li><a href={link.href} target="noopener">{link.text}</a></li>
              }
            )}
          </ul>
        </Wrapper>
      }
    </React.Fragment>
  )
}