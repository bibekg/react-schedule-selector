import React from 'react';
import { SelectionSchemeType } from './selection-schemes/index';
export declare const GridCell: import("@emotion/styled-base").StyledComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, Pick<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, keyof React.HTMLAttributes<HTMLDivElement>>, object>;
export interface IScheduleSelectorProps {
    selection: Array<Date>;
    selectionScheme: SelectionSchemeType;
    onChange: (newSelection: Array<Date>) => void;
    startDate: Date;
    numDays: number;
    minTime: number;
    maxTime: number;
    hourlyChunks: number;
    dateFormat: string;
    timeFormat: string;
    columnGap?: string;
    rowGap?: string;
    unselectedColor?: string;
    selectedColor?: string;
    hoveredColor?: string;
    renderDateCell?: (datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void) => JSX.Element;
    renderTimeLabel?: (time: Date) => JSX.Element;
    renderDateLabel?: (date: Date) => JSX.Element;
}
export declare const preventScroll: (e: TouchEvent) => void;
export declare const computeDatesMatrix: (props: IScheduleSelectorProps) => Array<Array<Date>>;
export declare const ScheduleSelector: React.FC<IScheduleSelectorProps>;
export default ScheduleSelector;
//# sourceMappingURL=ScheduleSelector.d.ts.map