// @flow

import isBefore from 'date-fns/is_before'

import * as dateUtils from '../date-utils'

const square = (selectionStart: ?Date, selectionEnd: ?Date, dateList: Array<Array<Date>>): Array<Date> => {
  let selected: Array<Date> = []
  if (selectionEnd == null) {
    // This function is called with a null selectionEnd on `mouseup`. This is useful for catching cases
    // where the user just clicks on a single cell
    if (selectionStart) selected = [selectionStart]
  } else if (selectionStart) {
    const reverseSelection = isBefore(selectionEnd, selectionStart)

    selected = dateList.reduce(
      (acc, dayOfTimes) =>
        acc.concat(
          dayOfTimes.filter(
            t =>
              selectionStart &&
              selectionEnd &&
              dateUtils.dateIsBetween(
                reverseSelection ? selectionEnd : selectionStart,
                t,
                reverseSelection ? selectionStart : selectionEnd
              ) &&
              dateUtils.timeIsBetween(
                reverseSelection ? selectionEnd : selectionStart,
                t,
                reverseSelection ? selectionStart : selectionEnd
              )
          )
        ),
      []
    )
  }

  return selected
}

export default square
