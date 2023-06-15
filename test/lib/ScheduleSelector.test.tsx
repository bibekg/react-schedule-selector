import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import moment from 'moment'
import 'jest-styled-components'

import ScheduleSelector, { preventScroll } from '../../src/lib/ScheduleSelector'

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

  it('getTimeFromTouchEvent returns the time for that cell', () => {
    const component = shallow(<ScheduleSelector />)
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
    const component = shallow(<ScheduleSelector onChange={changeSpy} />)
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
      spies.onMouseDown = jest.spyOn(ScheduleSelector.prototype, 'handleSelectionStartEvent')
      spies.onMouseEnter = jest.spyOn(ScheduleSelector.prototype, 'handleMouseEnterEvent')
      spies.onMouseUp = jest.spyOn(ScheduleSelector.prototype, 'handleMouseUpEvent')
      component = shallow(<ScheduleSelector />)
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
      spies.onTouchStart = jest.spyOn(ScheduleSelector.prototype, 'handleSelectionStartEvent')
      spies.onTouchMove = jest.spyOn(ScheduleSelector.prototype, 'handleTouchMoveEvent')
      spies.onTouchEnd = jest.spyOn(ScheduleSelector.prototype, 'handleTouchEndEvent')
      component = shallow(<ScheduleSelector />)
      anInstance = component.find('.rgdp__grid-cell').first()
      mockEvent.touches = [
        { clientX: 1, clientY: 2 },
        { clientX: 100, clientY: 200 }
      ]
    })

    test.each([
      ['onTouchStart', []],
      ['onTouchMove', [mockEvent]],
      ['onTouchEnd', []]
    ])('calls the handler for %s', (name, args) => {
      anInstance.prop(name)(...args)
      expect(spies[name]).toHaveBeenCalled()
      spies[name].mockClear()
    })

    afterAll(() => {
      Object.keys(spies).forEach(spyName => {
        spies[spyName].mockRestore()
      })
    })
  })

  it('handleTouchMoveEvent updates the availability draft', () => {
    const mockCellTime = new Date()
    const getTimeSpy = jest.spyOn(ScheduleSelector.prototype, 'getTimeFromTouchEvent').mockReturnValue(mockCellTime)
    const updateDraftSpy = jest.spyOn(ScheduleSelector.prototype, 'updateAvailabilityDraft')

    const component = shallow(<ScheduleSelector />)
    component.instance().handleTouchMoveEvent({})
    expect(updateDraftSpy).toHaveBeenCalledWith(mockCellTime)

    getTimeSpy.mockRestore()
    updateDraftSpy.mockRestore()
  })

  describe('updateAvailabilityDraft', () => {
    it.each([
      ['add', 1],
      ['remove', 1],
      ['add', -1],
      ['remove', -1]
    ])(
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

        const setStateSpy = jest.spyOn(ScheduleSelector.prototype, 'setState')
        const component = shallow(
          <ScheduleSelector
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
            component.instance().updateAvailabilityDraft(end, () => {
              expect(setStateSpy).toHaveBeenLastCalledWith({ selectionDraft: expect.arrayContaining([]) })
              setStateSpy.mockRestore()
              done()
            })
          }
        )
      }
    )

    it('updateAvailabilityDraft handles a single cell click correctly', done => {
      const setStateSpy = jest.spyOn(ScheduleSelector.prototype, 'setState')
      const component = shallow(<ScheduleSelector />)
      const start = startDate
      component.setState(
        {
          selectionType: 'add',
          selectionStart: start
        },
        () => {
          component.instance().updateAvailabilityDraft(null, () => {
            expect(setStateSpy).toHaveBeenCalledWith({ selectionDraft: expect.arrayContaining([]) })
            setStateSpy.mockRestore()
            done()
          })
        }
      )
    })
  })

  describe('componentWillUnmount', () => {
    it('removes the mouseup event listener', () => {
      const component = shallow(<ScheduleSelector />)
      const endSelectionMethod = component.instance().endSelection
      component.unmount()
      expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', endSelectionMethod)
    })

    it('removes the touchmove event listeners from the date cells', () => {
      const component = shallow(<ScheduleSelector />)
      const mockDateCell = {
        removeEventListener: jest.fn()
      }
      component.instance().cellToDate.set(mockDateCell, new Date())
      component.unmount()

      expect(mockDateCell.removeEventListener).toHaveBeenCalledWith('touchmove', expect.anything())
    })
  })

  describe('handleTouchEndEvent', () => {
    const component = shallow(<ScheduleSelector />)
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
          isTouchDragging: false
        },
        () => {
          component.instance().handleTouchEndEvent()
          expect(updateDraftSpy).toHaveBeenCalled()
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

  describe('minute-level resolution', () => {
    it('splits hours using the hourlyChunks prop', () => {
      // 15-minute resolution
      const component = shallow(<ScheduleSelector minTime={1} maxTime={2} hourlyChunks={4} />)
      expect(component.find('ScheduleSelector__TimeText')).toHaveLength(4)
      // 5-minute resolution
      const componentTwo = shallow(<ScheduleSelector minTime={1} maxTime={2} hourlyChunks={12} />)
      expect(componentTwo.find('ScheduleSelector__TimeText')).toHaveLength(12)
    })

    it('formats the time column using the timeFormat prop', () => {
      // 15-minute resolution
      const component = shallow(<ScheduleSelector minTime={1} maxTime={2} timeFormat="h:mma" hourlyChunks={4} />)
      expect(
        component
          .find('ScheduleSelector__TimeText')
          .at(1)
          .render()
          .text()
      ).toEqual('1:15AM')
      // 5-minute resolution
      const componentTwo = shallow(<ScheduleSelector minTime={1} maxTime={2} timeFormat="h:mma" hourlyChunks={12} />)
      expect(
        componentTwo
          .find('ScheduleSelector__TimeText')
          .at(1)
          .render()
          .text()
      ).toEqual('1:05AM')
    })
  })
})
