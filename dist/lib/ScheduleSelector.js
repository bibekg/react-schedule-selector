"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.default = exports.computeDatesMatrix = exports.ScheduleSelector = exports.GridCell = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _colors = _interopRequireDefault(require("./colors"));
var _react2 = require("@emotion/react");
var _styled = _interopRequireDefault(require("@emotion/styled"));
var _typography = require("./typography");
var _dateFns = require("date-fns");
var _format = _interopRequireDefault(require("date-fns/format"));
var _index = _interopRequireDefault(require("./selection-schemes/index"));
var _utc = require("@date-fns/utc");
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
        currentDay.push(new _utc.UTCDateMini((0, _dateFns.addMinutes)((0, _dateFns.addHours)((0, _dateFns.addDays)(startTime, d), h), c * minutesInChunk).getUTCDate()));
      }
    }
    dates.push(currentDay);
  }
  return dates;
};
exports.computeDatesMatrix = computeDatesMatrix;
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
exports.ScheduleSelector = ScheduleSelector;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9mb3JtYXQiLCJfaW5kZXgiLCJfdXRjIiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnRPZkRheSIsInN0YXJ0RGF0ZSIsImRhdGVzIiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJkIiwibnVtRGF5cyIsImN1cnJlbnREYXkiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsIlVUQ0RhdGVNaW5pIiwiYWRkTWludXRlcyIsImFkZEhvdXJzIiwiYWRkRGF5cyIsImdldFVUQ0RhdGUiLCJTY2hlZHVsZVNlbGVjdG9yIiwic2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMiLCJsaW5lYXIiLCJzZWxlY3Rpb25TY2hlbWVzIiwic3F1YXJlIiwiY2VsbFRvRGF0ZSIsInVzZVJlZiIsIk1hcCIsImdyaWRSZWYiLCJzZWxlY3Rpb25EcmFmdCIsInNldFNlbGVjdGlvbkRyYWZ0IiwidXNlU3RhdGUiLCJzZWxlY3Rpb24iLCJzZWxlY3Rpb25EcmFmdFJlZiIsInNlbGVjdGlvblR5cGUiLCJzZXRTZWxlY3Rpb25UeXBlIiwic2VsZWN0aW9uU3RhcnQiLCJzZXRTZWxlY3Rpb25TdGFydCIsImlzVG91Y2hEcmFnZ2luZyIsInNldElzVG91Y2hEcmFnZ2luZyIsInNldERhdGVzIiwidXNlRWZmZWN0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZW5kU2VsZWN0aW9uIiwiY3VycmVudCIsImZvckVhY2giLCJkYXRlQ2VsbCIsInBhc3NpdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwib25DaGFuZ2UiLCJ1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCIsInNlbGVjdGlvbkVuZCIsIm5ld1NlbGVjdGlvbiIsInNlbGVjdGlvblNjaGVtZSIsIm5leHREcmFmdCIsIkFycmF5IiwiZnJvbSIsIlNldCIsImZpbHRlciIsImEiLCJmaW5kIiwiYiIsImlzU2FtZU1pbnV0ZSIsImhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQiLCJ0aW1lU2VsZWN0ZWQiLCJoYW5kbGVNb3VzZUVudGVyRXZlbnQiLCJ0aW1lIiwiaGFuZGxlTW91c2VVcEV2ZW50IiwiaGFuZGxlVG91Y2hNb3ZlRXZlbnQiLCJoYW5kbGVUb3VjaEVuZEV2ZW50IiwicmVuZGVyRGF0ZUNlbGxXcmFwcGVyIiwic3RhcnRIYW5kbGVyIiwiQm9vbGVhbiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJyb2xlIiwidG9JU09TdHJpbmciLCJvbk1vdXNlRG93biIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VVcCIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwib25Ub3VjaEVuZCIsInJlbmRlckRhdGVDZWxsIiwicmVmU2V0dGVyIiwicmVmIiwicmVuZGVyVGltZUxhYmVsIiwiZm9ybWF0RGF0ZSIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsImNvbmNhdCIsImVsZW1lbnQiLCJlbCIsIl9kZWZhdWx0IiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCB7IGNzcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0J1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnXG5pbXBvcnQgeyBTdWJ0aXRsZSwgVGV4dCB9IGZyb20gJy4vdHlwb2dyYXBoeSdcbmltcG9ydCB7IGFkZERheXMsIGFkZEhvdXJzLCBhZGRNaW51dGVzLCBpc1NhbWVNaW51dGUsIHN0YXJ0T2ZEYXkgfSBmcm9tICdkYXRlLWZucydcbmltcG9ydCBmb3JtYXREYXRlIGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCdcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzL2luZGV4J1xuaW1wb3J0IHsgZm9ybWF0SW5UaW1lWm9uZSwgem9uZWRUaW1lVG9VdGMgfSBmcm9tICdkYXRlLWZucy10eidcbmltcG9ydCB7IFVUQ0RhdGUsIFVUQ0RhdGVNaW5pIH0gZnJvbSAnQGRhdGUtZm5zL3V0YydcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgYH1cbmBcbmludGVyZmFjZSBJR3JpZFByb3BzIHtcbiAgY29sdW1uczogbnVtYmVyXG4gIHJvd3M6IG51bWJlclxuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xufVxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjxJR3JpZFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMuY29sdW1uc30sIDFmcik7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzLnJvd3N9LCAxZnIpO1xuICAgIGNvbHVtbi1nYXA6ICR7cHJvcHMuY29sdW1uR2FwfTtcbiAgICByb3ctZ2FwOiAke3Byb3BzLnJvd0dhcH07XG4gICAgd2lkdGg6IDEwMCU7XG4gIGB9XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gICAgdG91Y2gtYWN0aW9uOiBub25lO1xuICBgfVxuYFxuXG5pbnRlcmZhY2UgSURhdGVDZWxsUHJvcHMge1xuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PElEYXRlQ2VsbFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAyNXB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yfTtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYH1cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgJHtjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICAgIG1hcmdpbjogMDtcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGB9XG5gXG5cbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICB9XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICBgfVxuYFxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWludGVyZmFjZVxuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVTZWxlY3RvclByb3BzIHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIHN0YXJ0RGF0ZTogRGF0ZVxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcD86IHN0cmluZ1xuICByb3dHYXA/OiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yPzogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yPzogc3RyaW5nXG4gIHJlbmRlckRhdGVDZWxsPzogKGRhdGV0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5leHBvcnQgY29uc3QgY29tcHV0ZURhdGVzTWF0cml4ID0gKHByb3BzOiBJU2NoZWR1bGVTZWxlY3RvclByb3BzKTogQXJyYXk8QXJyYXk8RGF0ZT4+ID0+IHtcbiAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpXG4gIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG4gIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XG4gICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPCBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgY3VycmVudERheS5wdXNoKFxuICAgICAgICAgIG5ldyBVVENEYXRlTWluaShhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykuZ2V0VVRDRGF0ZSgpKVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgfVxuICByZXR1cm4gZGF0ZXNcbn1cblxuZXhwb3J0IGNvbnN0IFNjaGVkdWxlU2VsZWN0b3I6IFJlYWN0LkZDPElTY2hlZHVsZVNlbGVjdG9yUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCBzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgfVxuICBjb25zdCBjZWxsVG9EYXRlID0gdXNlUmVmPE1hcDxFbGVtZW50LCBEYXRlPj4obmV3IE1hcCgpKVxuICBjb25zdCBncmlkUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbClcblxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcbiAgY29uc3QgW3NlbGVjdGlvblR5cGUsIHNldFNlbGVjdGlvblR5cGVdID0gdXNlU3RhdGU8U2VsZWN0aW9uVHlwZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25TdGFydCwgc2V0U2VsZWN0aW9uU3RhcnRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1RvdWNoRHJhZ2dpbmcsIHNldElzVG91Y2hEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGVzLCBzZXREYXRlc10gPSB1c2VTdGF0ZShjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcbiAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgY29uc3QgZ2V0VGltZUZyb21Ub3VjaEV2ZW50ID0gKGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IGNlbGxUb0RhdGUuY3VycmVudC5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBlbmRTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgcHJvcHMub25DaGFuZ2Uoc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudClcbiAgICBzZXRTZWxlY3Rpb25UeXBlKG51bGwpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQobnVsbClcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICBjb25zdCB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCA9IChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsKSA9PiB7XG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbcHJvcHMuc2VsZWN0aW9uU2NoZW1lXShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kLCBkYXRlcylcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25EcmFmdFJlZi5jdXJyZW50ID0gbmV4dERyYWZ0XG4gICAgc2V0U2VsZWN0aW9uRHJhZnQobmV4dERyYWZ0KVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgY29uc3QgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IChzdGFydFRpbWU6IERhdGUpID0+IHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSBwcm9wcy5zZWxlY3Rpb24uZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIHNldFNlbGVjdGlvblR5cGUodGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJylcbiAgICBzZXRTZWxlY3Rpb25TdGFydChzdGFydFRpbWUpXG4gIH1cblxuICBjb25zdCBoYW5kbGVNb3VzZUVudGVyRXZlbnQgPSAodGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VVcEV2ZW50ID0gKHRpbWU6IERhdGUpID0+IHtcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaE1vdmVFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIHNldElzVG91Y2hEcmFnZ2luZyh0cnVlKVxuICAgIGNvbnN0IGNlbGxUaW1lID0gZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVG91Y2hFbmRFdmVudCA9ICgpID0+IHtcbiAgICBpZiAoIWlzVG91Y2hEcmFnZ2luZykge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbClcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgc2V0SXNUb3VjaERyYWdnaW5nKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbihzZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgICBvbk1vdXNlRG93bj17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XG4gICAgICAgICAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uVG91Y2hNb3ZlPXtoYW5kbGVUb3VjaE1vdmVFdmVudH1cbiAgICAgICAgb25Ub3VjaEVuZD17aGFuZGxlVG91Y2hFbmRFdmVudH1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgcmVmU2V0dGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUNlbGxcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XG4gICAgICAgICAgcmVmPXtyZWZTZXR0ZXJ9XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cHJvcHMuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXtwcm9wcy51bnNlbGVjdGVkQ29sb3IhfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17cHJvcHMuaG92ZXJlZENvbG9yIX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdERhdGUodGltZSwgcHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXREYXRlKGRhdGUsIHByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlckZ1bGxEYXRlR3JpZCA9ICgpOiBBcnJheTxKU1guRWxlbWVudD4gPT4ge1xuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxuICAgIGNvbnN0IG51bURheXMgPSBkYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IGRhdGVzWzBdLmxlbmd0aFxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXM7IGogKz0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaChkYXRlc1tpXVtqXSlcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZGF0ZUdyaWRFbGVtZW50cyA9IGZsYXR0ZW5lZERhdGVzLm1hcChyZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHJlbmRlclRpbWVMYWJlbCh0aW1lKSlcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgIC8vIEVtcHR5IHRvcCBsZWZ0IGNvcm5lclxuICAgICAgPGRpdiBrZXk9XCJ0b3BsZWZ0XCIgLz4sXG4gICAgICAvLyBUb3Agcm93IG9mIGRhdGVzXG4gICAgICAuLi5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQocmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pKSxcbiAgICAgIC8vIEV2ZXJ5IHJvdyBhZnRlciB0aGF0XG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKVxuICAgIF1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFdyYXBwZXI+XG4gICAgICA8R3JpZFxuICAgICAgICBjb2x1bW5zPXtkYXRlcy5sZW5ndGh9XG4gICAgICAgIHJvd3M9e2RhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgY29sdW1uR2FwPXtwcm9wcy5jb2x1bW5HYXAhfVxuICAgICAgICByb3dHYXA9e3Byb3BzLnJvd0dhcCF9XG4gICAgICAgIHJlZj17ZWwgPT4ge1xuICAgICAgICAgIGdyaWRSZWYuY3VycmVudCA9IGVsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtyZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgIDwvR3JpZD5cbiAgICA8L1dyYXBwZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NoZWR1bGVTZWxlY3RvclxuXG5TY2hlZHVsZVNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgc2VsZWN0aW9uOiBbXSxcbiAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcbiAgbnVtRGF5czogNyxcbiAgbWluVGltZTogOSxcbiAgbWF4VGltZTogMjMsXG4gIGhvdXJseUNodW5rczogMSxcbiAgc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICB0aW1lRm9ybWF0OiAnaGEnLFxuICBkYXRlRm9ybWF0OiAnTS9kJyxcbiAgY29sdW1uR2FwOiAnNHB4JyxcbiAgcm93R2FwOiAnNHB4JyxcbiAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gIHVuc2VsZWN0ZWRDb2xvcjogY29sb3JzLnBhbGVCbHVlLFxuICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgb25DaGFuZ2U6ICgpID0+IHt9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsT0FBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsT0FBQSxHQUFBSCxPQUFBO0FBQ0EsSUFBQUksT0FBQSxHQUFBRixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUssV0FBQSxHQUFBTCxPQUFBO0FBQ0EsSUFBQU0sUUFBQSxH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