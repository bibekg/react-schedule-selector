import colors from './colors'

const fontFamilies = {
  rubik: 'Rubik, Helvetica, sans-serif',
}

export const baseTextStyles = {
  margin: 0,
  fontFamily: fontFamilies.rubik,
  letterSpacing: '0.02em',
}

const textStyles: Record<string, any> = {
  // <h* />
  h1: {
    fontWeight: 400,
    fontSize: [40, 40, 48, 48],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    color: colors.midnightGray,
  },
  h2: {
    fontWeight: 300,
    fontSize: [32, 32, 40, 40],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    color: colors.midnightGray,
  },
  h3: {
    fontWeight: 300,
    fontSize: [24, 24, 32, 32],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    color: colors.midnightGray,
  },
  h4: {
    fontWeight: 300,
    fontSize: [20, 20, 24, 24],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    color: colors.midnightGray,
  },
  h5: {
    fontWeight: 500,
    fontSize: [16, 16, 20, 20],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    color: colors.midnightGray,
  },
  h6: {
    // main nav
    fontWeight: 400,
    fontSize: [18, 18, 18, 18],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    letterSpacing: ['0.02em', '0.02em', '0.08em', '0.08em'],
    color: colors.midnightGray,
  },

  // <p />
  body: {
    fontWeight: 400,
    fontSize: [16, 16, 20, 20],
    lineHeight: [1.4, 1.4, 1.5, 1.5],
    color: colors.midnightGray,
  },
  body2: {
    fontWeight: 400,
    fontSize: [16, 16, 16, 16],
    lineHeight: [1.5, 1.5, 1.5, 1.5],
    color: colors.midnightGray,
  },
  body3: {
    fontWeight: 400,
    fontSize: [12, 12, 14, 14],
    lineHeight: [1.5, 1.5, 1.5, 1.5],
    color: colors.midnightGray,
  },

  // Other
  label: {
    ...baseTextStyles,
    marginBottom: 1,
    fontSize: [14, 14, 14, 14],
    letterSpacing: '0.08em',
    fontWeight: 500,
    color: colors.africanElephant,
    textTransform: 'uppercase',
  },
  input: {
    ...baseTextStyles,
    fontSize: [16, 16, 16, 16],
    fontWeight: 400,
    color: colors.midnightGray,
  },
}

export default {
  fontFamilies,
  baseTextStyles,
  textStyles,
}
