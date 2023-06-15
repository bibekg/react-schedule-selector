import * as dateUtils from '../date-utils'
import { isBefore, startOfDay } from 'date-fns'

const square = (selectionStart: Date | null, selectionEnd: Date | null, dateList: Array<Array<Date>>): Array<Date> => {
  let selected: Array<Date> = []
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart]
  } else if (selectionStart) {
    const dateIsReversed = isBefore(startOfDay(selectionEnd), startOfDay(selectionStart))
    const timeIsReversed = selectionStart.getHours() > selectionEnd.getHours()

    selected = dateList.reduce(
      (acc, dayOfTimes) =>
        acc.concat(
          dayOfTimes.filter(
            t =>
              selectionStart &&
              selectionEnd &&
              dateUtils.dateIsBetween(
                dateIsReversed ? selectionEnd : selectionStart,
                t,
                dateIsReversed ? selectionStart : selectionEnd
              ) &&
              dateUtils.timeIsBetween(
                timeIsReversed ? selectionEnd : selectionStart,
                t,
                timeIsReversed ? selectionStart : selectionEnd
              )
          )
        ),
      []
    )
  }

  return selected
}

export default square
