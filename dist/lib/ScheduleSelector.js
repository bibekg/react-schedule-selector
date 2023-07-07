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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsInJlcXVpcmUiLCJfY29sb3JzIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9yZWFjdDIiLCJfc3R5bGVkIiwiX3R5cG9ncmFwaHkiLCJfZGF0ZUZucyIsIl9pbmRleCIsIl9kYXRlRm5zVHoiLCJfdGVtcGxhdGVPYmplY3QiLCJfdGVtcGxhdGVPYmplY3QyIiwiX3RlbXBsYXRlT2JqZWN0MyIsIl90ZW1wbGF0ZU9iamVjdDQiLCJfdGVtcGxhdGVPYmplY3Q1IiwiX3RlbXBsYXRlT2JqZWN0NiIsIl90ZW1wbGF0ZU9iamVjdDciLCJfdGVtcGxhdGVPYmplY3Q4IiwiX3RlbXBsYXRlT2JqZWN0OSIsIl90ZW1wbGF0ZU9iamVjdDEwIiwiX3RlbXBsYXRlT2JqZWN0MTEiLCJfdGVtcGxhdGVPYmplY3QxMiIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlIiwibm9kZUludGVyb3AiLCJXZWFrTWFwIiwiY2FjaGVCYWJlbEludGVyb3AiLCJjYWNoZU5vZGVJbnRlcm9wIiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJfdGFnZ2VkVGVtcGxhdGVMaXRlcmFsIiwic3RyaW5ncyIsInJhdyIsInNsaWNlIiwiZnJlZXplIiwiZGVmaW5lUHJvcGVydGllcyIsInZhbHVlIiwiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsImNzcyIsIkdyaWQiLCJwcm9wcyIsImNvbHVtbnMiLCJyb3dzIiwiY29sdW1uR2FwIiwicm93R2FwIiwiR3JpZENlbGwiLCJleHBvcnRzIiwiRGF0ZUNlbGwiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ29sb3IiLCJ1bnNlbGVjdGVkQ29sb3IiLCJob3ZlcmVkQ29sb3IiLCJEYXRlTGFiZWwiLCJTdWJ0aXRsZSIsIlRpbWVUZXh0IiwiVGV4dCIsInByZXZlbnRTY3JvbGwiLCJlIiwicHJldmVudERlZmF1bHQiLCJjb21wdXRlRGF0ZXNNYXRyaXgiLCJzdGFydFRpbWUiLCJzdGFydE9mRGF5Iiwic3RhcnREYXRlIiwiZGF0ZXMiLCJtaW51dGVzSW5DaHVuayIsIk1hdGgiLCJmbG9vciIsImhvdXJseUNodW5rcyIsImQiLCJudW1EYXlzIiwiY3VycmVudERheSIsImgiLCJtaW5UaW1lIiwibWF4VGltZSIsImMiLCJwdXNoIiwiYWRkTWludXRlcyIsImFkZEhvdXJzIiwiYWRkRGF5cyIsIlNjaGVkdWxlU2VsZWN0b3IiLCJzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyIsImxpbmVhciIsInNlbGVjdGlvblNjaGVtZXMiLCJzcXVhcmUiLCJjZWxsVG9EYXRlIiwidXNlUmVmIiwiTWFwIiwiZ3JpZFJlZiIsInNlbGVjdGlvbkRyYWZ0Iiwic2V0U2VsZWN0aW9uRHJhZnQiLCJ1c2VTdGF0ZSIsInNlbGVjdGlvbiIsInNlbGVjdGlvbkRyYWZ0UmVmIiwic2VsZWN0aW9uVHlwZSIsInNldFNlbGVjdGlvblR5cGUiLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblN0YXJ0IiwiaXNUb3VjaERyYWdnaW5nIiwic2V0SXNUb3VjaERyYWdnaW5nIiwic2V0RGF0ZXMiLCJ1c2VFZmZlY3QiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmRTZWxlY3Rpb24iLCJjdXJyZW50IiwiZm9yRWFjaCIsImRhdGVDZWxsIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJnZXRUaW1lRnJvbVRvdWNoRXZlbnQiLCJldmVudCIsInRvdWNoZXMiLCJsZW5ndGgiLCJjbGllbnRYIiwiY2xpZW50WSIsInRhcmdldEVsZW1lbnQiLCJlbGVtZW50RnJvbVBvaW50IiwiY2VsbFRpbWUiLCJvbkNoYW5nZSIsInVwZGF0ZUF2YWlsYWJpbGl0eURyYWZ0Iiwic2VsZWN0aW9uRW5kIiwibmV3U2VsZWN0aW9uIiwic2VsZWN0aW9uU2NoZW1lIiwibmV4dERyYWZ0IiwiQXJyYXkiLCJmcm9tIiwiU2V0IiwiZmlsdGVyIiwiYSIsImZpbmQiLCJiIiwiaXNTYW1lTWludXRlIiwiaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCIsInRpbWVTZWxlY3RlZCIsImhhbmRsZU1vdXNlRW50ZXJFdmVudCIsInRpbWUiLCJoYW5kbGVNb3VzZVVwRXZlbnQiLCJoYW5kbGVUb3VjaE1vdmVFdmVudCIsImhhbmRsZVRvdWNoRW5kRXZlbnQiLCJyZW5kZXJEYXRlQ2VsbFdyYXBwZXIiLCJzdGFydEhhbmRsZXIiLCJCb29sZWFuIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInJvbGUiLCJ0b0lTT1N0cmluZyIsIm9uTW91c2VEb3duIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZVVwIiwib25Ub3VjaFN0YXJ0Iiwib25Ub3VjaE1vdmUiLCJvblRvdWNoRW5kIiwicmVuZGVyRGF0ZUNlbGwiLCJyZWZTZXR0ZXIiLCJyZWYiLCJyZW5kZXJUaW1lTGFiZWwiLCJmb3JtYXRJblRpbWVab25lIiwidGltZUZvcm1hdCIsInJlbmRlckRhdGVMYWJlbCIsImRhdGUiLCJkYXRlRm9ybWF0IiwicmVuZGVyRnVsbERhdGVHcmlkIiwiZmxhdHRlbmVkRGF0ZXMiLCJudW1UaW1lcyIsImoiLCJpIiwiZGF0ZUdyaWRFbGVtZW50cyIsIm1hcCIsImluZGV4Iiwic3BsaWNlIiwiZGF5T2ZUaW1lcyIsIlJlYWN0IiwiY2xvbmVFbGVtZW50IiwiY29uY2F0IiwiZWxlbWVudCIsImVsIiwiX2RlZmF1bHQiLCJkZWZhdWx0UHJvcHMiLCJEYXRlIiwiY29sb3JzIiwiYmx1ZSIsInBhbGVCbHVlIiwibGlnaHRCbHVlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9TY2hlZHVsZVNlbGVjdG9yLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJ1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnQGVtb3Rpb24vcmVhY3QnXG5pbXBvcnQgc3R5bGVkIGZyb20gJ0BlbW90aW9uL3N0eWxlZCdcbmltcG9ydCB7IFN1YnRpdGxlLCBUZXh0IH0gZnJvbSAnLi90eXBvZ3JhcGh5J1xuaW1wb3J0IHsgYWRkRGF5cywgYWRkSG91cnMsIGFkZE1pbnV0ZXMsIGlzU2FtZU1pbnV0ZSwgc3RhcnRPZkRheSB9IGZyb20gJ2RhdGUtZm5zJ1xuaW1wb3J0IGZvcm1hdERhdGUgZnJvbSAnZGF0ZS1mbnMvZm9ybWF0J1xuaW1wb3J0IHNlbGVjdGlvblNjaGVtZXMsIHsgU2VsZWN0aW9uU2NoZW1lVHlwZSwgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vc2VsZWN0aW9uLXNjaGVtZXMvaW5kZXgnXG5pbXBvcnQgeyBmb3JtYXRJblRpbWVab25lLCB6b25lZFRpbWVUb1V0YyB9IGZyb20gJ2RhdGUtZm5zLXR6J1xuXG5jb25zdCBXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgJHtjc3NgXG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICBgfVxuYFxuaW50ZXJmYWNlIElHcmlkUHJvcHMge1xuICBjb2x1bW5zOiBudW1iZXJcbiAgcm93czogbnVtYmVyXG4gIGNvbHVtbkdhcDogc3RyaW5nXG4gIHJvd0dhcDogc3RyaW5nXG59XG5cbmNvbnN0IEdyaWQgPSBzdHlsZWQuZGl2PElHcmlkUHJvcHM+YFxuICAke3Byb3BzID0+IGNzc2BcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byByZXBlYXQoJHtwcm9wcy5jb2x1bW5zfSwgMWZyKTtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG8gcmVwZWF0KCR7cHJvcHMucm93c30sIDFmcik7XG4gICAgY29sdW1uLWdhcDogJHtwcm9wcy5jb2x1bW5HYXB9O1xuICAgIHJvdy1nYXA6ICR7cHJvcHMucm93R2FwfTtcbiAgICB3aWR0aDogMTAwJTtcbiAgYH1cbmBcblxuZXhwb3J0IGNvbnN0IEdyaWRDZWxsID0gc3R5bGVkLmRpdmBcbiAgJHtjc3NgXG4gICAgcGxhY2Utc2VsZjogc3RyZXRjaDtcbiAgICB0b3VjaC1hY3Rpb246IG5vbmU7XG4gIGB9XG5gXG5cbmludGVyZmFjZSBJRGF0ZUNlbGxQcm9wcyB7XG4gIHNlbGVjdGVkOiBib29sZWFuXG4gIHNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I6IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I6IHN0cmluZ1xufVxuXG5jb25zdCBEYXRlQ2VsbCA9IHN0eWxlZC5kaXY8SURhdGVDZWxsUHJvcHM+YFxuICAke3Byb3BzID0+IGNzc2BcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDI1cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcy5zZWxlY3RlZCA/IHByb3BzLnNlbGVjdGVkQ29sb3IgOiBwcm9wcy51bnNlbGVjdGVkQ29sb3J9O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzLmhvdmVyZWRDb2xvcn07XG4gICAgfVxuICBgfVxuYFxuXG5jb25zdCBEYXRlTGFiZWwgPSBzdHlsZWQoU3VidGl0bGUpYFxuICAke2Nzc2BcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjk5cHgpIHtcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICB9XG4gICAgbWFyZ2luOiAwO1xuICAgIG1hcmdpbi1ib3R0b206IDRweDtcbiAgYH1cbmBcblxuY29uc3QgVGltZVRleHQgPSBzdHlsZWQoVGV4dClgXG4gICR7Y3NzYFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2OTlweCkge1xuICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgIH1cbiAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICBtYXJnaW46IDA7XG4gICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gIGB9XG5gXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktaW50ZXJmYWNlXG5leHBvcnQgaW50ZXJmYWNlIElTY2hlZHVsZVNlbGVjdG9yUHJvcHMge1xuICBzZWxlY3Rpb246IEFycmF5PERhdGU+XG4gIHNlbGVjdGlvblNjaGVtZTogU2VsZWN0aW9uU2NoZW1lVHlwZVxuICBvbkNoYW5nZTogKG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4pID0+IHZvaWRcbiAgc3RhcnREYXRlOiBEYXRlXG4gIG51bURheXM6IG51bWJlclxuICBtaW5UaW1lOiBudW1iZXJcbiAgbWF4VGltZTogbnVtYmVyXG4gIGhvdXJseUNodW5rczogbnVtYmVyXG4gIGRhdGVGb3JtYXQ6IHN0cmluZ1xuICB0aW1lRm9ybWF0OiBzdHJpbmdcbiAgY29sdW1uR2FwPzogc3RyaW5nXG4gIHJvd0dhcD86IHN0cmluZ1xuICB1bnNlbGVjdGVkQ29sb3I/OiBzdHJpbmdcbiAgc2VsZWN0ZWRDb2xvcj86IHN0cmluZ1xuICBob3ZlcmVkQ29sb3I/OiBzdHJpbmdcbiAgcmVuZGVyRGF0ZUNlbGw/OiAoZGF0ZXRpbWU6IERhdGUsIHNlbGVjdGVkOiBib29sZWFuLCByZWZTZXR0ZXI6IChkYXRlQ2VsbEVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB2b2lkKSA9PiBKU1guRWxlbWVudFxuICByZW5kZXJUaW1lTGFiZWw/OiAodGltZTogRGF0ZSkgPT4gSlNYLkVsZW1lbnRcbiAgcmVuZGVyRGF0ZUxhYmVsPzogKGRhdGU6IERhdGUpID0+IEpTWC5FbGVtZW50XG59XG5cbmV4cG9ydCBjb25zdCBwcmV2ZW50U2Nyb2xsID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmNvbnN0IGNvbXB1dGVEYXRlc01hdHJpeCA9IChwcm9wczogSVNjaGVkdWxlU2VsZWN0b3JQcm9wcyk6IEFycmF5PEFycmF5PERhdGU+PiA9PiB7XG4gIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0T2ZEYXkocHJvcHMuc3RhcnREYXRlKVxuICBjb25zdCBkYXRlczogQXJyYXk8QXJyYXk8RGF0ZT4+ID0gW11cbiAgY29uc3QgbWludXRlc0luQ2h1bmsgPSBNYXRoLmZsb29yKDYwIC8gcHJvcHMuaG91cmx5Q2h1bmtzKVxuICBmb3IgKGxldCBkID0gMDsgZCA8IHByb3BzLm51bURheXM7IGQgKz0gMSkge1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBbXVxuICAgIGZvciAobGV0IGggPSBwcm9wcy5taW5UaW1lOyBoIDwgcHJvcHMubWF4VGltZTsgaCArPSAxKSB7XG4gICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHByb3BzLmhvdXJseUNodW5rczsgYyArPSAxKSB7XG4gICAgICAgIGN1cnJlbnREYXkucHVzaChhZGRNaW51dGVzKGFkZEhvdXJzKGFkZERheXMoc3RhcnRUaW1lLCBkKSwgaCksIGMgKiBtaW51dGVzSW5DaHVuaykpXG4gICAgICB9XG4gICAgfVxuICAgIGRhdGVzLnB1c2goY3VycmVudERheSlcbiAgfVxuICByZXR1cm4gZGF0ZXNcbn1cblxuZXhwb3J0IGNvbnN0IFNjaGVkdWxlU2VsZWN0b3I6IFJlYWN0LkZDPElTY2hlZHVsZVNlbGVjdG9yUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCBzZWxlY3Rpb25TY2hlbWVIYW5kbGVycyA9IHtcbiAgICBsaW5lYXI6IHNlbGVjdGlvblNjaGVtZXMubGluZWFyLFxuICAgIHNxdWFyZTogc2VsZWN0aW9uU2NoZW1lcy5zcXVhcmVcbiAgfVxuICBjb25zdCBjZWxsVG9EYXRlID0gdXNlUmVmPE1hcDxFbGVtZW50LCBEYXRlPj4obmV3IE1hcCgpKVxuICBjb25zdCBncmlkUmVmID0gdXNlUmVmPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbClcblxuICBjb25zdCBbc2VsZWN0aW9uRHJhZnQsIHNldFNlbGVjdGlvbkRyYWZ0XSA9IHVzZVN0YXRlKFsuLi5wcm9wcy5zZWxlY3Rpb25dKVxuICBjb25zdCBzZWxlY3Rpb25EcmFmdFJlZiA9IHVzZVJlZihzZWxlY3Rpb25EcmFmdClcbiAgY29uc3QgW3NlbGVjdGlvblR5cGUsIHNldFNlbGVjdGlvblR5cGVdID0gdXNlU3RhdGU8U2VsZWN0aW9uVHlwZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3Rpb25TdGFydCwgc2V0U2VsZWN0aW9uU3RhcnRdID0gdXNlU3RhdGU8RGF0ZSB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtpc1RvdWNoRHJhZ2dpbmcsIHNldElzVG91Y2hEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2RhdGVzLCBzZXREYXRlc10gPSB1c2VTdGF0ZShjb21wdXRlRGF0ZXNNYXRyaXgocHJvcHMpKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byBhZGQgdGhlIGVuZFNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZG9jdW1lbnQgaXRzZWxmIGluIG9yZGVyXG4gICAgLy8gdG8gY2F0Y2ggdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VycyBlbmRzIHRoZWlyIG1vdXNlLWNsaWNrIHNvbWV3aGVyZSBiZXNpZGVzXG4gICAgLy8gdGhlIGRhdGUgY2VsbHMgKGluIHdoaWNoIGNhc2Ugbm9uZSBvZiB0aGUgRGF0ZUNlbGwncyBvbk1vdXNlVXAgaGFuZGxlcnMgd291bGQgZmlyZSlcbiAgICAvL1xuICAgIC8vIFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0b3VjaCBldmVudHMgc2luY2UgdGhlIGB0b3VjaGVuZGAgZXZlbnQgZmlyZXMgb25cbiAgICAvLyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgdG91Y2gvZHJhZyBzdGFydGVkIHNvIGl0J3MgYWx3YXlzIGNhdWdodC5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kU2VsZWN0aW9uKVxuXG4gICAgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZyB3aGVuIHVzZXIgaXMgZHJhZ2dpbmcgb24gdGhlIGRhdGUgY2VsbHNcbiAgICBjZWxsVG9EYXRlLmN1cnJlbnQuZm9yRWFjaCgodmFsdWUsIGRhdGVDZWxsKSA9PiB7XG4gICAgICBpZiAoZGF0ZUNlbGwgJiYgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZGF0ZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudFNjcm9sbCwgeyBwYXNzaXZlOiBmYWxzZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZFNlbGVjdGlvbilcbiAgICAgIGNlbGxUb0RhdGUuY3VycmVudC5mb3JFYWNoKCh2YWx1ZSwgZGF0ZUNlbGwpID0+IHtcbiAgICAgICAgaWYgKGRhdGVDZWxsICYmIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGRhdGVDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHByZXZlbnRTY3JvbGwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcblxuICAvLyBQZXJmb3JtcyBhIGxvb2t1cCBpbnRvIHRoaXMuY2VsbFRvRGF0ZSB0byByZXRyaWV2ZSB0aGUgRGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvXG4gIC8vIHRoZSBjZWxsIHdoZXJlIHRoaXMgdG91Y2ggZXZlbnQgaXMgcmlnaHQgbm93LiBOb3RlIHRoYXQgdGhpcyBtZXRob2Qgd2lsbCBvbmx5IHdvcmtcbiAgLy8gaWYgdGhlIGV2ZW50IGlzIGEgYHRvdWNobW92ZWAgZXZlbnQgc2luY2UgaXQncyB0aGUgb25seSBvbmUgdGhhdCBoYXMgYSBgdG91Y2hlc2AgbGlzdC5cbiAgY29uc3QgZ2V0VGltZUZyb21Ub3VjaEV2ZW50ID0gKGV2ZW50OiBSZWFjdC5Ub3VjaEV2ZW50PGFueT4pOiBEYXRlIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgeyB0b3VjaGVzIH0gPSBldmVudFxuICAgIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGxcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IHRvdWNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjbGllbnRYLCBjbGllbnRZKVxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBjb25zdCBjZWxsVGltZSA9IGNlbGxUb0RhdGUuY3VycmVudC5nZXQodGFyZ2V0RWxlbWVudClcbiAgICAgIHJldHVybiBjZWxsVGltZSA/PyBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBlbmRTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgcHJvcHMub25DaGFuZ2Uoc2VsZWN0aW9uRHJhZnRSZWYuY3VycmVudClcbiAgICBzZXRTZWxlY3Rpb25UeXBlKG51bGwpXG4gICAgc2V0U2VsZWN0aW9uU3RhcnQobnVsbClcbiAgfVxuXG4gIC8vIEdpdmVuIGFuIGVuZGluZyBEYXRlLCBkZXRlcm1pbmVzIGFsbCB0aGUgZGF0ZXMgdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgaW4gdGhpcyBkcmFmdFxuICBjb25zdCB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCA9IChzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsKSA9PiB7XG4gICAgaWYgKHNlbGVjdGlvblR5cGUgPT09IG51bGwgfHwgc2VsZWN0aW9uU3RhcnQgPT09IG51bGwpIHJldHVyblxuXG4gICAgbGV0IG5ld1NlbGVjdGlvbjogQXJyYXk8RGF0ZT4gPSBbXVxuICAgIGlmIChzZWxlY3Rpb25TdGFydCAmJiBzZWxlY3Rpb25FbmQgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgbmV3U2VsZWN0aW9uID0gc2VsZWN0aW9uU2NoZW1lSGFuZGxlcnNbcHJvcHMuc2VsZWN0aW9uU2NoZW1lXShzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kLCBkYXRlcylcbiAgICB9XG5cbiAgICBsZXQgbmV4dERyYWZ0ID0gWy4uLnByb3BzLnNlbGVjdGlvbl1cbiAgICBpZiAoc2VsZWN0aW9uVHlwZSA9PT0gJ2FkZCcpIHtcbiAgICAgIG5leHREcmFmdCA9IEFycmF5LmZyb20obmV3IFNldChbLi4ubmV4dERyYWZ0LCAuLi5uZXdTZWxlY3Rpb25dKSlcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGlvblR5cGUgPT09ICdyZW1vdmUnKSB7XG4gICAgICBuZXh0RHJhZnQgPSBuZXh0RHJhZnQuZmlsdGVyKGEgPT4gIW5ld1NlbGVjdGlvbi5maW5kKGIgPT4gaXNTYW1lTWludXRlKGEsIGIpKSlcbiAgICB9XG5cbiAgICBzZWxlY3Rpb25EcmFmdFJlZi5jdXJyZW50ID0gbmV4dERyYWZ0XG4gICAgc2V0U2VsZWN0aW9uRHJhZnQobmV4dERyYWZ0KVxuICB9XG5cbiAgLy8gSXNvbW9ycGhpYyAobW91c2UgYW5kIHRvdWNoKSBoYW5kbGVyIHNpbmNlIHN0YXJ0aW5nIGEgc2VsZWN0aW9uIHdvcmtzIHRoZSBzYW1lIHdheSBmb3IgYm90aCBjbGFzc2VzIG9mIHVzZXIgaW5wdXRcbiAgY29uc3QgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCA9IChzdGFydFRpbWU6IERhdGUpID0+IHtcbiAgICAvLyBDaGVjayBpZiB0aGUgc3RhcnRUaW1lIGNlbGwgaXMgc2VsZWN0ZWQvdW5zZWxlY3RlZCB0byBkZXRlcm1pbmUgaWYgdGhpcyBkcmFnLXNlbGVjdCBzaG91bGRcbiAgICAvLyBhZGQgdmFsdWVzIG9yIHJlbW92ZSB2YWx1ZXNcbiAgICBjb25zdCB0aW1lU2VsZWN0ZWQgPSBwcm9wcy5zZWxlY3Rpb24uZmluZChhID0+IGlzU2FtZU1pbnV0ZShhLCBzdGFydFRpbWUpKVxuICAgIHNldFNlbGVjdGlvblR5cGUodGltZVNlbGVjdGVkID8gJ3JlbW92ZScgOiAnYWRkJylcbiAgICBzZXRTZWxlY3Rpb25TdGFydChzdGFydFRpbWUpXG4gIH1cblxuICBjb25zdCBoYW5kbGVNb3VzZUVudGVyRXZlbnQgPSAodGltZTogRGF0ZSkgPT4ge1xuICAgIC8vIE5lZWQgdG8gdXBkYXRlIHNlbGVjdGlvbiBkcmFmdCBvbiBtb3VzZXVwIGFzIHdlbGwgaW4gb3JkZXIgdG8gY2F0Y2ggdGhlIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIHVzZXIganVzdCBjbGlja3Mgb24gYSBzaW5nbGUgY2VsbCAoYmVjYXVzZSBubyBtb3VzZWVudGVyIGV2ZW50cyBmaXJlXG4gICAgLy8gaW4gdGhpcyBzY2VuYXJpbylcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlTW91c2VVcEV2ZW50ID0gKHRpbWU6IERhdGUpID0+IHtcbiAgICB1cGRhdGVBdmFpbGFiaWxpdHlEcmFmdCh0aW1lKVxuICAgIC8vIERvbid0IGNhbGwgdGhpcy5lbmRTZWxlY3Rpb24oKSBoZXJlIGJlY2F1c2UgdGhlIGRvY3VtZW50IG1vdXNldXAgaGFuZGxlciB3aWxsIGRvIGl0XG4gIH1cblxuICBjb25zdCBoYW5kbGVUb3VjaE1vdmVFdmVudCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCkgPT4ge1xuICAgIHNldElzVG91Y2hEcmFnZ2luZyh0cnVlKVxuICAgIGNvbnN0IGNlbGxUaW1lID0gZ2V0VGltZUZyb21Ub3VjaEV2ZW50KGV2ZW50KVxuICAgIGlmIChjZWxsVGltZSkge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQoY2VsbFRpbWUpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVG91Y2hFbmRFdmVudCA9ICgpID0+IHtcbiAgICBpZiAoIWlzVG91Y2hEcmFnZ2luZykge1xuICAgICAgdXBkYXRlQXZhaWxhYmlsaXR5RHJhZnQobnVsbClcbiAgICB9IGVsc2Uge1xuICAgICAgZW5kU2VsZWN0aW9uKClcbiAgICB9XG4gICAgc2V0SXNUb3VjaERyYWdnaW5nKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGxXcmFwcGVyID0gKHRpbWU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3Qgc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgaGFuZGxlU2VsZWN0aW9uU3RhcnRFdmVudCh0aW1lKVxuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gQm9vbGVhbihzZWxlY3Rpb25EcmFmdC5maW5kKGEgPT4gaXNTYW1lTWludXRlKGEsIHRpbWUpKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8R3JpZENlbGxcbiAgICAgICAgY2xhc3NOYW1lPVwicmdkcF9fZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgIGtleT17dGltZS50b0lTT1N0cmluZygpfVxuICAgICAgICAvLyBNb3VzZSBoYW5kbGVyc1xuICAgICAgICBvbk1vdXNlRG93bj17c3RhcnRIYW5kbGVyfVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICBoYW5kbGVNb3VzZUVudGVyRXZlbnQodGltZSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XG4gICAgICAgICAgaGFuZGxlTW91c2VVcEV2ZW50KHRpbWUpXG4gICAgICAgIH19XG4gICAgICAgIC8vIFRvdWNoIGhhbmRsZXJzXG4gICAgICAgIC8vIFNpbmNlIHRvdWNoIGV2ZW50cyBmaXJlIG9uIHRoZSBldmVudCB3aGVyZSB0aGUgdG91Y2gtZHJhZyBzdGFydGVkLCB0aGVyZSdzIG5vIHBvaW50IGluIHBhc3NpbmdcbiAgICAgICAgLy8gaW4gdGhlIHRpbWUgcGFyYW1ldGVyLCBpbnN0ZWFkIHRoZXNlIGhhbmRsZXJzIHdpbGwgZG8gdGhlaXIgam9iIHVzaW5nIHRoZSBkZWZhdWx0IEV2ZW50XG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtzdGFydEhhbmRsZXJ9XG4gICAgICAgIG9uVG91Y2hNb3ZlPXtoYW5kbGVUb3VjaE1vdmVFdmVudH1cbiAgICAgICAgb25Ub3VjaEVuZD17aGFuZGxlVG91Y2hFbmRFdmVudH1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckRhdGVDZWxsKHRpbWUsIHNlbGVjdGVkKX1cbiAgICAgIDwvR3JpZENlbGw+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUNlbGwgPSAodGltZTogRGF0ZSwgc2VsZWN0ZWQ6IGJvb2xlYW4pOiBKU1guRWxlbWVudCA9PiB7XG4gICAgY29uc3QgcmVmU2V0dGVyID0gKGRhdGVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwpID0+IHtcbiAgICAgIGlmIChkYXRlQ2VsbCkge1xuICAgICAgICBjZWxsVG9EYXRlLmN1cnJlbnQuc2V0KGRhdGVDZWxsLCB0aW1lKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcHMucmVuZGVyRGF0ZUNlbGwpIHtcbiAgICAgIHJldHVybiBwcm9wcy5yZW5kZXJEYXRlQ2VsbCh0aW1lLCBzZWxlY3RlZCwgcmVmU2V0dGVyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUNlbGxcbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XG4gICAgICAgICAgcmVmPXtyZWZTZXR0ZXJ9XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcj17cHJvcHMuc2VsZWN0ZWRDb2xvciF9XG4gICAgICAgICAgdW5zZWxlY3RlZENvbG9yPXtwcm9wcy51bnNlbGVjdGVkQ29sb3IhfVxuICAgICAgICAgIGhvdmVyZWRDb2xvcj17cHJvcHMuaG92ZXJlZENvbG9yIX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW5kZXJUaW1lTGFiZWwgPSAodGltZTogRGF0ZSk6IEpTWC5FbGVtZW50ID0+IHtcbiAgICBpZiAocHJvcHMucmVuZGVyVGltZUxhYmVsKSB7XG4gICAgICByZXR1cm4gcHJvcHMucmVuZGVyVGltZUxhYmVsKHRpbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8VGltZVRleHQ+e2Zvcm1hdEluVGltZVpvbmUodGltZSwgJ1VUQycsIHByb3BzLnRpbWVGb3JtYXQpfTwvVGltZVRleHQ+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRGF0ZUxhYmVsID0gKGRhdGU6IERhdGUpOiBKU1guRWxlbWVudCA9PiB7XG4gICAgaWYgKHByb3BzLnJlbmRlckRhdGVMYWJlbCkge1xuICAgICAgcmV0dXJuIHByb3BzLnJlbmRlckRhdGVMYWJlbChkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPERhdGVMYWJlbD57Zm9ybWF0SW5UaW1lWm9uZShkYXRlLCAnVVRDJywgcHJvcHMuZGF0ZUZvcm1hdCl9PC9EYXRlTGFiZWw+XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVuZGVyRnVsbERhdGVHcmlkID0gKCk6IEFycmF5PEpTWC5FbGVtZW50PiA9PiB7XG4gICAgY29uc3QgZmxhdHRlbmVkRGF0ZXM6IERhdGVbXSA9IFtdXG4gICAgY29uc3QgbnVtRGF5cyA9IGRhdGVzLmxlbmd0aFxuICAgIGNvbnN0IG51bVRpbWVzID0gZGF0ZXNbMF0ubGVuZ3RoXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1UaW1lczsgaiArPSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURheXM7IGkgKz0gMSkge1xuICAgICAgICBmbGF0dGVuZWREYXRlcy5wdXNoKGRhdGVzW2ldW2pdKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkYXRlR3JpZEVsZW1lbnRzID0gZmxhdHRlbmVkRGF0ZXMubWFwKHJlbmRlckRhdGVDZWxsV3JhcHBlcilcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRpbWVzOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gaSAqIG51bURheXNcbiAgICAgIGNvbnN0IHRpbWUgPSBkYXRlc1swXVtpXVxuICAgICAgLy8gSW5qZWN0IHRoZSB0aW1lIGxhYmVsIGF0IHRoZSBzdGFydCBvZiBldmVyeSByb3dcbiAgICAgIGRhdGVHcmlkRWxlbWVudHMuc3BsaWNlKGluZGV4ICsgaSwgMCwgcmVuZGVyVGltZUxhYmVsKHRpbWUpKVxuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gRW1wdHkgdG9wIGxlZnQgY29ybmVyXG4gICAgICA8ZGl2IGtleT1cInRvcGxlZnRcIiAvPixcbiAgICAgIC8vIFRvcCByb3cgb2YgZGF0ZXNcbiAgICAgIC4uLmRhdGVzLm1hcCgoZGF5T2ZUaW1lcywgaW5kZXgpID0+IFJlYWN0LmNsb25lRWxlbWVudChyZW5kZXJEYXRlTGFiZWwoZGF5T2ZUaW1lc1swXSksIHsga2V5OiBgZGF0ZS0ke2luZGV4fWAgfSkpLFxuICAgICAgLy8gRXZlcnkgcm93IGFmdGVyIHRoYXRcbiAgICAgIC4uLmRhdGVHcmlkRWxlbWVudHMubWFwKChlbGVtZW50LCBpbmRleCkgPT4gUmVhY3QuY2xvbmVFbGVtZW50KGVsZW1lbnQsIHsga2V5OiBgdGltZS0ke2luZGV4fWAgfSkpXG4gICAgXVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8V3JhcHBlcj5cbiAgICAgIDxHcmlkXG4gICAgICAgIGNvbHVtbnM9e2RhdGVzLmxlbmd0aH1cbiAgICAgICAgcm93cz17ZGF0ZXNbMF0ubGVuZ3RofVxuICAgICAgICBjb2x1bW5HYXA9e3Byb3BzLmNvbHVtbkdhcCF9XG4gICAgICAgIHJvd0dhcD17cHJvcHMucm93R2FwIX1cbiAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgZ3JpZFJlZi5jdXJyZW50ID0gZWxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckZ1bGxEYXRlR3JpZCgpfVxuICAgICAgPC9HcmlkPlxuICAgIDwvV3JhcHBlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY2hlZHVsZVNlbGVjdG9yXG5cblNjaGVkdWxlU2VsZWN0b3IuZGVmYXVsdFByb3BzID0ge1xuICBzZWxlY3Rpb246IFtdLFxuICBzZWxlY3Rpb25TY2hlbWU6ICdzcXVhcmUnLFxuICBudW1EYXlzOiA3LFxuICBtaW5UaW1lOiA5LFxuICBtYXhUaW1lOiAyMyxcbiAgaG91cmx5Q2h1bmtzOiAxLFxuICBzdGFydERhdGU6IG5ldyBEYXRlKCksXG4gIHRpbWVGb3JtYXQ6ICdoYScsXG4gIGRhdGVGb3JtYXQ6ICdNL2QnLFxuICBjb2x1bW5HYXA6ICc0cHgnLFxuICByb3dHYXA6ICc0cHgnLFxuICBzZWxlY3RlZENvbG9yOiBjb2xvcnMuYmx1ZSxcbiAgdW5zZWxlY3RlZENvbG9yOiBjb2xvcnMucGFsZUJsdWUsXG4gIGhvdmVyZWRDb2xvcjogY29sb3JzLmxpZ2h0Qmx1ZSxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxuICBvbkNoYW5nZTogKCkgPT4ge31cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQUFDLHVCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxPQUFBLEdBQUFDLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxPQUFBLEdBQUFILE9BQUE7QUFDQSxJQUFBSSxPQUFBLEdBQUFGLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBSyxXQUFBLEdBQUFMLE9BQUE7QUFDQSxJQUFBTSxRQUFBLEdBQUFOLE9BQUE7QUFFQSxJQUFBTyxNQUFBLEdBQUFMLHNCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBUSxVQUFBLEdBQUFSLE9BQUE7QUFBOEQsSUFBQVMsZUFBQSxFQUFBQyxnQkFBQSxFQUFBQyxn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