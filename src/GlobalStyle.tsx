import { createGlobalStyle } from 'styled-components'
import SanitizeCss from './components/SanitizeCss'

import { ButtonCSS, ACss } from './components/atoms/Button'

const GlobalStyle = createGlobalStyle`
  ${SanitizeCss}
  html {
    font-size: ${props=> props.theme.fontSize.basePx}px;
    font-family: ${props=>props.theme.font.base};
  }

  body {
    color: ${props => props.theme.color.font.base};
    line-height: ${props => props.theme.lineHeight.baseRem}rem;
  }

  h1, h2 {
    margin-top: 0;
  }

  a {
      ${ACss}
  }
`

export default GlobalStyle