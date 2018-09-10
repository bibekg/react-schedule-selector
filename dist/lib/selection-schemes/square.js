'use strict';

exports.__esModule = true;

var _is_before = require('date-fns/is_before');

var _is_before2 = _interopRequireDefault(_is_before);

var _start_of_day = require('date-fns/start_of_day');

var _start_of_day2 = _interopRequireDefault(_start_of_day);

var _dateUtils = require('../date-utils');

var dateUtils = _interopRequireWildcard(_dateUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var square = function square(selectionStart, selectionEnd, dateList) {
  var selected = [];
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    var dateIsReversed = (0, _is_before2.default)((0, _start_of_day2.default)(selectionEnd), (0, _start_of_day2.default)(selectionStart));
    var timeIsReversed = selectionStart.getHours() > selectionEnd.getHours();

    selected = dateList.reduce(function (acc, dayOfTimes) {
      return acc.concat(dayOfTimes.filter(function (t) {
        return selectionStart && selectionEnd && dateUtils.dateIsBetween(dateIsReversed ? selectionEnd : selectionStart, t, dateIsReversed ? selectionStart : selectionEnd) && dateUtils.timeIsBetween(timeIsReversed ? selectionEnd : selectionStart, t, timeIsReversed ? selectionStart : selectionEnd);
      }));
    }, []);
  }

  return selected;
};

exports.default = square;