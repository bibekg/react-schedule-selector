import * as React from 'react'
import styled from 'styled-components'

// Import only the methods we need from date-fns in order to keep build size small
import { addMinutes, addHours, addDays, startOfDay, isSameMinute } from 'date-fns'
import formatDate from 'date-fns/format'
import { enGB } from 'date-fns/locale'
import { Locale } from 'date-fns'

import { Text, Subtitle } from './typography'
import colors from './colors'
import selectionSchemes, { SelectionSchemeType, SelectionType } from './selection-schemes'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  user-select: none;
`

const Grid = styled.div<{ columns: number; rows: number; columnGap: string; rowGap: string }>`
  display: grid;
  grid-template-columns: auto repeat(${props => props.columns}, 1fr);
  grid-template-rows: auto repeat(${props => props.rows}, 1fr);
  column-gap: ${props => props.columnGap};
  row-gap: ${props => props.rowGap};
  width: 100%;
`

export const GridCell = styled.div`
  place-self: stretch;
  touch-action: none;
`

const DateCell = styled.div<{
  selected: boolean
  selectedColor: string
  unselectedColor: string
  hoveredColor: string
}>`
  width: 100%;
  height: 25px;
  background-color: ${props => (props.selected ? props.selectedColor : props.unselectedColor)};

  &:hover {
    background-color: ${props => props.hoveredColor};
  }
`

const DateLabel = styled(Subtitle)`
  @media (max-width: 699px) {
    font-size: 12px;
  }
  margin: 0;
  margin-bottom: 4px;
`

const TimeText = styled(Text)`
  @media (max-width: 699px) {
    font-size: 10px;
  }
  text-align: right;
  margin: 0;
  margin-right: 4px;
`

type PropsType = {
  selection: Array<Date>
  selectionScheme: SelectionSchemeType
  onChange: (newSelection: Array<Date>) => void
  startDate: Date
  numDays: number
  minTime: number
  maxTime: number
  hourlyChunks: number
  dateFormat: string
  timeFormat: string
  columnGap: string
  rowGap: string
  locale: string
  unselectedColor: string
  selectedColor: string
  hoveredColor: string
  renderDateCell?: (datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void) => JSX.Element
  renderTimeLabel?: (time: Date) => JSX.Element
  renderDateLabel?: (date: Date) => JSX.Element
}

type StateType = {
  // In the case that a user is drag-selecting, we don't want to call this.props.onChange() until they have completed
  // the drag-select. selectionDraft serves as a temporary copy during drag-selects.
  selectionDraft: Array<Date>
  selectionType: SelectionType | null
  selectionStart: Date | null
  locale: Locale | null
  prevLocale: string
  isTouchDragging: boolean
  dates: Array<Array<Date>>
}

export const preventScroll = (e: TouchEvent) => {
  e.preventDefault()
}

export default class ScheduleSelector extends React.Component<PropsType, StateType> {
  selectionSchemeHandlers: { [key: string]: (startDate: Date, endDate: Date, foo: Array<Array<Date>>) => Date[] }
  cellToDate: Map<Element, Date> = new Map()
  // documentMouseUpHandler: () => void = () => {}
  // endSelection: () => void = () => {}
  // handleTouchMoveEvent: (event: React.SyntheticTouchEvent<*>) => void
  // handleTouchEndEvent: () => void
  // handleMouseUpEvent: (date: Date) => void
  // handleMouseEnterEvent: (date: Date) => void
  // handleSelectionStartEvent: (date: Date) => void
  gridRef: HTMLElement | null = null
  _asyncLocaleImportRequest: Promise<any> | null = null
  _currentLocale: string = ''

  static defaultProps: Partial<PropsType> = {
    selection: [],
    selectionScheme: 'square',
    numDays: 7,
    minTime: 9,
    maxTime: 23,
    hourlyChunks: 1,
    startDate: new Date(),
    timeFormat: 'ha',
    dateFormat: 'M/d',
    columnGap: '4px',
    rowGap: '4px',
    locale: 'en-GB',
    selectedColor: colors.blue,
    unselectedColor: colors.paleBlue,
    hoveredColor: colors.lightBlue,
    onChange: () => {}
  }

  static getDerivedStateFromProps(props: PropsType, state: StateType): Partial<StateType> | null {
    const updatedState: Partial<StateType> = {}

    if (props.locale !== state.prevLocale) {
      updatedState.locale = null
      updatedState.prevLocale = props.locale
    }
    // As long as the user isn't in the process of selecting, allow prop changes to re-populate selection state
    if (state.selectionStart == null) {
      updatedState.selectionDraft = [...props.selection]
      updatedState.dates = ScheduleSelector.computeDatesMatrix(props)
    }

    if (Object.keys(updatedState).length !== 0) return updatedState

    return null
  }

  static computeDatesMatrix(props: PropsType): Array<Array<Date>> {
    const startTime = startOfDay(props.startDate)
    const dates: Array<Array<Date>> = []
    const minutesInChunk = Math.floor(60 / props.hourlyChunks)
    for (let d = 0; d < props.numDays; d += 1) {
      const currentDay = []
      for (let h = props.minTime; h < props.maxTime; h += 1) {
        for (let c = 0; c < props.hourlyChunks; c += 1) {
          currentDay.push(addMinutes(addHours(addDays(startTime, d), h), c * minutesInChunk))
        }
      }
      dates.push(currentDay)
    }
    return dates
  }

  constructor(props: PropsType) {
    super(props)

    this.state = {
      selectionDraft: [...this.props.selection], // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false,
      locale: null,
      prevLocale: '',
      dates: ScheduleSelector.computeDatesMatrix(props)
    }

    this.selectionSchemeHandlers = {
      linear: selectionSchemes.linear,
      square: selectionSchemes.square
    }

    this.endSelection = this.endSelection.bind(this)
    this.handleMouseUpEvent = this.handleMouseUpEvent.bind(this)
    this.handleMouseEnterEvent = this.handleMouseEnterEvent.bind(this)
    this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this)
    this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this)
    this.handleSelectionStartEvent = this.handleSelectionStartEvent.bind(this)
  }

  componentDidMount() {
    if (this.props.locale !== 'en-GB') {
      this._loadLocaleLibrary(this.props.locale)
    }
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection)

    // Prevent page scrolling when user is dragging on the date cells
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, { passive: false })
      }
    })
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    if (this.props.locale !== 'en-GB' && this.state.locale !== enGB) {
      this._loadLocaleLibrary(this.props.locale)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection)
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.removeEventListener) {
        // @ts-ignore
        dateCell.removeEventListener('touchmove', preventScroll)
      }
    })
    if (this._asyncLocaleImportRequest) {
      this._asyncLocaleImportRequest = null
    }
    this._currentLocale = ''
  }

  _loadLocaleLibrary(id: string) {
    if (id === this._currentLocale) {
      // Data for this id is already loading
      return
    }

    this._currentLocale = id

    this._asyncLocaleImportRequest = import(
      /* webpackMode: "lazy", webpackChunkName: "df-[index]", webpackExclude: /_lib/ */
      `date-fns/locale/${id}/index.js`
    )
      .then(locale => {
        this._asyncLocaleImportRequest = null
        if (id === this._currentLocale) {
          this.setState({ locale: locale.default })
        }
      })
      .catch(e => {
        console.error(e)
        this._asyncLocaleImportRequest = null
        if (id === this._currentLocale) {
          this.setState({ locale: enGB })
        }
      })
  }

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  getTimeFromTouchEvent(event: React.TouchEvent<any>): Date | null {
    const { touches } = event
    if (!touches || touches.length === 0) return null
    const { clientX, clientY } = touches[0]
    const targetElement = document.elementFromPoint(clientX, clientY)
    if (targetElement) {
      const cellTime = this.cellToDate.get(targetElement)
      return cellTime ?? null
    }
    return null
  }

  endSelection() {
    this.props.onChange(this.state.selectionDraft)
    this.setState({
      selectionType: null,
      selectionStart: null
    })
  }

  // Given an ending Date, determines all the dates that should be selected in this draft
  updateAvailabilityDraft(selectionEnd: Date | null, callback?: () => void) {
    const { selectionType, selectionStart } = this.state

    if (selectionType === null || selectionStart === null) return

    let newSelection: Array<Date> = []
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](
        selectionStart,
        selectionEnd,
        this.state.dates
      )
    }

    let nextDraft = [...this.props.selection]
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]))
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => isSameMinute(a, b)))
    }

    this.setState({ selectionDraft: nextDraft }, callback)
  }

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  handleSelectionStartEvent(startTime: Date) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = this.props.selection.find(a => isSameMinute(a, startTime))
    this.setState({
      selectionType: timeSelected ? 'remove' : 'add',
      selectionStart: startTime
    })
  }

  handleMouseEnterEvent(time: Date) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time)
  }

  handleMouseUpEvent(time: Date) {
    this.updateAvailabilityDraft(time)
    // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  handleTouchMoveEvent(event: React.TouchEvent) {
    this.setState({ isTouchDragging: true })
    const cellTime = this.getTimeFromTouchEvent(event)
    if (cellTime) {
      this.updateAvailabilityDraft(cellTime)
    }
  }

  handleTouchEndEvent() {
    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, () => {
        this.endSelection()
      })
    } else {
      this.endSelection()
    }
    this.setState({ isTouchDragging: false })
  }

  renderDateCellWrapper = (time: Date): JSX.Element => {
    const startHandler = () => {
      this.handleSelectionStartEvent(time)
    }

    const selected = Boolean(this.state.selectionDraft.find(a => isSameMinute(a, time)))

    return (
      <GridCell
        className="rgdp__grid-cell"
        role="presentation"
        key={time.toISOString()}
        // Mouse handlers
        onMouseDown={startHandler}
        onMouseEnter={() => {
          this.handleMouseEnterEvent(time)
        }}
        onMouseUp={() => {
          this.handleMouseUpEvent(time)
        }}
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        onTouchStart={startHandler}
        onTouchMove={this.handleTouchMoveEvent}
        onTouchEnd={this.handleTouchEndEvent}
      >
        {this.renderDateCell(time, selected)}
      </GridCell>
    )
  }

  renderDateCell = (time: Date, selected: boolean): JSX.Element => {
    const refSetter = (dateCell: HTMLElement | null) => {
      if (dateCell) {
        this.cellToDate.set(dateCell, time)
      }
    }
    if (this.props.renderDateCell) {
      return this.props.renderDateCell(time, selected, refSetter)
    } else {
      return (
        <DateCell
          selected={selected}
          ref={refSetter}
          selectedColor={this.props.selectedColor}
          unselectedColor={this.props.unselectedColor}
          hoveredColor={this.props.hoveredColor}
        />
      )
    }
  }

  renderTimeLabel = (time: Date): JSX.Element => {
    if (this.props.renderTimeLabel) {
      return this.props.renderTimeLabel(time)
    } else {
      return <TimeText>{formatDate(time, this.props.timeFormat, { locale: this.state.locale || enGB })}</TimeText>
    }
  }

  renderDateLabel = (date: Date): JSX.Element => {
    if (this.props.renderDateLabel) {
      return this.props.renderDateLabel(date)
    } else {
      return <DateLabel>{formatDate(date, this.props.dateFormat, { locale: this.state.locale || enGB })}</DateLabel>
    }
  }

  renderFullDateGrid(): Array<JSX.Element> {
    const flattenedDates: Date[] = []
    const numDays = this.state.dates.length
    const numTimes = this.state.dates[0].length
    for (let j = 0; j < numTimes; j += 1) {
      for (let i = 0; i < numDays; i += 1) {
        flattenedDates.push(this.state.dates[i][j])
      }
    }
    const dateGridElements = flattenedDates.map(this.renderDateCellWrapper)
    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays
      const time = this.state.dates[0][i]
      // Inject the time label at the start of every row
      dateGridElements.splice(index + i, 0, this.renderTimeLabel(time))
    }
    return [
      // Empty top left corner
      <div key="topleft" />,
      // Top row of dates
      ...this.state.dates.map((dayOfTimes, index) =>
        React.cloneElement(this.renderDateLabel(dayOfTimes[0]), { key: `date-${index}` })
      ),
      // Every row after that
      ...dateGridElements.map((element, index) => React.cloneElement(element, { key: `time-${index}` }))
    ]
  }

  render(): JSX.Element {
    return (
      <Wrapper>
        <Grid
          columns={this.state.dates.length}
          rows={this.state.dates[0].length}
          columnGap={this.props.columnGap}
          rowGap={this.props.rowGap}
          ref={el => {
            this.gridRef = el
          }}
        >
          {this.renderFullDateGrid()}
        </Grid>
      </Wrapper>
    )
  }
}
