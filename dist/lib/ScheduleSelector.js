"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.default = exports.GridCell = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsIl9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkIiwicmVxdWlyZSIsIl9zdHlsZWRDb21wb25lbnRzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9mb3JtYXQiLCJfdHlwb2dyYXBoeSIsIl9jb2xvcnMiLCJfc2VsZWN0aW9uU2NoZW1lcyIsIl9kYXRlRm5zIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJlIiwiV2Vha01hcCIsInIiLCJ0IiwiaGFzIiwiZ2V0IiwibiIsIl9fcHJvdG9fXyIsImEiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInUiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJpIiwic2V0IiwiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIndpdGhDb25maWciLCJkaXNwbGF5TmFtZSIsImNvbXBvbmVudElkIiwiR3JpZCIsInByb3BzIiwiY29sdW1ucyIsInJvd3MiLCJjb2x1bW5HYXAiLCJyb3dHYXAiLCJHcmlkQ2VsbCIsImV4cG9ydHMiLCJEYXRlQ2VsbCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDb2xvciIsInVuc2VsZWN0ZWRDb2xvciIsImhvdmVyZWRDb2xvciIsIkRhdGVMYWJlbCIsIlN1YnRpdGxlIiwiVGltZVRleHQiLCJUZXh0IiwicHJldmVudFNjcm9sbCIsInByZXZlbnREZWZhdWx0IiwiU2NoZWR1bGVTZWxlY3RvciIsIkNvbXBvbmVudCIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlIiwic2VsZWN0aW9uU3RhcnQiLCJzZWxlY3Rpb25EcmFmdCIsInNlbGVjdGlvbiIsImRhdGVzIiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnRPZkRheSIsInN0YXJ0RGF0ZSIsIm1pbnV0ZXNJbkNodW5rIiwiTWF0aCIsImZsb29yIiwiaG91cmx5Q2h1bmtzIiwiZCIsIm51bURheXMiLCJjdXJyZW50RGF5IiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsInB1c2giLCJhZGRNaW51dGVzIiwiYWRkSG91cnMiLCJhZGREYXlzIiwiY29uc3RydWN0b3IiLCJjZWxsVG9EYXRlIiwiTWFwIiwiZ3JpZFJlZiIsInJlbmRlckRhdGVDZWxsV3JhcHBlciIsInRpbWUiLCJzdGFydEhhbmRsZXIiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwiQm9vbGVhbiIsImZpbmQiLCJpc1NhbWVNaW51dGUiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicm9sZSIsImtleSIsInRvSVNPU3RyaW5nIiwib25Nb3VzZURvd24iLCJvbk1vdXNlRW50ZXIiLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJvbk1vdXNlVXAiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJvblRvdWNoU3RhcnQiLCJvblRvdWNoTW92ZSIsImhhbmRsZVRvdWNoTW92ZUV2ZW50Iiwib25Ub3VjaEVuZCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsImRhdGVDZWxsIiwicmVmIiwicmVuZGVyVGltZUxhYmVsIiwiZm9ybWF0RGF0ZSIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInNlbGVjdGlvblR5cGUiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJlbmRTZWxlY3Rpb24iLCJiaW5kIiwiY29tcG9uZW50RGlkTW91bnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JFYWNoIiwidmFsdWUiLCJwYXNzaXZlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwib25DaGFuZ2UiLCJzZXRTdGF0ZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwiY2FsbGJhY2siLCJuZXdTZWxlY3Rpb24iLCJzZWxlY3Rpb25TY2hlbWUiLCJuZXh0RHJhZnQiLCJBcnJheSIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJiIiwidGltZVNlbGVjdGVkIiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1UaW1lcyIsImoiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiY2xvbmVFbGVtZW50IiwiY29uY2F0IiwiZWxlbWVudCIsInJlbmRlciIsImVsIiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJ1xuXG4vLyBJbXBvcnQgb25seSB0aGUgbWV0aG9kcyB3ZSBuZWVkIGZyb20gZGF0ZS1mbnMgaW4gb3JkZXIgdG8ga2VlcCBidWlsZCBzaXplIHNtYWxsXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5cbmltcG9ydCB7IFRleHQsIFN1YnRpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzJ1xuaW1wb3J0IHsgYWRkRGF5cywgYWRkSG91cnMsIGFkZE1pbnV0ZXMsIGlzU2FtZU1pbnV0ZSwgc3RhcnRPZkRheSB9IGZyb20gJ2RhdGUtZm5zJ1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuYFxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjx7IGNvbHVtbnM6IG51bWJlcjsgcm93czogbnVtYmVyOyBjb2x1bW5HYXA6IHN0cmluZzsgcm93R2FwOiBzdHJpbmcgfT5gXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHsocHJvcHMpID0+IHByb3BzLmNvbHVtbnN9LCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7KHByb3BzKSA9PiBwcm9wcy5yb3dzfSwgMWZyKTtcbiAgY29sdW1uLWdhcDogJHsocHJvcHMpID0+IHByb3BzLmNvbHVtbkdhcH07XG4gIHJvdy1nYXA6ICR7KHByb3BzKSA9PiBwcm9wcy5yb3dHYXB9O1xuICB3aWR0aDogMTAwJTtcbmBcblxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcbiAgcGxhY2Utc2VsZjogc3RyZXRjaDtcbiAgdG91Y2gtYWN0aW9uOiBub25lO1xuYFxuXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8e1xuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn0+YFxuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAyNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAkeyhwcm9wcykgPT4gKHByb3BzLnNlbGVjdGVkID8gcHJvcHMuc2VsZWN0ZWRDb2xvciA6IHByb3BzLnVuc2VsZWN0ZWRDb2xvcil9O1xuXG4gICY6aG92ZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7KHByb3BzKSA9PiBwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICB9XG5gXG5cbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgfVxuICBtYXJnaW46IDA7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbmBcblxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgfVxuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgbWFyZ2luOiAwO1xuICBtYXJnaW4tcmlnaHQ6IDRweDtcbmBcblxudHlwZSBQcm9wc1R5cGUgPSB7XG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cbiAgc2VsZWN0aW9uU2NoZW1lOiBTZWxlY3Rpb25TY2hlbWVUeXBlXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxuICBzdGFydERhdGU6IERhdGVcbiAgbnVtRGF5czogbnVtYmVyXG4gIG1pblRpbWU6IG51bWJlclxuICBtYXhUaW1lOiBudW1iZXJcbiAgaG91cmx5Q2h1bmtzOiBudW1iZXJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXG4gIHRpbWVGb3JtYXQ6IHN0cmluZ1xuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbnR5cGUgU3RhdGVUeXBlID0ge1xuICAvLyBJbiB0aGUgY2FzZSB0aGF0IGEgdXNlciBpcyBkcmFnLXNlbGVjdGluZywgd2UgZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMucHJvcHMub25DaGFuZ2UoKSB1bnRpbCB0aGV5IGhhdmUgY29tcGxldGVkXG4gIC8vIHRoZSBkcmFnLXNlbGVjdC4gc2VsZWN0aW9uRHJhZnQgc2VydmVzIGFzIGEgdGVtcG9yYXJ5IGNvcHkgZHVyaW5nIGRyYWctc2VsZWN0cy5cbiAgc2VsZWN0aW9uRHJhZnQ6IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGUgfCBudWxsXG4gIHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbFxuICBpc1RvdWNoRHJhZ2dpbmc6IGJvb2xlYW5cbiAgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PlxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZVNlbGVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzVHlwZSwgU3RhdGVUeXBlPiB7XG4gIHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzOiB7IFtrZXk6IHN0cmluZ106IChzdGFydERhdGU6IERhdGUsIGVuZERhdGU6IERhdGUsIGZvbzogQXJyYXk8QXJyYXk8RGF0ZT4+KSA9PiBEYXRlW10gfVxuICBjZWxsVG9EYXRlOiBNYXA8RWxlbWVudCwgRGF0ZT4gPSBuZXcgTWFwKClcbiAgLy8gZG9jdW1lbnRNb3VzZVVwSGFuZGxlcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGVuZFNlbGVjdGlvbjogKCkgPT4gdm9pZCA9ICgpID0+IHt9XG4gIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50OiAoZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY1RvdWNoRXZlbnQ8Kj4pID0+IHZvaWRcbiAgLy8gaGFuZGxlVG91Y2hFbmRFdmVudDogKCkgPT4gdm9pZFxuICAvLyBoYW5kbGVNb3VzZVVwRXZlbnQ6IChkYXRlOiBEYXRlKSA9PiB2b2lkXG4gIC8vIGhhbmRsZU1vdXNlRW50ZXJFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgLy8gaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudDogKGRhdGU6IERhdGUpID0+IHZvaWRcbiAgZ3JpZFJlZjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IFBhcnRpYWw8UHJvcHNUeXBlPiA9IHtcbiAgICBzZWxlY3Rpb246IFtdLFxuICAgIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gICAgbnVtRGF5czogNyxcbiAgICBtaW5UaW1lOiA5LFxuICAgIG1heFRpbWU6IDIzLFxuICAgIGhvdXJseUNodW5rczogMSxcbiAgICBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gICAgdGltZUZvcm1hdDogJ2hhJyxcbiAgICBkYXRlRm9ybWF0OiAnTS9kJyxcbiAgICBjb2x1bW5HYXA6ICc0cHgnLFxuICAgIHJvd0dhcDogJzRweCcsXG4gICAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gICAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gICAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAgIG9uQ2hhbmdlOiAoKSA9PiB7fSxcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHM6IFByb3BzVHlwZSwgc3RhdGU6IFN0YXRlVHlwZSk6IFBhcnRpYWw8U3RhdGVUeXBlPiB8IG51bGwge1xuICAgIC8vIEFzIGxvbmcgYXMgdGhlIHVzZXIgaXNuJ3QgaW4gdGhlIHByb2Nlc3Mgb2Ygc2VsZWN0aW5nLCBhbGxvdyBwcm9wIGNoYW5nZXMgdG8gcmUtcG9wdWxhdGUgc2VsZWN0aW9uIHN0YXRlXG4gICAgaWYgKHN0YXRlLnNlbGVjdGlvblN0YXJ0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4ucHJvcHMuc2VsZWN0aW9uXSxcbiAgICAgICAgZGF0ZXM6IFNjaGVkdWxlU2VsZWN0b3IuY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKSxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHN0YXRpYyBjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHM6IFByb3BzVHlwZSk6IEFycmF5PEFycmF5PERhdGU+PiB7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gICAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gICAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cbiAgICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhhZGREYXlzKHN0YXJ0VGltZSwgZCksIGgpLCBjICogbWludXRlc0luQ2h1bmspKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkYXRlcy5wdXNoKGN1cnJlbnREYXkpXG4gICAgfVxuICAgIHJldHVybiBkYXRlc1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzVHlwZSkge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGlvbkRyYWZ0OiBbLi4udGhpcy5wcm9wcy5zZWxlY3Rpb25dLCAvLyBjb3B5IGl0IG92ZXJcbiAgICAgIHNlbGVjdGlvblR5cGU6IG51bGwsXG4gICAgICBzZWxlY3Rpb25TdGFydDogbnVsbCxcbiAgICAgIGlzVG91Y2hEcmFnZ2luZzogZmFsc2UsXG4gICAgICBkYXRlczogU2NoZWR1bGVTZWxlY3Rvci5jb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpLFxuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZSxcbiAgICB9XG5cbiAgICB0aGlzLmVuZFNlbGVjdGlvbiA9IHRoaXMuZW5kU2VsZWN0aW9uLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VVcEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCA9IHRoaXMuaGFuZGxlTW91c2VFbnRlckV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVRvdWNoTW92ZUV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50ID0gdGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSB0aGlzLmhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG5cbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xuICAgIHRoaXMuY2VsbFRvRGF0ZS5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5lbmRTZWxlY3Rpb24pXG4gICAgdGhpcy5jZWxsVG9EYXRlLmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuY2VsbFRvRGF0ZS5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBlbmRTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnN0YXRlLnNlbGVjdGlvbkRyYWZ0KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogbnVsbCxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBudWxsLFxuICAgIH0pXG4gIH1cblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgeyBzZWxlY3Rpb25UeXBlLCBzZWxlY3Rpb25TdGFydCB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1t0aGlzLnByb3BzLnNlbGVjdGlvblNjaGVtZV0oXG4gICAgICAgIHNlbGVjdGlvblN0YXJ0LFxuICAgICAgICBzZWxlY3Rpb25FbmQsXG4gICAgICAgIHRoaXMuc3RhdGUuZGF0ZXMsXG4gICAgICApXG4gICAgfVxuXG4gICAgbGV0IG5leHREcmFmdCA9IFsuLi50aGlzLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKChhKSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoKGIpID0+IGlzU2FtZU1pbnV0ZShhLCBiKSkpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGlvbkRyYWZ0OiBuZXh0RHJhZnQgfSwgY2FsbGJhY2spXG4gIH1cblxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxuICBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHN0YXJ0VGltZTogRGF0ZSkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xuICAgIGNvbnN0IHRpbWVTZWxlY3RlZCA9IHRoaXMucHJvcHMuc2VsZWN0aW9uLmZpbmQoKGEpID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0aW9uVHlwZTogdGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJyxcbiAgICAgIHNlbGVjdGlvblN0YXJ0OiBzdGFydFRpbWUsXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lOiBEYXRlKSB7XG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxuICAgIHRoaXMudXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXBFdmVudCh0aW1lOiBEYXRlKSB7XG4gICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBoYW5kbGVUb3VjaE1vdmVFdmVudChldmVudDogUmVhY3QuVG91Y2hFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1RvdWNoRHJhZ2dpbmc6IHRydWUgfSlcbiAgICBjb25zdCBjZWxsVGltZSA9IHRoaXMuZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdGhpcy51cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChjZWxsVGltZSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVUb3VjaEVuZEV2ZW50KCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5pc1RvdWNoRHJhZ2dpbmcpIHtcbiAgICAgIC8vIEdvaW5nIGRvd24gdGhpcyBicmFuY2ggbWVhbnMgdGhlIHVzZXIgdGFwcGVkIGJ1dCBkaWRuJ3QgZHJhZyAtLSB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhlIGF2YWlsYWJpbGl0eSBkcmFmdCBoYXNuJ3QgeWV0IGJlZW4gdXBkYXRlZCAoc2luY2VcbiAgICAgIC8vIGhhbmRsZVRvdWNoTW92ZUV2ZW50IHdhcyBuZXZlciBjYWxsZWQpIHNvIHdlIG5lZWQgdG8gZG8gaXQgbm93XG4gICAgICB0aGlzLnVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KG51bGwsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmRTZWxlY3Rpb24oKVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNUb3VjaERyYWdnaW5nOiBmYWxzZSB9KVxuICB9XG5cbiAgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHRpbWUpXG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBCb29sZWFuKHRoaXMuc3RhdGUuc2VsZWN0aW9uRHJhZnQuZmluZCgoYSkgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgICBvbk1vdXNlRG93bj17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICAvLyBUb3VjaCBoYW5kbGVyc1xuICAgICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAgIC8vIGluIHRoZSB0aW1lIHBhcmFtZXRlciwgaW5zdGVhZCB0aGVzZSBoYW5kbGVycyB3aWxsIGRvIHRoZWlyIGpvYiB1c2luZyB0aGUgZGVmYXVsdCBFdmVudFxuICAgICAgICAvLyBwYXJhbWV0ZXJzXG4gICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvblRvdWNoTW92ZT17dGhpcy5oYW5kbGVUb3VjaE1vdmVFdmVudH1cbiAgICAgICAgb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZEV2ZW50fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCl9XG4gICAgICA8L0dyaWRDZWxsPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHJlZlNldHRlciA9IChkYXRlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcbiAgICAgICAgdGhpcy5jZWxsVG9EYXRlLnNldChkYXRlQ2VsbCwgdGltZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCByZWZTZXR0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlQ2VsbFxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXt0aGlzLnByb3BzLnVuc2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3RoaXMucHJvcHMuaG92ZXJlZENvbG9yfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlclRpbWVMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdERhdGUodGltZSwgdGhpcy5wcm9wcy50aW1lRm9ybWF0KX08L1RpbWVUZXh0PlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckRhdGVMYWJlbCA9IChkYXRlOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXREYXRlKGRhdGUsIHRoaXMucHJvcHMuZGF0ZUZvcm1hdCl9PC9EYXRlTGFiZWw+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRnVsbERhdGVHcmlkKCk6IEFycmF5PEpTWC5FbGVtZW50PiB7XG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXG4gICAgY29uc3QgbnVtRGF5cyA9IHRoaXMuc3RhdGUuZGF0ZXMubGVuZ3RoXG4gICAgY29uc3QgbnVtVGltZXMgPSB0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aFxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXM7IGogKz0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaCh0aGlzLnN0YXRlLmRhdGVzW2ldW2pdKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHRoaXMucmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGUuZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHRoaXMucmVuZGVyVGltZUxhYmVsKHRpbWUpKVxuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcbiAgICAgIC4uLnRoaXMuc3RhdGUuZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT5cbiAgICAgICAgUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pLFxuICAgICAgKSxcbiAgICAgIC8vIEV2ZXJ5IHJvdyBhZnRlciB0aGF0XG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKSxcbiAgICBdXG4gIH1cblxuICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICA8V3JhcHBlcj5cbiAgICAgICAgPEdyaWRcbiAgICAgICAgICBjb2x1bW5zPXt0aGlzLnN0YXRlLmRhdGVzLmxlbmd0aH1cbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLmRhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgICBjb2x1bW5HYXA9e3RoaXMucHJvcHMuY29sdW1uR2FwfVxuICAgICAgICAgIHJvd0dhcD17dGhpcy5wcm9wcy5yb3dHYXB9XG4gICAgICAgICAgcmVmPXsoZWwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFJlZiA9IGVsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckZ1bGxEYXRlR3JpZCgpfVxuICAgICAgICA8L0dyaWQ+XG4gICAgICA8L1dyYXBwZXI+XG4gICAgKVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsaUJBQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUdBLElBQUFHLE9BQUEsR0FBQUQsc0JBQUEsQ0FBQUYsT0FBQTtBQUVBLElBQUFJLFdBQUEsR0FBQUosT0FBQTtBQUNBLElBQUFLLE9BQUEsR0FBQUgsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFNLGlCQUFBLEdBQUFKLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBTyxRQUFBLEdBQUFQLE9BQUE7QUFBa0YsU0FBQUUsdUJBQUFNLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyx5QkFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxtQkFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBRix3QkFBQSxZQUFBQSx5QkFBQUMsQ0FBQSxXQUFBQSxDQUFBLEdBQUFHLENBQUEsR0FBQUQsQ0FBQSxLQUFBRixDQUFBO0FBQUEsU0FBQWIsd0JBQUFhLENBQUEsRUFBQUUsQ0FBQSxTQUFBQSxDQUFBLElBQUFGLENBQUEsSUFBQUEsQ0FBQSxDQUFBSCxVQUFBLFNBQUFHLENBQUEsZUFBQUEsQ0FBQSx1QkFBQUEsQ0FBQSx5QkFBQUEsQ0FBQSxXQUFBRixPQUFBLEVBQUFFLENBQUEsUUFBQUcsQ0FBQSxHQUFBSix3QkFBQSxDQUFBRyxDQUFBLE9BQUFDLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxHQUFBLENBQUFKLENBQUEsVUFBQUcsQ0FBQSxDQUFBRSxHQUFBLENBQUFMLENBQUEsT0FBQU0sQ0FBQSxLQUFBQyxTQUFBLFVB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