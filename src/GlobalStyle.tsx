import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${props=> props.theme.fontSize.base};
  }
`

export default GlobalStyle