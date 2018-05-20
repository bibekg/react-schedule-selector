// @flow

import * as React from 'react'
// eslint-disable-next-line
import * as ReactDOM from 'react-dom'
import DatePicker from '../lib'

type StateType = {
  schedule: Array<Date>
}

class App extends React.Component<{}, StateType> {
  state = { schedule: [] }

  handleDateChange = newSchedule => {
    this.setState({ schedule: newSchedule })
  }

  renderCustomCell = (selected: boolean) =>
    selected ? (
      <span role="img" aria-label="checked">
        ✅
      </span>
    ) : (
      <span role="img" aria-label="Unchecked">
        ❌
      </span>
    )

  render(): React.Element<*> {
    return (
      <div>
        <h1>Default Date Picker</h1>
        <DatePicker availability={this.state.schedule} onChange={this.handleDateChange} />

        <h1>Default Date Picker (with custom colors)</h1>
        <DatePicker
          availability={this.state.schedule}
          onChange={this.handleDateChange}
          unselectedColor="red"
          selectedColor="green"
          hoveredColor="yellow"
        />

        <h1>Date Picker with Custom Options</h1>
        <DatePicker
          minTime={12}
          maxTime={20}
          numDays={3}
          availability={this.state.schedule}
          onChange={this.handleDateChange}
          renderDateCell={this.renderCustomCell}
          dateFormat="MMM Do"
        />
      </div>
    )
  }
}

// flow-disable-next-line
ReactDOM.render(<App />, document.getElementById('app'))
