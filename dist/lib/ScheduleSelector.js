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
var _index = _interopRequireDefault(require("./selection-schemes/index"));
var _dateFnsTz = require("date-fns-tz");
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
  const startTime = props.startDate;
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
      return /*#__PURE__*/_react.default.createElement(TimeText, null, (0, _dateFnsTz.formatInTimeZone)(time, 'UTC', props.timeFormat));
    }
  };
  const renderDateLabel = date => {
    if (props.renderDateLabel) {
      return props.renderDateLabel(date);
    } else {
      return /*#__PURE__*/_react.default.createElement(DateLabel, null, (0, _dateFnsTz.formatInTimeZone)(date, 'UTC', props.dateFormat));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9pbmRleCIsIl9kYXRlRm5zVHoiLCJfdXRjIiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnREYXRlIiwiZGF0ZXMiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsImQiLCJudW1EYXlzIiwiY3VycmVudERheSIsImgiLCJtaW5UaW1lIiwibWF4VGltZSIsImMiLCJuZXdEYXRlIiwiVVRDRGF0ZSIsImFkZE1pbnV0ZXMiLCJhZGRIb3VycyIsImFkZERheXMiLCJwdXNoIiwiU2NoZWR1bGVTZWxlY3RvciIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImNlbGxUb0RhdGUiLCJ1c2VSZWYiLCJNYXAiLCJncmlkUmVmIiwic2VsZWN0aW9uRHJhZnQiLCJzZXRTZWxlY3Rpb25EcmFmdCIsInVzZVN0YXRlIiwic2VsZWN0aW9uIiwic2VsZWN0aW9uRHJhZnRSZWYiLCJzZWxlY3Rpb25UeXBlIiwic2V0U2VsZWN0aW9uVHlwZSIsInNlbGVjdGlvblN0YXJ0Iiwic2V0U2VsZWN0aW9uU3RhcnQiLCJpc1RvdWNoRHJhZ2dpbmciLCJzZXRJc1RvdWNoRHJhZ2dpbmciLCJzZXREYXRlcyIsInVzZUVmZmVjdCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImVuZFNlbGVjdGlvbiIsImN1cnJlbnQiLCJmb3JFYWNoIiwiZGF0ZUNlbGwiLCJwYXNzaXZlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFRpbWVGcm9tVG91Y2hFdmVudCIsImV2ZW50IiwidG91Y2hlcyIsImxlbmd0aCIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjZWxsVGltZSIsIm9uQ2hhbmdlIiwidXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQiLCJzZWxlY3Rpb25FbmQiLCJuZXdTZWxlY3Rpb24iLCJzZWxlY3Rpb25TY2hlbWUiLCJuZXh0RHJhZnQiLCJBcnJheSIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJhIiwiZmluZCIsImIiLCJpc1NhbWVNaW51dGUiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwidGltZVNlbGVjdGVkIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50IiwidGltZSIsImhhbmRsZU1vdXNlVXBFdmVudCIsImhhbmRsZVRvdWNoTW92ZUV2ZW50IiwiaGFuZGxlVG91Y2hFbmRFdmVudCIsInJlbmRlckRhdGVDZWxsV3JhcHBlciIsInN0YXJ0SGFuZGxlciIsIkJvb2xlYW4iLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicm9sZSIsInRvSVNPU3RyaW5nIiwib25Nb3VzZURvd24iLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlVXAiLCJvblRvdWNoU3RhcnQiLCJvblRvdWNoTW92ZSIsIm9uVG91Y2hFbmQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsInJlZiIsInJlbmRlclRpbWVMYWJlbCIsImZvcm1hdEluVGltZVpvbmUiLCJ0aW1lRm9ybWF0IiwicmVuZGVyRGF0ZUxhYmVsIiwiZGF0ZSIsImRhdGVGb3JtYXQiLCJyZW5kZXJGdWxsRGF0ZUdyaWQiLCJmbGF0dGVuZWREYXRlcyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiUmVhY3QiLCJjbG9uZUVsZW1lbnQiLCJjb25jYXQiLCJlbGVtZW50IiwiZWwiLCJfZGVmYXVsdCIsImRlZmF1bHRQcm9wcyIsIkRhdGUiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL1NjaGVkdWxlU2VsZWN0b3IudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnXG5pbXBvcnQgeyBjc3MgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCdcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJ1xuaW1wb3J0IHsgU3VidGl0bGUsIFRleHQgfSBmcm9tICcuL3R5cG9ncmFwaHknXG5pbXBvcnQgeyBhZGREYXlzLCBhZGRIb3VycywgYWRkTWludXRlcywgaXNTYW1lTWludXRlLCBzdGFydE9mRGF5IH0gZnJvbSAnZGF0ZS1mbnMnXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5pbXBvcnQgc2VsZWN0aW9uU2NoZW1lcywgeyBTZWxlY3Rpb25TY2hlbWVUeXBlLCBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9zZWxlY3Rpb24tc2NoZW1lcy9pbmRleCdcbmltcG9ydCB7IGZvcm1hdEluVGltZVpvbmUsIHpvbmVkVGltZVRvVXRjIH0gZnJvbSAnZGF0ZS1mbnMtdHonXG5pbXBvcnQgeyBVVENEYXRlLCBVVENEYXRlTWluaSB9IGZyb20gJ0BkYXRlLWZucy91dGMnXG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICAke2Nzc2BcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGB9XG5gXG5pbnRlcmZhY2UgSUdyaWRQcm9wcyB7XG4gIGNvbHVtbnM6IG51bWJlclxuICByb3dzOiBudW1iZXJcbiAgY29sdW1uR2FwOiBzdHJpbmdcbiAgcm93R2FwOiBzdHJpbmdcbn1cblxuY29uc3QgR3JpZCA9IHN0eWxlZC5kaXY8SUdyaWRQcm9wcz5gXG4gICR7cHJvcHMgPT4gY3NzYFxuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgke3Byb3BzLmNvbHVtbnN9LCAxZnIpO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHtwcm9wcy5yb3dzfSwgMWZyKTtcbiAgICBjb2x1bW4tZ2FwOiAke3Byb3BzLmNvbHVtbkdhcH07XG4gICAgcm93LWdhcDogJHtwcm9wcy5yb3dHYXB9O1xuICAgIHdpZHRoOiAxMDAlO1xuICBgfVxuYFxuXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxuICAke2Nzc2BcbiAgICBwbGFjZS1zZWxmOiBzdHJldGNoO1xuICAgIHRvdWNoLWFjdGlvbjogbm9uZTtcbiAgYH1cbmBcblxuaW50ZXJmYWNlIElEYXRlQ2VsbFByb3BzIHtcbiAgc2VsZWN0ZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG59XG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjxJRGF0ZUNlbGxQcm9wcz5gXG4gICR7cHJvcHMgPT4gY3NzYFxuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMjVweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzLnNlbGVjdGVkID8gcHJvcHMuc2VsZWN0ZWRDb2xvciA6IHByb3BzLnVuc2VsZWN0ZWRDb2xvcn07XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuaG92ZXJlZENvbG9yfTtcbiAgICB9XG4gIGB9XG5gXG5cbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXG4gICR7Y3NzYFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgIH1cbiAgICBtYXJnaW46IDA7XG4gICAgbWFyZ2luLWJvdHRvbTogNHB4O1xuICBgfVxuYFxuXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgJHtjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgICBmb250LXNpemU6IDEwcHg7XG4gICAgfVxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIG1hcmdpbjogMDtcbiAgICBtYXJnaW4tcmlnaHQ6IDRweDtcbiAgYH1cbmBcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1pbnRlcmZhY2VcbmV4cG9ydCBpbnRlcmZhY2UgSVNjaGVkdWxlU2VsZWN0b3JQcm9wcyB7XG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cbiAgc2VsZWN0aW9uU2NoZW1lOiBTZWxlY3Rpb25TY2hlbWVUeXBlXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxuICBzdGFydERhdGU6IERhdGUgfCBVVENEYXRlXG4gIG51bURheXM6IG51bWJlclxuICBtaW5UaW1lOiBudW1iZXJcbiAgbWF4VGltZTogbnVtYmVyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xuICB0aW1lRm9ybWF0OiBzdHJpbmdcbiAgY29sdW1uR2FwPzogc3RyaW5nXG4gIHJvd0dhcD86IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgc2VsZWN0ZWRDb2xvcj86IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I/OiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmNvbnN0IGNvbXB1dGVEYXRlc01hdHJpeCA9IChwcm9wczogSVNjaGVkdWxlU2VsZWN0b3JQcm9wcyk6IEFycmF5PEFycmF5PERhdGU+PiA9PiB7XG4gIGNvbnN0IHN0YXJ0VGltZSA9IHByb3BzLnN0YXJ0RGF0ZVxuXG4gIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG4gIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XG4gICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPCBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgY29uc3QgbmV3RGF0ZSA9IG5ldyBVVENEYXRlKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgY3VycmVudERheS5wdXNoKG5ld0RhdGUpXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgfVxuICByZXR1cm4gZGF0ZXNcbn1cblxuZXhwb3J0IGNvbnN0IFNjaGVkdWxlU2VsZWN0b3I6IFJlYWN0LkZDPElTY2hlZHVsZVNlbGVjdG9yUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCBzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgfVxuICBjb25zdCBjZWxsVG9EYXRlID0gdXNlUmVmPE1hcDxFbGVtZW50LCBEYXRlPj4obmV3IE1hcCgpKVxuICBjb25zdCBncmlkUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbClcblxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcbiAgY29uc3QgW3NlbGVjdGlvblR5cGUsIHNldFNlbGVjdGlvblR5cGVdID0gdXNlU3RhdGU8U2VsZWN0aW9uVHlwZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25TdGFydCwgc2V0U2VsZWN0aW9uU3RhcnRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1RvdWNoRHJhZ2dpbmcsIHNldElzVG91Y2hEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGVzLCBzZXREYXRlc10gPSB1c2VTdGF0ZShjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcbiAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgY29uc3QgZ2V0VGltZUZyb21Ub3VjaEV2ZW50ID0gKGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IGNlbGxUb0RhdGUuY3VycmVudC5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBlbmRTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgcHJvcHMub25DaGFuZ2Uoc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudClcbiAgICBzZXRTZWxlY3Rpb25UeXBlKG51bGwpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQobnVsbClcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICBjb25zdCB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCA9IChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsKSA9PiB7XG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbcHJvcHMuc2VsZWN0aW9uU2NoZW1lXShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kLCBkYXRlcylcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25EcmFmdFJlZi5jdXJyZW50ID0gbmV4dERyYWZ0XG4gICAgc2V0U2VsZWN0aW9uRHJhZnQobmV4dERyYWZ0KVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgY29uc3QgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IChzdGFydFRpbWU6IERhdGUpID0+IHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSBwcm9wcy5zZWxlY3Rpb24uZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIHNldFNlbGVjdGlvblR5cGUodGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJylcbiAgICBzZXRTZWxlY3Rpb25TdGFydChzdGFydFRpbWUpXG4gIH1cblxuICBjb25zdCBoYW5kbGVNb3VzZUVudGVyRXZlbnQgPSAodGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VVcEV2ZW50ID0gKHRpbWU6IERhdGUpID0+IHtcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaE1vdmVFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIHNldElzVG91Y2hEcmFnZ2luZyh0cnVlKVxuICAgIGNvbnN0IGNlbGxUaW1lID0gZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVG91Y2hFbmRFdmVudCA9ICgpID0+IHtcbiAgICBpZiAoIWlzVG91Y2hEcmFnZ2luZykge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbClcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgc2V0SXNUb3VjaERyYWdnaW5nKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbihzZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgICBvbk1vdXNlRG93bj17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XG4gICAgICAgICAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uVG91Y2hNb3ZlPXtoYW5kbGVUb3VjaE1vdmVFdmVudH1cbiAgICAgICAgb25Ub3VjaEVuZD17aGFuZGxlVG91Y2hFbmRFdmVudH1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgcmVmU2V0dGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUNlbGxcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XG4gICAgICAgICAgcmVmPXtyZWZTZXR0ZXJ9XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cHJvcHMuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXtwcm9wcy51bnNlbGVjdGVkQ29sb3IhfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17cHJvcHMuaG92ZXJlZENvbG9yIX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdEluVGltZVpvbmUodGltZSwgJ1VUQycsIHByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0SW5UaW1lWm9uZShkYXRlLCAnVVRDJywgcHJvcHMuZGF0ZUZvcm1hdCl9PC9EYXRlTGFiZWw+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRnVsbERhdGVHcmlkID0gKCk6IEFycmF5PEpTWC5FbGVtZW50PiA9PiB7XG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXG4gICAgY29uc3QgbnVtRGF5cyA9IGRhdGVzLmxlbmd0aFxuICAgIGNvbnN0IG51bVRpbWVzID0gZGF0ZXNbMF0ubGVuZ3RoXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lczsgaiArPSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKGRhdGVzW2ldW2pdKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHJlbmRlckRhdGVDZWxsV3JhcHBlcilcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRpbWVzOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gaSAqIG51bURheXNcbiAgICAgIGNvbnN0IHRpbWUgPSBkYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgcmVuZGVyVGltZUxhYmVsKHRpbWUpKVxuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcbiAgICAgIC4uLmRhdGVzLm1hcCgoZGF5T2ZUaW1lcywgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChyZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSkpLFxuICAgICAgLy8gRXZlcnkgcm93IGFmdGVyIHRoYXRcbiAgICAgIC4uLmRhdGVHcmlkRWxlbWVudHMubWFwKChlbGVtZW50LCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KGVsZW1lbnQsIHsga2V5OiBgdGltZS0ke2luZGV4fWAgfSkpXG4gICAgXVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8V3JhcHBlcj5cbiAgICAgIDxHcmlkXG4gICAgICAgIGNvbHVtbnM9e2RhdGVzLmxlbmd0aH1cbiAgICAgICAgcm93cz17ZGF0ZXNbMF0ubGVuZ3RofVxuICAgICAgICBjb2x1bW5HYXA9e3Byb3BzLmNvbHVtbkdhcCF9XG4gICAgICAgIHJvd0dhcD17cHJvcHMucm93R2FwIX1cbiAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgZ3JpZFJlZi5jdXJyZW50ID0gZWxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckZ1bGxEYXRlR3JpZCgpfVxuICAgICAgPC9HcmlkPlxuICAgIDwvV3JhcHBlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZVNlbGVjdG9yXG5cblNjaGVkdWxlU2VsZWN0b3IuZGVmYXVsdFByb3BzID0ge1xuICBzZWxlY3Rpb246IFtdLFxuICBzZWxlY3Rpb25TY2hlbWU6ICdzcXVhcmUnLFxuICBudW1EYXlzOiA3LFxuICBtaW5UaW1lOiA5LFxuICBtYXhUaW1lOiAyMyxcbiAgaG91cmx5Q2h1bmtzOiAxLFxuICBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gIHRpbWVGb3JtYXQ6ICdoYScsXG4gIGRhdGVGb3JtYXQ6ICdNL2QnLFxuICBjb2x1bW5HYXA6ICc0cHgnLFxuICByb3dHYXA6ICc0cHgnLFxuICBzZWxlY3RlZENvbG9yOiBjb2xvcnMuYmx1ZSxcbiAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gIGhvdmVyZWRDb2xvcjogY29sb3JzLmxpZ2h0Qmx1ZSxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxuICBvbkNoYW5nZTogKCkgPT4ge31cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxPQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxPQUFBLEdBQUFILE9BQUE7QUFDQSxJQUFBSSxPQUFBLEdBQUFGLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSyxXQUFBLEdBQUFMLE9BQUE7QUFDQSxJQUFBTSxRQUFB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