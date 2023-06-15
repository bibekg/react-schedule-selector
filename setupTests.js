/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

process.env.TZ = 'UTC'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })
