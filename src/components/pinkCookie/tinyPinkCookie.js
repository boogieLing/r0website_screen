import pinkCookie from "./pinkCookie.module.less";
import tinyCookie from "./tinyPinkCookie.module.less";
import colorStore from "@/stores/colorStore";
import R0n from "@/static/pic/R0n.png";
import {useEffect, useMemo} from "react";
import {randomIsoscelesTriangles} from "@/utils/randomTriangles";

const tinyPinkCookieCanvasId = "tinyPinkCookieCanvasId";
const pinkColor = colorStore.pink;
export const TinyPinkCookie = () => {
    const cookieDiameter = useMemo(() => 200, []);
    useEffect(() => {
        randomIsoscelesTriangles(
            document.querySelector("#" + tinyPinkCookieCanvasId),
            cookieDiameter, cookieDiameter, pinkColor.list
        );
    }, []);

    return <div className={pinkCookie.pinkCookie} style={{
        height: `${cookieDiameter}px`,
        width: `${cookieDiameter}px`,
        bottom: "-40px",
        right: "-20px",
    }}>
        <div className={pinkCookie.cookieDynamic}>
            <canvas
                id={tinyPinkCookieCanvasId}
                width={cookieDiameter} height={cookieDiameter} style={{
                backgroundColor: `${pinkColor.background}`,
                height: `${cookieDiameter}px`,
                width: `${cookieDiameter}px`,
            }}/>
            <div className={pinkCookie.ringDynamic} style={{
                mask: `radial-gradient(transparent 87px, #000 87px)`,
                WebkitMask: `radial-gradient(transparent 87px, #000 87px)`,
            }}/>
            <div className={pinkCookie.ringDynamicInsideShadow} style={{
                width: `174px`,
                height: `174px`,
                boxShadow: `inset 0 0 5px 0 ${pinkColor.hard_color}`
            }}/>
            <div className={pinkCookie.bigR0Box}>
                <img src={R0n} alt="" className={pinkCookie.R0Dynamic}/>
            </div>
        </div>
        <div className={pinkCookie.ringFixed} style={{
            mask: `radial-gradient(transparent 87px, #000 87px)`,
            WebkitMask: `radial-gradient(transparent 87px, #000 87px)`,
            width: `${cookieDiameter}px`,
            height: `${cookieDiameter}px`,
        }}/>
        <div className={pinkCookie.bigR0Box}>
            <img src={R0n} alt="" className={pinkCookie.R0Fixed}/>
        </div>
    </div>;
};