import React, { CSSProperties, HTMLAttributes } from "react";
export type DragSelectListProps = HTMLAttributes<HTMLDivElement> & {
    selectionMode?: 'default' | 'append' | 'remove';
    containerStyle?: CSSProperties;
    selectorStyle?: CSSProperties;
    onSelectionChange?: (selectedIndices: number[]) => void;
    children: JSX.Element;
};
declare const DragSelectList: ({ selectionMode, containerStyle, selectorStyle, onSelectionChange, children, ...props }: DragSelectListProps) => React.JSX.Element;
export default DragSelectList;
