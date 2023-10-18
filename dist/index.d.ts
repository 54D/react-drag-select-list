import React, { HTMLAttributes, CSSProperties } from 'react';

type DragSelectListProps<T> = HTMLAttributes<HTMLDivElement> & {
    selectionMode?: 'default' | 'append' | 'remove';
    containerStyle?: CSSProperties;
    selectorStyle?: CSSProperties;
    onSelectionChange?: (selectedIndices: number[]) => void;
    data?: T[];
    dataKeyExtractor?: (data: T) => string;
    renderItem?: (data: T, index?: number) => JSX.Element;
    children: JSX.Element[];
};
declare const DragSelectList: <DataType>({ selectionMode, containerStyle, selectorStyle, onSelectionChange, data, dataKeyExtractor, renderItem, children, ...props }: DragSelectListProps<DataType>) => React.JSX.Element;

type DragSelectListItemProps = HTMLAttributes<HTMLDivElement> & {
    dataKey: string;
    data: any;
    innerRef?: (ref: HTMLDivElement) => void;
};
declare const DragSelectListItem: ({ dataKey, data, innerRef, onSelect, children, ...props }: DragSelectListItemProps) => React.JSX.Element;

export { DragSelectList, DragSelectListItem };
