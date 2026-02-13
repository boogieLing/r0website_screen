import pinkCookie from "./pinkCookie.module.less";

import {useCallback, useEffect, useMemo, useState} from "react";
import useSound from "use-sound";

import colorStore from "@/stores/colorStore";
import PinkCookieSideList from "@/components/pinkCookie/pinkCookieSideList";
import {randomIsoscelesTriangles} from "@/utils/randomTriangles";

import R0n from "@/static/pic/R0n.png";
import thinking from "@/static/pic/thinking.png";
import book from "@/static/pic/book.png";
import coffee_cat from "@/static/pic/coffee_cat.png";
import basi from "@/static/mp3/ba-si-ba-si.wav";
import bennn from "@/static/mp3/bennn.wav";
import bunnnnn from "@/static/mp3/bunnnnn.wav";

const pinkCookieCanvasId = "pinkCookieCanvasId";
const randomColor = colorStore.randomColor;

class optionListItem {
    title = "Unknown";
    icon = "";
    iconRate = 0.13;
    tips = "Nothing wrote in here, just a text for testing";
    key = "Unknown";
    navigatePath = ""

    constructor(title, icon, iconRate, tips, key, navigatePath) {
        this.title = title;
        this.icon = icon;
        this.iconRate = iconRate;
        this.tips = tips;
        this.key = key;
        this.navigatePath = navigatePath
    }
}

const optionList = [
    new optionListItem("Blog", book, 0.2, "Some dispensable personal creations", "Blog", "/blog/"),
    new optionListItem("Thinking", thinking, 0.3, "The seat of this wandering soul", "Thinking"),
    new optionListItem("What's R0", R0n, 0.13, "What a creature r0 is...", "WhosR0", "/ushouldknow"),
    new optionListItem("More", coffee_cat, 0.20, "Other features of this site", "More","/more/"),
];

function PinkCookie({width, height, midOffset}) {
    const [ids, setId] = useState("");
    const [pinkCookieCanvas, setPinkCookieCanvas] = useState(null);
    const [showList, setShowList] = useState(false);

    const cookieDiameter = useMemo(() => {
        let cookieDiameter = width * 11 / 33;
        if (width <= height + 200) {
            // 如果是窄型屏幕
            cookieDiameter = height / 2.5;
        }
        return cookieDiameter;
    }, [width, height]);

    const ringWidth = useMemo(() => (cookieDiameter / 2) * 0.87, [cookieDiameter]);
    const percent = useMemo(() => {
        return {
            X: midOffset.x / (cookieDiameter / 2),
            Y: midOffset.y / (cookieDiameter / 2)
        };
    }, [cookieDiameter, midOffset]);
    const offset = useMemo(() => {
        const offset = {
            X: 0,
            Y: 0
        };
        const threshold = 0.4; // 发生粉饼偏移的下限
        if (Math.abs(percent.X) > threshold) {
            offset.X = -(percent.X > 0 ? (percent.X - threshold) : (percent.X + threshold)) * 17;
        }
        if (Math.abs(percent.Y) > threshold) {
            offset.Y = -(percent.Y > 0 ? (percent.Y - threshold) : (percent.Y + threshold)) * 23;
        }
        return offset;
    }, [percent]);

    useEffect(() => {
        let id = "PinkCookie" + ("_" + Math.random()).replace(".", "_");
        setId(id);
    }, []);


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
    const [playBennn] = useSound(
        bennn,
        {
            volume: 0.7,
        }
    );
    const [playBunnnnn] = useSound(
        bunnnnn,
        {
            volume: 0.5,
        }
    );
    const onClickHandler = useCallback(() => {
        if (!showList) {
            playBennn();
        } else {
            playBunnnnn();
        }
        setShowList(!showList);
    }, [showList]);

    return <>
        <PinkCookieSideList
            height={cookieDiameter} width={cookieDiameter * 1.15} color={randomColor}
            show={showList} optionList={optionList}
            style={{
                top: `${offset.Y + (height - cookieDiameter) / 2}px`,
                left: `${offset.X + width / 2 - (showList ? cookieDiameter / 3 : 0)}px`,
            }}
        />
        <div className={pinkCookie.pinkCookie} style={{
            height: `${cookieDiameter}px`,
            width: `${cookieDiameter}px`,
            top: `${offset.Y + (height - cookieDiameter) / 2}px`,
            left: `${offset.X + (width - cookieDiameter) / 2 - (showList ? cookieDiameter / 3 : 0)}px`,
        }} id={ids} onMouseEnter={() => playBasi()} onMouseLeave={() => stop()} onClick={onClickHandler}>
            <div className={pinkCookie.cookieDynamic}>
                <canvas
                    id={pinkCookieCanvasId}
                    width={cookieDiameter ? cookieDiameter - 20 : 150}
                    height={cookieDiameter ? cookieDiameter - 20 : 150} style={{
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
    </>;
}

export default PinkCookie;
