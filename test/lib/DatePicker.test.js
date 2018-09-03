import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
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

beforeAll(() => {
  document.elementFromPoint = jest.fn()
})

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
  const mockEvent = {
    touches: [{ clientX: 1, clientY: 2 }]
  }
  const cellToDateSpy = jest.spyOn(component.instance().cellToDate, 'get').mockReturnValue(mockCellTime)

  component.instance().getTimeFromTouchEvent(mockEvent)

  expect(document.elementFromPoint).toHaveBeenCalledWith(mockEvent.touches[0].clientX, mockEvent.touches[0].clientY)
  expect(cellToDateSpy).toHaveBeenCalled()
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

test('mouse handlers get called', () => {
  const component = shallow(<DatePicker />)
  const anInstance = component.find('.rgdp__grid-cell').first()

  const spies = {
    handleSelectionStart: jest.spyOn(component.instance(), 'handleSelectionStartEvent'),
    handleMouseEnter: jest.spyOn(component.instance(), 'handleMouseEnterEvent'),
    handleMouseUp: jest.spyOn(component.instance(), 'handleMouseUpEvent')
  }

  anInstance.prop('onMouseDown')()
  expect(spies.handleSelectionStart).toHaveBeenCalled()
  spies.handleSelectionStart.mockReset()

  anInstance.prop('onMouseEnter')()
  expect(spies.handleMouseEnter).toHaveBeenCalled()

  anInstance.prop('onMouseUp')()
  expect(spies.handleMouseUp).toHaveBeenCalled()

  Object.keys(spies).forEach(spyName => {
    spies[spyName].mockRestore()
  })
})

test('touch handlers get called', () => {
  const spies = {
    onTouchStart: jest.spyOn(DatePicker.prototype, 'handleSelectionStartEvent'),
    onTouchMove: jest.spyOn(DatePicker.prototype, 'handleTouchMoveEvent'),
    onTouchEnd: jest.spyOn(DatePicker.prototype, 'handleTouchEndEvent')
  }

  const component = shallow(<DatePicker />)
  const anInstance = component.find('.rgdp__grid-cell').first()

  const mockEvent = {
    touches: [{ clientX: 1, clientY: 2 }, { clientX: 100, clientY: 200 }]
  }

  anInstance.prop('onTouchStart')()
  expect(spies.onTouchStart).toHaveBeenCalled()
  spies.onTouchStart.mockReset()

  anInstance.prop('onTouchMove')(mockEvent)
  expect(spies.onTouchMove).toHaveBeenCalled()

  anInstance.prop('onTouchEnd')()
  expect(spies.onTouchEnd).toHaveBeenCalled()

  Object.keys(spies).forEach(spyName => {
    spies[spyName].mockRestore()
  })
})
