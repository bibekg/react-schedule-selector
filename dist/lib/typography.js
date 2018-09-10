'use strict';

exports.__esModule = true;
exports.Text = exports.Subtitle = undefined;

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subtitle = exports.Subtitle = (0, _styledComponents2.default)('h2').withConfig({
  displayName: 'typography__Subtitle',
  componentId: 'sc-1nxgjrj-0'
})(['font-size:20px;font-weight:400;color:', ';text-align:', ';@media (max-width:700px){font-size:18px;}'], _colors2.default.black, function (props) {
  return props.align || 'center';
});

var Text = exports.Text = (0, _styledComponents2.default)('p').withConfig({
  displayName: 'typography__Text',
  componentId: 'sc-1nxgjrj-1'
})(['font-size:14px;font-weight:300;line-height:', 'px;color:', ';margin:5px 0;'], 14 * 1.37, _colors2.default.grey);