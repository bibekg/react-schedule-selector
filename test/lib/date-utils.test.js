import moment from 'moment'

import { dateIsBetween, timeIsBetween } from '../../src/lib/date-utils'

describe('dateIsBetween', () => {
  const now = moment().toDate()
  const tomorrow = moment(now)
    .add(1, 'day')
    .toDate()
  const yesterday = moment(now)
    .subtract(1, 'day')
    .toDate()

  test.each([
    [[yesterday, now, tomorrow], true],
    [[now, yesterday, tomorrow], false],
    [[yesterday, tomorrow, now], false],
    [[now, now, now], true]
  ])('it returns correctly', (args, expectation) => {
    const expectMethod = expectation ? 'toBeTruthy' : 'toBeFalsy'
    expect(dateIsBetween(...args))[expectMethod]()
  })
})

describe('timeIsBetween', () => {
  const hours = {}
  for (let i = 0; i < 23; i += 1) {
    hours[i] = new Date()
    hours[i].setHours(i)
  }

  test.each([
    [[hours[1], hours[2], hours[3]], true],
    [[hours[5], hours[7], hours[20]], true],
    [[hours[5], hours[4], hours[7]], false],
    [[hours[5], hours[5], hours[5]], true],
    [[hours[5], hours[5], hours[6]], true],
    [[hours[5], hours[6], hours[6]], true],
    [[hours[5], hours[10], hours[4]], false]
  ])('it returns correctly', (args, expectation) => {
    const expectMethod = expectation ? 'toBeTruthy' : 'toBeFalsy'
    expect(timeIsBetween(...args))[expectMethod]()
  })
})
