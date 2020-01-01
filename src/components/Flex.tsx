import styled from "styled-components";

interface iFlex {
　row?: boolean
  rowReverse?: boolean
  column?: boolean
  columnReverse?: boolean
  noWrap?: boolean
  wrap?: boolean
  wrapReverse?: boolean

  hStart?: boolean
  hEnd?: boolean
  hCenter?: boolean
  hBetween?: boolean
  hAround?: boolean

  vStretch?: boolean
  vStart?: boolean
  vEnd?: boolean
  vCenter?: boolean
  vBaseLine?: boolean

  aStretch?: boolean
  aStart?: boolean
  aEnd?: boolean
  aCenter?: boolean
  aBetween?: boolean
  aAround?: boolean
}

const Flex = styled.div<iFlex>`
  display: flex;
  ${props => props.row && 'flex-direction: row;'}
  ${props => props.rowReverse && 'flex-direction: row-reverse;'}
  ${props => props.column && 'flex-direction: column;'}
  ${props => props.columnReverse && 'flex-direction: columnReverse;'}
  ${props => props.noWrap && 'flex-wrap: nowrap;'}
  ${props => props.wrap && 'flex-wrap: wrap;'}
  ${props => props.wrapReverse && 'flex-wrap: wrap-reverse;'}
  ${props => props.hStart && 'justify-content: flex-start;'}
  ${props => props.hEnd && 'justify-content: flex-end;'}
  ${props => props.hCenter && 'justify-content: center;'}
  ${props => props.hBetween && 'justify-content: space-between;'}
  ${props => props.hAround && 'justify-content: space-around;'}
  ${props => props.vStretch && 'align-items: stretch;'}
  ${props => props.vStart && 'align-items: flex-start;'}
  ${props => props.vEnd && 'align-items: flex-end;'}
  ${props => props.vCenter && 'align-items: center;'}
  ${props => props.vBaseLine && 'align-items: baseline;'}
  ${props => props.aStretch && 'align-content: stretch;'}
  ${props => props.aStart && 'align-content: flex-start;'}
  ${props => props.aEnd && 'align-content: flex-end;'}
  ${props => props.aCenter && 'align-content: center;'}
  ${props => props.aBetween && 'align-content: space-between;'}
  ${props => props.aAround && 'align-content: space-around;'}
`

interface iFlexItem{
  order?: number
  grow?: boolean | number
  shrink?: boolean | number
  basis?: string
  auto?: boolean
  start?: boolean
  end?: boolean
  center?: boolean
  stretch?: boolean
  baseline?: boolean
}

export const FlexItem = styled.div<iFlexItem>`
  ${props => props.order && `order: ${props.order};`}
  ${props => props.grow && typeof props.grow === 'boolean' && 'flex-grow: 1;'}
  ${props => props.grow! && typeof props.grow === 'boolean' && 'flex-grow: 0;'}
  ${props => props.grow && typeof props.grow === 'number' && `flex-grow: ${props.grow};`}
  ${props => props.shrink && typeof props.shrink === 'boolean' && 'flex-shrink: 1;'}
  ${props => props.shrink! && typeof props.shrink === 'boolean' && 'flex-shrink: 0;'}
  ${props => props.shrink && typeof props.shrink === 'number' && `flex-shrink: ${props.grow};`}
  ${props => props.basis && `flex-basis: ${props.basis};`}
  ${props => props.auto && `align-self: auto;`}
  ${props => props.start && `align-self: flex-start;`}
  ${props => props.end && `align-self: flex-end;`}
  ${props => props.center && `align-self: center;`}
  ${props => props.auto && `align-self: auto;`}
  ${props => props.stretch && `align-self: stretch;`}
  ${props => props.baseline && `align-self: baseline;`}
`

export default Flex