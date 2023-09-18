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
  const [selectionEnd, setSelectionaEnd] = (0, _react.useState)(null);
  const [selectionType, setSelectionType] = (0, _react.useState)(null);
  const [selectionStart, setSelectionStart] = (0, _react.useState)(null);
  const [isTouchDragging, setIsTouchDragging] = (0, _react.useState)(false);
  const [dates, setDates] = (0, _react.useState)(computeDatesMatrix(props));

  // Given an ending Date, determines all the dates that should be selected in this draft
  const selectionDraft = (0, _react.useMemo)(() => {
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
    return nextDraft;
  }, [selectionEnd]);

  /*
  const [selectionDraft, setSelectionDraft] = useState([...props.selection])
  */
  const selectionDraftRef = (0, _react.useRef)(selectionDraft);
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
    var _selectionDraftRef$cu;
    props.onChange((_selectionDraftRef$cu = selectionDraftRef.current) !== null && _selectionDraftRef$cu !== void 0 ? _selectionDraftRef$cu : []);
    setSelectionType(null);
    setSelectionStart(null);
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
    setSelectionaEnd(time);
  };
  const handleMouseUpEvent = time => {
    setSelectionaEnd(time);
    // Don't call this.endSelection() here because the document mouseup handler will do it
  };

  const handleTouchMoveEvent = event => {
    setIsTouchDragging(true);
    const cellTime = getTimeFromTouchEvent(event);
    if (cellTime) {
      setSelectionaEnd(cellTime);
    }
  };
  const handleTouchEndEvent = () => {
    if (!isTouchDragging) {
      setSelectionaEnd(null);
    } else {
      endSelection();
    }
    setIsTouchDragging(false);
  };
  const renderDateCellWrapper = time => {
    const startHandler = () => {
      handleSelectionStartEvent(time);
    };
    const selected = Boolean(selectionDraft === null || selectionDraft === void 0 ? void 0 : selectionDraft.find(a => (0, _dateFns.isSameMinute)(a, time)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9pbmRleCIsIl9kYXRlRm5zVHoiLCJfdXRjIiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnREYXRlIiwiZGF0ZXMiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsImQiLCJudW1EYXlzIiwiY3VycmVudERheSIsImgiLCJtaW5UaW1lIiwibWF4VGltZSIsImMiLCJuZXdEYXRlIiwiVVRDRGF0ZSIsImFkZE1pbnV0ZXMiLCJhZGRIb3VycyIsImFkZERheXMiLCJwdXNoIiwiU2NoZWR1bGVTZWxlY3RvciIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImNlbGxUb0RhdGUiLCJ1c2VSZWYiLCJNYXAiLCJncmlkUmVmIiwic2VsZWN0aW9uRW5kIiwic2V0U2VsZWN0aW9uYUVuZCIsInVzZVN0YXRlIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJzZWxlY3Rpb25EcmFmdCIsInVzZU1lbW8iLCJuZXdTZWxlY3Rpb24iLCJzZWxlY3Rpb25TY2hlbWUiLCJuZXh0RHJhZnQiLCJzZWxlY3Rpb24iLCJBcnJheSIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJhIiwiZmluZCIsImIiLCJpc1NhbWVNaW51dGUiLCJzZWxlY3Rpb25EcmFmdFJlZiIsImN1cnJlbnQiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmRTZWxlY3Rpb24iLCJmb3JFYWNoIiwiZGF0ZUNlbGwiLCJwYXNzaXZlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFRpbWVGcm9tVG91Y2hFdmVudCIsImV2ZW50IiwidG91Y2hlcyIsImxlbmd0aCIsImNsaWVudFgiLCJjbGllbnRZIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJjZWxsVGltZSIsIl9zZWxlY3Rpb25EcmFmdFJlZiRjdSIsIm9uQ2hhbmdlIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsInRpbWVTZWxlY3RlZCIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsInRpbWUiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJzdGFydEhhbmRsZXIiLCJCb29sZWFuIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJvbGUiLCJ0b0lTT1N0cmluZyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZVVwIiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJvblRvdWNoRW5kIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJyZWYiLCJyZW5kZXJUaW1lTGFiZWwiLCJmb3JtYXRJblRpbWVab25lIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0IiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1UaW1lcyIsImoiLCJpIiwiZGF0ZUdyaWRFbGVtZW50cyIsIm1hcCIsImluZGV4Iiwic3BsaWNlIiwiZGF5T2ZUaW1lcyIsIlJlYWN0IiwiY2xvbmVFbGVtZW50IiwiY29uY2F0IiwiZWxlbWVudCIsImVsIiwiX2RlZmF1bHQiLCJkZWZhdWx0UHJvcHMiLCJEYXRlIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9TY2hlZHVsZVNlbGVjdG9yLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJ1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ0BlbW90aW9uL3N0eWxlZCdcbmltcG9ydCB7IFN1YnRpdGxlLCBUZXh0IH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IHsgYWRkRGF5cywgYWRkSG91cnMsIGFkZE1pbnV0ZXMsIGlzU2FtZU1pbnV0ZSwgc3RhcnRPZkRheSB9IGZyb20gJ2RhdGUtZm5zJ1xuaW1wb3J0IGZvcm1hdERhdGUgZnJvbSAnZGF0ZS1mbnMvZm9ybWF0J1xuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMvaW5kZXgnXG5pbXBvcnQgeyBmb3JtYXRJblRpbWVab25lLCB6b25lZFRpbWVUb1V0YyB9IGZyb20gJ2RhdGUtZm5zLXR6J1xuaW1wb3J0IHsgVVRDRGF0ZSwgVVRDRGF0ZU1pbmkgfSBmcm9tICdAZGF0ZS1mbnMvdXRjJ1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgJHtjc3NgXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICBgfVxuYFxuaW50ZXJmYWNlIElHcmlkUHJvcHMge1xuICBjb2x1bW5zOiBudW1iZXJcbiAgcm93czogbnVtYmVyXG4gIGNvbHVtbkdhcDogc3RyaW5nXG4gIHJvd0dhcDogc3RyaW5nXG59XG5cbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PElHcmlkUHJvcHM+YFxuICAke3Byb3BzID0+IGNzc2BcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcy5jb2x1bW5zfSwgMWZyKTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMucm93c30sIDFmcik7XG4gICAgY29sdW1uLWdhcDogJHtwcm9wcy5jb2x1bW5HYXB9O1xuICAgIHJvdy1nYXA6ICR7cHJvcHMucm93R2FwfTtcbiAgICB3aWR0aDogMTAwJTtcbiAgYH1cbmBcblxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcbiAgJHtjc3NgXG4gICAgcGxhY2Utc2VsZjogc3RyZXRjaDtcbiAgICB0b3VjaC1hY3Rpb246IG5vbmU7XG4gIGB9XG5gXG5cbmludGVyZmFjZSBJRGF0ZUNlbGxQcm9wcyB7XG4gIHNlbGVjdGVkOiBib29sZWFuXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xufVxuXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8SURhdGVDZWxsUHJvcHM+YFxuICAke3Byb3BzID0+IGNzc2BcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDI1cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5zZWxlY3RlZCA/IHByb3BzLnNlbGVjdGVkQ29sb3IgOiBwcm9wcy51bnNlbGVjdGVkQ29sb3J9O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzLmhvdmVyZWRDb2xvcn07XG4gICAgfVxuICBgfVxuYFxuXG5jb25zdCBEYXRlTGFiZWwgPSBzdHlsZWQoU3VidGl0bGUpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICB9XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1ib3R0b206IDRweDtcbiAgYH1cbmBcblxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gICR7Y3NzYFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgIH1cbiAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICBtYXJnaW46IDA7XG4gICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gIGB9XG5gXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktaW50ZXJmYWNlXG5leHBvcnQgaW50ZXJmYWNlIElTY2hlZHVsZVNlbGVjdG9yUHJvcHMge1xuICBzZWxlY3Rpb246IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcbiAgc3RhcnREYXRlOiBEYXRlIHwgVVRDRGF0ZVxuICBudW1EYXlzOiBudW1iZXJcbiAgbWluVGltZTogbnVtYmVyXG4gIG1heFRpbWU6IG51bWJlclxuICBob3VybHlDaHVua3M6IG51bWJlclxuICBkYXRlRm9ybWF0OiBzdHJpbmdcbiAgdGltZUZvcm1hdDogc3RyaW5nXG4gIGNvbHVtbkdhcD86IHN0cmluZ1xuICByb3dHYXA/OiBzdHJpbmdcbiAgdW5zZWxlY3RlZENvbG9yPzogc3RyaW5nXG4gIHNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgaG92ZXJlZENvbG9yPzogc3RyaW5nXG4gIHJlbmRlckRhdGVDZWxsPzogKGRhdGV0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbiwgcmVmU2V0dGVyOiAoZGF0ZUNlbGxFbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZCkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyVGltZUxhYmVsPzogKHRpbWU6IERhdGUpID0+IEpTWC5FbGVtZW50XG4gIHJlbmRlckRhdGVMYWJlbD86IChkYXRlOiBEYXRlKSA9PiBKU1guRWxlbWVudFxufVxuXG5leHBvcnQgY29uc3QgcHJldmVudFNjcm9sbCA9IChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5jb25zdCBjb21wdXRlRGF0ZXNNYXRyaXggPSAocHJvcHM6IElTY2hlZHVsZVNlbGVjdG9yUHJvcHMpOiBBcnJheTxBcnJheTxEYXRlPj4gPT4ge1xuICBjb25zdCBzdGFydFRpbWUgPSBwcm9wcy5zdGFydERhdGVcblxuICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cbiAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5ld0RhdGUgPSBuZXcgVVRDRGF0ZShhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXG4gICAgICAgIGN1cnJlbnREYXkucHVzaChuZXdEYXRlKVxuICAgICAgfVxuICAgIH1cbiAgICBkYXRlcy5wdXNoKGN1cnJlbnREYXkpXG4gIH1cbiAgcmV0dXJuIGRhdGVzXG59XG5cbmV4cG9ydCBjb25zdCBTY2hlZHVsZVNlbGVjdG9yOiBSZWFjdC5GQzxJU2NoZWR1bGVTZWxlY3RvclByb3BzPiA9IHByb3BzID0+IHtcbiAgY29uc3Qgc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnMgPSB7XG4gICAgbGluZWFyOiBzZWxlY3Rpb25TY2hlbWVzLmxpbmVhcixcbiAgICBzcXVhcmU6IHNlbGVjdGlvblNjaGVtZXMuc3F1YXJlXG4gIH1cbiAgY29uc3QgY2VsbFRvRGF0ZSA9IHVzZVJlZjxNYXA8RWxlbWVudCwgRGF0ZT4+KG5ldyBNYXAoKSlcbiAgY29uc3QgZ3JpZFJlZiA9IHVzZVJlZjxIVE1MRWxlbWVudCB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25FbmQsIHNldFNlbGVjdGlvbmFFbmRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25UeXBlLCBzZXRTZWxlY3Rpb25UeXBlXSA9IHVzZVN0YXRlPFNlbGVjdGlvblR5cGUgfCBudWxsPihudWxsKVxuICBjb25zdCBbc2VsZWN0aW9uU3RhcnQsIHNldFNlbGVjdGlvblN0YXJ0XSA9IHVzZVN0YXRlPERhdGUgfCBudWxsPihudWxsKVxuICBjb25zdCBbaXNUb3VjaERyYWdnaW5nLCBzZXRJc1RvdWNoRHJhZ2dpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtkYXRlcywgc2V0RGF0ZXNdID0gdXNlU3RhdGUoY29tcHV0ZURhdGVzTWF0cml4KHByb3BzKSlcblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgY29uc3Qgc2VsZWN0aW9uRHJhZnQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gbnVsbCB8fCBzZWxlY3Rpb25TdGFydCA9PT0gbnVsbCkgcmV0dXJuXG5cbiAgICBsZXQgbmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPiA9IFtdXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0ICYmIHNlbGVjdGlvbkVuZCAmJiBzZWxlY3Rpb25UeXBlKSB7XG4gICAgICBuZXdTZWxlY3Rpb24gPSBzZWxlY3Rpb25TY2hlbWVIYW5kbGVyc1twcm9wcy5zZWxlY3Rpb25TY2hlbWVdKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQsIGRhdGVzKVxuICAgIH1cblxuICAgIGxldCBuZXh0RHJhZnQgPSBbLi4ucHJvcHMuc2VsZWN0aW9uXVxuICAgIGlmIChzZWxlY3Rpb25UeXBlID09PSAnYWRkJykge1xuICAgICAgbmV4dERyYWZ0ID0gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5uZXh0RHJhZnQsIC4uLm5ld1NlbGVjdGlvbl0pKVxuICAgIH0gZWxzZSBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIG5leHREcmFmdCA9IG5leHREcmFmdC5maWx0ZXIoYSA9PiAhbmV3U2VsZWN0aW9uLmZpbmQoYiA9PiBpc1NhbWVNaW51dGUoYSwgYikpKVxuICAgIH1cblxuICAgIHNlbGVjdGlvbkRyYWZ0UmVmLmN1cnJlbnQgPSBuZXh0RHJhZnRcbiAgICByZXR1cm4gbmV4dERyYWZ0XG4gIH0sIFtzZWxlY3Rpb25FbmRdKVxuXG4gIC8qXG4gIGNvbnN0IFtzZWxlY3Rpb25EcmFmdCwgc2V0U2VsZWN0aW9uRHJhZnRdID0gdXNlU3RhdGUoWy4uLnByb3BzLnNlbGVjdGlvbl0pXG4qL1xuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xuICAgIC8vIHRoZSBkYXRlIGNlbGxzIChpbiB3aGljaCBjYXNlIG5vbmUgb2YgdGhlIERhdGVDZWxsJ3Mgb25Nb3VzZVVwIGhhbmRsZXJzIHdvdWxkIGZpcmUpXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXG4gICAgLy8gdGhlIGVsZW1lbnQgd2hlcmUgdGhlIHRvdWNoL2RyYWcgc3RhcnRlZCBzbyBpdCdzIGFsd2F5cyBjYXVnaHQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcblxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXG4gICAgY2VsbFRvRGF0ZS5jdXJyZW50LmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmRTZWxlY3Rpb24pXG4gICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXG4gIC8vIGlmIHRoZSBldmVudCBpcyBhIGB0b3VjaG1vdmVgIGV2ZW50IHNpbmNlIGl0J3MgdGhlIG9ubHkgb25lIHRoYXQgaGFzIGEgYHRvdWNoZXNgIGxpc3QuXG4gIGNvbnN0IGdldFRpbWVGcm9tVG91Y2hFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcbiAgICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgY29uc3QgY2VsbFRpbWUgPSBjZWxsVG9EYXRlLmN1cnJlbnQuZ2V0KHRhcmdldEVsZW1lbnQpXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgY29uc3QgZW5kU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgIHByb3BzLm9uQ2hhbmdlKHNlbGVjdGlvbkRyYWZ0UmVmLmN1cnJlbnQgPz8gW10pXG4gICAgc2V0U2VsZWN0aW9uVHlwZShudWxsKVxuICAgIHNldFNlbGVjdGlvblN0YXJ0KG51bGwpXG4gIH1cblxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxuICBjb25zdCBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50ID0gKHN0YXJ0VGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xuICAgIGNvbnN0IHRpbWVTZWxlY3RlZCA9IHByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgc2V0U2VsZWN0aW9uVHlwZSh0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnKVxuICAgIHNldFNlbGVjdGlvblN0YXJ0KHN0YXJ0VGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlRW50ZXJFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxuICAgIHNldFNlbGVjdGlvbmFFbmQodGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlVXBFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgc2V0U2VsZWN0aW9uYUVuZCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaE1vdmVFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIHNldElzVG91Y2hEcmFnZ2luZyh0cnVlKVxuICAgIGNvbnN0IGNlbGxUaW1lID0gZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgc2V0U2VsZWN0aW9uYUVuZChjZWxsVGltZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaEVuZEV2ZW50ID0gKCkgPT4ge1xuICAgIGlmICghaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICBzZXRTZWxlY3Rpb25hRW5kKG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZFNlbGVjdGlvbigpXG4gICAgfVxuICAgIHNldElzVG91Y2hEcmFnZ2luZyhmYWxzZSlcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4oc2VsZWN0aW9uRHJhZnQ/LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkQ2VsbFxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XG4gICAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcbiAgICAgICAgLy8gU2luY2UgdG91Y2ggZXZlbnRzIGZpcmUgb24gdGhlIGV2ZW50IHdoZXJlIHRoZSB0b3VjaC1kcmFnIHN0YXJ0ZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gcGFzc2luZ1xuICAgICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcbiAgICAgICAgLy8gcGFyYW1ldGVyc1xuICAgICAgICBvblRvdWNoU3RhcnQ9e3N0YXJ0SGFuZGxlcn1cbiAgICAgICAgb25Ub3VjaE1vdmU9e2hhbmRsZVRvdWNoTW92ZUV2ZW50fVxuICAgICAgICBvblRvdWNoRW5kPXtoYW5kbGVUb3VjaEVuZEV2ZW50fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQpfVxuICAgICAgPC9HcmlkQ2VsbD5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlQ2VsbCA9ICh0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbik6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsKSB7XG4gICAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5zZXQoZGF0ZUNlbGwsIHRpbWUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCByZWZTZXR0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlQ2VsbFxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXtwcm9wcy5zZWxlY3RlZENvbG9yIX1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3Byb3BzLnVuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgaG92ZXJlZENvbG9yPXtwcm9wcy5ob3ZlcmVkQ29sb3IhfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmIChwcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0SW5UaW1lWm9uZSh0aW1lLCAnVVRDJywgcHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXRJblRpbWVab25lKGRhdGUsICdVVEMnLCBwcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJGdWxsRGF0ZUdyaWQgPSAoKTogQXJyYXk8SlNYLkVsZW1lbnQ+ID0+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gZGF0ZXMubGVuZ3RoXG4gICAgY29uc3QgbnVtVGltZXMgPSBkYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzOyBqICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGF5czsgaSArPSAxKSB7XG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2goZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAocmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IGRhdGVzWzBdW2ldXG4gICAgICAvLyBJbmplY3QgdGhlIHRpbWUgbGFiZWwgYXQgdGhlIHN0YXJ0IG9mIGV2ZXJ5IHJvd1xuICAgICAgZGF0ZUdyaWRFbGVtZW50cy5zcGxpY2UoaW5kZXggKyBpLCAwLCByZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4uZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KHJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KSksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxXcmFwcGVyPlxuICAgICAgPEdyaWRcbiAgICAgICAgY29sdW1ucz17ZGF0ZXMubGVuZ3RofVxuICAgICAgICByb3dzPXtkYXRlc1swXS5sZW5ndGh9XG4gICAgICAgIGNvbHVtbkdhcD17cHJvcHMuY29sdW1uR2FwIX1cbiAgICAgICAgcm93R2FwPXtwcm9wcy5yb3dHYXAhfVxuICAgICAgICByZWY9e2VsID0+IHtcbiAgICAgICAgICBncmlkUmVmLmN1cnJlbnQgPSBlbFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRnVsbERhdGVHcmlkKCl9XG4gICAgICA8L0dyaWQ+XG4gICAgPC9XcmFwcGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlU2VsZWN0b3JcblxuU2NoZWR1bGVTZWxlY3Rvci5kZWZhdWx0UHJvcHMgPSB7XG4gIHNlbGVjdGlvbjogW10sXG4gIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gIG51bURheXM6IDcsXG4gIG1pblRpbWU6IDksXG4gIG1heFRpbWU6IDIzLFxuICBob3VybHlDaHVua3M6IDEsXG4gIHN0YXJ0RGF0ZTogbmV3IERhdGUoKSxcbiAgdGltZUZvcm1hdDogJ2hhJyxcbiAgZGF0ZUZvcm1hdDogJ00vZCcsXG4gIGNvbHVtbkdhcDogJzRweCcsXG4gIHJvd0dhcDogJzRweCcsXG4gIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxuICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcbiAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIG9uQ2hhbmdlOiAoKSA9PiB7fVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE9BQUEsR0FBQUMsc0JBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLE9BQUEsR0FBQUgsT0FBQTtBQUNBLElBQUFJLE9BQUEsR0FBQUYsc0JB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