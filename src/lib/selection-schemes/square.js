"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateUtils = require("../date-utils");
var date_fns_1 = require("date-fns");
var square = function (selectionStart, selectionEnd, dateList) {
    var selected = [];
    if (selectionEnd == null) {
        if (selectionStart)
            selected = [selectionStart];
    }
    else if (selectionStart) {
        var dateIsReversed_1 = (0, date_fns_1.isBefore)((0, date_fns_1.startOfDay)(selectionEnd), (0, date_fns_1.startOfDay)(selectionStart));
        var timeIsReversed_1 = selectionStart.getHours() > selectionEnd.getHours();
        selected = dateList.reduce(function (acc, dayOfTimes) {
            return acc.concat(dayOfTimes.filter(function (t) {
                return selectionStart &&
                    selectionEnd &&
                    dateUtils.dateIsBetween(dateIsReversed_1 ? selectionEnd : selectionStart, t, dateIsReversed_1 ? selectionStart : selectionEnd) &&
                    dateUtils.timeIsBetween(timeIsReversed_1 ? selectionEnd : selectionStart, t, timeIsReversed_1 ? selectionStart : selectionEnd);
            }));
        }, []);
    }
    return selected;
};
exports.default = square;
