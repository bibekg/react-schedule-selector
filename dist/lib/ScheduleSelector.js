"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.ScheduleSelector = exports.GridCell = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var React = _interopRequireWildcard(require("react"));
var _styledComponents = _interopRequireDefault(require("styled-components"));
var _format = _interopRequireDefault(require("date-fns/format"));
var _typography = require("./typography");
var _colors = _interopRequireDefault(require("./colors"));
var _selectionSchemes = _interopRequireDefault(require("./selection-schemes"));
var _dateFns = require("date-fns");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Import only the methods we need from date-fns in order to keep build size small

const Wrapper = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Wrapper",
  componentId: "sc-1ke4ka2-0"
})(["display:flex;align-items:center;width:100%;user-select:none;"]);
const Grid = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__Grid",
  componentId: "sc-1ke4ka2-1"
})(["display:grid;grid-template-columns:auto repeat(", ",1fr);grid-template-rows:auto repeat(", ",1fr);column-gap:", ";row-gap:", ";width:100%;"], props => props.columns, props => props.rows, props => props.columnGap, props => props.rowGap);
const GridCell = exports.GridCell = _styledComponents.default.div.withConfig({
  displayName: "ScheduleSelector__GridCell",
  componentId: "sc-1ke4ka2-2"
})(["place-self:stretch;touch-action:none;"]);
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
exports.ScheduleSelector = ScheduleSelector;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwicmVxdWlyZSIsIl9zdHlsZWRDb21wb25lbnRzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9mb3JtYXQiLCJfdHlwb2dyYXBoeSIsIl9jb2xvcnMiLCJfc2VsZWN0aW9uU2NoZW1lcyIsIl9kYXRlRm5zIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0IiwiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIndpdGhDb25maWciLCJkaXNwbGF5TmFtZSIsImNvbXBvbmVudElkIiwiR3JpZCIsInByb3BzIiwiY29sdW1ucyIsInJvd3MiLCJjb2x1bW5HYXAiLCJyb3dHYXAiLCJHcmlkQ2VsbCIsImV4cG9ydHMiLCJEYXRlQ2VsbCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnRPZkRheSIsInN0YXJ0RGF0ZSIsIm1pbnV0ZXNJbkNodW5rIiwiTWF0aCIsImZsb29yIiwiaG91cmx5Q2h1bmtzIiwiZCIsIm51bURheXMiLCJjdXJyZW50RGF5IiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJhZGRNaW51dGVzIiwiYWRkSG91cnMiLCJhZGREYXlzIiwiY29uc3RydWN0b3IiLCJjZWxsVG9EYXRlIiwiTWFwIiwiZ3JpZFJlZiIsInJlbmRlckRhdGVDZWxsV3JhcHBlciIsInRpbWUiLCJzdGFydEhhbmRsZXIiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwiQm9vbGVhbiIsImZpbmQiLCJpc1NhbWVNaW51dGUiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicm9sZSIsImtleSIsInRvSVNPU3RyaW5nIiwib25Nb3VzZURvd24iLCJvbk1vdXNlRW50ZXIiLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJvbk1vdXNlVXAiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJvblRvdWNoU3RhcnQiLCJvblRvdWNoTW92ZSIsImhhbmRsZVRvdWNoTW92ZUV2ZW50Iiwib25Ub3VjaEVuZCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwicmVmIiwicmVuZGVyVGltZUxhYmVsIiwiZm9ybWF0RGF0ZSIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInNlbGVjdGlvblR5cGUiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJlbmRTZWxlY3Rpb24iLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JFYWNoIiwidmFsdWUiLCJwYXNzaXZlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwib25DaGFuZ2UiLCJzZXRTdGF0ZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwiY2FsbGJhY2siLCJuZXdTZWxlY3Rpb24iLCJzZWxlY3Rpb25TY2hlbWUiLCJuZXh0RHJhZnQiLCJBcnJheSIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJiIiwidGltZVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1UaW1lcyIsImoiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50IiwiY29uY2F0IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJ1xuXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5cbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xuaW1wb3J0IHsgYWRkRGF5cywgYWRkSG91cnMsIGFkZE1pbnV0ZXMsIGlzU2FtZU1pbnV0ZSwgc3RhcnRPZkRheSB9IGZyb20gJ2RhdGUtZm5zJ1xuaW1wb3J0IHsgVVRDRGF0ZSB9IGZyb20gJ0BkYXRlLWZucy91dGMnXG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG5gXG5cbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PHsgY29sdW1uczogbnVtYmVyOyByb3dzOiBudW1iZXI7IGNvbHVtbkdhcDogc3RyaW5nOyByb3dHYXA6IHN0cmluZyB9PmBcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgkeyhwcm9wcykgPT4gcHJvcHMuY29sdW1uc30sIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHsocHJvcHMpID0+IHByb3BzLnJvd3N9LCAxZnIpO1xuICBjb2x1bW4tZ2FwOiAkeyhwcm9wcykgPT4gcHJvcHMuY29sdW1uR2FwfTtcbiAgcm93LWdhcDogJHsocHJvcHMpID0+IHByb3BzLnJvd0dhcH07XG4gIHdpZHRoOiAxMDAlO1xuYFxuXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxuICBwbGFjZS1zZWxmOiBzdHJldGNoO1xuICB0b3VjaC1hY3Rpb246IG5vbmU7XG5gXG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjx7XG4gIHNlbGVjdGVkOiBib29sZWFuXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xufT5gXG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDI1cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7KHByb3BzKSA9PiAocHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yKX07XG5cbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHsocHJvcHMpID0+IHByb3BzLmhvdmVyZWRDb2xvcn07XG4gIH1cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIG1hcmdpbjogMDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xuYFxuXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xuYFxuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVTZWxlY3RvclByb3BzIHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIHN0YXJ0RGF0ZTogRGF0ZSB8IFVUQ0RhdGVcbiAgbnVtRGF5czogbnVtYmVyXG4gIG1pblRpbWU6IG51bWJlclxuICBtYXhUaW1lOiBudW1iZXJcbiAgaG91cmx5Q2h1bmtzOiBudW1iZXJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXG4gIHRpbWVGb3JtYXQ6IHN0cmluZ1xuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbnR5cGUgU3RhdGVUeXBlID0ge1xuICAvLyBJbiB0aGUgY2FzZSB0aGF0IGEgdXNlciBpcyBkcmFnLXNlbGVjdGluZywgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMucHJvcHMub25DaGFuZ2UoKSB1bnRpbCB0aGV5IGhhdmUgY29tcGxldGVkXG4gIC8vIHRoZSBkcmFnLXNlbGVjdC4gc2VsZWN0aW9uRHJhZnQgc2VydmVzIGFzIGEgdGVtcG9yYXJ5IGNvcHkgZHVyaW5nIGRyYWctc2VsZWN0cy5cbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGUgfCBudWxsXG4gIHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbFxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cbiAgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PlxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuY2xhc3MgU2NoZWR1bGVTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxJU2NoZWR1bGVTZWxlY3RvclByb3BzLCBTdGF0ZVR5cGU+IHtcbiAgc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnM6IHsgW2tleTogc3RyaW5nXTogKHN0YXJ0RGF0ZTogRGF0ZSwgZW5kRGF0ZTogRGF0ZSwgZm9vOiBBcnJheTxBcnJheTxEYXRlPj4pID0+IERhdGVbXSB9XG4gIGNlbGxUb0RhdGU6IE1hcDxFbGVtZW50LCBEYXRlPiA9IG5ldyBNYXAoKVxuICAvLyBkb2N1bWVudE1vdXNlVXBIYW5kbGVyOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cbiAgLy8gZW5kU2VsZWN0aW9uOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cbiAgLy8gaGFuZGxlVG91Y2hNb3ZlRXZlbnQ6IChldmVudDogUmVhY3QuU3ludGhldGljVG91Y2hFdmVudDwqPikgPT4gdm9pZFxuICAvLyBoYW5kbGVUb3VjaEVuZEV2ZW50OiAoKSA9PiB2b2lkXG4gIC8vIGhhbmRsZU1vdXNlVXBFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgLy8gaGFuZGxlTW91c2VFbnRlckV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICAvLyBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50OiAoZGF0ZTogRGF0ZSkgPT4gdm9pZFxuICBncmlkUmVmOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsXG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wczogUGFydGlhbDxJU2NoZWR1bGVTZWxlY3RvclByb3BzPiA9IHtcbiAgICBzZWxlY3Rpb246IFtdLFxuICAgIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gICAgbnVtRGF5czogNyxcbiAgICBtaW5UaW1lOiA5LFxuICAgIG1heFRpbWU6IDIzLFxuICAgIGhvdXJseUNodW5rczogMSxcbiAgICBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcbiAgICBkYXRlRm9ybWF0OiAnTS9kJyxcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxuICAgIHJvd0dhcDogJzRweCcsXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAgIG9uQ2hhbmdlOiAoKSA9PiB7fSxcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHM6IElTY2hlZHVsZVNlbGVjdG9yUHJvcHMsIHN0YXRlOiBTdGF0ZVR5cGUpOiBQYXJ0aWFsPFN0YXRlVHlwZT4gfCBudWxsIHtcbiAgICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIGlzbid0IGluIHRoZSBwcm9jZXNzIG9mIHNlbGVjdGluZywgYWxsb3cgcHJvcCBjaGFuZ2VzIHRvIHJlLXBvcHVsYXRlIHNlbGVjdGlvbiBzdGF0ZVxuICAgIGlmIChzdGF0ZS5zZWxlY3Rpb25TdGFydCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZWxlY3Rpb25EcmFmdDogWy4uLnByb3BzLnNlbGVjdGlvbl0sXG4gICAgICAgIGRhdGVzOiBTY2hlZHVsZVNlbGVjdG9yLmNvbXB1dGVEYXRlc01hdHJpeChwcm9wcyksXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBzdGF0aWMgY29tcHV0ZURhdGVzTWF0cml4KHByb3BzOiBJU2NoZWR1bGVTZWxlY3RvclByb3BzKTogQXJyYXk8QXJyYXk8RGF0ZT4+IHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcbiAgICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cbiAgICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPCBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xuICAgICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGVzXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogSVNjaGVkdWxlU2VsZWN0b3JQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dLCAvLyBjb3B5IGl0IG92ZXJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbCxcbiAgICAgIGlzVG91Y2hEcmFnZ2luZzogZmFsc2UsXG4gICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpLFxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZSxcbiAgICB9XG5cbiAgICB0aGlzLmVuZFNlbGVjdGlvbiA9IHRoaXMuZW5kU2VsZWN0aW9uLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG5cbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuY2VsbFRvRGF0ZS5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBlbmRTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxuICAgIH0pXG4gIH1cblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0LFxuICAgICAgICBzZWxlY3Rpb25FbmQsXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXMsXG4gICAgICApXG4gICAgfVxuXG4gICAgbGV0IG5leHREcmFmdCA9IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKChhKSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoKGIpID0+IGlzU2FtZU1pbnV0ZShhLCBiKSkpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGlvbkRyYWZ0OiBuZXh0RHJhZnQgfSwgY2FsbGJhY2spXG4gIH1cblxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxuICBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHN0YXJ0VGltZTogRGF0ZSkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xuICAgIGNvbnN0IHRpbWVTZWxlY3RlZCA9IHRoaXMucHJvcHMuc2VsZWN0aW9uLmZpbmQoKGEpID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogdGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJyxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBzdGFydFRpbWUsXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lOiBEYXRlKSB7XG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXBFdmVudCh0aW1lOiBEYXRlKSB7XG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBoYW5kbGVUb3VjaE1vdmVFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IHRydWUgfSlcbiAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChjZWxsVGltZSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVUb3VjaEVuZEV2ZW50KCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoRHJhZ2dpbmcpIHtcbiAgICAgIC8vIEdvaW5nIGRvd24gdGhpcyBicmFuY2ggbWVhbnMgdGhlIHVzZXIgdGFwcGVkIGJ1dCBkaWRuJ3QgZHJhZyAtLSB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhlIGF2YWlsYWJpbGl0eSBkcmFmdCBoYXNuJ3QgeWV0IGJlZW4gdXBkYXRlZCAoc2luY2VcbiAgICAgIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50IHdhcyBuZXZlciBjYWxsZWQpIHNvIHdlIG5lZWQgdG8gZG8gaXQgbm93XG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KG51bGwsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSB9KVxuICB9XG5cbiAgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHRpbWUpXG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBCb29sZWFuKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZCgoYSkgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgICBvbk1vdXNlRG93bj17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICAvLyBUb3VjaCBoYW5kbGVyc1xuICAgICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAgIC8vIGluIHRoZSB0aW1lIHBhcmFtZXRlciwgaW5zdGVhZCB0aGVzZSBoYW5kbGVycyB3aWxsIGRvIHRoZWlyIGpvYiB1c2luZyB0aGUgZGVmYXVsdCBFdmVudFxuICAgICAgICAvLyBwYXJhbWV0ZXJzXG4gICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvblRvdWNoTW92ZT17dGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCl9XG4gICAgICA8L0dyaWRDZWxsPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHJlZlNldHRlciA9IChkYXRlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcbiAgICAgICAgdGhpcy5jZWxsVG9EYXRlLnNldChkYXRlQ2VsbCwgdGltZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCByZWZTZXR0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlQ2VsbFxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnVuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdERhdGUodGltZSwgdGhpcy5wcm9wcy50aW1lRm9ybWF0KX08L1RpbWVUZXh0PlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckRhdGVMYWJlbCA9IChkYXRlOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXREYXRlKGRhdGUsIHRoaXMucHJvcHMuZGF0ZUZvcm1hdCl9PC9EYXRlTGFiZWw+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRnVsbERhdGVHcmlkKCk6IEFycmF5PEpTWC5FbGVtZW50PiB7XG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXG4gICAgY29uc3QgbnVtRGF5cyA9IHRoaXMuc3RhdGUuZGF0ZXMubGVuZ3RoXG4gICAgY29uc3QgbnVtVGltZXMgPSB0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aFxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXM7IGogKz0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaCh0aGlzLnN0YXRlLmRhdGVzW2ldW2pdKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHRoaXMucmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGUuZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHRoaXMucmVuZGVyVGltZUxhYmVsKHRpbWUpKVxuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcbiAgICAgIC4uLnRoaXMuc3RhdGUuZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT5cbiAgICAgICAgUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pLFxuICAgICAgKSxcbiAgICAgIC8vIEV2ZXJ5IHJvdyBhZnRlciB0aGF0XG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKSxcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXsoZWwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFJlZiA9IGVsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckZ1bGxEYXRlR3JpZCgpfVxuICAgICAgICA8L0dyaWQ+XG4gICAgICA8L1dyYXBwZXI+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCB7IFNjaGVkdWxlU2VsZWN0b3IgfVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLGlCQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFHQSxJQUFBRyxPQUFBLEdBQUFELHNCQUFBLENBQUFGLE9BQUE7QUFFQSxJQUFBSSxXQUFBLEdBQUFKLE9BQUE7QUFDQSxJQUFBSyxPQUFBLEdBQUFILHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBTSxpQkFBQSxHQUFBSixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQU8sUUFBQSxHQUFBUCxPQUFBO0FBQWtGLFNBQUFFLHVCQUFBTSxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBQUEsU0FBQUcseUJBQUFDLENBQUEsNkJBQUFDLE9BQUEsbUJBQUFDLENBQUEsT0FBQUQsT0FBQSxJQUFBRSxDQUFBLE9BQUFGLE9BQUEsWUFBQUYsd0JBQUEsWUFBQUEseUJBQUFDLENBQUEsV0FBQUEsQ0FBQSxHQUFBRyxDQUFBLEdBQUFELENBQUEsS0FBQUYsQ0FBQTtBQUFBLFNBQUFiLHdCQUFBYSxDQUFBLEVBQUFFLENBQUEsU0FBQUEsQ0FBQSxJQUFBRixDQUFBLElBQUFBLENBQUEsQ0FBQUgsVUFBQSxTQUFBRyxDQUFBLGVBQUFBLENBQUEsdUJBQUFBLENBQUEseUJBQUFBLENBQUEsV0FBQUYs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