import React, {HTMLAttributes} from "react";

export type DragSelectListItemProps = HTMLAttributes<HTMLDivElement> & {
    dataKey: string,
    data: any,
    innerRef?: (ref: HTMLDivElement) => void,
}

const DragSelectListItem = ({ dataKey, data, innerRef, onSelect, children, ...props }: DragSelectListItemProps) => {

    return (
        <div key={dataKey} ref={innerRef} {...props}>
            {children}
        </div>
    )

};

export default DragSelectListItem;
