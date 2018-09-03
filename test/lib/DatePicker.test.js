import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import moment from 'moment'
import DatePicker, { GridCell } from '../../src/lib/DatePicker'

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

// beforeAll(() => {
//   Object.defineProperty(global, 'document', {
//     elementFromPoint: jest.fn()
//   })
// })

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

test('getTimeFromTouchEvent', () => {
  const component = shallow(<DatePicker />)
  const mainSpy = jest.spyOn(component.instance(), 'getTimeFromTouchEvent')
  const mockCellTime = new Date()
  const mockTargetElement = {}
  const mockEvent = {
    touches: [{ clientX: 1, clientY: 2 }]
  }
  document.elementFromPoint = jest.fn().mockReturnValue(mockTargetElement)
  const cellToDateSpy = jest.spyOn(component.instance().cellToDate, 'get').mockReturnValue(mockCellTime)

  component.instance().getTimeFromTouchEvent(mockEvent)

  expect(document.elementFromPoint).toHaveBeenCalledWith(mockEvent.touches[0].clientX, mockEvent.touches[0].clientY)
  expect(cellToDateSpy).toHaveBeenCalledWith(mockTargetElement)
  expect(mainSpy).toHaveReturnedWith(mockCellTime)

  mainSpy.mockRestore()
  cellToDateSpy.mockRestore()
})

test('endSelection', () => {
  const changeSpy = jest.fn()
  const component = shallow(<DatePicker onChange={changeSpy} />)
  const setStateSpy = jest.spyOn(component.instance(), 'setState')

  component.instance().endSelection()

  expect(changeSpy).toHaveBeenCalledWith(component.state('selectionDraft'))
  expect(setStateSpy).toHaveBeenCalledWith({
    selectionType: null,
    selectionStart: null
  })

  setStateSpy.mockRestore()
})

test('handlers get called', () => {
  const component = shallow(<DatePicker />)
  const anInstance = component.find('.rgdp__grid-cell').first()

  const spies = {
    handleMouseEnter: jest.spyOn(component.instance(), 'handleMouseEnterEvent'),
    handleMouseUp: jest.spyOn(component.instance(), 'handleMouseUpEvent'),
    handleSelectionStart: jest.spyOn(component.instance(), 'handleSelectionStartEvent')
  }

  anInstance.prop('onMouseDown')()
  expect(spies.handleSelectionStart).toHaveBeenCalled()
  spies.handleSelectionStart.mockReset()

  anInstance.prop('onMouseEnter')()
  expect(spies.handleMouseEnter).toHaveBeenCalled()

  anInstance.prop('onMouseUp')()
  expect(spies.handleMouseUp).toHaveBeenCalled()
})
