"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.default = exports.GridCell = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _index = _interopRequireDefault(require("./selection-schemes/index"));
var _colors = _interopRequireDefault(require("./colors"));
var _react2 = require("@emotion/react");
var _styled = _interopRequireDefault(require("@emotion/styled"));
var _typography = require("./typography");
var _dateFns = require("date-fns");
var _format = _interopRequireDefault(require("date-fns/format"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
const Wrapper = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n"])), (0, _react2.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    display: flex;\n    align-items: center;\n    width: 100%;\n    user-select: none;\n  "]))));
const Grid = _styled.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  ", "\n"])), props => (0, _react2.css)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    display: grid;\n    grid-template-columns: auto repeat(", ", 1fr);\n    grid-template-rows: auto repeat(", ", 1fr);\n    column-gap: ", ";\n    row-gap: ", ";\n    width: 100%;\n  "])), props.columns, props.rows, props.columnGap, props.rowGap));
const GridCell = _styled.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  ", "\n"])), (0, _react2.css)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n    place-self: stretch;\n    touch-action: none;\n  "]))));
exports.GridCell = GridCell;
const DateCell = _styled.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  ", "\n"])), props => (0, _react2.css)(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n    width: 100%;\n    height: 25px;\n    background-color: ", ";\n\n    &:hover {\n      background-color: ", ";\n    }\n  "])), props.selected ? props.selectedColor : props.unselectedColor, props.hoveredColor));
const DateLabel = (0, _styled.default)(_typography.Subtitle)(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  ", "\n"])), (0, _react2.css)(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n    @media (max-width: 699px) {\n      font-size: 12px;\n    }\n    margin: 0;\n    margin-bottom: 4px;\n  "]))));
const TimeText = (0, _styled.default)(_typography.Text)(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n  ", "\n"])), (0, _react2.css)(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n    @media (max-width: 699px) {\n      font-size: 10px;\n    }\n    text-align: right;\n    margin: 0;\n    margin-right: 4px;\n  "]))));

// eslint-disable-next-line @typescript-eslint/no-empty-interface

const preventScroll = e => {
  e.preventDefault();
};
exports.preventScroll = preventScroll;
const computeDatesMatrix = props => {
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
};
const ScheduleSelector = props => {
  const selectionSchemeHandlers = {
    linear: _index.default.linear,
    square: _index.default.square
  };
  const cellToDate = (0, _react.useRef)(new Map());
  const gridRef = (0, _react.useRef)(null);
  const [selectionDraft, setSelectionDraft] = (0, _react.useState)([...props.selection]);
  const selectionDraftRef = (0, _react.useRef)(selectionDraft);
  const [selectionType, setSelectionType] = (0, _react.useState)(null);
  const [selectionStart, setSelectionStart] = (0, _react.useState)(null);
  const [isTouchDragging, setIsTouchDragging] = (0, _react.useState)(false);
  const [dates, setDates] = (0, _react.useState)(computeDatesMatrix(props));
  (0, _react.useEffect)(() => {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', endSelection);

    // Prevent page scrolling when user is dragging on the date cells
    cellToDate.current.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, {
          passive: false
        });
      }
    });
    return () => {
      document.removeEventListener('mouseup', endSelection);
      cellToDate.current.forEach((value, dateCell) => {
        if (dateCell && dateCell.removeEventListener) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dateCell.removeEventListener('touchmove', preventScroll);
        }
      });
    };
  }, []);

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  const getTimeFromTouchEvent = event => {
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
      const cellTime = cellToDate.current.get(targetElement);
      return cellTime !== null && cellTime !== void 0 ? cellTime : null;
    }
    return null;
  };
  const endSelection = () => {
    props.onChange(selectionDraftRef.current);
    setSelectionType(null);
    setSelectionStart(null);
  };

  // Given an ending Date, determines all the dates that should be selected in this draft
  const updateAvailabilityDraft = selectionEnd => {
    if (selectionType === null || selectionStart === null) return;
    let newSelection = [];
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = selectionSchemeHandlers[props.selectionScheme](selectionStart, selectionEnd, dates);
    }
    let nextDraft = [...props.selection];
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]));
      console.log(props.selection, newSelection, nextDraft);
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => (0, _dateFns.isSameMinute)(a, b)));
    }
    selectionDraftRef.current = nextDraft;
    setSelectionDraft(nextDraft);
  };

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  const handleSelectionStartEvent = startTime => {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = props.selection.find(a => (0, _dateFns.isSameMinute)(a, startTime));
    setSelectionType(timeSelected ? 'remove' : 'add');
    setSelectionStart(startTime);
  };
  const handleMouseEnterEvent = time => {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    updateAvailabilityDraft(time);
  };
  const handleMouseUpEvent = time => {
    updateAvailabilityDraft(time);
    // Don't call this.endSelection() here because the document mouseup handler will do it
  };

  const handleTouchMoveEvent = event => {
    setIsTouchDragging(true);
    const cellTime = getTimeFromTouchEvent(event);
    if (cellTime) {
      updateAvailabilityDraft(cellTime);
    }
  };
  const handleTouchEndEvent = () => {
    if (!isTouchDragging) {
      updateAvailabilityDraft(null);
    } else {
      endSelection();
    }
    setIsTouchDragging(false);
  };
  const renderDateCellWrapper = time => {
    const startHandler = () => {
      handleSelectionStartEvent(time);
    };
    const selected = Boolean(selectionDraft.find(a => (0, _dateFns.isSameMinute)(a, time)));
    return /*#__PURE__*/_react.default.createElement(GridCell, {
      className: "rgdp__grid-cell",
      role: "presentation",
      key: time.toISOString()
      // Mouse handlers
      ,
      onMouseDown: startHandler,
      onMouseEnter: () => {
        handleMouseEnterEvent(time);
      },
      onMouseUp: () => {
        handleMouseUpEvent(time);
      }
      // Touch handlers
      // Since touch events fire on the event where the touch-drag started, there's no point in passing
      // in the time parameter, instead these handlers will do their job using the default Event
      // parameters
      ,
      onTouchStart: startHandler,
      onTouchMove: handleTouchMoveEvent,
      onTouchEnd: handleTouchEndEvent
    }, renderDateCell(time, selected));
  };
  const renderDateCell = (time, selected) => {
    const refSetter = dateCell => {
      if (dateCell) {
        cellToDate.current.set(dateCell, time);
      }
    };
    if (props.renderDateCell) {
      return props.renderDateCell(time, selected, refSetter);
    } else {
      return /*#__PURE__*/_react.default.createElement(DateCell, {
        selected: selected,
        ref: refSetter,
        selectedColor: props.selectedColor,
        unselectedColor: props.unselectedColor,
        hoveredColor: props.hoveredColor
      });
    }
  };
  const renderTimeLabel = time => {
    if (props.renderTimeLabel) {
      return props.renderTimeLabel(time);
    } else {
      return /*#__PURE__*/_react.default.createElement(TimeText, null, (0, _format.default)(time, props.timeFormat));
    }
  };
  const renderDateLabel = date => {
    if (props.renderDateLabel) {
      return props.renderDateLabel(date);
    } else {
      return /*#__PURE__*/_react.default.createElement(DateLabel, null, (0, _format.default)(date, props.dateFormat));
    }
  };
  const renderFullDateGrid = () => {
    const flattenedDates = [];
    const numDays = dates.length;
    const numTimes = dates[0].length;
    for (let j = 0; j < numTimes; j += 1) {
      for (let i = 0; i < numDays; i += 1) {
        flattenedDates.push(dates[i][j]);
      }
    }
    const dateGridElements = flattenedDates.map(renderDateCellWrapper);
    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays;
      const time = dates[0][i];
      // Inject the time label at the start of every row
      dateGridElements.splice(index + i, 0, renderTimeLabel(time));
    }
    return [
    /*#__PURE__*/
    // Empty top left corner
    _react.default.createElement("div", {
      key: "topleft"
    }),
    // Top row of dates
    ...dates.map((dayOfTimes, index) => /*#__PURE__*/_react.default.cloneElement(renderDateLabel(dayOfTimes[0]), {
      key: "date-".concat(index)
    })),
    // Every row after that
    ...dateGridElements.map((element, index) => /*#__PURE__*/_react.default.cloneElement(element, {
      key: "time-".concat(index)
    }))];
  };
  return /*#__PURE__*/_react.default.createElement(Wrapper, null, /*#__PURE__*/_react.default.createElement(Grid, {
    columns: dates.length,
    rows: dates[0].length,
    columnGap: props.columnGap,
    rowGap: props.rowGap,
    ref: el => {
      gridRef.current = el;
    }
  }, renderFullDateGrid()));
};
var _default = ScheduleSelector;
exports.default = _default;
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: () => {}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfaW5kZXgiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX2NvbG9ycyIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9mb3JtYXQiLCJfdGVtcGxhdGVPYmplY3QiLCJfdGVtcGxhdGVPYmplY3QyIiwiX3RlbXBsYXRlT2JqZWN0MyIsIl90ZW1wbGF0ZU9iamVjdDQiLCJfdGVtcGxhdGVPYmplY3Q1IiwiX3RlbXBsYXRlT2JqZWN0NiIsIl90ZW1wbGF0ZU9iamVjdDciLCJfdGVtcGxhdGVPYmplY3Q4IiwiX3RlbXBsYXRlT2JqZWN0OSIsIl90ZW1wbGF0ZU9iamVjdDEwIiwiX3RlbXBsYXRlT2JqZWN0MTEiLCJfdGVtcGxhdGVPYmplY3QxMiIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsIiwic3RyaW5ncyIsInJhdyIsInNsaWNlIiwiZnJlZXplIiwiZGVmaW5lUHJvcGVydGllcyIsInZhbHVlIiwiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsImNzcyIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJleHBvcnRzIiwiRGF0ZUNlbGwiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ29sb3IiLCJ1bnNlbGVjdGVkQ29sb3IiLCJob3ZlcmVkQ29sb3IiLCJEYXRlTGFiZWwiLCJTdWJ0aXRsZSIsIlRpbWVUZXh0IiwiVGV4dCIsInByZXZlbnRTY3JvbGwiLCJlIiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJzdGFydFRpbWUiLCJzdGFydE9mRGF5Iiwic3RhcnREYXRlIiwiZGF0ZXMiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsImQiLCJudW1EYXlzIiwiY3VycmVudERheSIsImgiLCJtaW5UaW1lIiwibWF4VGltZSIsImMiLCJwdXNoIiwiYWRkTWludXRlcyIsImFkZEhvdXJzIiwiYWRkRGF5cyIsIlNjaGVkdWxlU2VsZWN0b3IiLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJjZWxsVG9EYXRlIiwidXNlUmVmIiwiTWFwIiwiZ3JpZFJlZiIsInNlbGVjdGlvbkRyYWZ0Iiwic2V0U2VsZWN0aW9uRHJhZnQiLCJ1c2VTdGF0ZSIsInNlbGVjdGlvbiIsInNlbGVjdGlvbkRyYWZ0UmVmIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmRTZWxlY3Rpb24iLCJjdXJyZW50IiwiZm9yRWFjaCIsImRhdGVDZWxsIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJvbkNoYW5nZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiY29uc29sZSIsImxvZyIsImZpbHRlciIsImEiLCJmaW5kIiwiYiIsImlzU2FtZU1pbnV0ZSIsImhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQiLCJ0aW1lU2VsZWN0ZWQiLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJ0aW1lIiwiaGFuZGxlTW91c2VVcEV2ZW50IiwiaGFuZGxlVG91Y2hNb3ZlRXZlbnQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwicmVuZGVyRGF0ZUNlbGxXcmFwcGVyIiwic3RhcnRIYW5kbGVyIiwiQm9vbGVhbiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJyb2xlIiwidG9JU09TdHJpbmciLCJvbk1vdXNlRG93biIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VVcCIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwib25Ub3VjaEVuZCIsInJlbmRlckRhdGVDZWxsIiwicmVmU2V0dGVyIiwicmVmIiwicmVuZGVyVGltZUxhYmVsIiwiZm9ybWF0RGF0ZSIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsImNvbmNhdCIsImVsZW1lbnQiLCJlbCIsIl9kZWZhdWx0IiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMgZnJvbSAnLi9zZWxlY3Rpb24tc2NoZW1lcy9pbmRleCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnXG5pbXBvcnQgeyBjc3MgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCdcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJ1xuaW1wb3J0IHsgU3VidGl0bGUsIFRleHQgfSBmcm9tICcuL3R5cG9ncmFwaHknXG5pbXBvcnQgeyBhZGREYXlzLCBhZGRIb3VycywgYWRkTWludXRlcywgaXNTYW1lTWludXRlLCBzdGFydE9mRGF5IH0gZnJvbSAnZGF0ZS1mbnMnXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5pbXBvcnQgeyBTZWxlY3Rpb25TY2hlbWVUeXBlLCBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9pbmRleCdcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgYH1cbmBcbmludGVyZmFjZSBJR3JpZFByb3BzIHtcbiAgY29sdW1uczogbnVtYmVyXG4gIHJvd3M6IG51bWJlclxuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xufVxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjxJR3JpZFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMuY29sdW1uc30sIDFmcik7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzLnJvd3N9LCAxZnIpO1xuICAgIGNvbHVtbi1nYXA6ICR7cHJvcHMuY29sdW1uR2FwfTtcbiAgICByb3ctZ2FwOiAke3Byb3BzLnJvd0dhcH07XG4gICAgd2lkdGg6IDEwMCU7XG4gIGB9XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gICAgdG91Y2gtYWN0aW9uOiBub25lO1xuICBgfVxuYFxuXG5pbnRlcmZhY2UgSURhdGVDZWxsUHJvcHMge1xuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PElEYXRlQ2VsbFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAyNXB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yfTtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYH1cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgJHtjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICAgIG1hcmdpbjogMDtcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGB9XG5gXG5cbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICB9XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICBgfVxuYFxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWludGVyZmFjZVxuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVTZWxlY3RvclByb3BzIHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIHN0YXJ0RGF0ZTogRGF0ZVxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcD86IHN0cmluZ1xuICByb3dHYXA/OiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yPzogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yPzogc3RyaW5nXG4gIHJlbmRlckRhdGVDZWxsPzogKGRhdGV0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5jb25zdCBjb21wdXRlRGF0ZXNNYXRyaXggPSAocHJvcHM6IElTY2hlZHVsZVNlbGVjdG9yUHJvcHMpOiBBcnJheTxBcnJheTxEYXRlPj4gPT4ge1xuICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcbiAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcbiAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cbiAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xuICAgICAgICBjdXJyZW50RGF5LnB1c2goYWRkTWludXRlcyhhZGRIb3VycyhhZGREYXlzKHN0YXJ0VGltZSwgZCksIGgpLCBjICogbWludXRlc0luQ2h1bmspKVxuICAgICAgfVxuICAgIH1cbiAgICBkYXRlcy5wdXNoKGN1cnJlbnREYXkpXG4gIH1cbiAgcmV0dXJuIGRhdGVzXG59XG5cbmNvbnN0IFNjaGVkdWxlU2VsZWN0b3I6IFJlYWN0LkZDPElTY2hlZHVsZVNlbGVjdG9yUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCBzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgfVxuICBjb25zdCBjZWxsVG9EYXRlID0gdXNlUmVmPE1hcDxFbGVtZW50LCBEYXRlPj4obmV3IE1hcCgpKVxuICBjb25zdCBncmlkUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbClcblxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcbiAgY29uc3QgW3NlbGVjdGlvblR5cGUsIHNldFNlbGVjdGlvblR5cGVdID0gdXNlU3RhdGU8U2VsZWN0aW9uVHlwZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25TdGFydCwgc2V0U2VsZWN0aW9uU3RhcnRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1RvdWNoRHJhZ2dpbmcsIHNldElzVG91Y2hEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGVzLCBzZXREYXRlc10gPSB1c2VTdGF0ZShjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcbiAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgY29uc3QgZ2V0VGltZUZyb21Ub3VjaEV2ZW50ID0gKGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IGNlbGxUb0RhdGUuY3VycmVudC5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBlbmRTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgcHJvcHMub25DaGFuZ2Uoc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudClcbiAgICBzZXRTZWxlY3Rpb25UeXBlKG51bGwpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQobnVsbClcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICBjb25zdCB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCA9IChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsKSA9PiB7XG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbcHJvcHMuc2VsZWN0aW9uU2NoZW1lXShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kLCBkYXRlcylcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICAgIGNvbnNvbGUubG9nKHByb3BzLnNlbGVjdGlvbiwgbmV3U2VsZWN0aW9uLCBuZXh0RHJhZnQpXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xuICAgICAgbmV4dERyYWZ0ID0gbmV4dERyYWZ0LmZpbHRlcihhID0+ICFuZXdTZWxlY3Rpb24uZmluZChiID0+IGlzU2FtZU1pbnV0ZShhLCBiKSkpXG4gICAgfVxuXG4gICAgc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudCA9IG5leHREcmFmdFxuICAgIHNldFNlbGVjdGlvbkRyYWZ0KG5leHREcmFmdClcbiAgfVxuXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XG4gIGNvbnN0IGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSAoc3RhcnRUaW1lOiBEYXRlKSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXJ0VGltZSBjZWxsIGlzIHNlbGVjdGVkL3Vuc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZHJhZy1zZWxlY3Qgc2hvdWxkXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXG4gICAgY29uc3QgdGltZVNlbGVjdGVkID0gcHJvcHMuc2VsZWN0aW9uLmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgc3RhcnRUaW1lKSlcbiAgICBzZXRTZWxlY3Rpb25UeXBlKHRpbWVTZWxlY3RlZCA/ICdyZW1vdmUnIDogJ2FkZCcpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQoc3RhcnRUaW1lKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gKHRpbWU6IERhdGUpID0+IHtcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSB1c2VyIGp1c3QgY2xpY2tzIG9uIGEgc2luZ2xlIGNlbGwgKGJlY2F1c2Ugbm8gbW91c2VlbnRlciBldmVudHMgZmlyZVxuICAgIC8vIGluIHRoaXMgc2NlbmFyaW8pXG4gICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlVXBFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxuICB9XG5cbiAgY29uc3QgaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSAoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpID0+IHtcbiAgICBzZXRJc1RvdWNoRHJhZ2dpbmcodHJ1ZSlcbiAgICBjb25zdCBjZWxsVGltZSA9IGdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcbiAgICBpZiAoY2VsbFRpbWUpIHtcbiAgICAgIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVRvdWNoRW5kRXZlbnQgPSAoKSA9PiB7XG4gICAgaWYgKCFpc1RvdWNoRHJhZ2dpbmcpIHtcbiAgICAgIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZFNlbGVjdGlvbigpXG4gICAgfVxuICAgIHNldElzVG91Y2hEcmFnZ2luZyhmYWxzZSlcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4oc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCB0aW1lKSkpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdyaWRDZWxsXG4gICAgICAgIGNsYXNzTmFtZT1cInJnZHBfX2dyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cbiAgICAgICAgLy8gTW91c2UgaGFuZGxlcnNcbiAgICAgICAgb25Nb3VzZURvd249e3N0YXJ0SGFuZGxlcn1cbiAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiB7XG4gICAgICAgICAgaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VVcD17KCkgPT4ge1xuICAgICAgICAgIGhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICAvLyBUb3VjaCBoYW5kbGVyc1xuICAgICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAgIC8vIGluIHRoZSB0aW1lIHBhcmFtZXRlciwgaW5zdGVhZCB0aGVzZSBoYW5kbGVycyB3aWxsIGRvIHRoZWlyIGpvYiB1c2luZyB0aGUgZGVmYXVsdCBFdmVudFxuICAgICAgICAvLyBwYXJhbWV0ZXJzXG4gICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvblRvdWNoTW92ZT17aGFuZGxlVG91Y2hNb3ZlRXZlbnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e2hhbmRsZVRvdWNoRW5kRXZlbnR9XG4gICAgICA+XG4gICAgICAgIHtyZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCl9XG4gICAgICA8L0dyaWRDZWxsPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHJlZlNldHRlciA9IChkYXRlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcbiAgICAgICAgY2VsbFRvRGF0ZS5jdXJyZW50LnNldChkYXRlQ2VsbCwgdGltZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BzLnJlbmRlckRhdGVDZWxsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIHJlZlNldHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERhdGVDZWxsXG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3Byb3BzLnNlbGVjdGVkQ29sb3IhfVxuICAgICAgICAgIHVuc2VsZWN0ZWRDb2xvcj17cHJvcHMudW5zZWxlY3RlZENvbG9yIX1cbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3Byb3BzLmhvdmVyZWRDb2xvciF9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHByb3BzLnJlbmRlclRpbWVMYWJlbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCBwcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJGdWxsRGF0ZUdyaWQgPSAoKTogQXJyYXk8SlNYLkVsZW1lbnQ+ID0+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gZGF0ZXMubGVuZ3RoXG4gICAgY29uc3QgbnVtVGltZXMgPSBkYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzOyBqICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGF5czsgaSArPSAxKSB7XG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2goZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAocmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IGRhdGVzWzBdW2ldXG4gICAgICAvLyBJbmplY3QgdGhlIHRpbWUgbGFiZWwgYXQgdGhlIHN0YXJ0IG9mIGV2ZXJ5IHJvd1xuICAgICAgZGF0ZUdyaWRFbGVtZW50cy5zcGxpY2UoaW5kZXggKyBpLCAwLCByZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4uZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KHJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KSksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxXcmFwcGVyPlxuICAgICAgPEdyaWRcbiAgICAgICAgY29sdW1ucz17ZGF0ZXMubGVuZ3RofVxuICAgICAgICByb3dzPXtkYXRlc1swXS5sZW5ndGh9XG4gICAgICAgIGNvbHVtbkdhcD17cHJvcHMuY29sdW1uR2FwIX1cbiAgICAgICAgcm93R2FwPXtwcm9wcy5yb3dHYXAhfVxuICAgICAgICByZWY9e2VsID0+IHtcbiAgICAgICAgICBncmlkUmVmLmN1cnJlbnQgPSBlbFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRnVsbERhdGVHcmlkKCl9XG4gICAgICA8L0dyaWQ+XG4gICAgPC9XcmFwcGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlU2VsZWN0b3JcblxuU2NoZWR1bGVTZWxlY3Rvci5kZWZhdWx0UHJvcHMgPSB7XG4gIHNlbGVjdGlvbjogW10sXG4gIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gIG51bURheXM6IDcsXG4gIG1pblRpbWU6IDksXG4gIG1heFRpbWU6IDIzLFxuICBob3VybHlDaHVua3M6IDEsXG4gIHN0YXJ0RGF0ZTogbmV3IERhdGUoKSxcbiAgdGltZUZvcm1hdDogJ2hhJyxcbiAgZGF0ZUZvcm1hdDogJ00vZCcsXG4gIGNvbHVtbkdhcDogJzRweCcsXG4gIHJvd0dhcDogJzRweCcsXG4gIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxuICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcbiAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIG9uQ2hhbmdlOiAoKSA9PiB7fVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLE9BQUEsR0FBQUQsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFJLE9BQUEsR0FBQUosT0FBQTtBQUNBLElBQUFLLE9BQUEsR0FBQUgsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFNLFdBQUEsR0FBQU4sT0FBQTtBQUNBLElBQUFPLFFBQUEsR0FBQVAsT0FBQTtBQUNBLElBQUFRLE9BQUEsR0FBQU4sc0JBQUEsQ0FBQUYsT0FBQTtBQUF3QyxJQUFBUyxlQUFBLEVBQUFDLGdCQUFBLEVB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