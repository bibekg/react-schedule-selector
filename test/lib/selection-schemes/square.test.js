import moment from 'moment'

import square from '../../../src/lib/selection-schemes/square'

describe('square selection scheme', () => {
  const dates = []
  const startDate = moment().startOf('day')
  beforeAll(() => {
    for (let i = 0; i < 5; i += 1) {
      const dayBuffer = []
      // Use 0 as the start so index lines up for ease of testing
      for (let j = 0; j < 20; j += 1) {
        dayBuffer.push(
          moment(startDate)
            .add(i, 'days')
            .add(j, 'hours')
            .toDate()
        )
      }
      dates.push(dayBuffer)
    }
  })

  test('it handles a null selectionEnd', () => {
    const selectionStart = dates[0][1]
    const result = square(selectionStart, null, dates).map(d => d.toString())
    expect(result).toContain(selectionStart.toString())
  })

  test('it handles a null start and end', () => {
    expect(square(null, null, dates)).toHaveLength(0)
  })

  test('it handles a cross-day selection', () => {
    const expected = []
    const START = { DATE: 1, TIME: 10 }
    const END = { DATE: 2, TIME: 5 }
    dates[START.DATE].slice(END.TIME, START.TIME + 1).forEach(d => expected.push(d))
    dates[END.DATE].slice(END.TIME, START.TIME + 1).forEach(d => expected.push(d))

    const result = square(dates[START.DATE][START.TIME], dates[END.DATE][END.TIME], dates).map(d => d.toString())
    expect(result).toEqual(expect.arrayContaining(expected.map(d => d.toString())))
  })
})
