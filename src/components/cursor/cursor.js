import React, {useContext, useEffect, useState} from "react";
import useMousePosition from "./useMousePosition";
import {CursorContext} from "./cursorContextProvider";
import cursorStyle from "./cursor.module.less";
import globalStore from "@/stores/globalStore";
// Follow: https://medium.com/@jaredloson/custom-javascript-cursor-in-react-d7ffefb2db38
const Cursor = () => {
    const {clientX, clientY} = useMousePosition();
    const [cursor] = useContext(CursorContext);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => {
            setIsVisible(false);
            globalStore.appCanvasCtx.clearRect(0, 0, globalStore.appCanvasDom.width, globalStore.appCanvasDom.height);
        };
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            pointerEvents: "none"
        }} className={cursorStyle.cursor}>
            <div style={{
                left: clientX,
                top: clientY,
                transform: `translate(-50%, -50%) scale(${cursor.active ? 2.5: 1})`,
                opacity: isVisible && clientX > 1 ? 1: 0,
            }} className={cursorStyle.lightCircle}>
                <div className={cursorStyle.lightShadow}/>
                <div className={cursorStyle.lightArcBox}>
                    <div className={cursorStyle.lightArc1}/>
                    <div className={cursorStyle.lightArc2}/>
                </div>
            </div>
            <div className={cursorStyle.cursorImg} style={{
                left: clientX,
                top: clientY,
                transform: `translate(-50%, -50%) scale(${cursor.active ? 2.5: 1})`,
                opacity: isVisible && clientX > 1 ? 1: 0,
            }}/>
        </div>
    );
};
export default Cursor;