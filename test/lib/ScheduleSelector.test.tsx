import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import moment from 'moment'
import 'jest-styled-components'
import { preventScroll, ScheduleSelector } from '../../src/lib/ScheduleSelector'

const startDate = new Date('2018-01-01T00:00:00.000')

const getTestSchedule = () => [
  moment(startDate)
    .startOf('day')
    .add(12, 'h'),
  moment(startDate)
    .startOf('day')
    .add(1, 'd')
    .add(13, 'h')
]

describe('ScheduleSelector', () => {
  beforeAll(() => {
    const fakeElement = document.createElement('div')
    document.elementFromPoint = jest.fn().mockReturnValue(fakeElement)
    document.removeEventListener = jest.fn()
  })

  describe('preventScroll', () => {
    it('prevents the event default', () => {
      const event = {
        preventDefault: jest.fn()
      }
      preventScroll(event)
      expect(event.preventDefault).toHaveBeenCalled()
    })
  })
})
