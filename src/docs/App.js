// @flow

import * as React from 'react'
import styled, { injectGlobal } from 'styled-components'
// eslint-disable-next-line
import * as ReactDOM from 'react-dom'
import DatePicker from '../lib'

// eslint-disable-next-line
injectGlobal`
  body {
    font-family: sans-serif;
  }
`

const DatePickerCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 2px #222222;
  padding: 20px;
`

const EmojiCell = styled.span.attrs({
  role: 'img',
  'aria-label': 'checked'
})`
  width: 150px;
  text-align: center;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: rgba(236, 146, 64, 0.3);
  }
`

type StateType = {
  schedule: Array<Date>
}

class App extends React.Component<{}, StateType> {
  state = { schedule: [] }

  handleDateChange = newSchedule => {
    this.setState({ schedule: newSchedule })
  }

  // eslint-disable-next-line
  renderCustomCell = (selected: boolean) => (selected ? <EmojiCell>✅</EmojiCell> : <EmojiCell>❌</EmojiCell>)

  render(): React.Element<*> {
    return (
      <div>
        <h1>Date Picker with Custom Options</h1>
        <DatePickerCard>
          <DatePicker
            minTime={12}
            maxTime={20}
            numDays={5}
            startDate={new Date('Fri May 18 2018 17:57:06 GMT-0700 (PDT)')}
            selection={this.state.schedule}
            onChange={this.handleDateChange}
            renderDateCell={this.renderCustomCell}
            dateFormat="ddd"
          />
        </DatePickerCard>
      </div>
    )
  }
}

// flow-disable-next-line
ReactDOM.render(<App />, document.getElementById('app'))
