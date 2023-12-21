"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeIsBetween = exports.dateIsBetween = exports.dateHourIsBetween = void 0;
// Helper function that uses date-fns methods to determine if a date is between two other dates
var date_fns_1 = require("date-fns");
var dateHourIsBetween = function (start, candidate, end) {
    return (candidate.getTime() === start.getTime() || (0, date_fns_1.isAfter)(candidate, start)) &&
        (candidate.getTime() === end.getTime() || (0, date_fns_1.isAfter)(end, candidate));
};
exports.dateHourIsBetween = dateHourIsBetween;
var dateIsBetween = function (start, candidate, end) {
    var startOfCandidate = (0, date_fns_1.startOfDay)(candidate);
    var startOfStart = (0, date_fns_1.startOfDay)(start);
    var startOfEnd = (0, date_fns_1.startOfDay)(end);
    return ((startOfCandidate.getTime() === startOfStart.getTime() || (0, date_fns_1.isAfter)(startOfCandidate, startOfStart)) &&
        (startOfCandidate.getTime() === startOfEnd.getTime() || (0, date_fns_1.isAfter)(startOfEnd, startOfCandidate)));
};
exports.dateIsBetween = dateIsBetween;
var timeIsBetween = function (start, candidate, end) {
    var candidateTime = candidate.getHours() * 60 + candidate.getMinutes();
    var startTime = start.getHours() * 60 + start.getMinutes();
    var endTime = end.getHours() * 60 + end.getMinutes();
    return candidateTime >= startTime && candidateTime <= endTime;
};
exports.timeIsBetween = timeIsBetween;
