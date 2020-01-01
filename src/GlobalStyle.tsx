import { createGlobalStyle } from 'styled-components'

import { ButtonCSS, ACss } from './components/atoms/Button'

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${props=> props.theme.fontSize.basePx}px;
    font-family: ${props=>props.theme.font.base};
  }

  body {
    color: ${props => props.theme.color.font.base};
    line-height: ${props => props.theme.lineHeight.baseRem}rem;
  }

  a {
      ${ACss}
  }
`

export default GlobalStyle