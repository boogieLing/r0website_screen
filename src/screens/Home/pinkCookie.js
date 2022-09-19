import pinkCookie from "./pinkCookie.module.less";
import R0n from "@/static/pic/R0n.png";
import {useEffect, useState} from "react";
import colorStore from "@/stores/colorStore";

import useSound from "use-sound";
import basi from "@/static/mp3/ba-si-ba-si.wav";
const pinkCookieCanvasId = "pinkCookieCanvasId";
const randomColor = colorStore.randomColor;

function PinkCookie({width, height, midOffset}) {
    const [ids, setId] = useState();
    let cookieDiameter = width * 11 / 33;
    if (width <= height + 200) {
        // 如果是窄型屏幕
        cookieDiameter = height / 2.5;
    }
    const ringWidth = (cookieDiameter / 2) * 0.87;
    const percentageX = midOffset.x / (cookieDiameter / 2);
    const percentageY = midOffset.y / (cookieDiameter / 2);

    let offsetX = 0;
    let offsetY = 0;
    const threshold = 0.4; // 发生粉饼偏移的下限
    if (Math.abs(percentageX) > threshold) {
        offsetX = -(percentageX > 0 ? (percentageX - threshold): (percentageX + threshold)) * 17;
    }
    if (Math.abs(percentageY) > threshold) {
        offsetY = -(percentageY > 0 ? (percentageY - threshold): (percentageY + threshold)) * 23;
    }
    useEffect(() => {
        let id = "PinkCookie" + ("_" + Math.random()).replace(".", "_");
        setId(id);
    }, []);

    const [pinkCookieCanvas, setPinkCookieCanvas] = useState(null);
    useEffect(() => {
        if (cookieDiameter > 0 && pinkCookieCanvas) {
            randomIsoscelesTriangles(pinkCookieCanvas, cookieDiameter, cookieDiameter, randomColor.list);
        } else {
            setPinkCookieCanvas(document.querySelector("#" + pinkCookieCanvasId));
        }
    }, [cookieDiameter, pinkCookieCanvas]);

    const [playBasi, {stop}] = useSound(
        basi,
        {
            loop: true,
            volume: 0.1,
        }
    );
    return (
        <div className={pinkCookie.pinkCookie} style={{
            height: `${cookieDiameter}px`,
            width: `${cookieDiameter}px`,
            top: `${offsetY + (height - cookieDiameter) / 2}px`,
            left: `${offsetX + (width - cookieDiameter) / 2}px`,
        }} id={ids} onMouseEnter={() => playBasi()} onMouseLeave={() => stop()}>
            <div className={pinkCookie.cookieDynamic}>
                <canvas
                    id={pinkCookieCanvasId}
                    width={cookieDiameter ? cookieDiameter - 20: 150}
                    height={cookieDiameter ? cookieDiameter - 20: 150} style={{
                    backgroundColor: `${randomColor.background}`
                }}/>
                <div className={pinkCookie.ringDynamic} style={{
                    mask: `radial-gradient(transparent ${ringWidth}px, #000 ${ringWidth}px)`,
                    WebkitMask: `radial-gradient(transparent ${ringWidth}px, #000 ${ringWidth}px)`,
                }}/>
                <div className={pinkCookie.ringDynamicInsideShadow} style={{
                    width: `${ringWidth * 2}px`,
                    height: `${ringWidth * 2}px`,
                    boxShadow: `inset 0 0 5px 0 ${randomColor.hard_color}`
                }}/>
                <div className={pinkCookie.bigR0Box}>
                    <img src={R0n} alt="" className={pinkCookie.R0Dynamic}/>
                </div>
            </div>

            <div className={pinkCookie.ringFixed} style={{
                mask: `radial-gradient(transparent ${ringWidth}px, #000 ${ringWidth}px)`,
                WebkitMask: `radial-gradient(transparent ${ringWidth}px, #000 ${ringWidth}px)`,
                width: `${cookieDiameter}px`,
                height: `${cookieDiameter}px`,
            }}/>
            <div className={pinkCookie.bigR0Box}>
                <img src={R0n} alt="" className={pinkCookie.R0Fixed}/>
            </div>
            <div className={pinkCookie.ringDynamicFineLight}/>
        </div>
    );
}

function randomIsoscelesTriangles(canvas, width, height, color_arr) {
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 0;
    const limit = Math.min(width, height) / 10;
    for (let i = color_arr.length - 1; i >= 0; --i) {
        for (let j = 0; j < limit; ++j) {
            randomIsoscelesTriangle(
                ctx,
                0, 0,
                width, height,
                color_arr[i], i, color_arr, 60 * i + 10, limit
            );
        }
    }
}

function randomIsoscelesTriangle(
    ctx, minWidth, minHeight, maxWidth, maxHeight, fillStyle, index, arr, threshold, limit,
) {
    // 注意，这里是故意不检查边界是否越界的！
    let startX = Math.random() * (maxWidth - minWidth) + minWidth;
    let endX = startX + Math.random() * (10 + threshold) + threshold;
    let startY = Math.random() * (maxHeight - minHeight) + minHeight;
    let endY = startY;
    let triangleHeight = 1.7320508 / 2 * (endX - startX);
    let pX1 = endX - (endX - startX) / 2;
    let pY1 = endY - triangleHeight;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(pX1, pY1);
    ctx.lineTo(endX, endY);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
    for (let i = 0; i < index; ++i) {
        // 如果是靠后的颜色，说明是深色，在这之上再生成一个浅色的三角形
        randomIsoscelesTriangle(
            ctx,
            startX - limit, pY1 - limit,
            endX + limit, endY + limit,
            arr[index - 1], index - 1, arr, threshold / 1.5
        );
    }
}

export default PinkCookie;