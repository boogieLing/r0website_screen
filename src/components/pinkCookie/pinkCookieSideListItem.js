import listStyle from "./pinkCookieSideList.module.less";

import {useCallback, useEffect, useState} from "react";
import useSound from "use-sound";

import {clearTriangles, randomIsoscelesTriangles} from "@/utils/randomTriangles";
import colorStore from "@/stores/colorStore";

import buiu from "@/static/mp3/bu-iu.wav";
import {useNavigate} from "react-router-dom";

const pinkCookieListItemCanvasId = "pinkCookieListItemCanvasId";
const pinkColor = colorStore.pink;

function PinkCookieSideListItem({height, width, value, id, navigatePath}) {
    const navigate = useNavigate();
    const [playBuiu] = useSound(buiu, {volume: 0.3});
    const [isCheck, setIsCheck] = useState(false);
    const [pinkCookieListItemCanvas, setPinkCookieCanvas] = useState(null);

    const mouseEnterHandler = useCallback(() => {
        playBuiu();
        setIsCheck(true);
    }, []);
    const mouseLeaveHandler = useCallback(() => {
        setIsCheck(false);
    }, []);

    useEffect(() => {
        if (height * width > 0 && pinkCookieListItemCanvas && isCheck) {
            randomIsoscelesTriangles(pinkCookieListItemCanvas, width, height, pinkColor.list);
        } else if (pinkCookieListItemCanvas && !isCheck) {
            clearTriangles(pinkCookieListItemCanvas, width, height);
        }
        if (!pinkCookieListItemCanvas) {
            setPinkCookieCanvas(document.querySelector("#" + pinkCookieListItemCanvasId + id));
        }
    }, [height, width, pinkCookieListItemCanvas, isCheck, id]);
    const goTo = useCallback(() => {
        if (navigatePath) {
            // navigate(navigatePath);
            window.open(navigatePath,"_blank")
        }
    }, [navigatePath]);
    return <div className={listStyle.PinkCookieSideListItem} key={value.key} style={{
        height: `${height * 0.15}px`,
        opacity: isCheck ? "1" : "0.7"
    }} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler} onClick={goTo}>
        <canvas
            id={pinkCookieListItemCanvasId + id}
            height={height * 0.15}
            width={width}
            style={{
                position: "absolute",
                width: `${width}px`,
                height: `${height * 0.15}px`,
                zIndex: "0",
                background: "rgba(0,0,0,0.5)"
            }}/>
        <div className={listStyle.placeHolder} style={{
            width: `${height * 0.55}px`
        }}/>
        <div className={listStyle.infoBox} style={{
            width: `${height * 0.42}px`
        }}>
            <span className={listStyle.title} style={{
                fontSize: `${height / 20}px`
            }}>
                {value.title}
            </span>
            <span className={listStyle.tips} >
                {value.tips}
            </span>
        </div>
        <div
            className={listStyle.iconBox}
            style={{
                background: `url(${value.icon})`,
                width: `${height * value.iconRate}px`,
                height: `${height * 0.25}px`,
            }}/>
    </div>;
}

export default PinkCookieSideListItem;