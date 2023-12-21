"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = exports.Subtitle = void 0;
var colors_1 = require("./colors");
var styled_1 = require("@emotion/styled");
var react_1 = require("@emotion/react");
exports.Subtitle = styled_1.default.h2(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    ", "\n"], ["\n    ", "\n"])), function (props) { return (0, react_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        font-size: 20px;\n        font-weight: 400;\n        color: ", ";\n        text-align: ", ";\n\n        @media (max-width: 700px) {\n            font-size: 18px;\n        }\n    "], ["\n        font-size: 20px;\n        font-weight: 400;\n        color: ", ";\n        text-align: ", ";\n\n        @media (max-width: 700px) {\n            font-size: 18px;\n        }\n    "])), colors_1.default.black, props.align || 'center'); });
exports.Text = styled_1.default.p(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    ", "\n"], ["\n    ", "\n"])), (0, react_1.css)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        font-size: 14px;\n        font-weight: 300;\n        line-height: ", "px;\n        color: ", ";\n        margin: 5px 0;\n    "], ["\n        font-size: 14px;\n        font-weight: 300;\n        line-height: ", "px;\n        color: ", ";\n        margin: 5px 0;\n    "])), 14 * 1.37, colors_1.default.grey));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
