"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventScroll = exports.GridCell = void 0;
var React = require("react");
var styled_components_1 = require("styled-components");
// Import only the methods we need from date-fns in order to keep build size small
var format_1 = require("date-fns/format");
var typography_1 = require("./typography");
var colors_1 = require("./colors");
var selection_schemes_1 = require("./selection-schemes");
var date_fns_1 = require("date-fns");
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  width: 100%;\n  user-select: none;\n"], ["\n  display: flex;\n  align-items: center;\n  width: 100%;\n  user-select: none;\n"])));
var Grid = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: auto repeat(", ", 1fr);\n  grid-template-rows: auto repeat(", ", 1fr);\n  column-gap: ", ";\n  row-gap: ", ";\n  width: 100%;\n"], ["\n  display: grid;\n  grid-template-columns: auto repeat(", ", 1fr);\n  grid-template-rows: auto repeat(", ", 1fr);\n  column-gap: ", ";\n  row-gap: ", ";\n  width: 100%;\n"])), function (props) { return props.columns; }, function (props) { return props.rows; }, function (props) { return props.columnGap; }, function (props) { return props.rowGap; });
exports.GridCell = styled_components_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  place-self: stretch;\n  touch-action: none;\n"], ["\n  place-self: stretch;\n  touch-action: none;\n"])));
var DateCell = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 100%;\n  height: 25px;\n  background-color: ", ";\n\n  &:hover {\n    background-color: ", ";\n  }\n"], ["\n  width: 100%;\n  height: 25px;\n  background-color: ", ";\n\n  &:hover {\n    background-color: ", ";\n  }\n"])), function (props) { return (props.selected ? props.selectedColor : props.unselectedColor); }, function (props) { return props.hoveredColor; });
var DateLabel = (0, styled_components_1.default)(typography_1.Subtitle)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  @media (max-width: 699px) {\n    font-size: 12px;\n  }\n  margin: 0;\n  margin-bottom: 4px;\n"], ["\n  @media (max-width: 699px) {\n    font-size: 12px;\n  }\n  margin: 0;\n  margin-bottom: 4px;\n"])));
var TimeText = (0, styled_components_1.default)(typography_1.Text)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  @media (max-width: 699px) {\n    font-size: 10px;\n  }\n  text-align: right;\n  margin: 0;\n  margin-right: 4px;\n"], ["\n  @media (max-width: 699px) {\n    font-size: 10px;\n  }\n  text-align: right;\n  margin: 0;\n  margin-right: 4px;\n"])));
var preventScroll = function (e) {
    e.preventDefault();
};
exports.preventScroll = preventScroll;
var ScheduleSelector = /** @class */ (function (_super) {
    __extends(ScheduleSelector, _super);
    function ScheduleSelector(props) {
        var _this = _super.call(this, props) || this;
        _this.cellToDate = new Map();
        // documentMouseUpHandler: () => void = () => {}
        // endSelection: () => void = () => {}
        // handleTouchMoveEvent: (event: React.SyntheticTouchEvent<*>) => void
        // handleTouchEndEvent: () => void
        // handleMouseUpEvent: (date: Date) => void
        // handleMouseEnterEvent: (date: Date) => void
        // handleSelectionStartEvent: (date: Date) => void
        _this.gridRef = null;
        _this.renderDateCellWrapper = function (time) {
            var startHandler = function () {
                _this.handleSelectionStartEvent(time);
            };
            var selected = Boolean(_this.state.selectionDraft.find(function (a) { return (0, date_fns_1.isSameMinute)(a, time); }));
            return (<exports.GridCell className="rgdp__grid-cell" role="presentation" key={time.toISOString()} 
            // Mouse handlers
            onMouseDown={startHandler} onMouseEnter={function () {
                    _this.handleMouseEnterEvent(time);
                }} onMouseUp={function () {
                    _this.handleMouseUpEvent(time);
                }} 
            // Touch handlers
            // Since touch events fire on the event where the touch-drag started, there's no point in passing
            // in the time parameter, instead these handlers will do their job using the default Event
            // parameters
            onTouchStart={startHandler} onTouchMove={_this.handleTouchMoveEvent} onTouchEnd={_this.handleTouchEndEvent}>
        {_this.renderDateCell(time, selected)}
      </exports.GridCell>);
        };
        _this.renderDateCell = function (time, selected) {
            var refSetter = function (dateCell) {
                if (dateCell) {
                    _this.cellToDate.set(dateCell, time);
                }
            };
            if (_this.props.renderDateCell) {
                return _this.props.renderDateCell(time, selected, refSetter);
            }
            else {
                return (<DateCell selected={selected} ref={refSetter} selectedColor={_this.props.selectedColor} unselectedColor={_this.props.unselectedColor} hoveredColor={_this.props.hoveredColor}/>);
            }
        };
        _this.renderTimeLabel = function (time) {
            if (_this.props.renderTimeLabel) {
                return _this.props.renderTimeLabel(time);
            }
            else {
                return <TimeText>{(0, format_1.default)(time, _this.props.timeFormat)}</TimeText>;
            }
        };
        _this.renderDateLabel = function (date) {
            if (_this.props.renderDateLabel) {
                return _this.props.renderDateLabel(date);
            }
            else {
                return <DateLabel>{(0, format_1.default)(date, _this.props.dateFormat)}</DateLabel>;
            }
        };
        _this.state = {
            selectionDraft: __spreadArray([], _this.props.selection, true), // copy it over
            selectionType: null,
            selectionStart: null,
            isTouchDragging: false,
            dates: ScheduleSelector.computeDatesMatrix(props),
        };
        _this.selectionSchemeHandlers = {
            linear: selection_schemes_1.default.linear,
            square: selection_schemes_1.default.square,
        };
        _this.endSelection = _this.endSelection.bind(_this);
        _this.handleMouseUpEvent = _this.handleMouseUpEvent.bind(_this);
        _this.handleMouseEnterEvent = _this.handleMouseEnterEvent.bind(_this);
        _this.handleTouchMoveEvent = _this.handleTouchMoveEvent.bind(_this);
        _this.handleTouchEndEvent = _this.handleTouchEndEvent.bind(_this);
        _this.handleSelectionStartEvent = _this.handleSelectionStartEvent.bind(_this);
        return _this;
    }
    ScheduleSelector.getDerivedStateFromProps = function (props, state) {
        // As long as the user isn't in the process of selecting, allow prop changes to re-populate selection state
        if (state.selectionStart == null) {
            return {
                selectionDraft: __spreadArray([], props.selection, true),
                dates: ScheduleSelector.computeDatesMatrix(props),
            };
        }
        return null;
    };
    ScheduleSelector.computeDatesMatrix = function (props) {
        var startTime = (0, date_fns_1.startOfDay)(props.startDate);
        var dates = [];
        var minutesInChunk = Math.floor(60 / props.hourlyChunks);
        for (var d = 0; d < props.numDays; d += 1) {
            var currentDay = [];
            for (var h = props.minTime; h < props.maxTime; h += 1) {
                for (var c = 0; c < props.hourlyChunks; c += 1) {
                    currentDay.push((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)((0, date_fns_1.addDays)(startTime, d), h), c * minutesInChunk));
                }
            }
            dates.push(currentDay);
        }
        return dates;
    };
    ScheduleSelector.prototype.componentDidMount = function () {
        // We need to add the endSelection event listener to the document itself in order
        // to catch the cases where the users ends their mouse-click somewhere besides
        // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
        //
        // This isn't necessary for touch events since the `touchend` event fires on
        // the element where the touch/drag started so it's always caught.
        document.addEventListener('mouseup', this.endSelection);
        // Prevent page scrolling when user is dragging on the date cells
        this.cellToDate.forEach(function (value, dateCell) {
            if (dateCell && dateCell.addEventListener) {
                // @ts-ignore
                dateCell.addEventListener('touchmove', exports.preventScroll, { passive: false });
            }
        });
    };
    ScheduleSelector.prototype.componentWillUnmount = function () {
        document.removeEventListener('mouseup', this.endSelection);
        this.cellToDate.forEach(function (value, dateCell) {
            if (dateCell && dateCell.removeEventListener) {
                // @ts-ignore
                dateCell.removeEventListener('touchmove', exports.preventScroll);
            }
        });
    };
    // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
    // the cell where this touch event is right now. Note that this method will only work
    // if the event is a `touchmove` event since it's the only one that has a `touches` list.
    ScheduleSelector.prototype.getTimeFromTouchEvent = function (event) {
        var touches = event.touches;
        if (!touches || touches.length === 0)
            return null;
        var _a = touches[0], clientX = _a.clientX, clientY = _a.clientY;
        var targetElement = document.elementFromPoint(clientX, clientY);
        if (targetElement) {
            var cellTime = this.cellToDate.get(targetElement);
            return cellTime !== null && cellTime !== void 0 ? cellTime : null;
        }
        return null;
    };
    ScheduleSelector.prototype.endSelection = function () {
        this.props.onChange(this.state.selectionDraft);
        this.setState({
            selectionType: null,
            selectionStart: null,
        });
    };
    // Given an ending Date, determines all the dates that should be selected in this draft
    ScheduleSelector.prototype.updateAvailabilityDraft = function (selectionEnd, callback) {
        var _a = this.state, selectionType = _a.selectionType, selectionStart = _a.selectionStart;
        if (selectionType === null || selectionStart === null)
            return;
        var newSelection = [];
        if (selectionStart && selectionEnd && selectionType) {
            newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.state.dates);
        }
        var nextDraft = __spreadArray([], this.props.selection, true);
        if (selectionType === 'add') {
            nextDraft = Array.from(new Set(__spreadArray(__spreadArray([], nextDraft, true), newSelection, true)));
        }
        else if (selectionType === 'remove') {
            nextDraft = nextDraft.filter(function (a) { return !newSelection.find(function (b) { return (0, date_fns_1.isSameMinute)(a, b); }); });
        }
        this.setState({ selectionDraft: nextDraft }, callback);
    };
    // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
    ScheduleSelector.prototype.handleSelectionStartEvent = function (startTime) {
        // Check if the startTime cell is selected/unselected to determine if this drag-select should
        // add values or remove values
        var timeSelected = this.props.selection.find(function (a) { return (0, date_fns_1.isSameMinute)(a, startTime); });
        this.setState({
            selectionType: timeSelected ? 'remove' : 'add',
            selectionStart: startTime,
        });
    };
    ScheduleSelector.prototype.handleMouseEnterEvent = function (time) {
        // Need to update selection draft on mouseup as well in order to catch the cases
        // where the user just clicks on a single cell (because no mouseenter events fire
        // in this scenario)
        this.updateAvailabilityDraft(time);
    };
    ScheduleSelector.prototype.handleMouseUpEvent = function (time) {
        this.updateAvailabilityDraft(time);
        // Don't call this.endSelection() here because the document mouseup handler will do it
    };
    ScheduleSelector.prototype.handleTouchMoveEvent = function (event) {
        this.setState({ isTouchDragging: true });
        var cellTime = this.getTimeFromTouchEvent(event);
        if (cellTime) {
            this.updateAvailabilityDraft(cellTime);
        }
    };
    ScheduleSelector.prototype.handleTouchEndEvent = function () {
        var _this = this;
        if (!this.state.isTouchDragging) {
            // Going down this branch means the user tapped but didn't drag -- which
            // means the availability draft hasn't yet been updated (since
            // handleTouchMoveEvent was never called) so we need to do it now
            this.updateAvailabilityDraft(null, function () {
                _this.endSelection();
            });
        }
        else {
            this.endSelection();
        }
        this.setState({ isTouchDragging: false });
    };
    ScheduleSelector.prototype.renderFullDateGrid = function () {
        var _this = this;
        var flattenedDates = [];
        var numDays = this.state.dates.length;
        var numTimes = this.state.dates[0].length;
        for (var j = 0; j < numTimes; j += 1) {
            for (var i = 0; i < numDays; i += 1) {
                flattenedDates.push(this.state.dates[i][j]);
            }
        }
        var dateGridElements = flattenedDates.map(this.renderDateCellWrapper);
        for (var i = 0; i < numTimes; i += 1) {
            var index = i * numDays;
            var time = this.state.dates[0][i];
            // Inject the time label at the start of every row
            dateGridElements.splice(index + i, 0, this.renderTimeLabel(time));
        }
        return __spreadArray(__spreadArray([
            // Empty top left corner
            <div key="topleft"/>
        ], this.state.dates.map(function (dayOfTimes, index) {
            return React.cloneElement(_this.renderDateLabel(dayOfTimes[0]), { key: "date-".concat(index) });
        }), true), dateGridElements.map(function (element, index) { return React.cloneElement(element, { key: "time-".concat(index) }); }), true);
    };
    ScheduleSelector.prototype.render = function () {
        var _this = this;
        return (<Wrapper>
        <Grid columns={this.state.dates.length} rows={this.state.dates[0].length} columnGap={this.props.columnGap} rowGap={this.props.rowGap} ref={function (el) {
                _this.gridRef = el;
            }}>
          {this.renderFullDateGrid()}
        </Grid>
      </Wrapper>);
    };
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
        selectedColor: colors_1.default.blue,
        unselectedColor: colors_1.default.paleBlue,
        hoveredColor: colors_1.default.lightBlue,
        onChange: function () { },
    };
    return ScheduleSelector;
}(React.Component));
exports.default = ScheduleSelector;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
