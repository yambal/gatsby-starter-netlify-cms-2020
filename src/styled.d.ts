import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    lineHeight: {
        baseRem: number
    }
    fontSize : {
        basePx: number
    }
    font: {
        base: string
    },
    color: {
        font: {
            base: string
            link: string
        }
    }
  }
}