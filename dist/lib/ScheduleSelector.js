"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventScroll = exports.default = exports.GridCell = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _colors = _interopRequireDefault(require("./colors"));
var _react2 = require("@emotion/react");
var _styled = _interopRequireDefault(require("@emotion/styled"));
var _typography = require("./typography");
var _dateFns = require("date-fns");
var _format = _interopRequireDefault(require("date-fns/format"));
var _index = _interopRequireDefault(require("./selection-schemes/index"));
var _dateFnsTz = require("date-fns-tz");
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
        currentDay.push((0, _dateFnsTz.zonedTimeToUtc)((0, _dateFns.addMinutes)((0, _dateFns.addHours)((0, _dateFns.addDays)(startTime, d), h), c * minutesInChunk), 'UTC'));
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
      return /*#__PURE__*/_react.default.createElement(DateLabel, null, (0, _format.default)(date.getUTCDate(), props.dateFormat));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9mb3JtYXQiLCJfaW5kZXgiLCJfZGF0ZUZuc1R6IiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnRPZkRheSIsInN0YXJ0RGF0ZSIsImRhdGVzIiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJkIiwibnVtRGF5cyIsImN1cnJlbnREYXkiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsInpvbmVkVGltZVRvVXRjIiwiYWRkTWludXRlcyIsImFkZEhvdXJzIiwiYWRkRGF5cyIsIlNjaGVkdWxlU2VsZWN0b3IiLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJjZWxsVG9EYXRlIiwidXNlUmVmIiwiTWFwIiwiZ3JpZFJlZiIsInNlbGVjdGlvbkRyYWZ0Iiwic2V0U2VsZWN0aW9uRHJhZnQiLCJ1c2VTdGF0ZSIsInNlbGVjdGlvbiIsInNlbGVjdGlvbkRyYWZ0UmVmIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmRTZWxlY3Rpb24iLCJjdXJyZW50IiwiZm9yRWFjaCIsImRhdGVDZWxsIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJvbkNoYW5nZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYSIsImZpbmQiLCJiIiwiaXNTYW1lTWludXRlIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsInRpbWVTZWxlY3RlZCIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsInRpbWUiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJzdGFydEhhbmRsZXIiLCJCb29sZWFuIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJvbGUiLCJ0b0lTT1N0cmluZyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZVVwIiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJvblRvdWNoRW5kIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJyZWYiLCJyZW5kZXJUaW1lTGFiZWwiLCJmb3JtYXREYXRlIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJnZXRVVENEYXRlIiwiZGF0ZUZvcm1hdCIsInJlbmRlckZ1bGxEYXRlR3JpZCIsImZsYXR0ZW5lZERhdGVzIiwibnVtVGltZXMiLCJqIiwiaSIsImRhdGVHcmlkRWxlbWVudHMiLCJtYXAiLCJpbmRleCIsInNwbGljZSIsImRheU9mVGltZXMiLCJSZWFjdCIsImNsb25lRWxlbWVudCIsImNvbmNhdCIsImVsZW1lbnQiLCJlbCIsIl9kZWZhdWx0IiwiZGVmYXVsdFByb3BzIiwiRGF0ZSIsImNvbG9ycyIsImJsdWUiLCJwYWxlQmx1ZSIsImxpZ2h0Qmx1ZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvU2NoZWR1bGVTZWxlY3Rvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycydcbmltcG9ydCB7IGNzcyB9IGZyb20gJ0BlbW90aW9uL3JlYWN0J1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnXG5pbXBvcnQgeyBTdWJ0aXRsZSwgVGV4dCB9IGZyb20gJy4vdHlwb2dyYXBoeSdcbmltcG9ydCB7IGFkZERheXMsIGFkZEhvdXJzLCBhZGRNaW51dGVzLCBpc1NhbWVNaW51dGUsIHN0YXJ0T2ZEYXkgfSBmcm9tICdkYXRlLWZucydcbmltcG9ydCBmb3JtYXREYXRlIGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCdcbmltcG9ydCBzZWxlY3Rpb25TY2hlbWVzLCB7IFNlbGVjdGlvblNjaGVtZVR5cGUsIFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL3NlbGVjdGlvbi1zY2hlbWVzL2luZGV4J1xuaW1wb3J0IHsgem9uZWRUaW1lVG9VdGMgfSBmcm9tICdkYXRlLWZucy10eidcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgYH1cbmBcbmludGVyZmFjZSBJR3JpZFByb3BzIHtcbiAgY29sdW1uczogbnVtYmVyXG4gIHJvd3M6IG51bWJlclxuICBjb2x1bW5HYXA6IHN0cmluZ1xuICByb3dHYXA6IHN0cmluZ1xufVxuXG5jb25zdCBHcmlkID0gc3R5bGVkLmRpdjxJR3JpZFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gcmVwZWF0KCR7cHJvcHMuY29sdW1uc30sIDFmcik7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIHJlcGVhdCgke3Byb3BzLnJvd3N9LCAxZnIpO1xuICAgIGNvbHVtbi1nYXA6ICR7cHJvcHMuY29sdW1uR2FwfTtcbiAgICByb3ctZ2FwOiAke3Byb3BzLnJvd0dhcH07XG4gICAgd2lkdGg6IDEwMCU7XG4gIGB9XG5gXG5cbmV4cG9ydCBjb25zdCBHcmlkQ2VsbCA9IHN0eWxlZC5kaXZgXG4gICR7Y3NzYFxuICAgIHBsYWNlLXNlbGY6IHN0cmV0Y2g7XG4gICAgdG91Y2gtYWN0aW9uOiBub25lO1xuICBgfVxuYFxuXG5pbnRlcmZhY2UgSURhdGVDZWxsUHJvcHMge1xuICBzZWxlY3RlZDogYm9vbGVhblxuICBzZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yOiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yOiBzdHJpbmdcbn1cblxuY29uc3QgRGF0ZUNlbGwgPSBzdHlsZWQuZGl2PElEYXRlQ2VsbFByb3BzPmBcbiAgJHtwcm9wcyA9PiBjc3NgXG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAyNXB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuc2VsZWN0ZWQgPyBwcm9wcy5zZWxlY3RlZENvbG9yIDogcHJvcHMudW5zZWxlY3RlZENvbG9yfTtcblxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5ob3ZlcmVkQ29sb3J9O1xuICAgIH1cbiAgYH1cbmBcblxuY29uc3QgRGF0ZUxhYmVsID0gc3R5bGVkKFN1YnRpdGxlKWBcbiAgJHtjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICAgIG1hcmdpbjogMDtcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIGB9XG5gXG5cbmNvbnN0IFRpbWVUZXh0ID0gc3R5bGVkKFRleHQpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICB9XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICBgfVxuYFxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWludGVyZmFjZVxuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVTZWxlY3RvclByb3BzIHtcbiAgc2VsZWN0aW9uOiBBcnJheTxEYXRlPlxuICBzZWxlY3Rpb25TY2hlbWU6IFNlbGVjdGlvblNjaGVtZVR5cGVcbiAgb25DaGFuZ2U6IChuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+KSA9PiB2b2lkXG4gIHN0YXJ0RGF0ZTogRGF0ZVxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcD86IHN0cmluZ1xuICByb3dHYXA/OiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yPzogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yPzogc3RyaW5nXG4gIHJlbmRlckRhdGVDZWxsPzogKGRhdGV0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5jb25zdCBjb21wdXRlRGF0ZXNNYXRyaXggPSAocHJvcHM6IElTY2hlZHVsZVNlbGVjdG9yUHJvcHMpOiBBcnJheTxBcnJheTxEYXRlPj4gPT4ge1xuICBjb25zdCBzdGFydFRpbWUgPSBzdGFydE9mRGF5KHByb3BzLnN0YXJ0RGF0ZSlcbiAgY29uc3QgZGF0ZXM6IEFycmF5PEFycmF5PERhdGU+PiA9IFtdXG4gIGNvbnN0IG1pbnV0ZXNJbkNodW5rID0gTWF0aC5mbG9vcig2MCAvIHByb3BzLmhvdXJseUNodW5rcylcbiAgZm9yIChsZXQgZCA9IDA7IGQgPCBwcm9wcy5udW1EYXlzOyBkICs9IDEpIHtcbiAgICBjb25zdCBjdXJyZW50RGF5ID0gW11cbiAgICBmb3IgKGxldCBoID0gcHJvcHMubWluVGltZTsgaCA8IHByb3BzLm1heFRpbWU7IGggKz0gMSkge1xuICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBwcm9wcy5ob3VybHlDaHVua3M7IGMgKz0gMSkge1xuICAgICAgICBjdXJyZW50RGF5LnB1c2goem9uZWRUaW1lVG9VdGMoYWRkTWludXRlcyhhZGRIb3VycyhhZGREYXlzKHN0YXJ0VGltZSwgZCksIGgpLCBjICogbWludXRlc0luQ2h1bmspLCAnVVRDJykpXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgfVxuICByZXR1cm4gZGF0ZXNcbn1cblxuY29uc3QgU2NoZWR1bGVTZWxlY3RvcjogUmVhY3QuRkM8SVNjaGVkdWxlU2VsZWN0b3JQcm9wcz4gPSBwcm9wcyA9PiB7XG4gIGNvbnN0IHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzID0ge1xuICAgIGxpbmVhcjogc2VsZWN0aW9uU2NoZW1lcy5saW5lYXIsXG4gICAgc3F1YXJlOiBzZWxlY3Rpb25TY2hlbWVzLnNxdWFyZVxuICB9XG4gIGNvbnN0IGNlbGxUb0RhdGUgPSB1c2VSZWY8TWFwPEVsZW1lbnQsIERhdGU+PihuZXcgTWFwKCkpXG4gIGNvbnN0IGdyaWRSZWYgPSB1c2VSZWY8SFRNTEVsZW1lbnQgfCBudWxsPihudWxsKVxuXG4gIGNvbnN0IFtzZWxlY3Rpb25EcmFmdCwgc2V0U2VsZWN0aW9uRHJhZnRdID0gdXNlU3RhdGUoWy4uLnByb3BzLnNlbGVjdGlvbl0pXG4gIGNvbnN0IHNlbGVjdGlvbkRyYWZ0UmVmID0gdXNlUmVmKHNlbGVjdGlvbkRyYWZ0KVxuICBjb25zdCBbc2VsZWN0aW9uVHlwZSwgc2V0U2VsZWN0aW9uVHlwZV0gPSB1c2VTdGF0ZTxTZWxlY3Rpb25UeXBlIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW3NlbGVjdGlvblN0YXJ0LCBzZXRTZWxlY3Rpb25TdGFydF0gPSB1c2VTdGF0ZTxEYXRlIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW2lzVG91Y2hEcmFnZ2luZywgc2V0SXNUb3VjaERyYWdnaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZGF0ZXMsIHNldERhdGVzXSA9IHVzZVN0YXRlKGNvbXB1dGVEYXRlc01hdHJpeChwcm9wcykpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBXZSBuZWVkIHRvIGFkZCB0aGUgZW5kU2VsZWN0aW9uIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCBpdHNlbGYgaW4gb3JkZXJcbiAgICAvLyB0byBjYXRjaCB0aGUgY2FzZXMgd2hlcmUgdGhlIHVzZXJzIGVuZHMgdGhlaXIgbW91c2UtY2xpY2sgc29tZXdoZXJlIGJlc2lkZXNcbiAgICAvLyB0aGUgZGF0ZSBjZWxscyAoaW4gd2hpY2ggY2FzZSBub25lIG9mIHRoZSBEYXRlQ2VsbCdzIG9uTW91c2VVcCBoYW5kbGVycyB3b3VsZCBmaXJlKVxuICAgIC8vXG4gICAgLy8gVGhpcyBpc24ndCBuZWNlc3NhcnkgZm9yIHRvdWNoIGV2ZW50cyBzaW5jZSB0aGUgYHRvdWNoZW5kYCBldmVudCBmaXJlcyBvblxuICAgIC8vIHRoZSBlbGVtZW50IHdoZXJlIHRoZSB0b3VjaC9kcmFnIHN0YXJ0ZWQgc28gaXQncyBhbHdheXMgY2F1Z2h0LlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmRTZWxlY3Rpb24pXG5cbiAgICAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gdXNlciBpcyBkcmFnZ2luZyBvbiB0aGUgZGF0ZSBjZWxsc1xuICAgIGNlbGxUb0RhdGUuY3VycmVudC5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBkYXRlQ2VsbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsLCB7IHBhc3NpdmU6IGZhbHNlIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kU2VsZWN0aW9uKVxuICAgICAgY2VsbFRvRGF0ZS5jdXJyZW50LmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgZGF0ZUNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIC8vIFBlcmZvcm1zIGEgbG9va3VwIGludG8gdGhpcy5jZWxsVG9EYXRlIHRvIHJldHJpZXZlIHRoZSBEYXRlIHRoYXQgY29ycmVzcG9uZHMgdG9cbiAgLy8gdGhlIGNlbGwgd2hlcmUgdGhpcyB0b3VjaCBldmVudCBpcyByaWdodCBub3cuIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCB3aWxsIG9ubHkgd29ya1xuICAvLyBpZiB0aGUgZXZlbnQgaXMgYSBgdG91Y2htb3ZlYCBldmVudCBzaW5jZSBpdCdzIHRoZSBvbmx5IG9uZSB0aGF0IGhhcyBhIGB0b3VjaGVzYCBsaXN0LlxuICBjb25zdCBnZXRUaW1lRnJvbVRvdWNoRXZlbnQgPSAoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQ8YW55Pik6IERhdGUgfCBudWxsID0+IHtcbiAgICBjb25zdCB7IHRvdWNoZXMgfSA9IGV2ZW50XG4gICAgaWYgKCF0b3VjaGVzIHx8IHRvdWNoZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IHsgY2xpZW50WCwgY2xpZW50WSB9ID0gdG91Y2hlc1swXVxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNlbGxUaW1lID0gY2VsbFRvRGF0ZS5jdXJyZW50LmdldCh0YXJnZXRFbGVtZW50KVxuICAgICAgcmV0dXJuIGNlbGxUaW1lID8/IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IGVuZFNlbGVjdGlvbiA9ICgpID0+IHtcbiAgICBwcm9wcy5vbkNoYW5nZShzZWxlY3Rpb25EcmFmdFJlZi5jdXJyZW50KVxuICAgIHNldFNlbGVjdGlvblR5cGUobnVsbClcbiAgICBzZXRTZWxlY3Rpb25TdGFydChudWxsKVxuICB9XG5cbiAgLy8gR2l2ZW4gYW4gZW5kaW5nIERhdGUsIGRldGVybWluZXMgYWxsIHRoZSBkYXRlcyB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBpbiB0aGlzIGRyYWZ0XG4gIGNvbnN0IHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0ID0gKHNlbGVjdGlvbkVuZDogRGF0ZSB8IG51bGwpID0+IHtcbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gbnVsbCB8fCBzZWxlY3Rpb25TdGFydCA9PT0gbnVsbCkgcmV0dXJuXG5cbiAgICBsZXQgbmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPiA9IFtdXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0ICYmIHNlbGVjdGlvbkVuZCAmJiBzZWxlY3Rpb25UeXBlKSB7XG4gICAgICBuZXdTZWxlY3Rpb24gPSBzZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1twcm9wcy5zZWxlY3Rpb25TY2hlbWVdKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQsIGRhdGVzKVxuICAgIH1cblxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4ucHJvcHMuc2VsZWN0aW9uXVxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxuICAgIH1cblxuICAgIHNlbGVjdGlvbkRyYWZ0UmVmLmN1cnJlbnQgPSBuZXh0RHJhZnRcbiAgICBzZXRTZWxlY3Rpb25EcmFmdChuZXh0RHJhZnQpXG4gIH1cblxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxuICBjb25zdCBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50ID0gKHN0YXJ0VGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xuICAgIGNvbnN0IHRpbWVTZWxlY3RlZCA9IHByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgc2V0U2VsZWN0aW9uVHlwZSh0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnKVxuICAgIHNldFNlbGVjdGlvblN0YXJ0KHN0YXJ0VGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlRW50ZXJFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxuICAgIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gIH1cblxuICBjb25zdCBoYW5kbGVNb3VzZVVwRXZlbnQgPSAodGltZTogRGF0ZSkgPT4ge1xuICAgIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KHRpbWUpXG4gICAgLy8gRG9uJ3QgY2FsbCB0aGlzLmVuZFNlbGVjdGlvbigpIGhlcmUgYmVjYXVzZSB0aGUgZG9jdW1lbnQgbW91c2V1cCBoYW5kbGVyIHdpbGwgZG8gaXRcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVRvdWNoTW92ZUV2ZW50ID0gKGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50KSA9PiB7XG4gICAgc2V0SXNUb3VjaERyYWdnaW5nKHRydWUpXG4gICAgY29uc3QgY2VsbFRpbWUgPSBnZXRUaW1lRnJvbVRvdWNoRXZlbnQoZXZlbnQpXG4gICAgaWYgKGNlbGxUaW1lKSB7XG4gICAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChjZWxsVGltZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaEVuZEV2ZW50ID0gKCkgPT4ge1xuICAgIGlmICghaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdChudWxsKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbmRTZWxlY3Rpb24oKVxuICAgIH1cbiAgICBzZXRJc1RvdWNoRHJhZ2dpbmcoZmFsc2UpXG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlQ2VsbFdyYXBwZXIgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCBzdGFydEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50KHRpbWUpXG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBCb29sZWFuKHNlbGVjdGlvbkRyYWZ0LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkQ2VsbFxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XG4gICAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcbiAgICAgICAgLy8gU2luY2UgdG91Y2ggZXZlbnRzIGZpcmUgb24gdGhlIGV2ZW50IHdoZXJlIHRoZSB0b3VjaC1kcmFnIHN0YXJ0ZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gcGFzc2luZ1xuICAgICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcbiAgICAgICAgLy8gcGFyYW1ldGVyc1xuICAgICAgICBvblRvdWNoU3RhcnQ9e3N0YXJ0SGFuZGxlcn1cbiAgICAgICAgb25Ub3VjaE1vdmU9e2hhbmRsZVRvdWNoTW92ZUV2ZW50fVxuICAgICAgICBvblRvdWNoRW5kPXtoYW5kbGVUb3VjaEVuZEV2ZW50fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQpfVxuICAgICAgPC9HcmlkQ2VsbD5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlQ2VsbCA9ICh0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbik6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsKSB7XG4gICAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5zZXQoZGF0ZUNlbGwsIHRpbWUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCByZWZTZXR0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlQ2VsbFxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXtwcm9wcy5zZWxlY3RlZENvbG9yIX1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3Byb3BzLnVuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgaG92ZXJlZENvbG9yPXtwcm9wcy5ob3ZlcmVkQ29sb3IhfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmIChwcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0RGF0ZSh0aW1lLCBwcm9wcy50aW1lRm9ybWF0KX08L1RpbWVUZXh0PlxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVMYWJlbCA9IChkYXRlOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmIChwcm9wcy5yZW5kZXJEYXRlTGFiZWwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJEYXRlTGFiZWwoZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxEYXRlTGFiZWw+e2Zvcm1hdERhdGUoZGF0ZS5nZXRVVENEYXRlKCksIHByb3BzLmRhdGVGb3JtYXQpfTwvRGF0ZUxhYmVsPlxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlckZ1bGxEYXRlR3JpZCA9ICgpOiBBcnJheTxKU1guRWxlbWVudD4gPT4ge1xuICAgIGNvbnN0IGZsYXR0ZW5lZERhdGVzOiBEYXRlW10gPSBbXVxuICAgIGNvbnN0IG51bURheXMgPSBkYXRlcy5sZW5ndGhcbiAgICBjb25zdCBudW1UaW1lcyA9IGRhdGVzWzBdLmxlbmd0aFxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtVGltZXM7IGogKz0gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EYXlzOyBpICs9IDEpIHtcbiAgICAgICAgZmxhdHRlbmVkRGF0ZXMucHVzaChkYXRlc1tpXVtqXSlcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZGF0ZUdyaWRFbGVtZW50cyA9IGZsYXR0ZW5lZERhdGVzLm1hcChyZW5kZXJEYXRlQ2VsbFdyYXBwZXIpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UaW1lczsgaSArPSAxKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGkgKiBudW1EYXlzXG4gICAgICBjb25zdCB0aW1lID0gZGF0ZXNbMF1baV1cbiAgICAgIC8vIEluamVjdCB0aGUgdGltZSBsYWJlbCBhdCB0aGUgc3RhcnQgb2YgZXZlcnkgcm93XG4gICAgICBkYXRlR3JpZEVsZW1lbnRzLnNwbGljZShpbmRleCArIGksIDAsIHJlbmRlclRpbWVMYWJlbCh0aW1lKSlcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgIC8vIEVtcHR5IHRvcCBsZWZ0IGNvcm5lclxuICAgICAgPGRpdiBrZXk9XCJ0b3BsZWZ0XCIgLz4sXG4gICAgICAvLyBUb3Agcm93IG9mIGRhdGVzXG4gICAgICAuLi5kYXRlcy5tYXAoKGRheU9mVGltZXMsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQocmVuZGVyRGF0ZUxhYmVsKGRheU9mVGltZXNbMF0pLCB7IGtleTogYGRhdGUtJHtpbmRleH1gIH0pKSxcbiAgICAgIC8vIEV2ZXJ5IHJvdyBhZnRlciB0aGF0XG4gICAgICAuLi5kYXRlR3JpZEVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChlbGVtZW50LCB7IGtleTogYHRpbWUtJHtpbmRleH1gIH0pKVxuICAgIF1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFdyYXBwZXI+XG4gICAgICA8R3JpZFxuICAgICAgICBjb2x1bW5zPXtkYXRlcy5sZW5ndGh9XG4gICAgICAgIHJvd3M9e2RhdGVzWzBdLmxlbmd0aH1cbiAgICAgICAgY29sdW1uR2FwPXtwcm9wcy5jb2x1bW5HYXAhfVxuICAgICAgICByb3dHYXA9e3Byb3BzLnJvd0dhcCF9XG4gICAgICAgIHJlZj17ZWwgPT4ge1xuICAgICAgICAgIGdyaWRSZWYuY3VycmVudCA9IGVsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtyZW5kZXJGdWxsRGF0ZUdyaWQoKX1cbiAgICAgIDwvR3JpZD5cbiAgICA8L1dyYXBwZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2NoZWR1bGVTZWxlY3RvclxuXG5TY2hlZHVsZVNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgc2VsZWN0aW9uOiBbXSxcbiAgc2VsZWN0aW9uU2NoZW1lOiAnc3F1YXJlJyxcbiAgbnVtRGF5czogNyxcbiAgbWluVGltZTogOSxcbiAgbWF4VGltZTogMjMsXG4gIGhvdXJseUNodW5rczogMSxcbiAgc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICB0aW1lRm9ybWF0OiAnaGEnLFxuICBkYXRlRm9ybWF0OiAnTS9kJyxcbiAgY29sdW1uR2FwOiAnNHB4JyxcbiAgcm93R2FwOiAnNHB4JyxcbiAgc2VsZWN0ZWRDb2xvcjogY29sb3JzLmJsdWUsXG4gIHVuc2VsZWN0ZWRDb2xvcjogY29sb3JzLnBhbGVCbHVlLFxuICBob3ZlcmVkQ29sb3I6IGNvbG9ycy5saWdodEJsdWUsXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgb25DaGFuZ2U6ICgpID0+IHt9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyx1QkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsT0FBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsT0FBQSxHQUFBSCxPQUFBO0FBQ0EsSUFBQUksT0FBQSxHQUFBRixzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUssV0FBQSxHQUFBTCxPQUFBO0FBQ0EsSUFBQU0sUUFBQSxHQUFBTixPQUFBO0FBQ0EsSUFBQU8sT0FBQSxHQUFBTCxzQkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQVEsTUFBQSxHQUFBTixzQkFBQSxDQUFBRixPQUFBO0FBQ0Es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