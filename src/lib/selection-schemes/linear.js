"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateUtils = require("../date-utils");
var date_fns_1 = require("date-fns");
var linear = function (selectionStart, selectionEnd, dateList) {
    var selected = [];
    if (selectionEnd == null) {
        if (selectionStart)
            selected = [selectionStart];
    }
    else if (selectionStart) {
        var reverseSelection_1 = (0, date_fns_1.isBefore)(selectionEnd, selectionStart);
        selected = dateList.reduce(function (acc, dayOfTimes) {
            return acc.concat(dayOfTimes.filter(function (t) {
                return selectionStart &&
                    selectionEnd &&
                    dateUtils.dateHourIsBetween(reverseSelection_1 ? selectionEnd : selectionStart, t, reverseSelection_1 ? selectionStart : selectionEnd);
            }));
        }, []);
    }
    return selected;
};
exports.default = linear;
