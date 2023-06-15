"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.default = exports.GridCell = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var React = _interopRequireWildcard(require("react"));
var _format = _interopRequireDefault(require("date-fns/format"));
var _typography = require("./typography");
var _colors = _interopRequireDefault(require("./colors"));
var _selectionSchemes = _interopRequireDefault(require("./selection-schemes"));
var _dateFns = require("date-fns");
var _styledComponents = _interopRequireDefault(require("styled-components"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Import only the methods we need from date-fns in order to keep build size small

const Wrapper = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Wrapper",
  componentId: "sc-1ke4ka2-0"
})(["display:flex;align-items:center;width:100%;user-select:none;"]);
const Grid = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Grid",
  componentId: "sc-1ke4ka2-1"
})(["display:grid;grid-template-columns:auto repeat(", ",1fr);grid-template-rows:auto repeat(", ",1fr);column-gap:", ";row-gap:", ";width:100%;"], props => props.columns, props => props.rows, props => props.columnGap, props => props.rowGap);
const GridCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__GridCell",
  componentId: "sc-1ke4ka2-2"
})(["place-self:stretch;touch-action:none;"]);
exports.GridCell = GridCell;
const DateCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__DateCell",
  componentId: "sc-1ke4ka2-3"
})(["width:100%;height:25px;background-color:", ";&:hover{background-color:", ";}"], props => props.selected ? props.selectedColor : props.unselectedColor, props => props.hoveredColor);
const DateLabel = (0, _styledComponents.default)(_typography.Subtitle).withConfig({
  displayName: "ScheduleSelector__DateLabel",
  componentId: "sc-1ke4ka2-4"
})(["@media (max-width:699px){font-size:12px;}margin:0;margin-bottom:4px;"]);
const TimeText = (0, _styledComponents.default)(_typography.Text).withConfig({
  displayName: "ScheduleSelector__TimeText",
  componentId: "sc-1ke4ka2-5"
})(["@media (max-width:699px){font-size:10px;}text-align:right;margin:0;margin-right:4px;"]);
const preventScroll = e => {
  e.preventDefault();
};
exports.preventScroll = preventScroll;
class ScheduleSelector extends React.Component {
  // documentMouseUpHandler: () => void = () => {}
  // endSelection: () => void = () => {}
  // handleTouchMoveEvent: (event: React.SyntheticTouchEvent<*>) => void
  // handleTouchEndEvent: () => void
  // handleMouseUpEvent: (date: Date) => void
  // handleMouseEnterEvent: (date: Date) => void
  // handleSelectionStartEvent: (date: Date) => void
  static getDerivedStateFromProps(props, state) {
    // As long as the user isn't in the process of selecting, allow prop changes to re-populate selection state
    if (state.selectionStart == null) {
      return {
        selectionDraft: [...props.selection],
        dates: ScheduleSelector.computeDatesMatrix(props)
      };
    }
    return null;
  }
  static computeDatesMatrix(props) {
    const startTime = (0, _dateFns.startOfDay)(props.startDate);
    const dates = [];
    const minutesInChunk = Math.floor(60 / props.hourlyChunks);
    for (let d = 0; d < props.numDays; d += 1) {
      const currentDay = [];
      for (let h = props.minTime; h < props.maxTime; h += 1) {
        for (let c = 0; c < props.hourlyChunks; c += 1) {
          currentDay.push((0, _dateFns.addMinutes)((0, _dateFns.addHours)((0, _dateFns.addDays)(startTime, d), h), c * minutesInChunk));
        }
      }
      dates.push(currentDay);
    }
    return dates;
  }
  constructor(props) {
    super(props);
    this.cellToDate = new Map();
    this.gridRef = null;
    this.renderDateCellWrapper = time => {
      const startHandler = () => {
        this.handleSelectionStartEvent(time);
      };
      const selected = Boolean(this.state.selectionDraft.find(a => (0, _dateFns.isSameMinute)(a, time)));
      return /*#__PURE__*/React.createElement(GridCell, {
        className: "rgdp__grid-cell",
        role: "presentation",
        key: time.toISOString()
        // Mouse handlers
        ,
        onMouseDown: startHandler,
        onMouseEnter: () => {
          this.handleMouseEnterEvent(time);
        },
        onMouseUp: () => {
          this.handleMouseUpEvent(time);
        }
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        ,
        onTouchStart: startHandler,
        onTouchMove: this.handleTouchMoveEvent,
        onTouchEnd: this.handleTouchEndEvent
      }, this.renderDateCell(time, selected));
    };
    this.renderDateCell = (time, selected) => {
      const refSetter = dateCell => {
        if (dateCell) {
          this.cellToDate.set(dateCell, time);
        }
      };
      if (this.props.renderDateCell) {
        return this.props.renderDateCell(time, selected, refSetter);
      } else {
        return /*#__PURE__*/React.createElement(DateCell, {
          selected: selected,
          ref: refSetter,
          selectedColor: this.props.selectedColor,
          unselectedColor: this.props.unselectedColor,
          hoveredColor: this.props.hoveredColor
        });
      }
    };
    this.renderTimeLabel = time => {
      if (this.props.renderTimeLabel) {
        return this.props.renderTimeLabel(time);
      } else {
        return /*#__PURE__*/React.createElement(TimeText, null, (0, _format.default)(time, this.props.timeFormat));
      }
    };
    this.renderDateLabel = date => {
      if (this.props.renderDateLabel) {
        return this.props.renderDateLabel(date);
      } else {
        return /*#__PURE__*/React.createElement(DateLabel, null, (0, _format.default)(date, this.props.dateFormat));
      }
    };
    this.state = {
      selectionDraft: [...this.props.selection],
      // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false,
      dates: ScheduleSelector.computeDatesMatrix(props)
    };
    this.selectionSchemeHandlers = {
      linear: _selectionSchemes.default.linear,
      square: _selectionSchemes.default.square
    };
    this.endSelection = this.endSelection.bind(this);
    this.handleMouseUpEvent = this.handleMouseUpEvent.bind(this);
    this.handleMouseEnterEvent = this.handleMouseEnterEvent.bind(this);
    this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this);
    this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this);
    this.handleSelectionStartEvent = this.handleSelectionStartEvent.bind(this);
  }
  componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection);

    // Prevent page scrolling when user is dragging on the date cells
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, {
          passive: false
        });
      }
    });
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection);
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.removeEventListener) {
        // @ts-ignore
        dateCell.removeEventListener('touchmove', preventScroll);
      }
    });
  }

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  getTimeFromTouchEvent(event) {
    const {
      touches
    } = event;
    if (!touches || touches.length === 0) return null;
    const {
      clientX,
      clientY
    } = touches[0];
    const targetElement = document.elementFromPoint(clientX, clientY);
    if (targetElement) {
      const cellTime = this.cellToDate.get(targetElement);
      return cellTime !== null && cellTime !== void 0 ? cellTime : null;
    }
    return null;
  }
  endSelection() {
    this.props.onChange(this.state.selectionDraft);
    this.setState({
      selectionType: null,
      selectionStart: null
    });
  }

  // Given an ending Date, determines all the dates that should be selected in this draft
  updateAvailabilityDraft(selectionEnd, callback) {
    const {
      selectionType,
      selectionStart
    } = this.state;
    if (selectionType === null || selectionStart === null) return;
    let newSelection = [];
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.state.dates);
    }
    let nextDraft = [...this.props.selection];
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]));
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => (0, _dateFns.isSameMinute)(a, b)));
    }
    this.setState({
      selectionDraft: nextDraft
    }, callback);
  }

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  handleSelectionStartEvent(startTime) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = this.props.selection.find(a => (0, _dateFns.isSameMinute)(a, startTime));
    this.setState({
      selectionType: timeSelected ? 'remove' : 'add',
      selectionStart: startTime
    });
  }
  handleMouseEnterEvent(time) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time);
  }
  handleMouseUpEvent(time) {
    this.updateAvailabilityDraft(time);
    // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  handleTouchMoveEvent(event) {
    this.setState({
      isTouchDragging: true
    });
    const cellTime = this.getTimeFromTouchEvent(event);
    if (cellTime) {
      this.updateAvailabilityDraft(cellTime);
    }
  }
  handleTouchEndEvent() {
    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, () => {
        this.endSelection();
      });
    } else {
      this.endSelection();
    }
    this.setState({
      isTouchDragging: false
    });
  }
  renderFullDateGrid() {
    const flattenedDates = [];
    const numDays = this.state.dates.length;
    const numTimes = this.state.dates[0].length;
    for (let j = 0; j < numTimes; j += 1) {
      for (let i = 0; i < numDays; i += 1) {
        flattenedDates.push(this.state.dates[i][j]);
      }
    }
    const dateGridElements = flattenedDates.map(this.renderDateCellWrapper);
    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays;
      const time = this.state.dates[0][i];
      // Inject the time label at the start of every row
      dateGridElements.splice(index + i, 0, this.renderTimeLabel(time));
    }
    return [
    /*#__PURE__*/
    // Empty top left corner
    React.createElement("div", {
      key: "topleft"
    }),
    // Top row of dates
    ...this.state.dates.map((dayOfTimes, index) => /*#__PURE__*/React.cloneElement(this.renderDateLabel(dayOfTimes[0]), {
      key: "date-".concat(index)
    })),
    // Every row after that
    ...dateGridElements.map((element, index) => /*#__PURE__*/React.cloneElement(element, {
      key: "time-".concat(index)
    }))];
  }
  render() {
    return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Grid, {
      columns: this.state.dates.length,
      rows: this.state.dates[0].length,
      columnGap: this.props.columnGap,
      rowGap: this.props.rowGap,
      ref: el => {
        this.gridRef = el;
      }
    }, this.renderFullDateGrid()));
  }
}
exports.default = ScheduleSelector;
ScheduleSelector.defaultProps = {
  selection: [],
  selectionScheme: 'square',
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  hourlyChunks: 1,
  startDate: new Date(),
  timeFormat: 'ha',
  dateFormat: 'M/d',
  columnGap: '4px',
  rowGap: '4px',
  selectedColor: _colors.default.blue,
  unselectedColor: _colors.default.paleBlue,
  hoveredColor: _colors.default.lightBlue,
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwicmVxdWlyZSIsIl9mb3JtYXQiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3R5cG9ncmFwaHkiLCJfY29sb3JzIiwiX3NlbGVjdGlvblNjaGVtZXMiLCJfZGF0ZUZucyIsIl9zdHlsZWRDb21wb25lbnRzIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJub2RlSW50ZXJvcCIsIldlYWtNYXAiLCJjYWNoZUJhYmVsSW50ZXJvcCIsImNhY2hlTm9kZUludGVyb3AiLCJjYWNoZSIsImhhcyIsImdldCIsIm5ld09iaiIsImhhc1Byb3BlcnR5RGVzY3JpcHRvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwia2V5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZGVzYyIsInNldCIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJ3aXRoQ29uZmlnIiwiZGlzcGxheU5hbWUiLCJjb21wb25lbnRJZCIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJleHBvcnRzIiwiRGF0ZUNlbGwiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ29sb3IiLCJ1bnNlbGVjdGVkQ29sb3IiLCJob3ZlcmVkQ29sb3IiLCJEYXRlTGFiZWwiLCJTdWJ0aXRsZSIsIlRpbWVUZXh0IiwiVGV4dCIsInByZXZlbnRTY3JvbGwiLCJlIiwicHJldmVudERlZmF1bHQiLCJTY2hlZHVsZVNlbGVjdG9yIiwiQ29tcG9uZW50IiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwic3RhdGUiLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwiZGF0ZXMiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJzdGFydFRpbWUiLCJzdGFydE9mRGF5Iiwic3RhcnREYXRlIiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJkIiwibnVtRGF5cyIsImN1cnJlbnREYXkiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsImFkZE1pbnV0ZXMiLCJhZGRIb3VycyIsImFkZERheXMiLCJjb25zdHJ1Y3RvciIsImNlbGxUb0RhdGUiLCJNYXAiLCJncmlkUmVmIiwicmVuZGVyRGF0ZUNlbGxXcmFwcGVyIiwidGltZSIsInN0YXJ0SGFuZGxlciIsImhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQiLCJCb29sZWFuIiwiZmluZCIsImEiLCJpc1NhbWVNaW51dGUiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicm9sZSIsInRvSVNPU3RyaW5nIiwib25Nb3VzZURvd24iLCJvbk1vdXNlRW50ZXIiLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJvbk1vdXNlVXAiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJvblRvdWNoU3RhcnQiLCJvblRvdWNoTW92ZSIsImhhbmRsZVRvdWNoTW92ZUV2ZW50Iiwib25Ub3VjaEVuZCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwicmVmIiwicmVuZGVyVGltZUxhYmVsIiwiZm9ybWF0RGF0ZSIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInNlbGVjdGlvblR5cGUiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJlbmRTZWxlY3Rpb24iLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JFYWNoIiwidmFsdWUiLCJwYXNzaXZlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwib25DaGFuZ2UiLCJzZXRTdGF0ZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwiY2FsbGJhY2siLCJuZXdTZWxlY3Rpb24iLCJzZWxlY3Rpb25TY2hlbWUiLCJuZXh0RHJhZnQiLCJBcnJheSIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJiIiwidGltZVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1UaW1lcyIsImoiLCJpIiwiZGF0ZUdyaWRFbGVtZW50cyIsIm1hcCIsImluZGV4Iiwic3BsaWNlIiwiZGF5T2ZUaW1lcyIsImNsb25lRWxlbWVudCIsImNvbmNhdCIsImVsZW1lbnQiLCJyZW5kZXIiLCJlbCIsImRlZmF1bHRQcm9wcyIsIkRhdGUiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL1NjaGVkdWxlU2VsZWN0b3IudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5cbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xuaW1wb3J0IHsgYWRkRGF5cywgYWRkSG91cnMsIGFkZE1pbnV0ZXMsIGlzU2FtZU1pbnV0ZSwgc3RhcnRPZkRheSB9IGZyb20gJ2RhdGUtZm5zJ1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cydcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbmBcblxuY29uc3QgR3JpZCA9IHN0eWxlZC5kaXY8eyBjb2x1bW5zOiBudW1iZXI7IHJvd3M6IG51bWJlcjsgY29sdW1uR2FwOiBzdHJpbmc7IHJvd0dhcDogc3RyaW5nIH0+YFxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMgPT4gcHJvcHMuY29sdW1uc30sIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHtwcm9wcyA9PiBwcm9wcy5yb3dzfSwgMWZyKTtcbiAgY29sdW1uLWdhcDogJHtwcm9wcyA9PiBwcm9wcy5jb2x1bW5HYXB9O1xuICByb3ctZ2FwOiAke3Byb3BzID0+IHByb3BzLnJvd0dhcH07XG4gIHdpZHRoOiAxMDAlO1xuYFxuXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxuICBwbGFjZS1zZWxmOiBzdHJldGNoO1xuICB0b3VjaC1hY3Rpb246IG5vbmU7XG5gXG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjx7XG4gIHNlbGVjdGVkOiBib29sZWFuXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xufT5gXG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDI1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMuc2VsZWN0ZWRDb2xvciA6IHByb3BzLnVuc2VsZWN0ZWRDb2xvcil9O1xuXG4gICY6aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMuaG92ZXJlZENvbG9yfTtcbiAgfVxuYFxuXG5jb25zdCBEYXRlTGFiZWwgPSBzdHlsZWQoU3VidGl0bGUpYFxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gIH1cbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tYm90dG9tOiA0cHg7XG5gXG5cbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxuICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIG1hcmdpbjogMDtcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XG5gXG5cbnR5cGUgUHJvcHNUeXBlID0ge1xuICBzZWxlY3Rpb246IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcbiAgc3RhcnREYXRlOiBEYXRlXG4gIG51bURheXM6IG51bWJlclxuICBtaW5UaW1lOiBudW1iZXJcbiAgbWF4VGltZTogbnVtYmVyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xuICB0aW1lRm9ybWF0OiBzdHJpbmdcbiAgY29sdW1uR2FwOiBzdHJpbmdcbiAgcm93R2FwOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG4gIHJlbmRlckRhdGVDZWxsPzogKGRhdGV0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxuICB0aW1lWm9uZTogc3RyaW5nXG59XG5cbnR5cGUgU3RhdGVUeXBlID0ge1xuICAvLyBJbiB0aGUgY2FzZSB0aGF0IGEgdXNlciBpcyBkcmFnLXNlbGVjdGluZywgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMucHJvcHMub25DaGFuZ2UoKSB1bnRpbCB0aGV5IGhhdmUgY29tcGxldGVkXG4gIC8vIHRoZSBkcmFnLXNlbGVjdC4gc2VsZWN0aW9uRHJhZnQgc2VydmVzIGFzIGEgdGVtcG9yYXJ5IGNvcHkgZHVyaW5nIGRyYWctc2VsZWN0cy5cbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGUgfCBudWxsXG4gIHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbFxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cbiAgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PlxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZVNlbGVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzVHlwZSwgU3RhdGVUeXBlPiB7XG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxuICBjZWxsVG9EYXRlOiBNYXA8RWxlbWVudCwgRGF0ZT4gPSBuZXcgTWFwKClcbiAgLy8gZG9jdW1lbnRNb3VzZVVwSGFuZGxlcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50OiAoZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY1RvdWNoRXZlbnQ8Kj4pID0+IHZvaWRcbiAgLy8gaGFuZGxlVG91Y2hFbmRFdmVudDogKCkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZU1vdXNlRW50ZXJFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgLy8gaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IFBhcnRpYWw8UHJvcHNUeXBlPiA9IHtcbiAgICBzZWxlY3Rpb246IFtdLFxuICAgIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gICAgbnVtRGF5czogNyxcbiAgICBtaW5UaW1lOiA5LFxuICAgIG1heFRpbWU6IDIzLFxuICAgIGhvdXJseUNodW5rczogMSxcbiAgICBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcbiAgICBkYXRlRm9ybWF0OiAnTS9kJyxcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxuICAgIHJvd0dhcDogJzRweCcsXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAgIG9uQ2hhbmdlOiAoKSA9PiB7fVxuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wczogUHJvcHNUeXBlLCBzdGF0ZTogU3RhdGVUeXBlKTogUGFydGlhbDxTdGF0ZVR5cGU+IHwgbnVsbCB7XG4gICAgLy8gQXMgbG9uZyBhcyB0aGUgdXNlciBpc24ndCBpbiB0aGUgcHJvY2VzcyBvZiBzZWxlY3RpbmcsIGFsbG93IHByb3AgY2hhbmdlcyB0byByZS1wb3B1bGF0ZSBzZWxlY3Rpb24gc3RhdGVcbiAgICBpZiAoc3RhdGUuc2VsZWN0aW9uU3RhcnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2VsZWN0aW9uRHJhZnQ6IFsuLi5wcm9wcy5zZWxlY3Rpb25dLFxuICAgICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBQcm9wc1R5cGUpOiBBcnJheTxBcnJheTxEYXRlPj4ge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICAgIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICAgIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgICAgY3VycmVudERheS5wdXNoKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZXNcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wc1R5cGUpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXSwgLy8gY29weSBpdCBvdmVyXG4gICAgICBzZWxlY3Rpb25UeXBlOiBudWxsLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IG51bGwsXG4gICAgICBpc1RvdWNoRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGF0ZXM6IFNjaGVkdWxlU2VsZWN0b3IuY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKVxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZVxuICAgIH1cblxuICAgIHRoaXMuZW5kU2VsZWN0aW9uID0gdGhpcy5lbmRTZWxlY3Rpb24uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZVVwRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gdGhpcy5oYW5kbGVNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQgPSB0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudC5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgZW5kU2VsZWN0aW9uIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCBpdHNlbGYgaW4gb3JkZXJcbiAgICAvLyB0byBjYXRjaCB0aGUgY2FzZXMgd2hlcmUgdGhlIHVzZXJzIGVuZHMgdGhlaXIgbW91c2UtY2xpY2sgc29tZXdoZXJlIGJlc2lkZXNcbiAgICAvLyB0aGUgZGF0ZSBjZWxscyAoaW4gd2hpY2ggY2FzZSBub25lIG9mIHRoZSBEYXRlQ2VsbCdzIG9uTW91c2VVcCBoYW5kbGVycyB3b3VsZCBmaXJlKVxuICAgIC8vXG4gICAgLy8gVGhpcyBpc24ndCBuZWNlc3NhcnkgZm9yIHRvdWNoIGV2ZW50cyBzaW5jZSB0aGUgYHRvdWNoZW5kYCBldmVudCBmaXJlcyBvblxuICAgIC8vIHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaC9kcmFnIHN0YXJ0ZWQgc28gaXQncyBhbHdheXMgY2F1Z2h0LlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcblxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmVuZFNlbGVjdGlvbilcbiAgICB0aGlzLmNlbGxUb0RhdGUuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIFBlcmZvcm1zIGEgbG9va3VwIGludG8gdGhpcy5jZWxsVG9EYXRlIHRvIHJldHJpZXZlIHRoZSBEYXRlIHRoYXQgY29ycmVzcG9uZHMgdG9cbiAgLy8gdGhlIGNlbGwgd2hlcmUgdGhpcyB0b3VjaCBldmVudCBpcyByaWdodCBub3cuIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIG9ubHkgd29ya1xuICAvLyBpZiB0aGUgZXZlbnQgaXMgYSBgdG91Y2htb3ZlYCBldmVudCBzaW5jZSBpdCdzIHRoZSBvbmx5IG9uZSB0aGF0IGhhcyBhIGB0b3VjaGVzYCBsaXN0LlxuICBnZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQ8YW55Pik6IERhdGUgfCBudWxsIHtcbiAgICBjb25zdCB7IHRvdWNoZXMgfSA9IGV2ZW50XG4gICAgaWYgKCF0b3VjaGVzIHx8IHRvdWNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IHsgY2xpZW50WCwgY2xpZW50WSB9ID0gdG91Y2hlc1swXVxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNlbGxUaW1lID0gdGhpcy5jZWxsVG9EYXRlLmdldCh0YXJnZXRFbGVtZW50KVxuICAgICAgcmV0dXJuIGNlbGxUaW1lID8/IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGVuZFNlbGVjdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQpXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGlvblR5cGU6IG51bGwsIHNlbGVjdGlvblN0YXJ0OiBudWxsIH0pXG4gIH1cblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0LFxuICAgICAgICBzZWxlY3Rpb25FbmQsXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXNcbiAgICAgIClcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnRoaXMucHJvcHMuc2VsZWN0aW9uXVxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3Rpb25EcmFmdDogbmV4dERyYWZ0IH0sIGNhbGxiYWNrKVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudChzdGFydFRpbWU6IERhdGUpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSB0aGlzLnByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3Rpb25UeXBlOiB0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnLFxuICAgICAgc2VsZWN0aW9uU3RhcnQ6IHN0YXJ0VGltZVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZTogRGF0ZSkge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gIH1cblxuICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZTogRGF0ZSkge1xuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxuICB9XG5cbiAgaGFuZGxlVG91Y2hNb3ZlRXZlbnQoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiB0cnVlIH0pXG4gICAgY29uc3QgY2VsbFRpbWUgPSB0aGlzLmdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcbiAgICBpZiAoY2VsbFRpbWUpIHtcbiAgICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVG91Y2hFbmRFdmVudCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICAvLyBHb2luZyBkb3duIHRoaXMgYnJhbmNoIG1lYW5zIHRoZSB1c2VyIHRhcHBlZCBidXQgZGlkbid0IGRyYWcgLS0gd2hpY2hcbiAgICAgIC8vIG1lYW5zIHRoZSBhdmFpbGFiaWxpdHkgZHJhZnQgaGFzbid0IHlldCBiZWVuIHVwZGF0ZWQgKHNpbmNlXG4gICAgICAvLyBoYW5kbGVUb3VjaE1vdmVFdmVudCB3YXMgbmV2ZXIgY2FsbGVkKSBzbyB3ZSBuZWVkIHRvIGRvIGl0IG5vd1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChudWxsLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzVG91Y2hEcmFnZ2luZzogZmFsc2UgfSlcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbih0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkQ2VsbFxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XG4gICAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VVcD17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50fVxuICAgICAgICBvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kRXZlbnR9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICB0aGlzLmNlbGxUb0RhdGUuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIHJlZlNldHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERhdGVDZWxsXG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3RoaXMucHJvcHMudW5zZWxlY3RlZENvbG9yfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17dGhpcy5wcm9wcy5ob3ZlcmVkQ29sb3J9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCB0aGlzLnByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJEYXRlTGFiZWwoZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZSwgdGhpcy5wcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICByZW5kZXJGdWxsRGF0ZUdyaWQoKTogQXJyYXk8SlNYLkVsZW1lbnQ+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gdGhpcy5zdGF0ZS5kYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IHRoaXMuc3RhdGUuZGF0ZXNbMF0ubGVuZ3RoXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lczsgaiArPSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKHRoaXMuc3RhdGUuZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAodGhpcy5yZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZS5kYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgdGhpcy5yZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4udGhpcy5zdGF0ZS5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PlxuICAgICAgICBSZWFjdC5jbG9uZUVsZW1lbnQodGhpcy5yZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSlcbiAgICAgICksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgICB0aGlzLmdyaWRSZWYgPSBlbFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgICAgPC9HcmlkPlxuICAgICAgPC9XcmFwcGVyPlxuICAgIClcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUdBLElBQUFDLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUVBLElBQUFHLFdBQUEsR0FBQUgsT0FBQTtBQUNBLElBQUFJLE9BQUEsR0FBQUYsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFLLGlCQUFBLEdBQUFILHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBTSxRQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxpQkFBQSxHQUFBTCxzQkFBQSxDQUFBRixPQUFBO0FBQXNDLFNBQUFFLHVCQUFBTSxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBQUEsU0FBQUcseUJBQUFDLFdBQUEsZUFBQUMsT0FBQSxrQ0FBQUMsaUJBQUEsT0FBQUQsT0FBQSxRQUFBRSxnQkFBQSxPQUFBRixPQUFBLFlBQUFGLHdCQUFBLFlBQUFBLHlCQUFBQyxXQUFBLFdBQUFBLFdBQUEsR0FBQUcsZ0JBQUEsR0FBQUQsaUJBQUEsS0FBQUYsV0FBQTtBQUFBLFNBQUFiLHdCQUFBUyxHQUFBLEVBQUFJLFdBQUEsU0FBQUEsV0FBQSxJQUFBSixHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxXQUFBRCxHQUFBLFFBQUFBLEdBQUEsb0JBQUFBLEdBQUEsd0JBQUFBLEdBQUEsNEJBQUFFLE9BQUEsRUFBQUYsR0FBQSxVQUFBUSxLQUFBLEdBQUFMLHdCQUFBLENBQUFDLFdBQUEsT0FBQUksS0FBQSxJQUFBQSxLQUFBLENBQUFDLEdBQUEsQ0FBQVQsR0FBQSxZQUFBUSxLQUFBLENBQUFFLEdBQUEsQ0FBQVYsR0FBQSxTQUFBVyxNQUFBLFdBQUFDLHFCQUFBLEdBQUFDLE1BQUEsQ0FBQUMsY0FBQSxJQUFBRCxNQUFBLENBQUFFLHdCQUFBLFdBQUFDLEdBQUEsSUFBQWhCLEdBQUEsUUFBQWdCLEdBQUEsa0JBQUFILE1BQUEsQ0FBQUksU0FBQSxDQUFBQyxjQUFBLENBQUFDLElBQUEsQ0FBQW5CLEdBQUEsRUFBQWdCLEdBQUEsU0FBQUksSUFBQSxHQUFBUixxQkFBQSxHQUFBQyxNQUFBLENBQUFFLHdCQUFBLENBQUFmLEdBQUEsRUFBQWdCLEdBQUEsY0FBQUksSUFBQSxLQUFBQSxJQUFBLENBQUFWLEdBQUEsSUFBQVUsSUFBQSxDQUFBQyxHQUFBLEtBQUFSLE1BQUEsQ0FBQUMsY0FBQSxDQUFBSCxNQUFBLEVBQUFLLEdBQUEsRUFBQUksSUFBQSxZQUFBVCxNQUFBLENBQUFLLEdBQUEsSUFBQWhCLEdBQUEsQ0FBQWdCLEdBQUEsU0FBQUwsTUFBQSxDQUFBVCxPQUFBLEdBQUFGLEdBQUEsTUFBQVEsS0FBQSxJQUFBQSxLQUFBLENBQUFhLEdBQUEsQ0FBQXJCLEdBQUEsRUFBQVcsTUFBQSxZQUFBQSxNQUFBO0FBUHRDOztBQVNBLE1BQU1XLE9BQU8sR0FBR0MseUJBQU0sQ0FBQ0MsR0FBRyxDQUFBQyxVQUFBO0VBQUFDLFdBQUE7RUFBQUMsV0FBQTtBQUFBLG9FQUt6QjtBQUVELE1BQU1DLElBQUksR0FBR0wseUJBQU0sQ0FBQ0MsR0FBRyxDQUFBQyxVQUFBO0VBQUFDLFdBQUE7RUFBQUMsV0FBQTtBQUFBLG1KQUVnQkUsS0FBSyxJQUFJQSxLQUFLLENBQUNDLE9BQU8sRUFDekJELEtBQUssSUFBSUEsS0FBSyxDQUFDRSxJQUFJLEVBQ3ZDRixLQUFLLElBQUlBLEtBQUssQ0FBQ0csU0FBUyxFQUMzQkgsS0FBSyxJQUFJQSxLQUFLLENBQUNJLE1BQU0sQ0FFakM7QUFFTSxNQUFNQyxRQUFRLEdBQUdYLHlCQUFNLENBQUNDLEdBQUcsQ0FBQUMsVUFBQTtFQUFBQyxXQUFBO0VBQUFDLFdBQUE7QUFBQSw2Q0FHakM7QUFBQVEsT0FBQSxDQUFBRCxRQUFBLEdBQUFBLFFBQUE7QUFFRCxNQUFNRSxRQUFRLEdBQUdiLHlCQUFNLENBQUNDLEdBQUcsQ0FBQUMsVUFBQTtFQUFBQyxXQUFBO0VBQUFDLFdBQUE7QUFBQSxxRkFRTEUsS0FBSyxJQUFLQSxLQUFLLENBQUNRLFFBQVEsR0FBR1IsS0FBSyxDQUFDUyxhQUFhLEdBQUdULEtBQUssQ0FBQ1UsZUFBZ0IsRUFHckVWLEtBQUssSUFBSUEsS0FBSyxDQUFDVyxZQUFZLENBRWxEO0FBRUQsTUFBTUMsU0FBUyxHQUFHLElBQUFsQix5QkFBTSxFQUFDbUIsb0JBQVEsQ0FBQyxDQUFBakIsVUFBQTtFQUFBQyxXQUFBO0VBQUFDLFdBQUE7QUFBQSw0RUFNakM7QUFFRCxNQUFNZ0IsUUFBUSxHQUFHLElBQUFwQix5QkFBTSxFQUFDcUIsZ0JBQUksQ0FBQyxDQUFBbkIsVUFBQTtFQUFBQyxXQUFBO0VBQUFDLFdBQUE7QUFBQSw0RkFPNUI7QUFrQ00sTUFBTWtCLGFBQWEsR0FBSUMsQ0FBYSxJQUFLO0VBQzlDQSxDQUFDLENBQUNDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFBQVosT0FBQSxDQUFBVSxhQUFBLEdBQUFBLGFBQUE7QUFFYyxNQUFNRyxnQkFBZ0IsU0FBUzFELEtBQUssQ0FBQzJELFNBQVMsQ0FBdUI7RUFHbEY7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFxQkEsT0FBT0Msd0JBQXdCQSxDQUFDckIsS0FBZ0IsRUFBRXNCLEtBQWdCLEVBQTZCO0lBQzdGO0lBQ0EsSUFBSUEsS0FBSyxDQUFDQyxjQUFjLElBQUksSUFBSSxFQUFFO01BQ2hDLE9BQU87UUFDTEMsY0FBYyxFQUFFLENBQUMsR0FBR3hCLEtBQUssQ0FBQ3lCLFNBQVMsQ0FBQztRQUNwQ0MsS0FBSyxFQUFFUCxnQkFBZ0IsQ0FBQ1Esa0JBQWtCLENBQUMzQixLQUFLO01BQ2xELENBQUM7SUFDSDtJQUNBLE9BQU8sSUFBSTtFQUNiO0VBRUEsT0FBTzJCLGtCQUFrQkEsQ0FBQzNCLEtBQWdCLEVBQXNCO0lBQzlELE1BQU00QixTQUFTLEdBQUcsSUFBQUMsbUJBQVUsRUFBQzdCLEtBQUssQ0FBQzhCLFNBQVMsQ0FBQztJQUM3QyxNQUFNSixLQUF5QixHQUFHLEVBQUU7SUFDcEMsTUFBTUssY0FBYyxHQUFHQyxJQUFJLENBQUNDLEtBQUssQ0FBQyxFQUFFLEdBQUdqQyxLQUFLLENBQUNrQyxZQUFZLENBQUM7SUFDMUQsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUduQyxLQUFLLENBQUNvQyxPQUFPLEVBQUVELENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDekMsTUFBTUUsVUFBVSxHQUFHLEVBQUU7TUFDckIsS0FBSyxJQUFJQyxDQUFDLEdBQUd0QyxLQUFLLENBQUN1QyxPQUFPLEVBQUVELENBQUMsR0FBR3RDLEtBQUssQ0FBQ3dDLE9BQU8sRUFBRUYsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNyRCxLQUFLLElBQUlHLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3pDLEtBQUssQ0FBQ2tDLFlBQVksRUFBRU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtVQUM5Q0osVUFBVSxDQUFDSyxJQUFJLENBQUMsSUFBQUMsbUJBQVUsRUFBQyxJQUFBQyxpQkFBUSxFQUFDLElBQUFDLGdCQUFPLEVBQUNqQixTQUFTLEVBQUVPLENBQUMsQ0FBQyxFQUFFRyxDQUFDLENBQUMsRUFBRUcsQ0FBQyxHQUFHVixjQUFjLENBQUMsQ0FBQztRQUNyRjtNQUNGO01BQ0FMLEtBQUssQ0FBQ2dCLElBQUksQ0FBQ0wsVUFBVSxDQUFDO0lBQ3hCO0lBQ0EsT0FBT1gsS0FBSztFQUNkO0VBRUFvQixXQUFXQSxDQUFDOUMsS0FBZ0IsRUFBRTtJQUM1QixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUFBLEtBeERkK0MsVUFBVSxHQUF1QixJQUFJQyxHQUFHLENBQUMsQ0FBQztJQUFBLEtBUTFDQyxPQUFPLEdBQXVCLElBQUk7SUFBQSxLQTZMbENDLHFCQUFxQixHQUFJQyxJQUFVLElBQWtCO01BQ25ELE1BQU1DLFlBQVksR0FBR0EsQ0FBQSxLQUFNO1FBQ3pCLElBQUksQ0FBQ0MseUJBQXlCLENBQUNGLElBQUksQ0FBQztNQUN0QyxDQUFDO01BRUQsTUFBTTNDLFFBQVEsR0FBRzhDLE9BQU8sQ0FBQyxJQUFJLENBQUNoQyxLQUFLLENBQUNFLGNBQWMsQ0FBQytCLElBQUksQ0FBQ0MsQ0FBQyxJQUFJLElBQUFDLHFCQUFZLEVBQUNELENBQUMsRUFBRUwsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUVwRixvQkFDRTFGLEtBQUEsQ0FBQWlHLGFBQUEsQ0FBQ3JELFFBQVE7UUFDUHNELFNBQVMsRUFBQyxpQkFBaUI7UUFDM0JDLElBQUksRUFBQyxjQUFjO1FBQ25CekUsR0FBRyxFQUFFZ0UsSUFBSSxDQUFDVSxXQUFXLENBQUM7UUFDdEI7UUFBQTtRQUNBQyxXQUFXLEVBQUVWLFlBQWE7UUFDMUJXLFlBQVksRUFBRUEsQ0FBQSxLQUFNO1VBQ2xCLElBQUksQ0FBQ0MscUJBQXFCLENBQUNiLElBQUksQ0FBQztRQUNsQyxDQUFFO1FBQ0ZjLFNBQVMsRUFBRUEsQ0FBQSxLQUFNO1VBQ2YsSUFBSSxDQUFDQyxrQkFBa0IsQ0FBQ2YsSUFBSSxDQUFDO1FBQy9CO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFBQTtRQUNBZ0IsWUFBWSxFQUFFZixZQUFhO1FBQzNCZ0IsV0FBVyxFQUFFLElBQUksQ0FBQ0Msb0JBQXFCO1FBQ3ZDQyxVQUFVLEVBQUUsSUFBSSxDQUFDQztNQUFvQixHQUVwQyxJQUFJLENBQUNDLGNBQWMsQ0FBQ3JCLElBQUksRUFBRTNDLFFBQVEsQ0FDM0IsQ0FBQztJQUVmLENBQUM7SUFBQSxLQUVEZ0UsY0FBYyxHQUFHLENBQUNyQixJQUFVLEVBQUUzQyxRQUFpQixLQUFrQjtNQUMvRCxNQUFNaUUsU0FBUyxHQUFJQyxRQUE0QixJQUFLO1FBQ2xELElBQUlBLFFBQVEsRUFBRTtVQUNaLElBQUksQ0FBQzNCLFVBQVUsQ0FBQ3ZELEdBQUcsQ0FBQ2tGLFFBQVEsRUFBRXZCLElBQUksQ0FBQztRQUNyQztNQUNGLENBQUM7TUFDRCxJQUFJLElBQUksQ0FBQ25ELEtBQUssQ0FBQ3dFLGNBQWMsRUFBRTtRQUM3QixPQUFPLElBQUksQ0FBQ3hFLEtBQUssQ0FBQ3dFLGNBQWMsQ0FBQ3JCLElBQUksRUFBRTNDLFFBQVEsRUFBRWlFLFNBQVMsQ0FBQztNQUM3RCxDQUFDLE1BQU07UUFDTCxvQkFDRWhILEtBQUEsQ0FBQWlHLGFBQUEsQ0FBQ25ELFFBQVE7VUFDUEMsUUFBUSxFQUFFQSxRQUFTO1VBQ25CbUUsR0FBRyxFQUFFRixTQUFVO1VBQ2ZoRSxhQUFhLEVBQUUsSUFBSSxDQUFDVCxLQUFLLENBQUNTLGFBQWM7VUFDeENDLGVBQWUsRUFBRSxJQUFJLENBQUNWLEtBQUssQ0FBQ1UsZUFBZ0I7VUFDNUNDLFlBQVksRUFBRSxJQUFJLENBQUNYLEtBQUssQ0FBQ1c7UUFBYSxDQUN2QyxDQUFDO01BRU47SUFDRixDQUFDO0lBQUEsS0FFRGlFLGVBQWUsR0FBSXpCLElBQVUsSUFBa0I7TUFDN0MsSUFBSSxJQUFJLENBQUNuRCxLQUFLLENBQUM0RSxlQUFlLEVBQUU7UUFDOUIsT0FBTyxJQUFJLENBQUM1RSxLQUFLLENBQUM0RSxlQUFlLENBQUN6QixJQUFJLENBQUM7TUFDekMsQ0FBQyxNQUFNO1FBQ0wsb0JBQU8xRixLQUFBLENBQUFpRyxhQUFBLENBQUM1QyxRQUFRLFFBQUUsSUFBQStELGVBQVUsRUFBQzFCLElBQUksRUFBRSxJQUFJLENBQUNuRCxLQUFLLENBQUM4RSxVQUFVLENBQVksQ0FBQztNQUN2RTtJQUNGLENBQUM7SUFBQSxLQUVEQyxlQUFlLEdBQUlDLElBQVUsSUFBa0I7TUFDN0MsSUFBSSxJQUFJLENBQUNoRixLQUFLLENBQUMrRSxlQUFlLEVBQUU7UUFDOUIsT0FBTyxJQUFJLENBQUMvRSxLQUFLLENBQUMrRSxlQUFlLENBQUNDLElBQUksQ0FBQztNQUN6QyxDQUFDLE1BQU07UUFDTCxvQkFBT3ZILEtBQUEsQ0FBQWlHLGFBQUEsQ0FBQzlDLFNBQVMsUUFBRSxJQUFBaUUsZUFBVSxFQUFDRyxJQUFJLEVBQUUsSUFBSSxDQUFDaEYsS0FBSyxDQUFDaUYsVUFBVSxDQUFhLENBQUM7TUFDekU7SUFDRixDQUFDO0lBL01DLElBQUksQ0FBQzNELEtBQUssR0FBRztNQUNYRSxjQUFjLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQ3hCLEtBQUssQ0FBQ3lCLFNBQVMsQ0FBQztNQUFFO01BQzNDeUQsYUFBYSxFQUFFLElBQUk7TUFDbkIzRCxjQUFjLEVBQUUsSUFBSTtNQUNwQjRELGVBQWUsRUFBRSxLQUFLO01BQ3RCekQsS0FBSyxFQUFFUCxnQkFBZ0IsQ0FBQ1Esa0JBQWtCLENBQUMzQixLQUFLO0lBQ2xELENBQUM7SUFFRCxJQUFJLENBQUNvRix1QkFBdUIsR0FBRztNQUM3QkMsTUFBTSxFQUFFQyx5QkFBZ0IsQ0FBQ0QsTUFBTTtNQUMvQkUsTUFBTSxFQUFFRCx5QkFBZ0IsQ0FBQ0M7SUFDM0IsQ0FBQztJQUVELElBQUksQ0FBQ0MsWUFBWSxHQUFHLElBQUksQ0FBQ0EsWUFBWSxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2hELElBQUksQ0FBQ3ZCLGtCQUFrQixHQUFHLElBQUksQ0FBQ0Esa0JBQWtCLENBQUN1QixJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVELElBQUksQ0FBQ3pCLHFCQUFxQixHQUFHLElBQUksQ0FBQ0EscUJBQXFCLENBQUN5QixJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xFLElBQUksQ0FBQ3BCLG9CQUFvQixHQUFHLElBQUksQ0FBQ0Esb0JBQW9CLENBQUNvQixJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2hFLElBQUksQ0FBQ2xCLG1CQUFtQixHQUFHLElBQUksQ0FBQ0EsbUJBQW1CLENBQUNrQixJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzlELElBQUksQ0FBQ3BDLHlCQUF5QixHQUFHLElBQUksQ0FBQ0EseUJBQXlCLENBQUNvQyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQzVFO0VBRUFDLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBQyxRQUFRLENBQUNDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUNKLFlBQVksQ0FBQzs7SUFFdkQ7SUFDQSxJQUFJLENBQUN6QyxVQUFVLENBQUM4QyxPQUFPLENBQUMsQ0FBQ0MsS0FBSyxFQUFFcEIsUUFBUSxLQUFLO01BQzNDLElBQUlBLFFBQVEsSUFBSUEsUUFBUSxDQUFDa0IsZ0JBQWdCLEVBQUU7UUFDekM7UUFDQWxCLFFBQVEsQ0FBQ2tCLGdCQUFnQixDQUFDLFdBQVcsRUFBRTVFLGFBQWEsRUFBRTtVQUFFK0UsT0FBTyxFQUFFO1FBQU0sQ0FBQyxDQUFDO01BQzNFO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7RUFFQUMsb0JBQW9CQSxDQUFBLEVBQUc7SUFDckJMLFFBQVEsQ0FBQ00sbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQ1QsWUFBWSxDQUFDO0lBQzFELElBQUksQ0FBQ3pDLFVBQVUsQ0FBQzhDLE9BQU8sQ0FBQyxDQUFDQyxLQUFLLEVBQUVwQixRQUFRLEtBQUs7TUFDM0MsSUFBSUEsUUFBUSxJQUFJQSxRQUFRLENBQUN1QixtQkFBbUIsRUFBRTtRQUM1QztRQUNBdkIsUUFBUSxDQUFDdUIsbUJBQW1CLENBQUMsV0FBVyxFQUFFakYsYUFBYSxDQUFDO01BQzFEO0lBQ0YsQ0FBQyxDQUFDO0VBQ0o7O0VBRUE7RUFDQTtFQUNBO0VBQ0FrRixxQkFBcUJBLENBQUNDLEtBQTRCLEVBQWU7SUFDL0QsTUFBTTtNQUFFQztJQUFRLENBQUMsR0FBR0QsS0FBSztJQUN6QixJQUFJLENBQUNDLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSTtJQUNqRCxNQUFNO01BQUVDLE9BQU87TUFBRUM7SUFBUSxDQUFDLEdBQUdILE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdkMsTUFBTUksYUFBYSxHQUFHYixRQUFRLENBQUNjLGdCQUFnQixDQUFDSCxPQUFPLEVBQUVDLE9BQU8sQ0FBQztJQUNqRSxJQUFJQyxhQUFhLEVBQUU7TUFDakIsTUFBTUUsUUFBUSxHQUFHLElBQUksQ0FBQzNELFVBQVUsQ0FBQ2xFLEdBQUcsQ0FBQzJILGFBQWEsQ0FBQztNQUNuRCxPQUFPRSxRQUFRLGFBQVJBLFFBQVEsY0FBUkEsUUFBUSxHQUFJLElBQUk7SUFDekI7SUFDQSxPQUFPLElBQUk7RUFDYjtFQUVBbEIsWUFBWUEsQ0FBQSxFQUFHO0lBQ2IsSUFBSSxDQUFDeEYsS0FBSyxDQUFDMkcsUUFBUSxDQUFDLElBQUksQ0FBQ3JGLEtBQUssQ0FBQ0UsY0FBYyxDQUFDO0lBQzlDLElBQUksQ0FBQ29GLFFBQVEsQ0FBQztNQUFFMUIsYUFBYSxFQUFFLElBQUk7TUFBRTNELGNBQWMsRUFBRTtJQUFLLENBQUMsQ0FBQztFQUM5RDs7RUFFQTtFQUNBc0YsdUJBQXVCQSxDQUFDQyxZQUF5QixFQUFFQyxRQUFxQixFQUFFO0lBQ3hFLE1BQU07TUFBRTdCLGFBQWE7TUFBRTNEO0lBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQ0QsS0FBSztJQUVwRCxJQUFJNEQsYUFBYSxLQUFLLElBQUksSUFBSTNELGNBQWMsS0FBSyxJQUFJLEVBQUU7SUFFdkQsSUFBSXlGLFlBQXlCLEdBQUcsRUFBRTtJQUNsQyxJQUFJekYsY0FBYyxJQUFJdUYsWUFBWSxJQUFJNUIsYUFBYSxFQUFFO01BQ25EOEIsWUFBWSxHQUFHLElBQUksQ0FBQzVCLHVCQUF1QixDQUFDLElBQUksQ0FBQ3BGLEtBQUssQ0FBQ2lILGVBQWUsQ0FBQyxDQUNyRTFGLGNBQWMsRUFDZHVGLFlBQVksRUFDWixJQUFJLENBQUN4RixLQUFLLENBQUNJLEtBQ2IsQ0FBQztJQUNIO0lBRUEsSUFBSXdGLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDbEgsS0FBSyxDQUFDeUIsU0FBUyxDQUFDO0lBQ3pDLElBQUl5RCxhQUFhLEtBQUssS0FBSyxFQUFFO01BQzNCZ0MsU0FBUyxHQUFHQyxLQUFLLENBQUNDLElBQUksQ0FBQyxJQUFJQyxHQUFHLENBQUMsQ0FBQyxHQUFHSCxTQUFTLEVBQUUsR0FBR0YsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDLE1BQU0sSUFBSTlCLGFBQWEsS0FBSyxRQUFRLEVBQUU7TUFDckNnQyxTQUFTLEdBQUdBLFNBQVMsQ0FBQ0ksTUFBTSxDQUFDOUQsQ0FBQyxJQUFJLENBQUN3RCxZQUFZLENBQUN6RCxJQUFJLENBQUNnRSxDQUFDLElBQUksSUFBQTlELHFCQUFZLEVBQUNELENBQUMsRUFBRStELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEY7SUFFQSxJQUFJLENBQUNYLFFBQVEsQ0FBQztNQUFFcEYsY0FBYyxFQUFFMEY7SUFBVSxDQUFDLEVBQUVILFFBQVEsQ0FBQztFQUN4RDs7RUFFQTtFQUNBMUQseUJBQXlCQSxDQUFDekIsU0FBZSxFQUFFO0lBQ3pDO0lBQ0E7SUFDQSxNQUFNNEYsWUFBWSxHQUFHLElBQUksQ0FBQ3hILEtBQUssQ0FBQ3lCLFNBQVMsQ0FBQzhCLElBQUksQ0FBQ0MsQ0FBQyxJQUFJLElBQUFDLHFCQUFZLEVBQUNELENBQUMsRUFBRTVCLFNBQVMsQ0FBQyxDQUFDO0lBQy9FLElBQUksQ0FBQ2dGLFFBQVEsQ0FBQztNQUNaMUIsYUFBYSxFQUFFc0MsWUFBWSxHQUFHLFFBQVEsR0FBRyxLQUFLO01BQzlDakcsY0FBYyxFQUFFSztJQUNsQixDQUFDLENBQUM7RUFDSjtFQUVBb0MscUJBQXFCQSxDQUFDYixJQUFVLEVBQUU7SUFDaEM7SUFDQTtJQUNBO0lBQ0EsSUFBSSxDQUFDMEQsdUJBQXVCLENBQUMxRCxJQUFJLENBQUM7RUFDcEM7RUFFQWUsa0JBQWtCQSxDQUFDZixJQUFVLEVBQUU7SUFDN0IsSUFBSSxDQUFDMEQsdUJBQXVCLENBQUMxRCxJQUFJLENBQUM7SUFDbEM7RUFDRjs7RUFFQWtCLG9CQUFvQkEsQ0FBQzhCLEtBQXVCLEVBQUU7SUFDNUMsSUFBSSxDQUFDUyxRQUFRLENBQUM7TUFBRXpCLGVBQWUsRUFBRTtJQUFLLENBQUMsQ0FBQztJQUN4QyxNQUFNdUIsUUFBUSxHQUFHLElBQUksQ0FBQ1IscUJBQXFCLENBQUNDLEtBQUssQ0FBQztJQUNsRCxJQUFJTyxRQUFRLEVBQUU7TUFDWixJQUFJLENBQUNHLHVCQUF1QixDQUFDSCxRQUFRLENBQUM7SUFDeEM7RUFDRjtFQUVBbkMsbUJBQW1CQSxDQUFBLEVBQUc7SUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQ2pELEtBQUssQ0FBQzZELGVBQWUsRUFBRTtNQUMvQjtNQUNBO01BQ0E7TUFDQSxJQUFJLENBQUMwQix1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsTUFBTTtRQUN2QyxJQUFJLENBQUNyQixZQUFZLENBQUMsQ0FBQztNQUNyQixDQUFDLENBQUM7SUFDSixDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNBLFlBQVksQ0FBQyxDQUFDO0lBQ3JCO0lBQ0EsSUFBSSxDQUFDb0IsUUFBUSxDQUFDO01BQUV6QixlQUFlLEVBQUU7SUFBTSxDQUFDLENBQUM7RUFDM0M7RUF3RUFzQyxrQkFBa0JBLENBQUEsRUFBdUI7SUFDdkMsTUFBTUMsY0FBc0IsR0FBRyxFQUFFO0lBQ2pDLE1BQU10RixPQUFPLEdBQUcsSUFBSSxDQUFDZCxLQUFLLENBQUNJLEtBQUssQ0FBQzJFLE1BQU07SUFDdkMsTUFBTXNCLFFBQVEsR0FBRyxJQUFJLENBQUNyRyxLQUFLLENBQUNJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzJFLE1BQU07SUFDM0MsS0FBSyxJQUFJdUIsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHRCxRQUFRLEVBQUVDLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDcEMsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUd6RixPQUFPLEVBQUV5RixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25DSCxjQUFjLENBQUNoRixJQUFJLENBQUMsSUFBSSxDQUFDcEIsS0FBSyxDQUFDSSxLQUFLLENBQUNtRyxDQUFDLENBQUMsQ0FBQ0QsQ0FBQyxDQUFDLENBQUM7TUFDN0M7SUFDRjtJQUNBLE1BQU1FLGdCQUFnQixHQUFHSixjQUFjLENBQUNLLEdBQUcsQ0FBQyxJQUFJLENBQUM3RSxxQkFBcUIsQ0FBQztJQUN2RSxLQUFLLElBQUkyRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdGLFFBQVEsRUFBRUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNwQyxNQUFNRyxLQUFLLEdBQUdILENBQUMsR0FBR3pGLE9BQU87TUFDekIsTUFBTWUsSUFBSSxHQUFHLElBQUksQ0FBQzdCLEtBQUssQ0FBQ0ksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDbUcsQ0FBQyxDQUFDO01BQ25DO01BQ0FDLGdCQUFnQixDQUFDRyxNQUFNLENBQUNELEtBQUssR0FBR0gsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUNqRCxlQUFlLENBQUN6QixJQUFJLENBQUMsQ0FBQztJQUNuRTtJQUNBLE9BQU87SUFBQTtJQUNMO0lBQ0ExRixLQUFBLENBQUFpRyxhQUFBO01BQUt2RSxHQUFHLEVBQUM7SUFBUyxDQUFFLENBQUM7SUFDckI7SUFDQSxHQUFHLElBQUksQ0FBQ21DLEtBQUssQ0FBQ0ksS0FBSyxDQUFDcUcsR0FBRyxDQUFDLENBQUNHLFVBQVUsRUFBRUYsS0FBSyxrQkFDeEN2SyxLQUFLLENBQUMwSyxZQUFZLENBQUMsSUFBSSxDQUFDcEQsZUFBZSxDQUFDbUQsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFBRS9JLEdBQUcsVUFBQWlKLE1BQUEsQ0FBVUosS0FBSztJQUFHLENBQUMsQ0FDbEYsQ0FBQztJQUNEO0lBQ0EsR0FBR0YsZ0JBQWdCLENBQUNDLEdBQUcsQ0FBQyxDQUFDTSxPQUFPLEVBQUVMLEtBQUssa0JBQUt2SyxLQUFLLENBQUMwSyxZQUFZLENBQUNFLE9BQU8sRUFBRTtNQUFFbEosR0FBRyxVQUFBaUosTUFBQSxDQUFVSixLQUFLO0lBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDbkc7RUFDSDtFQUVBTSxNQUFNQSxDQUFBLEVBQWdCO0lBQ3BCLG9CQUNFN0ssS0FBQSxDQUFBaUcsYUFBQSxDQUFDakUsT0FBTyxxQkFDTmhDLEtBQUEsQ0FBQWlHLGFBQUEsQ0FBQzNELElBQUk7TUFDSEUsT0FBTyxFQUFFLElBQUksQ0FBQ3FCLEtBQUssQ0FBQ0ksS0FBSyxDQUFDMkUsTUFBTztNQUNqQ25HLElBQUksRUFBRSxJQUFJLENBQUNvQixLQUFLLENBQUNJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzJFLE1BQU87TUFDakNsRyxTQUFTLEVBQUUsSUFBSSxDQUFDSCxLQUFLLENBQUNHLFNBQVU7TUFDaENDLE1BQU0sRUFBRSxJQUFJLENBQUNKLEtBQUssQ0FBQ0ksTUFBTztNQUMxQnVFLEdBQUcsRUFBRTRELEVBQUUsSUFBSTtRQUNULElBQUksQ0FBQ3RGLE9BQU8sR0FBR3NGLEVBQUU7TUFDbkI7SUFBRSxHQUVELElBQUksQ0FBQ2Qsa0JBQWtCLENBQUMsQ0FDckIsQ0FDQyxDQUFDO0VBRWQ7QUFDRjtBQUFDbkgsT0FBQSxDQUFBakMsT0FBQSxHQUFBOEMsZ0JBQUE7QUExVG9CQSxnQkFBZ0IsQ0FZNUJxSCxZQUFZLEdBQXVCO0VBQ3hDL0csU0FBUyxFQUFFLEVBQUU7RUFDYndGLGVBQWUsRUFBRSxRQUFRO0VBQ3pCN0UsT0FBTyxFQUFFLENBQUM7RUFDVkcsT0FBTyxFQUFFLENBQUM7RUFDVkMsT0FBTyxFQUFFLEVBQUU7RUFDWE4sWUFBWSxFQUFFLENBQUM7RUFDZkosU0FBUyxFQUFFLElBQUkyRyxJQUFJLENBQUMsQ0FBQztFQUNyQjNELFVBQVUsRUFBRSxJQUFJO0VBQ2hCRyxVQUFVLEVBQUUsS0FBSztFQUNqQjlFLFNBQVMsRUFBRSxLQUFLO0VBQ2hCQyxNQUFNLEVBQUUsS0FBSztFQUNiSyxhQUFhLEVBQUVpSSxlQUFNLENBQUNDLElBQUk7RUFDMUJqSSxlQUFlLEVBQUVnSSxlQUFNLENBQUNFLFFBQVE7RUFDaENqSSxZQUFZLEVBQUUrSCxlQUFNLENBQUNHLFNBQVM7RUFDOUJsQyxRQUFRLEVBQUVBLENBQUEsS0FBTSxDQUFDO0FBQ25CLENBQUMifQ==