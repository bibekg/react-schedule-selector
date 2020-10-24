import styled from 'styled-components'
import theme from '../styles/theme'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  fontSize,
  FontSizeProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  lineHeight,
  LineHeightProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps
} from 'styled-system'

type InputProps = {
  as?: string
} & SpaceProps &
  PositionProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  FontSizeProps &
  LineHeightProps &
  TypographyProps

const Input = styled.input<InputProps>(
  {
    borderRadius: '6px',
    padding: '10px 8px',
    border: `1px solid ${theme.colors.africanElephant}`,
    '&::placeholder': {
      color: theme.colors.africanElephant
    }
  },
  space,
  position,
  color,
  border,
  layout,
  flexbox,
  grid,
  fontSize,
  lineHeight,
  typography
)

Input.defaultProps = {
  ...theme.textStyles.input
}

export default Input
