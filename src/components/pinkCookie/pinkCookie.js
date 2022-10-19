import pinkCookie from "./pinkCookie.module.less";

import {useEffect, useState} from "react";

import colorStore from "@/stores/colorStore";
import R0n from "@/static/pic/R0n.png";
import useSound from "use-sound";
import basi from "@/static/mp3/ba-si-ba-si.wav";
import PinkCookieSideList from "@/components/pinkCookie/pinkCookieSideList";
import {randomIsoscelesTriangles} from "@/utils/randomTriangles";

const pinkCookieCanvasId = "pinkCookieCanvasId";
const randomColor = colorStore.randomColor;

class optionListItem {
    title = "Unknown";
    icon = "";
    tips = "Nothing wrote in here, just a text for testing";
    key = "Unknown";

    constructor(title, icon, tips, key) {
        this.title = title;
        this.icon = icon;
        this.tips = tips;
        this.key = key;
    }
}

const optionList = [
    new optionListItem("Blog", R0n, "Some dispensable personal creations", "Blog"),
    new optionListItem("Thinking", R0n, "The seat of this wandering soul", "Thinking"),
    new optionListItem("What's R0", R0n, "What a creature r0 is...", "WhosR0"),
    new optionListItem("More", R0n, "Other features of this site", "More"),
];

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
    const [showList, setShowList] = useState(false);
    const onClickHandler = () => {
        setShowList(!showList);
    };

    return (
        <>
            <PinkCookieSideList
                height={cookieDiameter} width={cookieDiameter * 1.15} color={randomColor}
                show={showList} optionList={optionList} style={{
                top: `${offsetY + (height - cookieDiameter) / 2}px`,
                left: `${offsetX + width / 2 - (showList ? cookieDiameter / 3: 0)}px`,
            }}/>
            <div className={pinkCookie.pinkCookie} style={{
                height: `${cookieDiameter}px`,
                width: `${cookieDiameter}px`,
                top: `${offsetY + (height - cookieDiameter) / 2}px`,
                left: `${offsetX + (width - cookieDiameter) / 2 - (showList ? cookieDiameter / 3: 0)}px`,
            }} id={ids} onMouseEnter={() => playBasi()} onMouseLeave={() => stop()} onClick={onClickHandler}>
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

        </>
    );
}

export default PinkCookie;