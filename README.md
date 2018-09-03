# Grid Date Picker

[![Coverage Status](https://coveralls.io/repos/github/bibekg/react-grid-date-picker/badge.svg?branch=configure-travis)](https://coveralls.io/github/bibekg/react-grid-date-picker?branch=configure-travis)

A mobile-friendly when2meet-style grid-based date picker built with [styled components](https://github.com/styled-components/styled-components) and [date-fns](https://date-fns.org/).

![image](https://image.ibb.co/jDKJBT/react_grid_date_picker.png)

## Getting Started

```
yarn add react-grid-date-picker styled-components
```

```js
import DatePicker from 'react-grid-date-picker'

class App extends React.Component {
  state = { schedule = [] }

  handleDatePickerChange = newSchedule => {
    this.setState({ schedule: newSchedule })
  }

  render() {
    return (
      <DatePicker
        selection={this.state.schedule}
        numDays={5}
        minTime={8}
        maxTime={22}
        onChange={this.handleDatePickerChange}
      />
    )
  }
}
```

## `<DatePicker />`

`DatePicker` is a controlled component that can be used easily with the default settings. Just provide a controlled value for `selection` and include an `onChange` handler and you're good to go. Further customization can be done using the props outlined below.

To customize the UI, you can either:

1.  Specify values for the color, margin, format, etc. props
2.  Use the `renderDateCell` render prop to handle rendering yourself.

### `Props`

| props             | type                                            | description                                                                                                                                                                                                                         | required | default value              |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------- |
| `selection`       | `Array<Date>`                                   | List of dates that should be filled in on the grid (reflect the start time of each cell)                                                                                                                                            | yes      | N/A                        |
| `onChange`        | `(newSelection: Array<Date>) => void`           | A callback that's executed when the selected availability is changed. The new list of selected dates is passed in as the single parameter                                                                                           | yes      | N/A                        |
| `startDate`       | `Date`                                          | The date on which the grid should start (time portion is ignored, specify start time via `minTime`)                                                                                                                                 | no       | today                      |
| `numDays`         | `number`                                        | The number of days from today to show                                                                                                                                                                                               | no       | `7`                        |
| `minTime`         | `number`                                        | The minimum hour to show (0-23)                                                                                                                                                                                                     | no       | `9`                        |
| `maxTime`         | `number`                                        | The maximum hour to show (0-23)                                                                                                                                                                                                     | no       | `23`                       |
| `dateFormat`      | `string`                                        | The [date format](https://date-fns.org/v1.29.0/docs/format) to be used for the column headers                                                                                                                                       | no       | `'M/D'`                    |
| `margin`          | `number`                                        | The margin between grid cells                                                                                                                                                                                                       | no       | `3`                        |
| `unselectedColor` | `string`                                        | The color of an unselected cell                                                                                                                                                                                                     | no       | `'rgba(89, 154, 242, 1)'`  |
| `selectedColor`   | `string`                                        | The color of a selected cell                                                                                                                                                                                                        | no       | `'rgba(162, 198, 248, 1)'` |
| `hoveredColor`    | `string`                                        | The color of a hovered cell                                                                                                                                                                                                         | no       | `'#dbedff'`                |
| `renderDateCell`  | `(time: Date, selected: boolean) => React.Node` | A render prop function that accepts the time this cell is representing and whether the cell is selected or not and returns a React element. If you choose to use this custom render function, the color props above have no effect. | no       | ...                        |
