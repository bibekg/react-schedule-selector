# Grid Date Picker

A mobile-friendly when2meet-style grid-based date picker built with [styled components](https://github.com/styled-components/styled-components) and [moment](momentjs.com).

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
      <GridDatePicker
        availability={this.state.schedule}
        numDays={5}
        minTime={8}
        maxTime={22}
        onChange={this.handleDatePickerChange}
      />
    )
  }
}
```

## `<GridDatePicker />`

| props | type | description |required | default value |
--- | --- | --- | --- | ---
`availability` | `Array<Date>` | List of dates that should be filled in on the grid (reflect the start time of each cell) | yes | N/A
`numDays` | `number` | The number of days from today to show | no | `7`
`minTime` | `number` | The minimum hour to show (0-23) | no | `9`
`maxTime` | `number` | The maximum hour to show (0-23) | no | `23`
`onChange` | `(Array<Date>) => void` | A callback that's executed when the selected availability is changed | yes | N/A
`dateFormat` | `string` | The [date format](http://momentjs.com/docs/#/displaying/) to be used for the column headers | no | `'M/D'`
`margin` | `number` | The margin between grid cells | no | `3`
`unselectedColor` | `string` | The color of an unselected cell | no | `'rgba(89, 154, 242, 1)'`
`selectedColor` | `string` | The color of a selected cell | no | `'rgba(162, 198, 248, 1)'`
`hoveredColor` | `string` | The color of a hovered cell | no | `'#dbedff'`
`renderDateCell` | `boolean => React.Node` | A function that accepts whether the cell is selected or not and returns a React element. If you choose to use this custom render function, the color props above have no effect. | no | ...