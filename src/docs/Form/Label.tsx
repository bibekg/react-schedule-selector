import styled from 'styled-components'
import { variant } from 'styled-system'

import theme from '../styles/theme'
import { LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  variant?: keyof typeof theme.textStyles | null
}

// @ts-ignore
const Label = styled.label<LabelProps>(
  {
    textTransform: 'uppercase',
    display: 'block'
  },
  variant({
    variants: theme.textStyles
  })
)

Label.defaultProps = {
  variant: 'label'
}

export default Label
