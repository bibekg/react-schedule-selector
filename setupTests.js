/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme'
import ReactEighteenAdapter from '@cfaester/enzyme-adapter-react-18'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new ReactEighteenAdapter() })
