'use strict';

exports.__esModule = true;

var _is_before = require('date-fns/is_before');

var _is_before2 = _interopRequireDefault(_is_before);

var _dateUtils = require('../date-utils');

var dateUtils = _interopRequireWildcard(_dateUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linear = function linear(selectionStart, selectionEnd, dateList) {
  var selected = [];
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    var reverseSelection = (0, _is_before2.default)(selectionEnd, selectionStart);
    selected = dateList.reduce(function (acc, dayOfTimes) {
      return acc.concat(dayOfTimes.filter(function (t) {
        return selectionStart && selectionEnd && dateUtils.dateHourIsBetween(reverseSelection ? selectionEnd : selectionStart, t, reverseSelection ? selectionStart : selectionEnd);
      }));
    }, []);
  }
  return selected;
};

exports.default = linear;