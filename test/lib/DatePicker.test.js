// @flow

import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'
import DatePicker from '../../src/lib/DatePicker'

const getTestSchedule = (): Array<moment> => [
  moment()
    .startOf('day')
    .add(12, 'h'),
  moment()
    .startOf('day')
    .add(1, 'd')
    .add(13, 'h')
]

test('Component renders correctly', () => {
  const component = renderer.create(<DatePicker selection={getTestSchedule()} onChange={() => undefined} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Date cell render prop is used if provided', () => {
  const customDateCellRenderer = (date: Date, selected: boolean): React.Element<*> => (
    <div className={`${selected && 'selected'} test-date-cell-renderer`}>{date.toDateString()}</div>
  )

  const component = renderer.create(
    <DatePicker selection={getTestSchedule()} onChange={() => undefined} renderDateCell={customDateCellRenderer} />
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
