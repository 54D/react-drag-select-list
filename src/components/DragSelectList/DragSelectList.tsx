import React, {CSSProperties, HTMLAttributes} from "react";
import {useCallback, useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import DragSelectListItem, {DragSelectListItemProps} from "../DragSelectListItem/DragSelectListItem";

type BoundingBox = {
    top: number
    left: number
    bottom: number
    right: number
}

const boxesIntersect = (box1: BoundingBox, box2: BoundingBox) =>
    box1.left < box2.right &&
    box1.right > box2.left &&
    box1.top < box2.bottom &&
    box1.bottom > box2.top;

export type DragSelectListProps<T> = HTMLAttributes<HTMLDivElement> & {
    selectionMode?: 'default'|'append'|'remove',
    containerStyle?: CSSProperties,
    selectorStyle?: CSSProperties,
    onSelectionChange?: (selectedIndices: number[]) => void,
    data?: T[],
    dataKeyExtractor?: (data: T) => string,
    renderItem?: (data: T, index?: number) => JSX.Element,
    //children: JSX.Element<DragSelectListItemProps>[],
    children: JSX.Element[],
};

const DragSelectList = <DataType,>(
    {
        selectionMode = 'default',
        containerStyle,
        selectorStyle,
        onSelectionChange,
        data,
        dataKeyExtractor,
        renderItem,
        children,
        ...props
    }: DragSelectListProps<DataType>) => {

    const itemsContainerRef = useRef<HTMLDivElement>(null);

    const [selectionBoxStart, setSelectionBoxStart] = useState<{ x: number, y: number } | undefined>(undefined);
    const [selectionBoxEnd, setSelectionBoxEnd] = useState<{ x: number, y: number } | undefined>(undefined);

    const mouseDownHandler = (event: ReactMouseEvent) => {
        event.preventDefault();
        setSelectionBoxStart({ x: event.pageX, y: event.pageY });
        setSelectionBoxEnd({ x: event.pageX, y: event.pageY });
    };

    const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        if (selectionBoxStart) setSelectionBoxEnd({ x: event.pageX, y: event.pageY });
    };

    const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        setSelectionBoxStart(undefined);
        setSelectionBoxEnd(undefined);
    };

    useEffect(() => {
        if (selectionBoxStart) {
            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        }
        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        }
    }, [selectionBoxStart]);

    const calculateSelectionBox = useCallback<() => { top: number, left: number, height: number, width: number } | undefined>(() => {
        if(!selectionBoxStart || !selectionBoxEnd) { return undefined; }
        const top = Math.min(selectionBoxStart.y, selectionBoxEnd.y);
        const left = Math.min(selectionBoxStart.x, selectionBoxEnd.x);
        const height = Math.abs(selectionBoxStart.y - selectionBoxEnd.y);
        const width = Math.abs(selectionBoxStart.x - selectionBoxEnd.x);
        return {top, left, height, width};
    }, [selectionBoxStart, selectionBoxEnd]);

    const [selectedBoxIndices, setSelectedBoxIndices] = useState<number[]>([]);

    useEffect(() => {
        onSelectionChange && onSelectionChange(selectedBoxIndices);
    }, [selectedBoxIndices]);

    useEffect(() => {
        if (!selectionBoxStart || !selectionBoxEnd || !itemsContainerRef || itemsContainerRef.current == null) { return; }
        const selectionBox = calculateSelectionBox();
        if (!selectionBox) { return; }
        const intersectingBoxIndices = Array.from(itemsContainerRef.current?.children).map((item, index) => {
            const itemBoundingBox = item.getBoundingClientRect();
            return boxesIntersect({
                top: selectionBox.top - window.scrollY,
                left: selectionBox.left - window.scrollX,
                bottom: selectionBox.top - window.scrollY + selectionBox.height,
                right: selectionBox.left - window.scrollX + selectionBox.width,
            }, {
                top: itemBoundingBox.top ,
                left: itemBoundingBox.left,
                bottom: itemBoundingBox.bottom ,
                right: itemBoundingBox.right,
            });
        }).map((item, index) => {
            return item ? index : -1;
        }).filter((item) => item !== -1);
        const newSelectedBoxIndices =
            selectionMode === 'default' ? intersectingBoxIndices :
            selectionMode === 'append' ? [...selectedBoxIndices, ...intersectingBoxIndices] :
            selectionMode === 'remove' ? selectedBoxIndices.filter((item) => !intersectingBoxIndices.includes(item)) :
            selectionMode === 'toggle' ? selectedBoxIndices.filter((item) => !intersectingBoxIndices.includes(item)).concat(intersectingBoxIndices.filter((item) => !selectedBoxIndices.includes(item))) :
            [];
        setSelectedBoxIndices(newSelectedBoxIndices);
    }, [selectionBoxStart, selectionBoxEnd]);

    return (
        <div style={{ height: '100%', width: '100%' }} onMouseDown={mouseDownHandler}>
            {selectionBoxStart && selectionBoxEnd && (
                <div style={{ position: 'absolute', zIndex: 50, ...selectorStyle, ...calculateSelectionBox()}}>
                </div>
            )}
            <div ref={itemsContainerRef} style={containerStyle}>
                {data && renderItem && data.map((item, index) => {
                    return (
                        <DragSelectListItem
                            key={index}
                            dataKey={dataKeyExtractor ? dataKeyExtractor(item) : index.toString()}
                            data={item}
                        >
                            {renderItem(item, index)}
                        </DragSelectListItem>
                    );
                })}
                {children}
            </div>
        </div>
    );

}

export default DragSelectList;
