import React, {useContext, useEffect, useState} from "react";
import useMousePosition from "./useMousePosition";
import {CursorContext} from "./cursorContextProvider";
import cursorStyle from "./cursor.module.less";
import globalStore from "@/stores/globalStore";
import useLocalStorage from "@/hooks/localStorage";
// Follow: https://medium.com/@jaredloson/custom-javascript-cursor-in-react-d7ffefb2db38
const Cursor = () => {
    const {clientX, clientY} = useMousePosition();
    const [cursor] = useContext(CursorContext);
    const [isVisible, setIsVisible] = useState(false);
    const [isDown, setIsDown] = useState(false);
    useEffect(() => {
        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => {
            setIsVisible(false);
            globalStore.appCanvasCtx.clearRect(0, 0, globalStore.appCanvasDom.width, globalStore.appCanvasDom.height);
        };
        const handleMouseDown = () => setIsDown(true);
        const handleMouseUp = () => setIsDown(false);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);
        document.body.addEventListener("mousedown", handleMouseDown);
        document.body.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.removeEventListener("mousedown", handleMouseDown);
            document.body.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    const [isSafari,] = useLocalStorage("isSafari", false)
    const cursorDiameter = 40 * (isSafari ? 1 : (isDown ? 1.3 : 1));
    const borderColor = isDown ? (isSafari ? "#00cec9" : "white") : "white";
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
                width: `${cursorDiameter}px`,
                height: `${cursorDiameter}px`,
                borderWidth: `${cursorDiameter / 10}px`,
                transform: `translate(-50%, -50%)`,
                opacity: isVisible && clientX > 1 ? 1 : 0,
                borderColor: borderColor,
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
                transform: `translate(-50%, -50%) scale(${cursor.active ? 2.5 : 1})`,
                opacity: isVisible && clientX > 1 ? 1 : 0,
            }}/>
        </div>
    );
};
export default Cursor;