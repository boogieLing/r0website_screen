import React, {useContext, useEffect, useState} from "react";
import useMousePosition from "./useMousePosition";
import {CursorContext} from "./cursorContextProvider";
import cursorStyle from "./cursor.module.less";
import cursorTipsStore from "@/stores/cursorTipsStore";
import useLocalStorage from "@/hooks/localStorage";
// Follow: https://medium.com/@jaredloson/custom-javascript-cursor-in-react-d7ffefb2db38
const Cursor = ({display = false}) => {
    const {clientX, clientY} = useMousePosition();
    const [cursor] = useContext(CursorContext);
    const [isVisible, setIsVisible] = useState(false);
    const [isDown, setIsDown] = useState(false);
    useEffect(() => {
        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => {
            setIsVisible(false);
            // TODO 需要浏览器性能。。。。。
            // globalStore.appCanvasCtx.clearRect(0, 0, globalStore.appCanvasDom.width, globalStore.appCanvasDom.height);
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
    const borderColor = isDown ? (isSafari ? "#fdcb6e" : "white") : "white";
    return (
        <div style={{
            position: "fixed",
            left: clientX,
            top: clientY,
            zIndex: 9999,
            pointerEvents: "none",
        }} className={cursorStyle.cursor}>
            <div style={{
                width: `${cursorDiameter}px`,
                height: `${cursorDiameter}px`,
                borderWidth: `${cursorDiameter / 10}px`,
                transform: `translate(-50%, -50%)`,
                opacity: isVisible && clientX > 1 ? 1 : 0,
                borderColor: borderColor,
                display: display?"default":"none",
            }} className={cursorStyle.lightCircle}>
                <div className={cursorStyle.lightShadow}/>
                <div className={cursorStyle.lightArcBox}>
                    <div className={cursorStyle.lightArc1}/>
                    <div className={cursorStyle.lightArc2}/>
                </div>
            </div>
            <div className={cursorStyle.cursorImg} style={{
                transform: `translate(-50%, -50%) scale(${cursor.active ? 2.5 : 1})`,
                opacity: isVisible && clientX > 1 ? 1 : 0,
            }}>
                <div className={cursorStyle.cursorTipsUl}>
                    {

                        cursorTipsStore.mouseTips.map((tip, index) => {
                            return <div className={cursorStyle.cursorTipsLi} key={index}>
                                <div className={cursorStyle.cursorTipsIcon}>
                                    <i className={cursorStyle.iconfont}>&#xe748;</i>
                                    <i className={cursorStyle.iconText}>{tip.iconText}</i>
                                </div>
                                <span className={cursorStyle.cursorTips}>
                                {tip.spanText}
                            </span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    );
};
export default Cursor;