var _templateObject = _taggedTemplateLiteralLoose(['\n  body {\n    font-family: sans-serif;\n  }\n'], ['\n  body {\n    font-family: sans-serif;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n  border-radius: 25px;\n  box-shadow: 0px 0px 2px #222222;\n  padding: 20px;\n'], ['\n  border-radius: 25px;\n  box-shadow: 0px 0px 2px #222222;\n  padding: 20px;\n']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n  width: 150px;\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  border: 1px solid rgba(0,0,0,0.3);\n  &:hover {\n    background-color: rgba(236, 146, 64, 0.3);\n  }\n'], ['\n  width: 150px;\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  border: 1px solid rgba(0,0,0,0.3);\n  &:hover {\n    background-color: rgba(236, 146, 64, 0.3);\n  }\n']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';
// eslint-disable-next-line
import * as ReactDOM from 'react-dom';
import DatePicker from '../lib';

// eslint-disable-next-line
injectGlobal(_templateObject);

var DatePickerCard = styled.div(_templateObject2);

var EmojiCell = styled.span.attrs({
  role: 'img',
  'aria-label': 'checked'
})(_templateObject3);

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = { schedule: [] }, _this.handleDateChange = function (newSchedule) {
      _this.setState({ schedule: newSchedule });
    }, _this.renderCustomCell = function (selected) {
      return selected ? React.createElement(
        EmojiCell,
        null,
        '\u2705'
      ) : React.createElement(
        EmojiCell,
        null,
        '\u274C'
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // eslint-disable-next-line


  App.prototype.render = function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'Date Picker with Custom Options'
      ),
      React.createElement(
        DatePickerCard,
        null,
        React.createElement(DatePicker, {
          minTime: 12,
          maxTime: 20,
          numDays: 5,
          startDate: new Date('Fri May 18 2018 17:57:06 GMT-0700 (PDT)'),
          selection: this.state.schedule,
          onChange: this.handleDateChange,
          renderDateCell: this.renderCustomCell,
          dateFormat: 'ddd'
        })
      )
    );
  };

  return App;
}(React.Component);

// flow-disable-next-line


ReactDOM.render(React.createElement(App, null), document.getElementById('app'));