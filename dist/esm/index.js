import React, { useRef, useState, useEffect, useCallback } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var DragSelectListItem = function (_a) {
    var dataKey = _a.dataKey; _a.data; var innerRef = _a.innerRef; _a.onSelect; var children = _a.children, props = __rest(_a, ["dataKey", "data", "innerRef", "onSelect", "children"]);
    return (React.createElement("div", __assign({ key: dataKey, ref: innerRef }, props), children));
};

var boxesIntersect = function (box1, box2) {
    return box1.left < box2.right &&
        box1.right > box2.left &&
        box1.top < box2.bottom &&
        box1.bottom > box2.top;
};
var DragSelectList = function (_a) {
    var _b = _a.selectionMode, selectionMode = _b === void 0 ? 'default' : _b, detectionAreaStyle = _a.detectionAreaStyle, containerStyle = _a.containerStyle, selectorStyle = _a.selectorStyle, onSelectionChange = _a.onSelectionChange, data = _a.data, dataKeyExtractor = _a.dataKeyExtractor, renderItem = _a.renderItem, children = _a.children; __rest(_a, ["selectionMode", "detectionAreaStyle", "containerStyle", "selectorStyle", "onSelectionChange", "data", "dataKeyExtractor", "renderItem", "children"]);
    var itemsContainerRef = useRef(null);
    var _c = useState(undefined), selectionBoxStart = _c[0], setSelectionBoxStart = _c[1];
    var _d = useState(undefined), selectionBoxEnd = _d[0], setSelectionBoxEnd = _d[1];
    var mouseDownHandler = function (event) {
        event.preventDefault();
        setSelectionBoxStart({ x: event.pageX, y: event.pageY });
        setSelectionBoxEnd({ x: event.pageX, y: event.pageY });
    };
    var mouseMoveHandler = function (event) {
        event.preventDefault();
        if (selectionBoxStart)
            setSelectionBoxEnd({ x: event.pageX, y: event.pageY });
    };
    var mouseUpHandler = function (event) {
        event.preventDefault();
        setSelectionBoxStart(undefined);
        setSelectionBoxEnd(undefined);
    };
    useEffect(function () {
        if (selectionBoxStart) {
            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        }
        return function () {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [selectionBoxStart]);
    var calculateSelectionBox = useCallback(function () {
        if (!selectionBoxStart || !selectionBoxEnd) {
            return undefined;
        }
        var top = Math.min(selectionBoxStart.y, selectionBoxEnd.y);
        var left = Math.min(selectionBoxStart.x, selectionBoxEnd.x);
        var height = Math.abs(selectionBoxStart.y - selectionBoxEnd.y);
        var width = Math.abs(selectionBoxStart.x - selectionBoxEnd.x);
        return { top: top, left: left, height: height, width: width };
    }, [selectionBoxStart, selectionBoxEnd]);
    var _e = useState([]), selectedBoxIndices = _e[0], setSelectedBoxIndices = _e[1];
    useEffect(function () {
        onSelectionChange && onSelectionChange(selectedBoxIndices);
    }, [selectedBoxIndices]);
    useEffect(function () {
        var _a;
        if (!selectionBoxStart || !selectionBoxEnd || !itemsContainerRef || itemsContainerRef.current == null) {
            return;
        }
        var selectionBox = calculateSelectionBox();
        if (!selectionBox) {
            return;
        }
        var intersectingBoxIndices = Array.from((_a = itemsContainerRef.current) === null || _a === void 0 ? void 0 : _a.children).map(function (item, index) {
            var itemBoundingBox = item.getBoundingClientRect();
            return boxesIntersect({
                top: selectionBox.top - window.scrollY,
                left: selectionBox.left - window.scrollX,
                bottom: selectionBox.top - window.scrollY + selectionBox.height,
                right: selectionBox.left - window.scrollX + selectionBox.width,
            }, {
                top: itemBoundingBox.top,
                left: itemBoundingBox.left,
                bottom: itemBoundingBox.bottom,
                right: itemBoundingBox.right,
            });
        }).map(function (item, index) {
            return item ? index : -1;
        }).filter(function (item) { return item !== -1; });
        var newSelectedBoxIndices = selectionMode === 'default' ? intersectingBoxIndices :
            selectionMode === 'append' ? __spreadArray(__spreadArray([], selectedBoxIndices, true), intersectingBoxIndices, true) :
                selectionMode === 'remove' ? selectedBoxIndices.filter(function (item) { return !intersectingBoxIndices.includes(item); }) :
                    selectionMode === 'toggle' ? selectedBoxIndices.filter(function (item) { return !intersectingBoxIndices.includes(item); }).concat(intersectingBoxIndices.filter(function (item) { return !selectedBoxIndices.includes(item); })) :
                        [];
        setSelectedBoxIndices(newSelectedBoxIndices);
    }, [selectionBoxStart, selectionBoxEnd]);
    return (React.createElement("div", { style: detectionAreaStyle, onMouseDown: mouseDownHandler },
        selectionBoxStart && selectionBoxEnd && (React.createElement("div", { style: __assign(__assign({ position: 'absolute', zIndex: 50 }, selectorStyle), calculateSelectionBox()) })),
        React.createElement("div", { ref: itemsContainerRef, style: containerStyle },
            data && renderItem && data.map(function (item, index) {
                return (React.createElement(DragSelectListItem, { key: index, dataKey: dataKeyExtractor ? dataKeyExtractor(item) : index.toString(), data: item }, renderItem(item, index)));
            }),
            children)));
};

export { DragSelectList, DragSelectListItem };
//# sourceMappingURL=index.js.map
