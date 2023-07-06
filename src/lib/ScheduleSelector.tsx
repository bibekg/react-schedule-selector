import React, { useEffect, useRef, useState } from 'react'
import colors from './colors'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Subtitle, Text } from './typography'
import { addDays, addHours, addMinutes, isSameMinute, startOfDay } from 'date-fns'
import formatDate from 'date-fns/format'
import selectionSchemes, { SelectionSchemeType, SelectionType } from './selection-schemes/index'

const Wrapper = styled.div`
  ${css`
    display: flex;
    align-items: center;
    width: 100%;
    user-select: none;
  `}
`
interface IGridProps {
  columns: number
  rows: number
  columnGap: string
  rowGap: string
}

const Grid = styled.div<IGridProps>`
  ${props => css`
    display: grid;
    grid-template-columns: auto repeat(${props.columns}, 1fr);
    grid-template-rows: auto repeat(${props.rows}, 1fr);
    column-gap: ${props.columnGap};
    row-gap: ${props.rowGap};
    width: 100%;
  `}
`

export const GridCell = styled.div`
  ${css`
    place-self: stretch;
    touch-action: none;
  `}
`

interface IDateCellProps {
  selected: boolean
  selectedColor: string
  unselectedColor: string
  hoveredColor: string
}

const DateCell = styled.div<IDateCellProps>`
  ${props => css`
    width: 100%;
    height: 25px;
    background-color: ${props.selected ? props.selectedColor : props.unselectedColor};

    &:hover {
      background-color: ${props.hoveredColor};
    }
  `}
`

const DateLabel = styled(Subtitle)`
  ${css`
    @media (max-width: 699px) {
      font-size: 12px;
    }
    margin: 0;
    margin-bottom: 4px;
  `}
`

const TimeText = styled(Text)`
  ${css`
    @media (max-width: 699px) {
      font-size: 10px;
    }
    text-align: right;
    margin: 0;
    margin-right: 4px;
  `}
`

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IScheduleSelectorProps {
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
  columnGap?: string
  rowGap?: string
  unselectedColor?: string
  selectedColor?: string
  hoveredColor?: string
  renderDateCell?: (datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void) => JSX.Element
  renderTimeLabel?: (time: Date) => JSX.Element
  renderDateLabel?: (date: Date) => JSX.Element
}

export const preventScroll = (e: TouchEvent) => {
  e.preventDefault()
}

const computeDatesMatrix = (props: IScheduleSelectorProps): Array<Array<Date>> => {
  const startTime = startOfDay(props.startDate.getUTCDate())
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

const ScheduleSelector: React.FC<IScheduleSelectorProps> = props => {
  const selectionSchemeHandlers = {
    linear: selectionSchemes.linear,
    square: selectionSchemes.square
  }
  const cellToDate = useRef<Map<Element, Date>>(new Map())
  const gridRef = useRef<HTMLElement | null>(null)

  const [selectionDraft, setSelectionDraft] = useState([...props.selection])
  const selectionDraftRef = useRef(selectionDraft)
  const [selectionType, setSelectionType] = useState<SelectionType | null>(null)
  const [selectionStart, setSelectionStart] = useState<Date | null>(null)
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [dates, setDates] = useState(computeDatesMatrix(props))

  useEffect(() => {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', endSelection)

    // Prevent page scrolling when user is dragging on the date cells
    cellToDate.current.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, { passive: false })
      }
    })

    return () => {
      document.removeEventListener('mouseup', endSelection)
      cellToDate.current.forEach((value, dateCell) => {
        if (dateCell && dateCell.removeEventListener) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dateCell.removeEventListener('touchmove', preventScroll)
        }
      })
    }
  }, [])

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  const getTimeFromTouchEvent = (event: React.TouchEvent<any>): Date | null => {
    const { touches } = event
    if (!touches || touches.length === 0) return null
    const { clientX, clientY } = touches[0]
    const targetElement = document.elementFromPoint(clientX, clientY)
    if (targetElement) {
      const cellTime = cellToDate.current.get(targetElement)
      return cellTime ?? null
    }
    return null
  }

  const endSelection = () => {
    props.onChange(selectionDraftRef.current)
    setSelectionType(null)
    setSelectionStart(null)
  }

  // Given an ending Date, determines all the dates that should be selected in this draft
  const updateAvailabilityDraft = (selectionEnd: Date | null) => {
    if (selectionType === null || selectionStart === null) return

    let newSelection: Array<Date> = []
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = selectionSchemeHandlers[props.selectionScheme](selectionStart, selectionEnd, dates)
    }

    let nextDraft = [...props.selection]
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]))
      console.log(props.selection, newSelection, nextDraft)
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => isSameMinute(a, b)))
    }

    selectionDraftRef.current = nextDraft
    setSelectionDraft(nextDraft)
  }

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  const handleSelectionStartEvent = (startTime: Date) => {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = props.selection.find(a => isSameMinute(a, startTime))
    setSelectionType(timeSelected ? 'remove' : 'add')
    setSelectionStart(startTime)
  }

  const handleMouseEnterEvent = (time: Date) => {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    updateAvailabilityDraft(time)
  }

  const handleMouseUpEvent = (time: Date) => {
    updateAvailabilityDraft(time)
    // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  const handleTouchMoveEvent = (event: React.TouchEvent) => {
    setIsTouchDragging(true)
    const cellTime = getTimeFromTouchEvent(event)
    if (cellTime) {
      updateAvailabilityDraft(cellTime)
    }
  }

  const handleTouchEndEvent = () => {
    if (!isTouchDragging) {
      updateAvailabilityDraft(null)
    } else {
      endSelection()
    }
    setIsTouchDragging(false)
  }

  const renderDateCellWrapper = (time: Date): JSX.Element => {
    const startHandler = () => {
      handleSelectionStartEvent(time)
    }

    const selected = Boolean(selectionDraft.find(a => isSameMinute(a, time)))

    return (
      <GridCell
        className="rgdp__grid-cell"
        role="presentation"
        key={time.toISOString()}
        // Mouse handlers
        onMouseDown={startHandler}
        onMouseEnter={() => {
          handleMouseEnterEvent(time)
        }}
        onMouseUp={() => {
          handleMouseUpEvent(time)
        }}
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        onTouchStart={startHandler}
        onTouchMove={handleTouchMoveEvent}
        onTouchEnd={handleTouchEndEvent}
      >
        {renderDateCell(time, selected)}
      </GridCell>
    )
  }

  const renderDateCell = (time: Date, selected: boolean): JSX.Element => {
    const refSetter = (dateCell: HTMLElement | null) => {
      if (dateCell) {
        cellToDate.current.set(dateCell, time)
      }
    }
    if (props.renderDateCell) {
      return props.renderDateCell(time, selected, refSetter)
    } else {
      return (
        <DateCell
          selected={selected}
          ref={refSetter}
          selectedColor={props.selectedColor!}
          unselectedColor={props.unselectedColor!}
          hoveredColor={props.hoveredColor!}
        />
      )
    }
  }

  const renderTimeLabel = (time: Date): JSX.Element => {
    if (props.renderTimeLabel) {
      return props.renderTimeLabel(time)
    } else {
      return <TimeText>{formatDate(time, props.timeFormat)}</TimeText>
    }
  }

  const renderDateLabel = (date: Date): JSX.Element => {
    if (props.renderDateLabel) {
      return props.renderDateLabel(date)
    } else {
      return <DateLabel>{formatDate(date, props.dateFormat)}</DateLabel>
    }
  }

  const renderFullDateGrid = (): Array<JSX.Element> => {
    const flattenedDates: Date[] = []
    const numDays = dates.length
    const numTimes = dates[0].length
    for (let j = 0; j < numTimes; j += 1) {
      for (let i = 0; i < numDays; i += 1) {
        flattenedDates.push(dates[i][j])
      }
    }
    const dateGridElements = flattenedDates.map(renderDateCellWrapper)
    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays
      const time = dates[0][i]
      // Inject the time label at the start of every row
      dateGridElements.splice(index + i, 0, renderTimeLabel(time))
    }
    return [
      // Empty top left corner
      <div key="topleft" />,
      // Top row of dates
      ...dates.map((dayOfTimes, index) => React.cloneElement(renderDateLabel(dayOfTimes[0]), { key: `date-${index}` })),
      // Every row after that
      ...dateGridElements.map((element, index) => React.cloneElement(element, { key: `time-${index}` }))
    ]
  }

  return (
    <Wrapper>
      <Grid
        columns={dates.length}
        rows={dates[0].length}
        columnGap={props.columnGap!}
        rowGap={props.rowGap!}
        ref={el => {
          gridRef.current = el
        }}
      >
        {renderFullDateGrid()}
      </Grid>
    </Wrapper>
  )
}

export default ScheduleSelector

ScheduleSelector.defaultProps = {
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
  selectedColor: colors.blue,
  unselectedColor: colors.paleBlue,
  hoveredColor: colors.lightBlue,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: () => {}
}
