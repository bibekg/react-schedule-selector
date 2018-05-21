var _templateObject = _taggedTemplateLiteralLoose(['\n  display: flex;\n  align-items: center;\n  width: 100%;\n  user-select: none;\n'], ['\n  display: flex;\n  align-items: center;\n  width: 100%;\n  user-select: none;\n']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n'], ['\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n'], ['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n']),
    _templateObject4 = _taggedTemplateLiteralLoose(['\n  margin: ', 'px;\n'], ['\n  margin: ', 'px;\n']),
    _templateObject5 = _taggedTemplateLiteralLoose(['\n  width: 100%;\n  height: 25px;\n  background-color: ', ';\n  ', ' touch-action: none;\n\n  &:hover {\n    background-color: ', ';\n  }\n'], ['\n  width: 100%;\n  height: 25px;\n  background-color: ', ';\n  ', ' touch-action: none;\n\n  &:hover {\n    background-color: ', ';\n  }\n']),
    _templateObject6 = _taggedTemplateLiteralLoose(['\n  height: 30px;\n  @media (max-width: 699px) {\n    font-size: 12px;\n  }\n'], ['\n  height: 30px;\n  @media (max-width: 699px) {\n    font-size: 12px;\n  }\n']),
    _templateObject7 = _taggedTemplateLiteralLoose(['\n  position: relative;\n  display: block;\n  width: 100%;\n  height: 25px;\n  margin: 3px 0;\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n'], ['\n  position: relative;\n  display: block;\n  width: 100%;\n  height: 25px;\n  margin: 3px 0;\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n']),
    _templateObject8 = _taggedTemplateLiteralLoose(['\n  margin: 0;\n  @media (max-width: 699px) {\n    font-size: 10px;\n  }\n  text-align: right;\n'], ['\n  margin: 0;\n  @media (max-width: 699px) {\n    font-size: 10px;\n  }\n  text-align: right;\n']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Text, Subtitle } from './typography';
import colors from './colors';

var formatTime = function formatTime(hour) {
  var h = hour === 0 || hour === 12 || hour === 24 ? 12 : hour % 12;
  var abb = hour < 12 || hour === 24 ? 'am' : 'pm';
  return '' + h + abb;
};

var Wrapper = styled.div(_templateObject);

var Grid = styled.div(_templateObject2);

var Column = styled.div(_templateObject3);

var GridCell = styled.div(_templateObject4, function (props) {
  return props.margin;
});

var DateCell = styled.div(_templateObject5, function (props) {
  return props.selected ? props.selectedColor : props.unselectedColor;
}, '' /* Ensures that the page doesn't scroll while the user is drag-selecting cells */, function (props) {
  return props.hoveredColor;
});

var DateLabel = Subtitle.extend(_templateObject6);

var TimeLabelCell = styled.div(_templateObject7);

var TimeText = Text.extend(_templateObject8);

// This component relies heavily on the fantastic APIs exposed by the moment.js library: http://momentjs.com
var AvailabilitySelector = function (_React$Component) {
  _inherits(AvailabilitySelector, _React$Component);

  function AvailabilitySelector(props) {
    _classCallCheck(this, AvailabilitySelector);

    // Generate list of dates to render cells for
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var startTime = moment(props.startDate).startOf('day');
    _this.dates = [];
    _this.cellToMoment = new Map();
    for (var i = 0; i < props.numDays; i += 1) {
      var currentDay = [];
      for (var j = props.minTime; j <= props.maxTime; j += 1) {
        currentDay.push(moment(startTime).add(i, 'days').add(j, 'hours'));
      }
      _this.dates.push(currentDay);
    }

    _this.state = {
      selectionDraft: [].concat(_this.props.selection), // copy it over
      selectionType: null,
      selectionStart: null
    };

    _this.endSelection = _this.endSelection.bind(_this);
    return _this;
  }

  AvailabilitySelector.prototype.componentDidMount = function componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection);
  };

  AvailabilitySelector.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection);
  };

  AvailabilitySelector.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({
      selectionDraft: [].concat(nextProps.selection)
    });
  };

  // Performs a lookup into this.cellToMoment to retrieve the moment that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.


  // Given an ending moment, determines all the


  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input


  AvailabilitySelector.prototype.render = function render() {
    return React.createElement(
      Wrapper,
      null,
      React.createElement(
        Grid,
        null,
        this.renderTimeLabels(),
        this.dates.map(this.renderDateColumn)
      )
    );
  };

  return AvailabilitySelector;
}(React.Component);

AvailabilitySelector.defaultProps = {
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  startDate: moment(),
  dateFormat: 'M/D',
  margin: 3,
  selectedColor: colors.blue,
  unselectedColor: colors.paleBlue,
  hoveredColor: colors.lightBlue
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.getTimeFromTouchEvent = function (event) {
    var touches = event.touches;

    if (!touches || touches.length === 0) return null;
    var _touches$ = touches[0],
        clientX = _touches$.clientX,
        clientY = _touches$.clientY;

    var targetElement = document.elementFromPoint(clientX, clientY);
    var cellTime = _this2.cellToMoment.get(targetElement);
    return cellTime;
  };

  this.endSelection = function () {
    _this2.props.onChange(_this2.state.selectionDraft);
    _this2.setState({
      selectionType: null,
      selectionStart: null
    });
  };

  this.updateAvailabilityDraft = function (selectionEnd, callback) {
    var selection = _this2.props.selection;
    var _state = _this2.state,
        selectionType = _state.selectionType,
        selectionStart = _state.selectionStart;

    // User isn't selecting right now, doesn't make sense to update selection draft

    if (selectionType === null || selectionStart === null) return;

    var selected = [];
    if (selectionEnd == null) {
      // This function is called with a null selectionEnd on `mouseup`. This is useful for catching cases
      // where the user just clicks on a single cell, since in that case,
      // In such a case, set the entire selection as just that
      if (selectionStart) selected = [selectionStart];
    } else {
      var reverseSelection = selectionEnd.isBefore(selectionStart);
      // Generate a list of moments between the start of the selection and the end of the selection
      // The moments to choose from for this list are sourced from this.dates
      selected = _this2.dates.reduce(function (acc, dayOfTimes) {
        return acc.concat(dayOfTimes.filter(function (t) {
          return selectionStart && selectionEnd && moment(t).isBetween(reverseSelection ? selectionEnd : selectionStart, reverseSelection ? selectionStart : selectionEnd, 'hour', '[]');
        }));
      }, []);
    }

    if (selectionType === 'add') {
      _this2.setState({
        selectionDraft: Array.from(new Set(selection.concat(selected.map(function (t) {
          return t.toDate();
        }))))
      }, callback);
    } else if (selectionType === 'remove') {
      _this2.setState({
        selectionDraft: selection.filter(function (a) {
          return !selected.find(function (b) {
            return moment(a).isSame(b);
          });
        })
      }, callback);
    }
  };

  this.handleSelectionStartEvent = function (startTime) {
    if (startTime) {
      // Check if the startTime cell is selected/unselected to determine if this drag-select should
      // add values or remove values
      var timeSelected = _this2.props.selection.find(function (a) {
        return moment(a).isSame(startTime);
      });
      _this2.setState({
        selectionType: timeSelected ? 'remove' : 'add',
        selectionStart: startTime
      });
    }
  };

  this.handleMouseEnterEvent = function (time) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    _this2.updateAvailabilityDraft(time);
  };

  this.handleMouseUpEvent = function (time) {
    if (time) {
      _this2.updateAvailabilityDraft(time);
      // Don't call this.endSelection() here because the document mouseup handler will do it
    }
  };

  this.handleTouchMoveEvent = function (event) {
    var cellTime = _this2.getTimeFromTouchEvent(event);
    if (cellTime) {
      _this2.updateAvailabilityDraft(cellTime);
    }
  };

  this.handleTouchEndEvent = function () {
    _this2.endSelection();
  };

  this.renderTimeLabels = function () {
    var labels = [React.createElement(DateLabel, { key: -1 })]; // Ensures time labels start at correct location
    for (var t = _this2.props.minTime; t <= _this2.props.maxTime; t += 1) {
      labels.push(React.createElement(
        TimeLabelCell,
        { key: t },
        React.createElement(
          TimeText,
          null,
          formatTime(t)
        )
      ));
    }
    return React.createElement(
      Column,
      { margin: _this2.props.margin },
      labels
    );
  };

  this.renderDateColumn = function (dayOfTimes) {
    return React.createElement(
      Column,
      { key: dayOfTimes[0].toISOString(), margin: _this2.props.margin },
      React.createElement(
        GridCell,
        { margin: _this2.props.margin },
        React.createElement(
          DateLabel,
          null,
          dayOfTimes[0].format(_this2.props.dateFormat)
        )
      ),
      dayOfTimes.map(function (time) {
        return _this2.renderDateCellWrapper(time);
      })
    );
  };

  this.renderDateCellWrapper = function (time) {
    var startHandler = function startHandler() {
      _this2.handleSelectionStartEvent(time);
    };

    var selected = Boolean(_this2.state.selectionDraft.find(function (a) {
      return moment(a).isSame(time);
    }));

    return React.createElement(
      GridCell,
      {
        role: 'presentation',
        margin: _this2.props.margin,
        key: time.toISOString(),
        innerRef: function innerRef(dateCell) {
          _this2.cellToMoment.set(dateCell, time);
        }
        // Mouse handlers
        , onMouseDown: startHandler,
        onMouseEnter: function onMouseEnter() {
          _this2.handleMouseEnterEvent(time);
        },
        onMouseUp: function onMouseUp() {
          _this2.handleMouseUpEvent(time);
        }
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default SyntheticEvent
        // parameters
        , onTouchStart: startHandler,
        onTouchMove: _this2.handleTouchMoveEvent,
        onTouchEnd: _this2.handleTouchEndEvent
      },
      _this2.renderDateCell(selected)
    );
  };

  this.renderDateCell = function (selected) {
    if (_this2.props.renderDateCell) {
      return _this2.props.renderDateCell(selected);
    } else {
      return React.createElement(DateCell, {
        selected: selected,
        selectedColor: _this2.props.selectedColor,
        unselectedColor: _this2.props.unselectedColor,
        hoveredColor: _this2.props.hoveredColor
      });
    }
  };
};

export default AvailabilitySelector;