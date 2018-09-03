/* eslint-disable flowtype/* */

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
  document.removeEventListener = jest.fn()
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

test('getTimeFromTouchEvent returns the time for that cell', () => {
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

test('endSelection calls the onChange prop and resets selection state', () => {
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

test('handleTouchMoveEvent updates the availability draft', () => {
  const mockCellTime = new Date()
  const getTimeSpy = jest.spyOn(DatePicker.prototype, 'getTimeFromTouchEvent').mockReturnValue(mockCellTime)
  const updateDraftSpy = jest.spyOn(DatePicker.prototype, 'updateAvailabilityDraft')

  const component = shallow(<DatePicker />)
  component.instance().handleTouchMoveEvent({})
  expect(updateDraftSpy).toHaveBeenCalledWith(mockCellTime)

  getTimeSpy.mockRestore()
  updateDraftSpy.mockRestore()
})

test.each([['add', 1], ['remove', 1], ['add', -1], ['remove', -1]])(
  'updateAvailabilityDraft handles addition and removals, for forward and reversed drags',
  (type, amount, done) => {
    const start = moment(startDate)
      .add(5, 'hours')
      .toDate()
    const end = moment(start)
      .add(amount, 'hours')
      .toDate()
    const outOfRangeOne = moment(start)
      .add(amount + 5, 'hours')
      .toDate()

    const setStateSpy = jest.spyOn(DatePicker.prototype, 'setState')
    const component = shallow(
      <DatePicker
        // Initialize the initial selection based on whether this test is adding or removing
        selection={type === 'remove' ? [start, end, outOfRangeOne] : [outOfRangeOne]}
        startDate={start}
        numDays={5}
        minTime={0}
        maxTime={23}
      />
    )
    component.setState(
      {
        selectionType: type,
        selectionStart: start
      },
      () => {
        const expected = type === 'remove' ? [outOfRangeOne] : [start, end, outOfRangeOne]
        component.instance().updateAvailabilityDraft(end, () => {
          expect(setStateSpy).toHaveBeenLastCalledWith({ selectionDraft: expect.arrayContaining(expected) })
          setStateSpy.mockRestore()
          done()
        })
      }
    )
  }
)

test('updateAvailabilityDraft handles a single cell click correctly', done => {
  const setStateSpy = jest.spyOn(DatePicker.prototype, 'setState')
  const component = shallow(<DatePicker />)
  const start = startDate
  component.setState(
    {
      selectionType: 'add',
      selectionStart: start
    },
    () => {
      component.instance().updateAvailabilityDraft(null, () => {
        expect(setStateSpy).toHaveBeenCalledWith({ selectionDraft: expect.arrayContaining([start]) })
        setStateSpy.mockRestore()
        done()
      })
    }
  )
})

test('componentWillUnmount removes the mouseup event listener', () => {
  const component = shallow(<DatePicker />)
  const endSelectionMethod = component.instance().endSelection
  component.unmount()
  expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', endSelectionMethod)
})

test('componentWillReceiveProps makes the selection prop override the existing selection draft', () => {
  const setStateSpy = jest.spyOn(DatePicker.prototype, 'setState')
  const component = shallow(<DatePicker />)
  const mockNextProps = {
    selection: ['foo', 'bar']
  }
  component.instance().componentWillReceiveProps(mockNextProps)
  expect(setStateSpy).toHaveBeenCalledWith({
    selectionDraft: expect.arrayContaining(mockNextProps.selection)
  })
})
