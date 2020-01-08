import { DefaultTheme } from 'styled-components'

const theme:DefaultTheme = {
  lineHeight: {
    baseRem: 1.75
  },
  fontSize: {
    basePx: 16
  },
  font: {
    base: 'system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", "Meiryo", sans-serif'
  },
  color: {
    background: {
      base: 'rgb(234,228,215)',
      dark: 'rgb(69,66,62)'
    },
    font: {
      base: 'rgb(58,59,59)',
      link: 'black'
    }
  }
}

export default theme