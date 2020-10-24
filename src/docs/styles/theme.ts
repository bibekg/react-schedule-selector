import colors from './colors'
import typography from './typography'
import breakpoints from './breakpoints'
import shadows from './shadows'

const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  radii: [0, 4, 8, 16, 32],
  fontSizes: [18, 20, 24, 54],
  fontFamilies: typography.fontFamilies,
  textStyles: typography.textStyles,
  colors,
  breakpoints,
  shadows,
}

export default theme
