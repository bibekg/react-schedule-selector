// @flow

import * as React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Text, Subtitle } from './typography'
import colors from './colors'

const formatTime = (hour: number): string => {
  const h = hour === 12 || hour === 24 ? 12 : hour % 12
  const abb = hour < 12 || hour === 24 ? 'am' : 'pm'
  return `${h}${abb}`
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  user-select: none;
`

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 3px;
`

const DateCell = styled.div`
  width: 100%;
  height: 25px;
  background-color: ${props => (props.selected ? colors.blue : colors.paleBlue)};
  ${'' /* Ensures that the page doesn't scroll while the user is drag-selecting cells */} touch-action: none;

  &:hover {
    background-color: ${colors.lightBlue};
  }

  margin: 3px;
`

const DateLabel = Subtitle.extend`
  height: 25px;
  @media (max-width: 699px) {
    font-size: 12px;
  }
`

const TimeLabelCell = styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: 25px;
  margin: 3px 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TimeText = Text.extend`
  margin: 0;
  @media (max-width: 699px) {
    font-size: 10px;
  }
  text-align: right;
`

type PropsType = {
  availability: Array<Date>,
  numDays: number,
  minTime: number,
  maxTime: number,
  onChange: (Array<Date>) => void
}

type SelectionType = 'add' | 'remove'

type StateType = {
  // In the case that a user is drag-selecting, we don't want to call this.props.onChange() until they have completed
  // the drag-select. availabilityDraft serves as a temporary copy during drag-selects.
  availabilityDraft: Array<Date>,
  selectionType: ?SelectionType,
  selectionStart: ?moment
}

// This component relies heavily on the fantastic APIs exposed by the moment.js library: http://momentjs.com
export default class AvailabilitySelector extends React.Component<PropsType, StateType> {
  dates: Array<Array<moment>>
  cellToMoment: Map<?HTMLElement, moment>
  documentMouseUpHandler: () => void

  static defaultProps = {
    numDays: 7,
    minTime: 9,
    maxTime: 23
  }

  constructor(props: PropsType) {
    super(props)

    // Generate list of dates to render cells for
    const now = moment().startOf('day')
    this.dates = []
    this.cellToMoment = new Map()
    for (let i = 0; i < props.numDays; i += 1) {
      const currentDay = []
      for (let j = props.minTime; j <= props.maxTime; j += 1) {
        currentDay.push(
          moment(now)
            .add(i, 'days')
            .add(j, 'hours')
        )
      }
      this.dates.push(currentDay)
    }

    this.state = {
      availabilityDraft: [...this.props.availability], // copy it over
      selectionType: null,
      selectionStart: null
    }
  }

  componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection)
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection)
  }

  componentWillReceiveProps(nextProps: PropsType) {
    this.setState({
      availabilityDraft: nextProps.availability
    })
  }

  // Performs a lookup into this.cellToMoment to retrieve the moment that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  getTimeFromTouchEvent = (event: SyntheticTouchEvent<*>): ?moment => {
    const { touches } = event
    if (!touches || touches.length === 0) return null
    const { clientX, clientY } = touches[0]
    const targetElement = document.elementFromPoint(clientX, clientY)
    const cellTime = this.cellToMoment.get(targetElement)
    return cellTime
  }

  endSelection = () => {
    this.props.onChange(this.state.availabilityDraft)
    this.setState({
      selectionType: null,
      selectionStart: null
    })
  }

  // Given an ending moment, determines all the
  updateAvailabilityDraft = (selectionEnd: ?moment, callback?: () => void) => {
    const { availability } = this.props
    const { selectionType, selectionStart } = this.state

    // User isn't selecting right now, doesn't make sense to update availability draft
    if (selectionType === null || selectionStart === null) return

    let selected: Array<moment> = []
    if (selectionEnd == null) {
      // This function is called with a null selectionEnd on `mouseup`. This is useful for catching cases
      // where the user just clicks on a single cell, since in that case,
      // In such a case, set the entire selection as just that
      if (selectionStart) selected = [selectionStart]
    } else {
      const reverseSelection = selectionEnd.isBefore(selectionStart)
      // Generate a list of moments between the start of the selection and the end of the selection
      // The moments to choose from for this list are sourced from this.dates
      selected = this.dates.reduce(
        (acc, dayOfTimes) =>
          acc.concat(
            dayOfTimes.filter(
              t =>
                selectionStart &&
                selectionEnd &&
                moment(t).isBetween(
                  reverseSelection ? selectionEnd : selectionStart,
                  reverseSelection ? selectionStart : selectionEnd,
                  'hour',
                  '[]'
                )
            )
          ),
        []
      )
    }

    if (selectionType === 'add') {
      this.setState(
        {
          availabilityDraft: Array.from(new Set(availability.concat(selected.map(t => t.toDate()))))
        },
        callback
      )
    } else if (selectionType === 'remove') {
      this.setState(
        {
          availabilityDraft: availability.filter(a => !selected.find(b => moment(a).isSame(b)))
        },
        callback
      )
    }
  }

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  handleSelectionStartEvent = (startTime: moment) => {
    if (startTime) {
      // Check if the startTime cell is selected/unselected to determine if this drag-select should
      // add values or remove values
      const timeSelected = this.props.availability.find(a => moment(a).isSame(startTime))
      this.setState({
        selectionType: timeSelected ? 'remove' : 'add',
        selectionStart: startTime
      })
    }
  }

  handleMouseEnterEvent = (time: moment) => {
    // Need to update availability draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time)
  }

  handleMouseUpEvent = (time?: moment) => {
    if (time) {
      this.updateAvailabilityDraft(time)
      // Don't call this.endSelection() here because the document mouseup handler will do it
    }
  }

  handleTouchMoveEvent = (event: SyntheticTouchEvent<*>) => {
    const cellTime = this.getTimeFromTouchEvent(event)
    if (cellTime) {
      this.updateAvailabilityDraft(cellTime)
    }
  }

  handleTouchEndEvent = () => {
    this.endSelection()
  }

  renderTimeLabels = (): React.Element<*> => {
    const labels = [<DateLabel key={-1} />] // Ensures time labels start at correct location
    for (let t = this.props.minTime; t <= this.props.maxTime; t += 1) {
      labels.push(
        <TimeLabelCell key={t}>
          <TimeText>{formatTime(t)}</TimeText>
        </TimeLabelCell>
      )
    }
    return <Column>{labels}</Column>
  }

  renderDateColumn = (dayOfTimes: Array<moment>) => (
    <Column key={dayOfTimes[0].toISOString()}>
      <DateLabel>{dayOfTimes[0].format('M/D')}</DateLabel>
      {dayOfTimes.map(time => this.renderDateCell(time))}
    </Column>
  )

  renderDateCell = (time: moment): React.Element<*> => {
    const startHandler = () => {
      this.handleSelectionStartEvent(time)
    }

    return (
      <DateCell
        key={time.toISOString()}
        innerRef={(dateCell: HTMLElement) => {
          this.cellToMoment.set(dateCell, time)
        }}
        className="date-cell"
        selected={Boolean(this.state.availabilityDraft.find(a => moment(a).isSame(time)))}
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
        // in the time parameter, instead these handlers will do their job using the default SyntheticEvent
        // parameters
        onTouchStart={startHandler}
        onTouchMove={this.handleTouchMoveEvent}
        onTouchEnd={this.handleTouchEndEvent}
      />
    )
  }

  render(): React.Element<*> {
    return (
      <Wrapper className="availability-selector">
        {
          <Grid>
            {this.renderTimeLabels()}
            {this.dates.map(this.renderDateColumn)}
          </Grid>
        }
      </Wrapper>
    )
  }
}
