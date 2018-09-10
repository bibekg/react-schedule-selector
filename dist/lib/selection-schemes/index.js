'use strict';

exports.__esModule = true;

var _linear = require('./linear');

var _linear2 = _interopRequireDefault(_linear);

var _square = require('./square');

var _square2 = _interopRequireDefault(_square);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  linear: _linear2.default,
  square: _square2.default
};