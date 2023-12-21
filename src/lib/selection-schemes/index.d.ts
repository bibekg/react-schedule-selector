declare const _default: {
    linear: (selectionStart: Date, selectionEnd: Date, dateList: Date[][]) => Date[];
    square: (selectionStart: Date, selectionEnd: Date, dateList: Date[][]) => Date[];
};
export default _default;
export type SelectionType = 'add' | 'remove';
export type SelectionSchemeType = 'linear' | 'square';
