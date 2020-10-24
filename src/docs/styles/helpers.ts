type StyleObject = { [k: string]: string | number }

export function makeComplexResponsiveStyles<T extends string>(
  complexStyles: { [k in T]: StyleObject },
  responsiveKeys: { [k: string]: T } | T | T[],
) {
  const styleKeysToApply = Array.from(
    new Set(
      (Object.values(
        complexStyles,
      ) as StyleObject[]).flatMap((styles: StyleObject) => Object.keys(styles)),
    ),
  )

  return styleKeysToApply.reduce<{ [k in string]: any }>((acc, styleKey) => {
    const responsiveKeysToUse =
      typeof responsiveKeys === 'object'
        ? responsiveKeys
        : { _: responsiveKeys }

    Object.keys(responsiveKeysToUse).forEach((bp) => {
      // @ts-ignore It doesn't like this line if responsiveKeysToUse is an array but it'll still
      // work fine since the "keys" will be indices
      const point: T = responsiveKeysToUse[bp]

      if (acc[styleKey] == null) {
        acc[styleKey] = {}
      }
      acc[styleKey][bp] = complexStyles[point][styleKey]
    })
    return acc
  }, {})
}
