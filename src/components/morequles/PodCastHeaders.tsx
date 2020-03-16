import React from 'react'
import styled from 'styled-components'
import { iHeader } from './PodcastInterface'


interface iPodCastHeadersProps {
  headers: iHeader[]
  allLevel?: boolean
}

const Wrapper = styled.div``

export const PodCastHeaders:React.FC<iPodCastHeadersProps> = props => {
  const topHeaders = React.useMemo(
    (): iHeader[] => {
      if (props.allLevel) {
        return props.headers
      }

      let max = 6
      props.headers.forEach(
        header => {
         if( max > header.level ) {
          max = header.level
         }
        }
      )
      
      const topHeaders = props.headers.filter(
        header => {
          return header.level === max
        }
      )

      return topHeaders
    },
    [props]
  )

  return (
    <React.Fragment>
      {
        topHeaders.length > 0 &&
          <Wrapper>
            <h3>サマリ</h3>
            <ul>
              {topHeaders.map(
                hedaer => {
                  return <li>{hedaer.text}</li>
                }
              )}
            </ul>
          </Wrapper>
      }
    </React.Fragment>
  )
}