import React, { CSSProperties, HTMLAttributes } from "react";
export type DragSelectListProps<T> = HTMLAttributes<HTMLDivElement> & {
    selectionMode?: 'default' | 'append' | 'remove';
    containerStyle?: CSSProperties;
    selectorStyle?: CSSProperties;
    onSelectionChange?: (selectedIndices: number[]) => void;
    data?: T[];
    dataKeyExtractor?: (data: T) => string;
    renderItem?: (data: T, index?: number) => JSX.Element;
    children: JSX.Element;
};
declare const DragSelectList: <DataType>({ selectionMode, containerStyle, selectorStyle, onSelectionChange, data, dataKeyExtractor, renderItem, children, ...props }: DragSelectListProps<DataType>) => React.JSX.Element;
export default DragSelectList;
