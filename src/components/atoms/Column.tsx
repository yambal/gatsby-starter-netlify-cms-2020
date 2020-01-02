import styled, { css } from 'styled-components'
import { lighten, modularScale } from 'polished'

export const ColumnNoBreak = styled.div``

const Column = styled.div`
  columns: 25rem;
  column-gap: 2rem;
  column-rule: 1px solid ${props => lighten(0.2, props.theme.color.font.base)};

  h2, h3 {
    column-span: all;
  }

  p {
    margin-top: 0;
  }

  .gatsby-image-wrapper {
    page-break-inside: avoid;
    break-inside: avoid;
    height: auto;
  }

  & ${ColumnNoBreak} {
    break-inside: avoid;
  }
`

export default Column