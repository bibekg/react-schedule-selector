"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.default = exports.ScheduleSelector = exports.GridCell = void 0;
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
  const startTime = new _utc.UTCDate((0, _dateFns.startOfDay)(props.startDate));
  console.log('startTime', startTime.toISOString());
  const dates = [];
  const minutesInChunk = Math.floor(60 / props.hourlyChunks);
  for (let d = 0; d < props.numDays; d += 1) {
    const currentDay = [];
    for (let h = props.minTime; h < props.maxTime; h += 1) {
      for (let c = 0; c < props.hourlyChunks; c += 1) {
        const newDate = new _utc.UTCDate((0, _dateFns.addMinutes)((0, _dateFns.addHours)((0, _dateFns.addDays)(startTime, d), h), c * minutesInChunk));
        currentDay.push(newDate);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9mb3JtYXQiLCJfaW5kZXgiLCJfdXRjIiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwiVVRDRGF0ZSIsInN0YXJ0T2ZEYXkiLCJzdGFydERhdGUiLCJjb25zb2xlIiwibG9nIiwidG9JU09TdHJpbmciLCJkYXRlcyIsIm1pbnV0ZXNJbkNodW5rIiwiTWF0aCIsImZsb29yIiwiaG91cmx5Q2h1bmtzIiwiZCIsIm51bURheXMiLCJjdXJyZW50RGF5IiwiaCIsIm1pblRpbWUiLCJtYXhUaW1lIiwiYyIsIm5ld0RhdGUiLCJhZGRNaW51dGVzIiwiYWRkSG91cnMiLCJhZGREYXlzIiwicHVzaCIsIlNjaGVkdWxlU2VsZWN0b3IiLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJjZWxsVG9EYXRlIiwidXNlUmVmIiwiTWFwIiwiZ3JpZFJlZiIsInNlbGVjdGlvbkRyYWZ0Iiwic2V0U2VsZWN0aW9uRHJhZnQiLCJ1c2VTdGF0ZSIsInNlbGVjdGlvbiIsInNlbGVjdGlvbkRyYWZ0UmVmIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmRTZWxlY3Rpb24iLCJjdXJyZW50IiwiZm9yRWFjaCIsImRhdGVDZWxsIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJvbkNoYW5nZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYSIsImZpbmQiLCJiIiwiaXNTYW1lTWludXRlIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsInRpbWVTZWxlY3RlZCIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsInRpbWUiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJzdGFydEhhbmRsZXIiLCJCb29sZWFuIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJvbGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VVcCIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwib25Ub3VjaEVuZCIsInJlbmRlckRhdGVDZWxsIiwicmVmU2V0dGVyIiwicmVmIiwicmVuZGVyVGltZUxhYmVsIiwiZm9ybWF0RGF0ZSIsInRpbWVGb3JtYXQiLCJyZW5kZXJEYXRlTGFiZWwiLCJkYXRlIiwiZGF0ZUZvcm1hdCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsImNvbmNhdCIsImVsZW1lbnQiLCJlbCIsIl9kZWZhdWx0IiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCB7IGNzcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0J1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnXG5pbXBvcnQgeyBTdWJ0aXRsZSwgVGV4dCB9IGZyb20gJy4vdHlwb2dyYXBoeSdcbmltcG9ydCB7IGFkZERheXMsIGFkZEhvdXJzLCBhZGRNaW51dGVzLCBpc1NhbWVNaW51dGUsIHN0YXJ0T2ZEYXkgfSBmcm9tICdkYXRlLWZucydcbmltcG9ydCBmb3JtYXREYXRlIGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCdcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzL2luZGV4J1xuaW1wb3J0IHsgZm9ybWF0SW5UaW1lWm9uZSwgem9uZWRUaW1lVG9VdGMgfSBmcm9tICdkYXRlLWZucy10eidcbmltcG9ydCB7IFVUQ0RhdGUsIFVUQ0RhdGVNaW5pIH0gZnJvbSAnQGRhdGUtZm5zL3V0YydcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgYH1cbmBcbmludGVyZmFjZSBJR3JpZFByb3BzIHtcbiAgY29sdW1uczogbnVtYmVyXG4gIHJvd3M6IG51bWJlclxuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xufVxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjxJR3JpZFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMuY29sdW1uc30sIDFmcik7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzLnJvd3N9LCAxZnIpO1xuICAgIGNvbHVtbi1nYXA6ICR7cHJvcHMuY29sdW1uR2FwfTtcbiAgICByb3ctZ2FwOiAke3Byb3BzLnJvd0dhcH07XG4gICAgd2lkdGg6IDEwMCU7XG4gIGB9XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gICAgdG91Y2gtYWN0aW9uOiBub25lO1xuICBgfVxuYFxuXG5pbnRlcmZhY2UgSURhdGVDZWxsUHJvcHMge1xuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PElEYXRlQ2VsbFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAyNXB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yfTtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYH1cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgJHtjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICAgIG1hcmdpbjogMDtcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGB9XG5gXG5cbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICB9XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICBgfVxuYFxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWludGVyZmFjZVxuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVTZWxlY3RvclByb3BzIHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIHN0YXJ0RGF0ZTogRGF0ZSB8IFVUQ0RhdGVcbiAgbnVtRGF5czogbnVtYmVyXG4gIG1pblRpbWU6IG51bWJlclxuICBtYXhUaW1lOiBudW1iZXJcbiAgaG91cmx5Q2h1bmtzOiBudW1iZXJcbiAgZGF0ZUZvcm1hdDogc3RyaW5nXG4gIHRpbWVGb3JtYXQ6IHN0cmluZ1xuICBjb2x1bW5HYXA/OiBzdHJpbmdcbiAgcm93R2FwPzogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcj86IHN0cmluZ1xuICBzZWxlY3RlZENvbG9yPzogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcj86IHN0cmluZ1xuICByZW5kZXJEYXRlQ2VsbD86IChkYXRldGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4sIHJlZlNldHRlcjogKGRhdGVDZWxsRWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWQpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlclRpbWVMYWJlbD86ICh0aW1lOiBEYXRlKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJEYXRlTGFiZWw/OiAoZGF0ZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbn1cblxuZXhwb3J0IGNvbnN0IHByZXZlbnRTY3JvbGwgPSAoZTogVG91Y2hFdmVudCkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuY29uc3QgY29tcHV0ZURhdGVzTWF0cml4ID0gKHByb3BzOiBJU2NoZWR1bGVTZWxlY3RvclByb3BzKTogQXJyYXk8QXJyYXk8RGF0ZT4+ID0+IHtcbiAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IFVUQ0RhdGUoc3RhcnRPZkRheShwcm9wcy5zdGFydERhdGUpKVxuICBjb25zb2xlLmxvZygnc3RhcnRUaW1lJywgc3RhcnRUaW1lLnRvSVNPU3RyaW5nKCkpXG4gIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG4gIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XG4gICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPCBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgY29uc3QgbmV3RGF0ZSA9IG5ldyBVVENEYXRlKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgY3VycmVudERheS5wdXNoKG5ld0RhdGUpXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgfVxuICByZXR1cm4gZGF0ZXNcbn1cblxuZXhwb3J0IGNvbnN0IFNjaGVkdWxlU2VsZWN0b3I6IFJlYWN0LkZDPElTY2hlZHVsZVNlbGVjdG9yUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCBzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgfVxuICBjb25zdCBjZWxsVG9EYXRlID0gdXNlUmVmPE1hcDxFbGVtZW50LCBEYXRlPj4obmV3IE1hcCgpKVxuICBjb25zdCBncmlkUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbClcblxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcbiAgY29uc3QgW3NlbGVjdGlvblR5cGUsIHNldFNlbGVjdGlvblR5cGVdID0gdXNlU3RhdGU8U2VsZWN0aW9uVHlwZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25TdGFydCwgc2V0U2VsZWN0aW9uU3RhcnRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1RvdWNoRHJhZ2dpbmcsIHNldElzVG91Y2hEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGVzLCBzZXREYXRlc10gPSB1c2VTdGF0ZShjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcbiAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgY29uc3QgZ2V0VGltZUZyb21Ub3VjaEV2ZW50ID0gKGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IGNlbGxUb0RhdGUuY3VycmVudC5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBlbmRTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgcHJvcHMub25DaGFuZ2Uoc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudClcbiAgICBzZXRTZWxlY3Rpb25UeXBlKG51bGwpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQobnVsbClcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICBjb25zdCB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCA9IChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsKSA9PiB7XG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbcHJvcHMuc2VsZWN0aW9uU2NoZW1lXShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kLCBkYXRlcylcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25EcmFmdFJlZi5jdXJyZW50ID0gbmV4dERyYWZ0XG4gICAgc2V0U2VsZWN0aW9uRHJhZnQobmV4dERyYWZ0KVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgY29uc3QgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IChzdGFydFRpbWU6IERhdGUpID0+IHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSBwcm9wcy5zZWxlY3Rpb24uZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIHNldFNlbGVjdGlvblR5cGUodGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJylcbiAgICBzZXRTZWxlY3Rpb25TdGFydChzdGFydFRpbWUpXG4gIH1cblxuICBjb25zdCBoYW5kbGVNb3VzZUVudGVyRXZlbnQgPSAodGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VVcEV2ZW50ID0gKHRpbWU6IERhdGUpID0+IHtcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaE1vdmVFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIHNldElzVG91Y2hEcmFnZ2luZyh0cnVlKVxuICAgIGNvbnN0IGNlbGxUaW1lID0gZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVG91Y2hFbmRFdmVudCA9ICgpID0+IHtcbiAgICBpZiAoIWlzVG91Y2hEcmFnZ2luZykge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbClcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgc2V0SXNUb3VjaERyYWdnaW5nKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbihzZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgICBvbk1vdXNlRG93bj17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XG4gICAgICAgICAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uVG91Y2hNb3ZlPXtoYW5kbGVUb3VjaE1vdmVFdmVudH1cbiAgICAgICAgb25Ub3VjaEVuZD17aGFuZGxlVG91Y2hFbmRFdmVudH1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgcmVmU2V0dGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUNlbGxcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XG4gICAgICAgICAgcmVmPXtyZWZTZXR0ZXJ9XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cHJvcHMuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXtwcm9wcy51bnNlbGVjdGVkQ29sb3IhfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17cHJvcHMuaG92ZXJlZENvbG9yIX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdERhdGUodGltZSwgcHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXREYXRlKGRhdGUsIHByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlckZ1bGxEYXRlR3JpZCA9ICgpOiBBcnJheTxKU1guRWxlbWVudD4gPT4ge1xuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxuICAgIGNvbnN0IG51bURheXMgPSBkYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IGRhdGVzWzBdLmxlbmd0aFxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXM7IGogKz0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaChkYXRlc1tpXVtqXSlcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZGF0ZUdyaWRFbGVtZW50cyA9IGZsYXR0ZW5lZERhdGVzLm1hcChyZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHJlbmRlclRpbWVMYWJlbCh0aW1lKSlcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgIC8vIEVtcHR5IHRvcCBsZWZ0IGNvcm5lclxuICAgICAgPGRpdiBrZXk9XCJ0b3BsZWZ0XCIgLz4sXG4gICAgICAvLyBUb3Agcm93IG9mIGRhdGVzXG4gICAgICAuLi5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQocmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pKSxcbiAgICAgIC8vIEV2ZXJ5IHJvdyBhZnRlciB0aGF0XG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKVxuICAgIF1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFdyYXBwZXI+XG4gICAgICA8R3JpZFxuICAgICAgICBjb2x1bW5zPXtkYXRlcy5sZW5ndGh9XG4gICAgICAgIHJvd3M9e2RhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgY29sdW1uR2FwPXtwcm9wcy5jb2x1bW5HYXAhfVxuICAgICAgICByb3dHYXA9e3Byb3BzLnJvd0dhcCF9XG4gICAgICAgIHJlZj17ZWwgPT4ge1xuICAgICAgICAgIGdyaWRSZWYuY3VycmVudCA9IGVsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtyZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgIDwvR3JpZD5cbiAgICA8L1dyYXBwZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NoZWR1bGVTZWxlY3RvclxuXG5TY2hlZHVsZVNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgc2VsZWN0aW9uOiBbXSxcbiAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcbiAgbnVtRGF5czogNyxcbiAgbWluVGltZTogOSxcbiAgbWF4VGltZTogMjMsXG4gIGhvdXJseUNodW5rczogMSxcbiAgc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICB0aW1lRm9ybWF0OiAnaGEnLFxuICBkYXRlRm9ybWF0OiAnTS9kJyxcbiAgY29sdW1uR2FwOiAnNHB4JyxcbiAgcm93R2FwOiAnNHB4JyxcbiAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gIHVuc2VsZWN0ZWRDb2xvcjogY29sb3JzLnBhbGVCbHVlLFxuICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgb25DaGFuZ2U6ICgpID0+IHt9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsT0FBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsT0FBQSxHQUFBSCxPQUFBO0FBQ0EsSUFBQUks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