import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'
import DatePicker from '../../src/lib/DatePicker'

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

test('Component renders correctly', () => {
  const component = renderer.create(
    <DatePicker selection={getTestSchedule()} startDate={startDate} numDays={5} onChange={() => undefined} />
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Date cell render prop is used if provided', () => {
  const customDateCellRenderer = (date, selected) => (
    <div className={`${selected && 'selected'} test-date-cell-renderer`}>{date.toDateString()}</div>
  )

  const component = renderer.create(
    <DatePicker
      selection={getTestSchedule()}
      startDate={startDate}
      numDays={5}
      onChange={() => undefined}
      renderDateCell={customDateCellRenderer}
    />
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
