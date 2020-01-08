import { createGlobalStyle, DefaultTheme } from 'styled-components'
import SanitizeCss from './components/SanitizeCss'
import { lighten, modularScale } from 'polished'

import Button, { ACss } from './components/atoms/Button'

interface iGlobalStyle {
  theme: DefaultTheme
  dark?: boolean
}

const GlobalStyle = createGlobalStyle<iGlobalStyle>`
  ${SanitizeCss}
  html {
    font-size: ${props=> props.theme.fontSize.basePx}px;
  }

  body {
    color: ${props => props.dark ? 'white' : props.theme.color.font.base};
    font-family: ${props=>props.theme.font.base};
    font-family: 'Noto Sans JP', sans-serif;
    line-height: ${props => props.theme.lineHeight.baseRem}rem;
    background-color: ${props => props.dark ? props.theme.color.background.dark : props.theme.color.background.base};
    transition: background-color 0.5s;
  }

  h1, h2 {
    margin-top: 0;
  }

  a {
    ${ACss}
    color: ${props => props.dark ? 'white' : props.theme.color.font.base};
    border-bottom-color: ${props => lighten(0.2, props.theme.color.font.base)};
    &:hover {
      border-bottom-color: ${props => props.dark ? 'white' : props.theme.color.font.base};
    }
  }
`

export default GlobalStyle