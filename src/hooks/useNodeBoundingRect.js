import React from "react";

export default function useNodeBoundingRect(){
    const [rect, setRect] = React.useState(null);

    const resizeObserver = new ResizeObserver((entries) => {
        setRect(entries[0].contentRect);
    });
    const ref = React.useCallback((node) => {
        if (node !== null) {
            resizeObserver.observe(node);
        }
    }, []);

    const cleanObserver = React.useCallback(() => {
        resizeObserver.disconnect();
    }, []);

    return [rect, ref, cleanObserver];
}
