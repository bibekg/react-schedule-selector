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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9mb3JtYXQiLCJfaW5kZXgiLCJfZGF0ZUZuc1R6IiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnRPZkRheSIsInN0YXJ0RGF0ZSIsImRhdGVzIiwibWludXRlc0luQ2h1bmsiLCJNYXRoIiwiZmxvb3IiLCJob3VybHlDaHVua3MiLCJkIiwibnVtRGF5cyIsImN1cnJlbnREYXkiLCJoIiwibWluVGltZSIsIm1heFRpbWUiLCJjIiwicHVzaCIsInpvbmVkVGltZVRvVXRjIiwiYWRkTWludXRlcyIsImFkZEhvdXJzIiwiYWRkRGF5cyIsIlNjaGVkdWxlU2VsZWN0b3IiLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJjZWxsVG9EYXRlIiwidXNlUmVmIiwiTWFwIiwiZ3JpZFJlZiIsInNlbGVjdGlvbkRyYWZ0Iiwic2V0U2VsZWN0aW9uRHJhZnQiLCJ1c2VTdGF0ZSIsInNlbGVjdGlvbiIsInNlbGVjdGlvbkRyYWZ0UmVmIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmRTZWxlY3Rpb24iLCJjdXJyZW50IiwiZm9yRWFjaCIsImRhdGVDZWxsIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJvbkNoYW5nZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYSIsImZpbmQiLCJiIiwiaXNTYW1lTWludXRlIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsInRpbWVTZWxlY3RlZCIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsInRpbWUiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJzdGFydEhhbmRsZXIiLCJCb29sZWFuIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJvbGUiLCJ0b0lTT1N0cmluZyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZVVwIiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJvblRvdWNoRW5kIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJyZWYiLCJyZW5kZXJUaW1lTGFiZWwiLCJmb3JtYXREYXRlIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0IiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1UaW1lcyIsImoiLCJpIiwiZGF0ZUdyaWRFbGVtZW50cyIsIm1hcCIsImluZGV4Iiwic3BsaWNlIiwiZGF5T2ZUaW1lcyIsIlJlYWN0IiwiY2xvbmVFbGVtZW50IiwiY29uY2F0IiwiZWxlbWVudCIsImVsIiwiX2RlZmF1bHQiLCJkZWZhdWx0UHJvcHMiLCJEYXRlIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9TY2hlZHVsZVNlbGVjdG9yLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJ1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ0BlbW90aW9uL3N0eWxlZCdcbmltcG9ydCB7IFN1YnRpdGxlLCBUZXh0IH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IHsgYWRkRGF5cywgYWRkSG91cnMsIGFkZE1pbnV0ZXMsIGlzU2FtZU1pbnV0ZSwgc3RhcnRPZkRheSB9IGZyb20gJ2RhdGUtZm5zJ1xuaW1wb3J0IGZvcm1hdERhdGUgZnJvbSAnZGF0ZS1mbnMvZm9ybWF0J1xuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMvaW5kZXgnXG5pbXBvcnQgeyB6b25lZFRpbWVUb1V0YyB9IGZyb20gJ2RhdGUtZm5zLXR6J1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgJHtjc3NgXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICBgfVxuYFxuaW50ZXJmYWNlIElHcmlkUHJvcHMge1xuICBjb2x1bW5zOiBudW1iZXJcbiAgcm93czogbnVtYmVyXG4gIGNvbHVtbkdhcDogc3RyaW5nXG4gIHJvd0dhcDogc3RyaW5nXG59XG5cbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PElHcmlkUHJvcHM+YFxuICAke3Byb3BzID0+IGNzc2BcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcy5jb2x1bW5zfSwgMWZyKTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMucm93c30sIDFmcik7XG4gICAgY29sdW1uLWdhcDogJHtwcm9wcy5jb2x1bW5HYXB9O1xuICAgIHJvdy1nYXA6ICR7cHJvcHMucm93R2FwfTtcbiAgICB3aWR0aDogMTAwJTtcbiAgYH1cbmBcblxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcbiAgJHtjc3NgXG4gICAgcGxhY2Utc2VsZjogc3RyZXRjaDtcbiAgICB0b3VjaC1hY3Rpb246IG5vbmU7XG4gIGB9XG5gXG5cbmludGVyZmFjZSBJRGF0ZUNlbGxQcm9wcyB7XG4gIHNlbGVjdGVkOiBib29sZWFuXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xufVxuXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8SURhdGVDZWxsUHJvcHM+YFxuICAke3Byb3BzID0+IGNzc2BcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDI1cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5zZWxlY3RlZCA/IHByb3BzLnNlbGVjdGVkQ29sb3IgOiBwcm9wcy51bnNlbGVjdGVkQ29sb3J9O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzLmhvdmVyZWRDb2xvcn07XG4gICAgfVxuICBgfVxuYFxuXG5jb25zdCBEYXRlTGFiZWwgPSBzdHlsZWQoU3VidGl0bGUpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICB9XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1ib3R0b206IDRweDtcbiAgYH1cbmBcblxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gICR7Y3NzYFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgIH1cbiAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICBtYXJnaW46IDA7XG4gICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gIGB9XG5gXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktaW50ZXJmYWNlXG5leHBvcnQgaW50ZXJmYWNlIElTY2hlZHVsZVNlbGVjdG9yUHJvcHMge1xuICBzZWxlY3Rpb246IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcbiAgc3RhcnREYXRlOiBEYXRlXG4gIG51bURheXM6IG51bWJlclxuICBtaW5UaW1lOiBudW1iZXJcbiAgbWF4VGltZTogbnVtYmVyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xuICB0aW1lRm9ybWF0OiBzdHJpbmdcbiAgY29sdW1uR2FwPzogc3RyaW5nXG4gIHJvd0dhcD86IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgc2VsZWN0ZWRDb2xvcj86IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I/OiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmNvbnN0IGNvbXB1dGVEYXRlc01hdHJpeCA9IChwcm9wczogSVNjaGVkdWxlU2VsZWN0b3JQcm9wcyk6IEFycmF5PEFycmF5PERhdGU+PiA9PiB7XG4gIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cbiAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgIGN1cnJlbnREYXkucHVzaCh6b25lZFRpbWVUb1V0YyhhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuayksICdVVEMnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgZGF0ZXMucHVzaChjdXJyZW50RGF5KVxuICB9XG4gIHJldHVybiBkYXRlc1xufVxuXG5jb25zdCBTY2hlZHVsZVNlbGVjdG9yOiBSZWFjdC5GQzxJU2NoZWR1bGVTZWxlY3RvclByb3BzPiA9IHByb3BzID0+IHtcbiAgY29uc3Qgc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgbGluZWFyOiBzZWxlY3Rpb25TY2hlbWVzLmxpbmVhcixcbiAgICBzcXVhcmU6IHNlbGVjdGlvblNjaGVtZXMuc3F1YXJlXG4gIH1cbiAgY29uc3QgY2VsbFRvRGF0ZSA9IHVzZVJlZjxNYXA8RWxlbWVudCwgRGF0ZT4+KG5ldyBNYXAoKSlcbiAgY29uc3QgZ3JpZFJlZiA9IHVzZVJlZjxIVE1MRWxlbWVudCB8IG51bGw+KG51bGwpXG5cbiAgY29uc3QgW3NlbGVjdGlvbkRyYWZ0LCBzZXRTZWxlY3Rpb25EcmFmdF0gPSB1c2VTdGF0ZShbLi4ucHJvcHMuc2VsZWN0aW9uXSlcbiAgY29uc3Qgc2VsZWN0aW9uRHJhZnRSZWYgPSB1c2VSZWYoc2VsZWN0aW9uRHJhZnQpXG4gIGNvbnN0IFtzZWxlY3Rpb25UeXBlLCBzZXRTZWxlY3Rpb25UeXBlXSA9IHVzZVN0YXRlPFNlbGVjdGlvblR5cGUgfCBudWxsPihudWxsKVxuICBjb25zdCBbc2VsZWN0aW9uU3RhcnQsIHNldFNlbGVjdGlvblN0YXJ0XSA9IHVzZVN0YXRlPERhdGUgfCBudWxsPihudWxsKVxuICBjb25zdCBbaXNUb3VjaERyYWdnaW5nLCBzZXRJc1RvdWNoRHJhZ2dpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtkYXRlcywgc2V0RGF0ZXNdID0gdXNlU3RhdGUoY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xuICAgIC8vIHRoZSBkYXRlIGNlbGxzIChpbiB3aGljaCBjYXNlIG5vbmUgb2YgdGhlIERhdGVDZWxsJ3Mgb25Nb3VzZVVwIGhhbmRsZXJzIHdvdWxkIGZpcmUpXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXG4gICAgLy8gdGhlIGVsZW1lbnQgd2hlcmUgdGhlIHRvdWNoL2RyYWcgc3RhcnRlZCBzbyBpdCdzIGFsd2F5cyBjYXVnaHQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcblxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXG4gICAgY2VsbFRvRGF0ZS5jdXJyZW50LmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmRTZWxlY3Rpb24pXG4gICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXG4gIC8vIGlmIHRoZSBldmVudCBpcyBhIGB0b3VjaG1vdmVgIGV2ZW50IHNpbmNlIGl0J3MgdGhlIG9ubHkgb25lIHRoYXQgaGFzIGEgYHRvdWNoZXNgIGxpc3QuXG4gIGNvbnN0IGdldFRpbWVGcm9tVG91Y2hFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcbiAgICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgY29uc3QgY2VsbFRpbWUgPSBjZWxsVG9EYXRlLmN1cnJlbnQuZ2V0KHRhcmdldEVsZW1lbnQpXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgY29uc3QgZW5kU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgIHByb3BzLm9uQ2hhbmdlKHNlbGVjdGlvbkRyYWZ0UmVmLmN1cnJlbnQpXG4gICAgc2V0U2VsZWN0aW9uVHlwZShudWxsKVxuICAgIHNldFNlbGVjdGlvblN0YXJ0KG51bGwpXG4gIH1cblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgY29uc3QgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQgPSAoc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCkgPT4ge1xuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSBudWxsIHx8IHNlbGVjdGlvblN0YXJ0ID09PSBudWxsKSByZXR1cm5cblxuICAgIGxldCBuZXdTZWxlY3Rpb246IEFycmF5PERhdGU+ID0gW11cbiAgICBpZiAoc2VsZWN0aW9uU3RhcnQgJiYgc2VsZWN0aW9uRW5kICYmIHNlbGVjdGlvblR5cGUpIHtcbiAgICAgIG5ld1NlbGVjdGlvbiA9IHNlbGVjdGlvblNjaGVtZUhhbmRsZXJzW3Byb3BzLnNlbGVjdGlvblNjaGVtZV0oc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCwgZGF0ZXMpXG4gICAgfVxuXG4gICAgbGV0IG5leHREcmFmdCA9IFsuLi5wcm9wcy5zZWxlY3Rpb25dXG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdhZGQnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLm5leHREcmFmdCwgLi4ubmV3U2VsZWN0aW9uXSkpXG4gICAgfSBlbHNlIGlmIChzZWxlY3Rpb25UeXBlID09PSAncmVtb3ZlJykge1xuICAgICAgbmV4dERyYWZ0ID0gbmV4dERyYWZ0LmZpbHRlcihhID0+ICFuZXdTZWxlY3Rpb24uZmluZChiID0+IGlzU2FtZU1pbnV0ZShhLCBiKSkpXG4gICAgfVxuXG4gICAgc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudCA9IG5leHREcmFmdFxuICAgIHNldFNlbGVjdGlvbkRyYWZ0KG5leHREcmFmdClcbiAgfVxuXG4gIC8vIElzb21vcnBoaWMgKG1vdXNlIGFuZCB0b3VjaCkgaGFuZGxlciBzaW5jZSBzdGFydGluZyBhIHNlbGVjdGlvbiB3b3JrcyB0aGUgc2FtZSB3YXkgZm9yIGJvdGggY2xhc3NlcyBvZiB1c2VyIGlucHV0XG4gIGNvbnN0IGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQgPSAoc3RhcnRUaW1lOiBEYXRlKSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHN0YXJ0VGltZSBjZWxsIGlzIHNlbGVjdGVkL3Vuc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZHJhZy1zZWxlY3Qgc2hvdWxkXG4gICAgLy8gYWRkIHZhbHVlcyBvciByZW1vdmUgdmFsdWVzXG4gICAgY29uc3QgdGltZVNlbGVjdGVkID0gcHJvcHMuc2VsZWN0aW9uLmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgc3RhcnRUaW1lKSlcbiAgICBzZXRTZWxlY3Rpb25UeXBlKHRpbWVTZWxlY3RlZCA/ICdyZW1vdmUnIDogJ2FkZCcpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQoc3RhcnRUaW1lKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VFbnRlckV2ZW50ID0gKHRpbWU6IERhdGUpID0+IHtcbiAgICAvLyBOZWVkIHRvIHVwZGF0ZSBzZWxlY3Rpb24gZHJhZnQgb24gbW91c2V1cCBhcyB3ZWxsIGluIG9yZGVyIHRvIGNhdGNoIHRoZSBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSB1c2VyIGp1c3QgY2xpY2tzIG9uIGEgc2luZ2xlIGNlbGwgKGJlY2F1c2Ugbm8gbW91c2VlbnRlciBldmVudHMgZmlyZVxuICAgIC8vIGluIHRoaXMgc2NlbmFyaW8pXG4gICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlVXBFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQodGltZSlcbiAgICAvLyBEb24ndCBjYWxsIHRoaXMuZW5kU2VsZWN0aW9uKCkgaGVyZSBiZWNhdXNlIHRoZSBkb2N1bWVudCBtb3VzZXVwIGhhbmRsZXIgd2lsbCBkbyBpdFxuICB9XG5cbiAgY29uc3QgaGFuZGxlVG91Y2hNb3ZlRXZlbnQgPSAoZXZlbnQ6IFJlYWN0LlRvdWNoRXZlbnQpID0+IHtcbiAgICBzZXRJc1RvdWNoRHJhZ2dpbmcodHJ1ZSlcbiAgICBjb25zdCBjZWxsVGltZSA9IGdldFRpbWVGcm9tVG91Y2hFdmVudChldmVudClcbiAgICBpZiAoY2VsbFRpbWUpIHtcbiAgICAgIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KGNlbGxUaW1lKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZVRvdWNoRW5kRXZlbnQgPSAoKSA9PiB7XG4gICAgaWYgKCFpc1RvdWNoRHJhZ2dpbmcpIHtcbiAgICAgIHVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0KG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZFNlbGVjdGlvbigpXG4gICAgfVxuICAgIHNldElzVG91Y2hEcmFnZ2luZyhmYWxzZSlcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4oc2VsZWN0aW9uRHJhZnQuZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCB0aW1lKSkpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEdyaWRDZWxsXG4gICAgICAgIGNsYXNzTmFtZT1cInJnZHBfX2dyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICBrZXk9e3RpbWUudG9JU09TdHJpbmcoKX1cbiAgICAgICAgLy8gTW91c2UgaGFuZGxlcnNcbiAgICAgICAgb25Nb3VzZURvd249e3N0YXJ0SGFuZGxlcn1cbiAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiB7XG4gICAgICAgICAgaGFuZGxlTW91c2VFbnRlckV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VVcD17KCkgPT4ge1xuICAgICAgICAgIGhhbmRsZU1vdXNlVXBFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICAvLyBUb3VjaCBoYW5kbGVyc1xuICAgICAgICAvLyBTaW5jZSB0b3VjaCBldmVudHMgZmlyZSBvbiB0aGUgZXZlbnQgd2hlcmUgdGhlIHRvdWNoLWRyYWcgc3RhcnRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBwYXNzaW5nXG4gICAgICAgIC8vIGluIHRoZSB0aW1lIHBhcmFtZXRlciwgaW5zdGVhZCB0aGVzZSBoYW5kbGVycyB3aWxsIGRvIHRoZWlyIGpvYiB1c2luZyB0aGUgZGVmYXVsdCBFdmVudFxuICAgICAgICAvLyBwYXJhbWV0ZXJzXG4gICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvblRvdWNoTW92ZT17aGFuZGxlVG91Y2hNb3ZlRXZlbnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e2hhbmRsZVRvdWNoRW5kRXZlbnR9XG4gICAgICA+XG4gICAgICAgIHtyZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCl9XG4gICAgICA8L0dyaWRDZWxsPlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVDZWxsID0gKHRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHJlZlNldHRlciA9IChkYXRlQ2VsbDogSFRNTEVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwpIHtcbiAgICAgICAgY2VsbFRvRGF0ZS5jdXJyZW50LnNldChkYXRlQ2VsbCwgdGltZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BzLnJlbmRlckRhdGVDZWxsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQsIHJlZlNldHRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERhdGVDZWxsXG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxuICAgICAgICAgIHJlZj17cmVmU2V0dGVyfVxuICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3Byb3BzLnNlbGVjdGVkQ29sb3IhfVxuICAgICAgICAgIHVuc2VsZWN0ZWRDb2xvcj17cHJvcHMudW5zZWxlY3RlZENvbG9yIX1cbiAgICAgICAgICBob3ZlcmVkQ29sb3I9e3Byb3BzLmhvdmVyZWRDb2xvciF9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyVGltZUxhYmVsID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHByb3BzLnJlbmRlclRpbWVMYWJlbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlclRpbWVMYWJlbCh0aW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPFRpbWVUZXh0Pntmb3JtYXREYXRlKHRpbWUsIHByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0RGF0ZShkYXRlLCBwcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJGdWxsRGF0ZUdyaWQgPSAoKTogQXJyYXk8SlNYLkVsZW1lbnQ+ID0+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gZGF0ZXMubGVuZ3RoXG4gICAgY29uc3QgbnVtVGltZXMgPSBkYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzOyBqICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGF5czsgaSArPSAxKSB7XG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2goZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAocmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IGRhdGVzWzBdW2ldXG4gICAgICAvLyBJbmplY3QgdGhlIHRpbWUgbGFiZWwgYXQgdGhlIHN0YXJ0IG9mIGV2ZXJ5IHJvd1xuICAgICAgZGF0ZUdyaWRFbGVtZW50cy5zcGxpY2UoaW5kZXggKyBpLCAwLCByZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4uZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KHJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KSksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxXcmFwcGVyPlxuICAgICAgPEdyaWRcbiAgICAgICAgY29sdW1ucz17ZGF0ZXMubGVuZ3RofVxuICAgICAgICByb3dzPXtkYXRlc1swXS5sZW5ndGh9XG4gICAgICAgIGNvbHVtbkdhcD17cHJvcHMuY29sdW1uR2FwIX1cbiAgICAgICAgcm93R2FwPXtwcm9wcy5yb3dHYXAhfVxuICAgICAgICByZWY9e2VsID0+IHtcbiAgICAgICAgICBncmlkUmVmLmN1cnJlbnQgPSBlbFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRnVsbERhdGVHcmlkKCl9XG4gICAgICA8L0dyaWQ+XG4gICAgPC9XcmFwcGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlU2VsZWN0b3JcblxuU2NoZWR1bGVTZWxlY3Rvci5kZWZhdWx0UHJvcHMgPSB7XG4gIHNlbGVjdGlvbjogW10sXG4gIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gIG51bURheXM6IDcsXG4gIG1pblRpbWU6IDksXG4gIG1heFRpbWU6IDIzLFxuICBob3VybHlDaHVua3M6IDEsXG4gIHN0YXJ0RGF0ZTogbmV3IERhdGUoKSxcbiAgdGltZUZvcm1hdDogJ2hhJyxcbiAgZGF0ZUZvcm1hdDogJ00vZCcsXG4gIGNvbHVtbkdhcDogJzRweCcsXG4gIHJvd0dhcDogJzRweCcsXG4gIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxuICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcbiAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIG9uQ2hhbmdlOiAoKSA9PiB7fVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLE9BQUEsR0FBQUgsT0FBQTtBQUNBLElBQUFJLE9BQUEsR0FBQUYsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFLLFdBQUEsR0FBQUwsT0FBQTtBQUNBLElBQUFNLFFBQUEsR0FBQU4sT0FBQTtBQUNBLElBQUFPLE9BQUEsR0FBQUwsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFRLE1BQUEsR0FBQU4sc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFTLFVBQUEsR0FBQVQsT0FBQTtBQUE0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