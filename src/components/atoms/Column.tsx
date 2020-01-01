import styled, { css } from 'styled-components'

const Column = styled.div`
  columns: 2;

  h2 {
    column-span: all;
  }

  .gatsby-image-wrapper {
    page-break-inside: avoid;
    break-inside: avoid;
    height: auto;
  }
`

export default Column