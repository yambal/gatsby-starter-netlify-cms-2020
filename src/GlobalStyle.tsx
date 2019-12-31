import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${props=> props.theme.fontSize.base};
    font-family: ${props=>props.theme.font.base};
  }
`

export default GlobalStyle