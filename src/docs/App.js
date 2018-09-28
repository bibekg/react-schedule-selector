// @flow

import * as React from 'react'
import styled, { injectGlobal } from 'styled-components'
// eslint-disable-next-line
import * as ReactDOM from 'react-dom'
import ScheduleSelector from '../lib'

// eslint-disable-next-line
injectGlobal`
  body {
    font-family: sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const IntroText = styled.div`
  width: 100%;
  text-align: center;
`

const ScheduleSelectorCard = styled.div`
  border-radius: 25px;
  box-shadow: 10px 2px 30px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 90%;
  max-width: 800px;
  & > * {
    flex-grow: 1;
  }
`

const Links = styled.div`
  display: flex;
  margin-top: 20px;
`

const ExternalLink = styled.a`
  background-color: ${props => props.color};
  color: white;
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  text-decoration: none;
  margin: 5px;
`

type StateType = {
  schedule: Array<Date>
}

class App extends React.Component<{}, StateType> {
  state = { schedule: [] }

  handleDateChange = newSchedule => {
    this.setState({ schedule: newSchedule })
  }

  render(): React.Element<*> {
    return (
      <MainDiv>
        <IntroText>
          <h1>React Schedule Selector</h1>
          <p>Tap to select one time or drag to select multiple times at once.</p>
        </IntroText>
        <ScheduleSelectorCard>
          <ScheduleSelector
            minTime={12}
            maxTime={20}
            numDays={7}
            selection={this.state.schedule}
            onChange={this.handleDateChange}
          />
        </ScheduleSelectorCard>
        <Links>
          <ExternalLink color="#24292e" href="https://github.com/bibekg/react-schedule-selector">
            GitHub
          </ExternalLink>
          <ExternalLink color="#cb3838" href="https://npmjs.com/package/react-schedule-selector">
            NPM
          </ExternalLink>
          <ExternalLink color="#292929" href="https://medium.com/@bibekg/react-schedule-selector-6cd5bf1f4968">
            Medium
          </ExternalLink>
        </Links>
      </MainDiv>
    )
  }
}

// flow-disable-next-line
ReactDOM.render(<App />, document.getElementById('app'))
