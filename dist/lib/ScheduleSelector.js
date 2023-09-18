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
  const [selectionDraft, setSelectionDraft] = (0, _react.useState)([...props.selection]);
  const selectionDraftRef = (0, _react.useRef)(selectionDraft);

  // Given an ending Date, determines all the dates that should be selected in this draft
  const selectionDraftHandler = (0, _react.useMemo)(() => {
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
  }, [selectionEnd]);

  /*
  const [selectionDraft, setSelectionDraft] = useState([...props.selection])
  */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9pbmRleCIsIl9kYXRlRm5zVHoiLCJfdXRjIiwiX3RlbXBsYXRlT2JqZWN0IiwiX3RlbXBsYXRlT2JqZWN0MiIsIl90ZW1wbGF0ZU9iamVjdDMiLCJfdGVtcGxhdGVPYmplY3Q0IiwiX3RlbXBsYXRlT2JqZWN0NSIsIl90ZW1wbGF0ZU9iamVjdDYiLCJfdGVtcGxhdGVPYmplY3Q3IiwiX3RlbXBsYXRlT2JqZWN0OCIsIl90ZW1wbGF0ZU9iamVjdDkiLCJfdGVtcGxhdGVPYmplY3QxMCIsIl90ZW1wbGF0ZU9iamVjdDExIiwiX3RlbXBsYXRlT2JqZWN0MTIiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsImNhY2hlIiwiaGFzIiwiZ2V0IiwibmV3T2JqIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9yIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2V0IiwiX3RhZ2dlZFRlbXBsYXRlTGl0ZXJhbCIsInN0cmluZ3MiLCJyYXciLCJzbGljZSIsImZyZWV6ZSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsIldyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJjc3MiLCJHcmlkIiwicHJvcHMiLCJjb2x1bW5zIiwicm93cyIsImNvbHVtbkdhcCIsInJvd0dhcCIsIkdyaWRDZWxsIiwiZXhwb3J0cyIsIkRhdGVDZWxsIiwic2VsZWN0ZWQiLCJzZWxlY3RlZENvbG9yIiwidW5zZWxlY3RlZENvbG9yIiwiaG92ZXJlZENvbG9yIiwiRGF0ZUxhYmVsIiwiU3VidGl0bGUiLCJUaW1lVGV4dCIsIlRleHQiLCJwcmV2ZW50U2Nyb2xsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY29tcHV0ZURhdGVzTWF0cml4Iiwic3RhcnRUaW1lIiwic3RhcnREYXRlIiwiZGF0ZXMiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsImQiLCJudW1EYXlzIiwiY3VycmVudERheSIsImgiLCJtaW5UaW1lIiwibWF4VGltZSIsImMiLCJuZXdEYXRlIiwiVVRDRGF0ZSIsImFkZE1pbnV0ZXMiLCJhZGRIb3VycyIsImFkZERheXMiLCJwdXNoIiwiU2NoZWR1bGVTZWxlY3RvciIsInNlbGVjdGlvblNjaGVtZUhhbmRsZXJzIiwibGluZWFyIiwic2VsZWN0aW9uU2NoZW1lcyIsInNxdWFyZSIsImNlbGxUb0RhdGUiLCJ1c2VSZWYiLCJNYXAiLCJncmlkUmVmIiwic2VsZWN0aW9uRW5kIiwic2V0U2VsZWN0aW9uYUVuZCIsInVzZVN0YXRlIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJzZWxlY3Rpb25EcmFmdCIsInNldFNlbGVjdGlvbkRyYWZ0Iiwic2VsZWN0aW9uIiwic2VsZWN0aW9uRHJhZnRSZWYiLCJzZWxlY3Rpb25EcmFmdEhhbmRsZXIiLCJ1c2VNZW1vIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYSIsImZpbmQiLCJiIiwiaXNTYW1lTWludXRlIiwiY3VycmVudCIsInVzZUVmZmVjdCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImVuZFNlbGVjdGlvbiIsImZvckVhY2giLCJkYXRlQ2VsbCIsInBhc3NpdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZ2V0VGltZUZyb21Ub3VjaEV2ZW50IiwiZXZlbnQiLCJ0b3VjaGVzIiwibGVuZ3RoIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsImNlbGxUaW1lIiwiX3NlbGVjdGlvbkRyYWZ0UmVmJGN1Iiwib25DaGFuZ2UiLCJoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50IiwidGltZVNlbGVjdGVkIiwiaGFuZGxlTW91c2VFbnRlckV2ZW50IiwidGltZSIsImhhbmRsZU1vdXNlVXBFdmVudCIsImhhbmRsZVRvdWNoTW92ZUV2ZW50IiwiaGFuZGxlVG91Y2hFbmRFdmVudCIsInJlbmRlckRhdGVDZWxsV3JhcHBlciIsInN0YXJ0SGFuZGxlciIsIkJvb2xlYW4iLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwicm9sZSIsInRvSVNPU3RyaW5nIiwib25Nb3VzZURvd24iLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlVXAiLCJvblRvdWNoU3RhcnQiLCJvblRvdWNoTW92ZSIsIm9uVG91Y2hFbmQiLCJyZW5kZXJEYXRlQ2VsbCIsInJlZlNldHRlciIsInJlZiIsInJlbmRlclRpbWVMYWJlbCIsImZvcm1hdEluVGltZVpvbmUiLCJ0aW1lRm9ybWF0IiwicmVuZGVyRGF0ZUxhYmVsIiwiZGF0ZSIsImRhdGVGb3JtYXQiLCJyZW5kZXJGdWxsRGF0ZUdyaWQiLCJmbGF0dGVuZWREYXRlcyIsIm51bVRpbWVzIiwiaiIsImkiLCJkYXRlR3JpZEVsZW1lbnRzIiwibWFwIiwiaW5kZXgiLCJzcGxpY2UiLCJkYXlPZlRpbWVzIiwiUmVhY3QiLCJjbG9uZUVsZW1lbnQiLCJjb25jYXQiLCJlbGVtZW50IiwiZWwiLCJfZGVmYXVsdCIsImRlZmF1bHRQcm9wcyIsIkRhdGUiLCJjb2xvcnMiLCJibHVlIiwicGFsZUJsdWUiLCJsaWdodEJsdWUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL1NjaGVkdWxlU2VsZWN0b3IudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnXG5pbXBvcnQgeyBjc3MgfSBmcm9tICdAZW1vdGlvbi9yZWFjdCdcbmltcG9ydCBzdHlsZWQgZnJvbSAnQGVtb3Rpb24vc3R5bGVkJ1xuaW1wb3J0IHsgU3VidGl0bGUsIFRleHQgfSBmcm9tICcuL3R5cG9ncmFwaHknXG5pbXBvcnQgeyBhZGREYXlzLCBhZGRIb3VycywgYWRkTWludXRlcywgaXNTYW1lTWludXRlLCBzdGFydE9mRGF5IH0gZnJvbSAnZGF0ZS1mbnMnXG5pbXBvcnQgZm9ybWF0RGF0ZSBmcm9tICdkYXRlLWZucy9mb3JtYXQnXG5pbXBvcnQgc2VsZWN0aW9uU2NoZW1lcywgeyBTZWxlY3Rpb25TY2hlbWVUeXBlLCBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9zZWxlY3Rpb24tc2NoZW1lcy9pbmRleCdcbmltcG9ydCB7IGZvcm1hdEluVGltZVpvbmUsIHpvbmVkVGltZVRvVXRjIH0gZnJvbSAnZGF0ZS1mbnMtdHonXG5pbXBvcnQgeyBVVENEYXRlLCBVVENEYXRlTWluaSB9IGZyb20gJ0BkYXRlLWZucy91dGMnXG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICAke2Nzc2BcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGB9XG5gXG5pbnRlcmZhY2UgSUdyaWRQcm9wcyB7XG4gIGNvbHVtbnM6IG51bWJlclxuICByb3dzOiBudW1iZXJcbiAgY29sdW1uR2FwOiBzdHJpbmdcbiAgcm93R2FwOiBzdHJpbmdcbn1cblxuY29uc3QgR3JpZCA9IHN0eWxlZC5kaXY8SUdyaWRQcm9wcz5gXG4gICR7cHJvcHMgPT4gY3NzYFxuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIHJlcGVhdCgke3Byb3BzLmNvbHVtbnN9LCAxZnIpO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byByZXBlYXQoJHtwcm9wcy5yb3dzfSwgMWZyKTtcbiAgICBjb2x1bW4tZ2FwOiAke3Byb3BzLmNvbHVtbkdhcH07XG4gICAgcm93LWdhcDogJHtwcm9wcy5yb3dHYXB9O1xuICAgIHdpZHRoOiAxMDAlO1xuICBgfVxuYFxuXG5leHBvcnQgY29uc3QgR3JpZENlbGwgPSBzdHlsZWQuZGl2YFxuICAke2Nzc2BcbiAgICBwbGFjZS1zZWxmOiBzdHJldGNoO1xuICAgIHRvdWNoLWFjdGlvbjogbm9uZTtcbiAgYH1cbmBcblxuaW50ZXJmYWNlIElEYXRlQ2VsbFByb3BzIHtcbiAgc2VsZWN0ZWQ6IGJvb2xlYW5cbiAgc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIHVuc2VsZWN0ZWRDb2xvcjogc3RyaW5nXG4gIGhvdmVyZWRDb2xvcjogc3RyaW5nXG59XG5cbmNvbnN0IERhdGVDZWxsID0gc3R5bGVkLmRpdjxJRGF0ZUNlbGxQcm9wcz5gXG4gICR7cHJvcHMgPT4gY3NzYFxuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMjVweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzLnNlbGVjdGVkID8gcHJvcHMuc2VsZWN0ZWRDb2xvciA6IHByb3BzLnVuc2VsZWN0ZWRDb2xvcn07XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMuaG92ZXJlZENvbG9yfTtcbiAgICB9XG4gIGB9XG5gXG5cbmNvbnN0IERhdGVMYWJlbCA9IHN0eWxlZChTdWJ0aXRsZSlgXG4gICR7Y3NzYFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgIH1cbiAgICBtYXJnaW46IDA7XG4gICAgbWFyZ2luLWJvdHRvbTogNHB4O1xuICBgfVxuYFxuXG5jb25zdCBUaW1lVGV4dCA9IHN0eWxlZChUZXh0KWBcbiAgJHtjc3NgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY5OXB4KSB7XG4gICAgICBmb250LXNpemU6IDEwcHg7XG4gICAgfVxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIG1hcmdpbjogMDtcbiAgICBtYXJnaW4tcmlnaHQ6IDRweDtcbiAgYH1cbmBcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1pbnRlcmZhY2VcbmV4cG9ydCBpbnRlcmZhY2UgSVNjaGVkdWxlU2VsZWN0b3JQcm9wcyB7XG4gIHNlbGVjdGlvbjogQXJyYXk8RGF0ZT5cbiAgc2VsZWN0aW9uU2NoZW1lOiBTZWxlY3Rpb25TY2hlbWVUeXBlXG4gIG9uQ2hhbmdlOiAobmV3U2VsZWN0aW9uOiBBcnJheTxEYXRlPikgPT4gdm9pZFxuICBzdGFydERhdGU6IERhdGUgfCBVVENEYXRlXG4gIG51bURheXM6IG51bWJlclxuICBtaW5UaW1lOiBudW1iZXJcbiAgbWF4VGltZTogbnVtYmVyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xuICB0aW1lRm9ybWF0OiBzdHJpbmdcbiAgY29sdW1uR2FwPzogc3RyaW5nXG4gIHJvd0dhcD86IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgc2VsZWN0ZWRDb2xvcj86IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I/OiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmNvbnN0IGNvbXB1dGVEYXRlc01hdHJpeCA9IChwcm9wczogSVNjaGVkdWxlU2VsZWN0b3JQcm9wcyk6IEFycmF5PEFycmF5PERhdGU+PiA9PiB7XG4gIGNvbnN0IHN0YXJ0VGltZSA9IHByb3BzLnN0YXJ0RGF0ZVxuXG4gIGNvbnN0IGRhdGVzOiBBcnJheTxBcnJheTxEYXRlPj4gPSBbXVxuICBjb25zdCBtaW51dGVzSW5DaHVuayA9IE1hdGguZmxvb3IoNjAgLyBwcm9wcy5ob3VybHlDaHVua3MpXG4gIGZvciAobGV0IGQgPSAwOyBkIDwgcHJvcHMubnVtRGF5czsgZCArPSAxKSB7XG4gICAgY29uc3QgY3VycmVudERheSA9IFtdXG4gICAgZm9yIChsZXQgaCA9IHByb3BzLm1pblRpbWU7IGggPCBwcm9wcy5tYXhUaW1lOyBoICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcHJvcHMuaG91cmx5Q2h1bmtzOyBjICs9IDEpIHtcbiAgICAgICAgY29uc3QgbmV3RGF0ZSA9IG5ldyBVVENEYXRlKGFkZE1pbnV0ZXMoYWRkSG91cnMoYWRkRGF5cyhzdGFydFRpbWUsIGQpLCBoKSwgYyAqIG1pbnV0ZXNJbkNodW5rKSlcbiAgICAgICAgY3VycmVudERheS5wdXNoKG5ld0RhdGUpXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgfVxuICByZXR1cm4gZGF0ZXNcbn1cblxuZXhwb3J0IGNvbnN0IFNjaGVkdWxlU2VsZWN0b3I6IFJlYWN0LkZDPElTY2hlZHVsZVNlbGVjdG9yUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCBzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgfVxuICBjb25zdCBjZWxsVG9EYXRlID0gdXNlUmVmPE1hcDxFbGVtZW50LCBEYXRlPj4obmV3IE1hcCgpKVxuICBjb25zdCBncmlkUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbClcbiAgY29uc3QgW3NlbGVjdGlvbkVuZCwgc2V0U2VsZWN0aW9uYUVuZF0gPSB1c2VTdGF0ZTxEYXRlIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW3NlbGVjdGlvblR5cGUsIHNldFNlbGVjdGlvblR5cGVdID0gdXNlU3RhdGU8U2VsZWN0aW9uVHlwZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25TdGFydCwgc2V0U2VsZWN0aW9uU3RhcnRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1RvdWNoRHJhZ2dpbmcsIHNldElzVG91Y2hEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGVzLCBzZXREYXRlc10gPSB1c2VTdGF0ZShjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpKVxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcblxuICAvLyBHaXZlbiBhbiBlbmRpbmcgRGF0ZSwgZGV0ZXJtaW5lcyBhbGwgdGhlIGRhdGVzIHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGluIHRoaXMgZHJhZnRcbiAgY29uc3Qgc2VsZWN0aW9uRHJhZnRIYW5kbGVyID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbcHJvcHMuc2VsZWN0aW9uU2NoZW1lXShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kLCBkYXRlcylcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25EcmFmdFJlZi5jdXJyZW50ID0gbmV4dERyYWZ0XG4gICAgc2V0U2VsZWN0aW9uRHJhZnQobmV4dERyYWZ0KVxuICB9LCBbc2VsZWN0aW9uRW5kXSlcblxuICAvKlxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuKi9cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFdlIG5lZWQgdG8gYWRkIHRoZSBlbmRTZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50IGl0c2VsZiBpbiBvcmRlclxuICAgIC8vIHRvIGNhdGNoIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlcnMgZW5kcyB0aGVpciBtb3VzZS1jbGljayBzb21ld2hlcmUgYmVzaWRlc1xuICAgIC8vIHRoZSBkYXRlIGNlbGxzIChpbiB3aGljaCBjYXNlIG5vbmUgb2YgdGhlIERhdGVDZWxsJ3Mgb25Nb3VzZVVwIGhhbmRsZXJzIHdvdWxkIGZpcmUpXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzbid0IG5lY2Vzc2FyeSBmb3IgdG91Y2ggZXZlbnRzIHNpbmNlIHRoZSBgdG91Y2hlbmRgIGV2ZW50IGZpcmVzIG9uXG4gICAgLy8gdGhlIGVsZW1lbnQgd2hlcmUgdGhlIHRvdWNoL2RyYWcgc3RhcnRlZCBzbyBpdCdzIGFsd2F5cyBjYXVnaHQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcblxuICAgIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmcgd2hlbiB1c2VyIGlzIGRyYWdnaW5nIG9uIHRoZSBkYXRlIGNlbGxzXG4gICAgY2VsbFRvRGF0ZS5jdXJyZW50LmZvckVhY2goKHZhbHVlLCBkYXRlQ2VsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGRhdGVDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwsIHsgcGFzc2l2ZTogZmFsc2UgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmRTZWxlY3Rpb24pXG4gICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICAgIGlmIChkYXRlQ2VsbCAmJiBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBkYXRlQ2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50U2Nyb2xsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSwgW10pXG5cbiAgLy8gUGVyZm9ybXMgYSBsb29rdXAgaW50byB0aGlzLmNlbGxUb0RhdGUgdG8gcmV0cmlldmUgdGhlIERhdGUgdGhhdCBjb3JyZXNwb25kcyB0b1xuICAvLyB0aGUgY2VsbCB3aGVyZSB0aGlzIHRvdWNoIGV2ZW50IGlzIHJpZ2h0IG5vdy4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIHdpbGwgb25seSB3b3JrXG4gIC8vIGlmIHRoZSBldmVudCBpcyBhIGB0b3VjaG1vdmVgIGV2ZW50IHNpbmNlIGl0J3MgdGhlIG9ubHkgb25lIHRoYXQgaGFzIGEgYHRvdWNoZXNgIGxpc3QuXG4gIGNvbnN0IGdldFRpbWVGcm9tVG91Y2hFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudDxhbnk+KTogRGF0ZSB8IG51bGwgPT4ge1xuICAgIGNvbnN0IHsgdG91Y2hlcyB9ID0gZXZlbnRcbiAgICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsXG4gICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSB0b3VjaGVzWzBdXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY2xpZW50WCwgY2xpZW50WSlcbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgY29uc3QgY2VsbFRpbWUgPSBjZWxsVG9EYXRlLmN1cnJlbnQuZ2V0KHRhcmdldEVsZW1lbnQpXG4gICAgICByZXR1cm4gY2VsbFRpbWUgPz8gbnVsbFxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgY29uc3QgZW5kU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgIHByb3BzLm9uQ2hhbmdlKHNlbGVjdGlvbkRyYWZ0UmVmLmN1cnJlbnQgPz8gW10pXG4gICAgc2V0U2VsZWN0aW9uVHlwZShudWxsKVxuICAgIHNldFNlbGVjdGlvblN0YXJ0KG51bGwpXG4gIH1cblxuICAvLyBJc29tb3JwaGljIChtb3VzZSBhbmQgdG91Y2gpIGhhbmRsZXIgc2luY2Ugc3RhcnRpbmcgYSBzZWxlY3Rpb24gd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIGNsYXNzZXMgb2YgdXNlciBpbnB1dFxuICBjb25zdCBoYW5kbGVTZWxlY3Rpb25TdGFydEV2ZW50ID0gKHN0YXJ0VGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIENoZWNrIGlmIHRoZSBzdGFydFRpbWUgY2VsbCBpcyBzZWxlY3RlZC91bnNlbGVjdGVkIHRvIGRldGVybWluZSBpZiB0aGlzIGRyYWctc2VsZWN0IHNob3VsZFxuICAgIC8vIGFkZCB2YWx1ZXMgb3IgcmVtb3ZlIHZhbHVlc1xuICAgIGNvbnN0IHRpbWVTZWxlY3RlZCA9IHByb3BzLnNlbGVjdGlvbi5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHN0YXJ0VGltZSkpXG4gICAgc2V0U2VsZWN0aW9uVHlwZSh0aW1lU2VsZWN0ZWQgPyAncmVtb3ZlJyA6ICdhZGQnKVxuICAgIHNldFNlbGVjdGlvblN0YXJ0KHN0YXJ0VGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlRW50ZXJFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgLy8gTmVlZCB0byB1cGRhdGUgc2VsZWN0aW9uIGRyYWZ0IG9uIG1vdXNldXAgYXMgd2VsbCBpbiBvcmRlciB0byBjYXRjaCB0aGUgY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgdXNlciBqdXN0IGNsaWNrcyBvbiBhIHNpbmdsZSBjZWxsIChiZWNhdXNlIG5vIG1vdXNlZW50ZXIgZXZlbnRzIGZpcmVcbiAgICAvLyBpbiB0aGlzIHNjZW5hcmlvKVxuICAgIHNldFNlbGVjdGlvbmFFbmQodGltZSlcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU1vdXNlVXBFdmVudCA9ICh0aW1lOiBEYXRlKSA9PiB7XG4gICAgc2V0U2VsZWN0aW9uYUVuZCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaE1vdmVFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIHNldElzVG91Y2hEcmFnZ2luZyh0cnVlKVxuICAgIGNvbnN0IGNlbGxUaW1lID0gZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgc2V0U2VsZWN0aW9uYUVuZChjZWxsVGltZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaEVuZEV2ZW50ID0gKCkgPT4ge1xuICAgIGlmICghaXNUb3VjaERyYWdnaW5nKSB7XG4gICAgICBzZXRTZWxlY3Rpb25hRW5kKG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZFNlbGVjdGlvbigpXG4gICAgfVxuICAgIHNldElzVG91Y2hEcmFnZ2luZyhmYWxzZSlcbiAgfVxuXG4gIGNvbnN0IHJlbmRlckRhdGVDZWxsV3JhcHBlciA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcbiAgICAgIGhhbmRsZVNlbGVjdGlvblN0YXJ0RXZlbnQodGltZSlcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IEJvb2xlYW4oc2VsZWN0aW9uRHJhZnQ/LmZpbmQoYSA9PiBpc1NhbWVNaW51dGUoYSwgdGltZSkpKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkQ2VsbFxuICAgICAgICBjbGFzc05hbWU9XCJyZ2RwX19ncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgICAga2V5PXt0aW1lLnRvSVNPU3RyaW5nKCl9XG4gICAgICAgIC8vIE1vdXNlIGhhbmRsZXJzXG4gICAgICAgIG9uTW91c2VEb3duPXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIGhhbmRsZU1vdXNlRW50ZXJFdmVudCh0aW1lKVxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZVVwRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgLy8gVG91Y2ggaGFuZGxlcnNcbiAgICAgICAgLy8gU2luY2UgdG91Y2ggZXZlbnRzIGZpcmUgb24gdGhlIGV2ZW50IHdoZXJlIHRoZSB0b3VjaC1kcmFnIHN0YXJ0ZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gcGFzc2luZ1xuICAgICAgICAvLyBpbiB0aGUgdGltZSBwYXJhbWV0ZXIsIGluc3RlYWQgdGhlc2UgaGFuZGxlcnMgd2lsbCBkbyB0aGVpciBqb2IgdXNpbmcgdGhlIGRlZmF1bHQgRXZlbnRcbiAgICAgICAgLy8gcGFyYW1ldGVyc1xuICAgICAgICBvblRvdWNoU3RhcnQ9e3N0YXJ0SGFuZGxlcn1cbiAgICAgICAgb25Ub3VjaE1vdmU9e2hhbmRsZVRvdWNoTW92ZUV2ZW50fVxuICAgICAgICBvblRvdWNoRW5kPXtoYW5kbGVUb3VjaEVuZEV2ZW50fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRGF0ZUNlbGwodGltZSwgc2VsZWN0ZWQpfVxuICAgICAgPC9HcmlkQ2VsbD5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlQ2VsbCA9ICh0aW1lOiBEYXRlLCBzZWxlY3RlZDogYm9vbGVhbik6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBjb25zdCByZWZTZXR0ZXIgPSAoZGF0ZUNlbGw6IEhUTUxFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKGRhdGVDZWxsKSB7XG4gICAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5zZXQoZGF0ZUNlbGwsIHRpbWUpXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZW5kZXJEYXRlQ2VsbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkLCByZWZTZXR0ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlQ2VsbFxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cbiAgICAgICAgICByZWY9e3JlZlNldHRlcn1cbiAgICAgICAgICBzZWxlY3RlZENvbG9yPXtwcm9wcy5zZWxlY3RlZENvbG9yIX1cbiAgICAgICAgICB1bnNlbGVjdGVkQ29sb3I9e3Byb3BzLnVuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgaG92ZXJlZENvbG9yPXtwcm9wcy5ob3ZlcmVkQ29sb3IhfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlclRpbWVMYWJlbCA9ICh0aW1lOiBEYXRlKTogSlNYLkVsZW1lbnQgPT4ge1xuICAgIGlmIChwcm9wcy5yZW5kZXJUaW1lTGFiZWwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJUaW1lTGFiZWwodGltZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxUaW1lVGV4dD57Zm9ybWF0SW5UaW1lWm9uZSh0aW1lLCAnVVRDJywgcHJvcHMudGltZUZvcm1hdCl9PC9UaW1lVGV4dD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJEYXRlTGFiZWwgPSAoZGF0ZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyRGF0ZUxhYmVsKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8RGF0ZUxhYmVsPntmb3JtYXRJblRpbWVab25lKGRhdGUsICdVVEMnLCBwcm9wcy5kYXRlRm9ybWF0KX08L0RhdGVMYWJlbD5cbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJGdWxsRGF0ZUdyaWQgPSAoKTogQXJyYXk8SlNYLkVsZW1lbnQ+ID0+IHtcbiAgICBjb25zdCBmbGF0dGVuZWREYXRlczogRGF0ZVtdID0gW11cbiAgICBjb25zdCBudW1EYXlzID0gZGF0ZXMubGVuZ3RoXG4gICAgY29uc3QgbnVtVGltZXMgPSBkYXRlc1swXS5sZW5ndGhcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVRpbWVzOyBqICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGF5czsgaSArPSAxKSB7XG4gICAgICAgIGZsYXR0ZW5lZERhdGVzLnB1c2goZGF0ZXNbaV1bal0pXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRhdGVHcmlkRWxlbWVudHMgPSBmbGF0dGVuZWREYXRlcy5tYXAocmVuZGVyRGF0ZUNlbGxXcmFwcGVyKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtVGltZXM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaW5kZXggPSBpICogbnVtRGF5c1xuICAgICAgY29uc3QgdGltZSA9IGRhdGVzWzBdW2ldXG4gICAgICAvLyBJbmplY3QgdGhlIHRpbWUgbGFiZWwgYXQgdGhlIHN0YXJ0IG9mIGV2ZXJ5IHJvd1xuICAgICAgZGF0ZUdyaWRFbGVtZW50cy5zcGxpY2UoaW5kZXggKyBpLCAwLCByZW5kZXJUaW1lTGFiZWwodGltZSkpXG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAvLyBFbXB0eSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgIDxkaXYga2V5PVwidG9wbGVmdFwiIC8+LFxuICAgICAgLy8gVG9wIHJvdyBvZiBkYXRlc1xuICAgICAgLi4uZGF0ZXMubWFwKChkYXlPZlRpbWVzLCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KHJlbmRlckRhdGVMYWJlbChkYXlPZlRpbWVzWzBdKSwgeyBrZXk6IGBkYXRlLSR7aW5kZXh9YCB9KSksXG4gICAgICAvLyBFdmVyeSByb3cgYWZ0ZXIgdGhhdFxuICAgICAgLi4uZGF0ZUdyaWRFbGVtZW50cy5tYXAoKGVsZW1lbnQsIGluZGV4KSA9PiBSZWFjdC5jbG9uZUVsZW1lbnQoZWxlbWVudCwgeyBrZXk6IGB0aW1lLSR7aW5kZXh9YCB9KSlcbiAgICBdXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxXcmFwcGVyPlxuICAgICAgPEdyaWRcbiAgICAgICAgY29sdW1ucz17ZGF0ZXMubGVuZ3RofVxuICAgICAgICByb3dzPXtkYXRlc1swXS5sZW5ndGh9XG4gICAgICAgIGNvbHVtbkdhcD17cHJvcHMuY29sdW1uR2FwIX1cbiAgICAgICAgcm93R2FwPXtwcm9wcy5yb3dHYXAhfVxuICAgICAgICByZWY9e2VsID0+IHtcbiAgICAgICAgICBncmlkUmVmLmN1cnJlbnQgPSBlbFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7cmVuZGVyRnVsbERhdGVHcmlkKCl9XG4gICAgICA8L0dyaWQ+XG4gICAgPC9XcmFwcGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlU2VsZWN0b3JcblxuU2NoZWR1bGVTZWxlY3Rvci5kZWZhdWx0UHJvcHMgPSB7XG4gIHNlbGVjdGlvbjogW10sXG4gIHNlbGVjdGlvblNjaGVtZTogJ3NxdWFyZScsXG4gIG51bURheXM6IDcsXG4gIG1pblRpbWU6IDksXG4gIG1heFRpbWU6IDIzLFxuICBob3VybHlDaHVua3M6IDEsXG4gIHN0YXJ0RGF0ZTogbmV3IERhdGUoKSxcbiAgdGltZUZvcm1hdDogJ2hhJyxcbiAgZGF0ZUZvcm1hdDogJ00vZCcsXG4gIGNvbHVtbkdhcDogJzRweCcsXG4gIHJvd0dhcDogJzRweCcsXG4gIHNlbGVjdGVkQ29sb3I6IGNvbG9ycy5ibHVlLFxuICB1bnNlbGVjdGVkQ29sb3I6IGNvbG9ycy5wYWxlQmx1ZSxcbiAgaG92ZXJlZENvbG9yOiBjb2xvcnMubGlnaHRCbHVlLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gIG9uQ2hhbmdlOiAoKSA9PiB7fVxufVxuIl0sIm1hcHBpbmdz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