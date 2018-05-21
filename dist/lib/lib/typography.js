var _templateObject = _taggedTemplateLiteralLoose(['\n  font-size: 24px;\n  font-weight: 400;\n  color: ', ';\n  text-align: ', ';\n\n  @media (max-width: 700px) {\n    font-size: 20px;\n  }\n'], ['\n  font-size: 24px;\n  font-weight: 400;\n  color: ', ';\n  text-align: ', ';\n\n  @media (max-width: 700px) {\n    font-size: 20px;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n  font-size: 20px;\n  line-height: 30px;\n\n  @media (max-width: 700px) {\n    font-size: 18px;\n  }\n'], ['\n  font-size: 20px;\n  line-height: 30px;\n\n  @media (max-width: 700px) {\n    font-size: 18px;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n  font-size: ', 'px;\n  font-weight: ', ';\n  line-height: ', 'px;\n  color: ', ';\n  ', ' letter-spacing: 0.8px;\n  margin: 5px 0;\n'], ['\n  font-size: ', 'px;\n  font-weight: ', ';\n  line-height: ', 'px;\n  color: ', ';\n  ', ' letter-spacing: 0.8px;\n  margin: 5px 0;\n']);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import styled from 'styled-components';
import colors from './colors';

export var Title = styled.h1(_templateObject, colors.black, function (props) {
  return props.align || 'center';
});

export var Subtitle = styled(Title)(_templateObject2);

export var Text = styled.p(_templateObject3, function (props) {
  return props.size ? props.size : 14;
}, function (props) {
  return props.bold ? 400 : 300;
}, function (props) {
  return 14 * (props.paragraph ? 2.0 : 1.37);
}, function (props) {
  return props.color ? props.color : colors.grey;
}, function (props) {
  return props.center && 'text-align: center;';
});