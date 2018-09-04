/* eslint-disable flowtype/* */

import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import moment from 'moment'

import DatePicker, { preventScroll } from '../../src/lib/DatePicker'

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

describe('snapshot tests', () => {
  it('renders correctly with default render logic', () => {
    const component = renderer.create(
      <DatePicker selection={getTestSchedule()} startDate={startDate} numDays={5} onChange={() => undefined} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with custom render prop', () => {
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
})

it('getTimeFromTouchEvent returns the time for that cell', () => {
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

it('endSelection calls the onChange prop and resets selection state', () => {
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

describe('mouse handlers', () => {
  const spies = {}
  let component
  let anInstance

  beforeAll(() => {
    spies.onMouseDown = jest.spyOn(DatePicker.prototype, 'handleSelectionStartEvent')
    spies.onMouseEnter = jest.spyOn(DatePicker.prototype, 'handleMouseEnterEvent')
    spies.onMouseUp = jest.spyOn(DatePicker.prototype, 'handleMouseUpEvent')
    component = shallow(<DatePicker />)
    anInstance = component.find('.rgdp__grid-cell').first()
  })

  test.each([['onMouseDown'], ['onMouseEnter'], ['onMouseUp']])('calls the handler for %s', name => {
    anInstance.prop(name)()
    expect(spies[name]).toHaveBeenCalled()
    spies[name].mockClear()
  })

  afterAll(() => {
    Object.keys(spies).forEach(spyName => {
      spies[spyName].mockRestore()
    })
  })
})

describe('touch handlers', () => {
  const spies = {}
  let component
  let anInstance
  const mockEvent = {}

  beforeAll(() => {
    spies.onTouchStart = jest.spyOn(DatePicker.prototype, 'handleSelectionStartEvent')
    spies.onTouchMove = jest.spyOn(DatePicker.prototype, 'handleTouchMoveEvent')
    spies.onTouchEnd = jest.spyOn(DatePicker.prototype, 'handleTouchEndEvent')
    component = shallow(<DatePicker />)
    anInstance = component.find('.rgdp__grid-cell').first()
    mockEvent.touches = [{ clientX: 1, clientY: 2 }, { clientX: 100, clientY: 200 }]
  })

  test.each([['onTouchStart', []], ['onTouchMove', [mockEvent]], ['onTouchEnd', []]])(
    'calls the handler for %s',
    (name, args) => {
      anInstance.prop(name)(...args)
      expect(spies[name]).toHaveBeenCalled()
      spies[name].mockClear()
    }
  )

  afterAll(() => {
    Object.keys(spies).forEach(spyName => {
      spies[spyName].mockRestore()
    })
  })
})

it('handleTouchMoveEvent updates the availability draft', () => {
  const mockCellTime = new Date()
  const getTimeSpy = jest.spyOn(DatePicker.prototype, 'getTimeFromTouchEvent').mockReturnValue(mockCellTime)
  const updateDraftSpy = jest.spyOn(DatePicker.prototype, 'updateAvailabilityDraft')

  const component = shallow(<DatePicker />)
  component.instance().handleTouchMoveEvent({})
  expect(updateDraftSpy).toHaveBeenCalledWith(mockCellTime)

  getTimeSpy.mockRestore()
  updateDraftSpy.mockRestore()
})

describe('updateAvailabilityDraft', () => {
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

  it('updateAvailabilityDraft handles a single cell click correctly', done => {
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
})

describe('componentDidMount', () => {
  it('runs properly on a full mount', () => {
    mount(<DatePicker />)
  })
})

describe('componentWillUnmount', () => {
  it('removes the mouseup event listener', () => {
    const component = shallow(<DatePicker />)
    const endSelectionMethod = component.instance().endSelection
    component.unmount()
    expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', endSelectionMethod)
  })

  it('removes the touchmove event listeners from the date cells', () => {
    const component = shallow(<DatePicker />)
    const mockDateCell = {
      removeEventListener: jest.fn()
    }
    component.instance().cellToDate.set(mockDateCell, new Date())
    component.unmount()

    expect(mockDateCell.removeEventListener).toHaveBeenCalledWith('touchmove', expect.anything())
  })
})

describe('componentWillReceiveProps', () => {
  it('makes the selection prop override the existing selection draft', () => {
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
})

describe('handleTouchEndEvent', () => {
  const component = shallow(<DatePicker />)
  const setStateSpy = jest.spyOn(component.instance(), 'setState')
  const updateDraftSpy = jest.spyOn(component.instance(), 'updateAvailabilityDraft').mockImplementation((a, b) => b())
  const endSelectionSpy = jest.spyOn(component.instance(), 'endSelection').mockImplementation(jest.fn())

  it('handles regular events correctly', () => {
    component.instance().handleTouchEndEvent()

    expect(setStateSpy).toHaveBeenLastCalledWith({ isTouchDragging: false })
    expect(updateDraftSpy).toHaveBeenCalled()
    expect(endSelectionSpy).toHaveBeenCalled()

    setStateSpy.mockClear()
    updateDraftSpy.mockClear()
    endSelectionSpy.mockClear()
  })

  it('handles single-touch-tap events correctly', done => {
    // Set touch dragging to true and make sure updateDraftSpy doesn't get called
    component.setState(
      {
        isTouchDragging: true
      },
      () => {
        component.instance().handleTouchEndEvent()
        expect(updateDraftSpy).not.toHaveBeenCalled()
        expect(endSelectionSpy).toHaveBeenCalled()
        expect(setStateSpy).toHaveBeenLastCalledWith({ isTouchDragging: false })
        setStateSpy.mockRestore()
        updateDraftSpy.mockRestore()
        endSelectionSpy.mockRestore()
        done()
      }
    )
  })
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
