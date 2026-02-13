import pinkCookie from "./pinkCookie.module.less";
import colorStore from "@/stores/colorStore";
import R0n from "@/static/pic/R0n.png";
import {useCallback, useEffect, useMemo} from "react";
import {randomIsoscelesTriangles} from "@/utils/randomTriangles";
import {useNavigate} from "react-router-dom";

const tinyPinkCookieCanvasId = "tinyPinkCookieCanvasId";
const pinkColor = colorStore.pink;
export const TinyPinkCookie = ({isMobile = false, diameter}) => {
    const navigate = useNavigate();
    const clickHandler = useCallback(() => navigate("/"), [navigate]);
    const cookieDiameter = useMemo(() => {
        if (Number.isFinite(diameter) && diameter > 0) {
            return Math.round(diameter);
        }
        return isMobile ? 128 : 200;
    }, [isMobile, diameter]);
    const ringCutRadius = useMemo(() => Math.round(cookieDiameter * 0.435), [cookieDiameter]);
    const insideShadowSize = useMemo(() => Math.round(cookieDiameter * 0.87), [cookieDiameter]);

    useEffect(() => {
        randomIsoscelesTriangles(
            document.querySelector("#" + tinyPinkCookieCanvasId),
            cookieDiameter, cookieDiameter, pinkColor.list
        );
    }, [cookieDiameter]);

    return <div className={`${pinkCookie.pinkCookie} ${isMobile ? pinkCookie.mobilePinkCookie : ''}`} style={{
        height: `${cookieDiameter}px`,
        width: `${cookieDiameter}px`,
        bottom: isMobile ? "-32px" : "-40px",
        right: isMobile ? "-14px" : "-20px",
    }} onClick={clickHandler}>
        <div className={pinkCookie.cookieDynamic}>
            <canvas
                id={tinyPinkCookieCanvasId}
                width={cookieDiameter} height={cookieDiameter} style={{
                backgroundColor: `${pinkColor.background}`,
                height: `${cookieDiameter}px`,
                width: `${cookieDiameter}px`,
            }}/>
            <div className={pinkCookie.ringDynamic} style={{
                mask: `radial-gradient(transparent ${ringCutRadius}px, #000 ${ringCutRadius}px)`,
                WebkitMask: `radial-gradient(transparent ${ringCutRadius}px, #000 ${ringCutRadius}px)`,
            }}/>
            <div className={pinkCookie.ringDynamicInsideShadow} style={{
                width: `${insideShadowSize}px`,
                height: `${insideShadowSize}px`,
                boxShadow: `inset 0 0 5px 0 ${pinkColor.hard_color}`
            }}/>
            <div className={pinkCookie.bigR0Box}>
                <img src={R0n} alt="" className={pinkCookie.R0Dynamic}/>
            </div>
        </div>
        <div className={pinkCookie.ringFixed} style={{
            mask: `radial-gradient(transparent ${ringCutRadius}px, #000 ${ringCutRadius}px)`,
            WebkitMask: `radial-gradient(transparent ${ringCutRadius}px, #000 ${ringCutRadius}px)`,
            width: `${cookieDiameter}px`,
            height: `${cookieDiameter}px`,
        }}/>
        <div className={pinkCookie.bigR0Box}>
            <img src={R0n} alt="" className={pinkCookie.R0Fixed}/>
        </div>
    </div>;
};
