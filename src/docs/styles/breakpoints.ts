import * as React from 'react'

// Unfortunately, I couldn't figure out how to type an array that would also allow string indexes so I'm typing it as any for now
const breakpoints: any = ['20em', '38em', '64em']
const mq = breakpoints.map((bp: any) => `@media (min-width: ${bp})`)
breakpoints.sm = breakpoints[0]
mq.sm = mq[0]
breakpoints.md = breakpoints[1]
mq.md = mq[1]
breakpoints.lg = breakpoints[2]
mq.lg = mq[2]

export { mq, breakpoints as default }

export const useBreakpoint = (bp: 'sm' | 'md' | 'lg') => {
  const matcher = window.matchMedia(mq[bp].replace('@media ', ''))
  const [matches, setMatches] = React.useState(matcher.matches)
  React.useEffect(() => {
    matcher.addListener((e) => {
      if (e.matches) {
        setMatches(true)
      } else {
        setMatches(false)
      }
    })
  }, [matcher])
  return matches
}
