import * as React from 'react';
import { SelectionSchemeType, SelectionType } from './selection-schemes';
import { UTCDate } from '@date-fns/utc';
export declare const GridCell: import("styled-components").StyledComponent<"div", any, {}, never>;
export interface IScheduleSelectorProps {
    selection: Array<Date>;
    selectionScheme: SelectionSchemeType;
    onChange: (newSelection: Array<Date>) => void;
    startDate: Date | UTCDate;
    numDays: number;
    minTime: number;
    maxTime: number;
    hourlyChunks: number;
    dateFormat: string;
    timeFormat: string;
    columnGap: string;
    rowGap: string;
    unselectedColor: string;
    selectedColor: string;
    hoveredColor: string;
    renderDateCell?: (datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void) => JSX.Element;
    renderTimeLabel?: (time: Date) => JSX.Element;
    renderDateLabel?: (date: Date) => JSX.Element;
}
type StateType = {
    selectionDraft: Array<Date>;
    selectionType: SelectionType | null;
    selectionStart: Date | null;
    isTouchDragging: boolean;
    dates: Array<Array<Date>>;
};
export declare const preventScroll: (e: TouchEvent) => void;
declare class ScheduleSelector extends React.Component<IScheduleSelectorProps, StateType> {
    selectionSchemeHandlers: {
        [key: string]: (startDate: Date, endDate: Date, foo: Array<Array<Date>>) => Date[];
    };
    cellToDate: Map<Element, Date>;
    gridRef: HTMLElement | null;
    static defaultProps: Partial<IScheduleSelectorProps>;
    static getDerivedStateFromProps(props: IScheduleSelectorProps, state: StateType): Partial<StateType> | null;
    static computeDatesMatrix(props: IScheduleSelectorProps): Array<Array<Date>>;
    constructor(props: IScheduleSelectorProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    getTimeFromTouchEvent(event: React.TouchEvent<any>): Date | null;
    endSelection(): void;
    updateAvailabilityDraft(selectionEnd: Date | null, callback?: () => void): void;
    handleSelectionStartEvent(startTime: Date): void;
    handleMouseEnterEvent(time: Date): void;
    handleMouseUpEvent(time: Date): void;
    handleTouchMoveEvent(event: React.TouchEvent): void;
    handleTouchEndEvent(): void;
    renderDateCellWrapper: (time: Date) => JSX.Element;
    renderDateCell: (time: Date, selected: boolean) => JSX.Element;
    renderTimeLabel: (time: Date) => JSX.Element;
    renderDateLabel: (date: Date) => JSX.Element;
    renderFullDateGrid(): Array<JSX.Element>;
    render(): JSX.Element;
}
export { ScheduleSelector };
//# sourceMappingURL=ScheduleSelector.d.ts.map