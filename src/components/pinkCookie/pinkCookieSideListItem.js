import listStyle from "./pinkCookieSideList.module.less";
import {useEffect, useState} from "react";
import {clearTriangles, randomIsoscelesTriangles} from "@/utils/randomTriangles";
import colorStore from "@/stores/colorStore";

const pinkCookieListItemCanvasId = "pinkCookieListItemCanvasId";
const randomColor = colorStore.randomColor;

function PinkCookieSideListItem({isEnter, height, width, value, id}) {
    const [isCheck, setIsCheck] = useState(false);
    const mouseEnterHandler = () => {
        setIsCheck(true);
    };
    const mouseLeaveHandler = () => {
        setIsCheck(false);
    };
    const [pinkCookieListItemCanvas, setPinkCookieCanvas] = useState(null);
    useEffect(() => {
        if (height * width > 0 && pinkCookieListItemCanvas && isCheck) {
            randomIsoscelesTriangles(pinkCookieListItemCanvas, width, height, randomColor.list);
        } else if (pinkCookieListItemCanvas && !isCheck) {
            clearTriangles(pinkCookieListItemCanvas, width, height);
        }
        if (!pinkCookieListItemCanvas) {
            setPinkCookieCanvas(document.querySelector("#" + pinkCookieListItemCanvasId + id));
        }
    }, [height, width, pinkCookieListItemCanvas, isCheck, id]);
    return <div className={listStyle.PinkCookieSideListItem} key={value.key} style={{
        height: `${height * 0.17}px`,
        backgroundColor: `${randomColor.hard_color}`
    }} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
        <canvas
            id={pinkCookieListItemCanvasId + id}
            height={height * 0.17}
            width={width}
            style={{
                position: "absolute",
                width: `${width}px`,
                height: `${height * 0.17}px`,
                zIndex: "0",
                background:"rgba(0,0,0,0.5)"
            }}/>
        <div className={listStyle.placeHolder} style={{
            width: `${height * 0.55}px`
        }}/>
        <div className={listStyle.infoBox} style={{
            width: `${height * 0.42}px`
        }}>
            <span className={listStyle.title} style={{
                fontSize: `${height / 17}px`
            }}>
                {value.title}
            </span>
            <span className={listStyle.tips} style={{
                fontSize: `${height / 50}px`
            }}>
                {value.tips}
            </span>
        </div>
        <div style={{
            background: `url(${value.icon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: `${height * 0.13}px`,
            height: `${height * 0.13}px`,
            zIndex: 0,
        }}/>
    </div>;
}

export default PinkCookieSideListItem;