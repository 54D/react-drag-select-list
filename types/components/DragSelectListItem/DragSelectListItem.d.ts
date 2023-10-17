import React, { HTMLAttributes } from "react";
export type DragSelectListItemProps = HTMLAttributes<HTMLDivElement> & {
    dataKey: string;
    data: any;
    innerRef?: (ref: HTMLDivElement) => void;
};
declare const DragSelectListItem: ({ dataKey, data, innerRef, onSelect, children, ...props }: DragSelectListItemProps) => React.JSX.Element;
export default DragSelectListItem;
