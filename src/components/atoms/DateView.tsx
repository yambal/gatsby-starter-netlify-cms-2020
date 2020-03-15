import React from 'react'
import styled from 'styled-components'
import dateFormat from 'dateformat'

interface iDateView {
  rfc: string
}

const Wrapper = styled.div``

export const DateView:React.FC<iDateView> = props => {
  var oDate = new Date(props.rfc)
  return(
    <Wrapper>
      {dateFormat(oDate, 'yyyy年mm月dd日')}
    </Wrapper>
  )
}