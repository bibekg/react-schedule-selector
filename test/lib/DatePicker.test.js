import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'
import DatePicker from '../../src/lib/DatePicker'

test('Component renders correctly', () => {
  // Super basic test of whether it renders correctly
  const testSchedule = [
    moment().startOf('day').add(12, 'h'),
    moment().startOf('day').add(1, 'd').add(13, 'h')
  ]

  const component = renderer.create(<DatePicker selection={testSchedule} onChange={() => undefined} />)

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
