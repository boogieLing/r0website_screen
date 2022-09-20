import {useState, useRef, useEffect} from "react";
import React from "react";
// Follow: https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
export const useNodeBoundingPositionSize = () => {
    const resizeObserver = new ResizeObserver((entries) => {
        setRect({
            left: entries[0].target.getBoundingClientRect().left,
            top: entries[0].target.getBoundingClientRect().top,
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height,
        });
    });
    const cleanObserver = React.useCallback(() => {
        resizeObserver.disconnect();
    }, []);
    const ref = React.useCallback((node) => {
        if (node !== null) {
            resizeObserver.observe(node);
        }
    }, []);
    const [rect, setRect] = useState({left: 0, top: 0, width: 0, height: 0});

    return [rect, ref, cleanObserver];
};