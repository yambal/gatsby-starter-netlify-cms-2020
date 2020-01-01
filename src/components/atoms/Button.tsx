import styled, { css } from 'styled-components'
import { lighten, modularScale } from 'polished'

export const ButtonCSS = css`
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  ser-select: none;
  /* border-radius: .25rem; */
  font-size: 1rem;
`

export const ACss = css`
  ${ButtonCSS}
  color: ${props => props.theme.color.font.base};
  border-top: dashed ${props => 2 / props.theme.fontSize.basePx}rem transparent;
  transition: all 0.5s;
  border-bottom-style: dashed;
  border-bottom-width: ${props => 2 / props.theme.fontSize.basePx}rem;
  border-bottom-color: ${props => lighten(0.2, props.theme.color.font.base)};
  
  line-height: ${props => props.theme.lineHeight.baseRem - (4 / props.theme.fontSize.basePx)}rem;
  
  vertical-align: bottom;
  text-decoration: none;

  &:hover {
    border-bottom-color: ${props => props.theme.color.font.base};
  }
`

const Button = styled.div`
  ${ButtonCSS}
  border: solid ${props => 1 / props.theme.fontSize.basePx}rem black;
  line-height: ${props => props.theme.lineHeight.baseRem - (2 / props.theme.fontSize.basePx)}rem;
`

export default Button