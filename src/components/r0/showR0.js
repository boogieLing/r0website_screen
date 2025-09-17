import S from "./showR0.module.less";
import catr0 from "@/static/pic/catr0.png";
import signImg from "@/static/pic/sign_line.png";
import {memo} from "react";

export const ShowR0 = memo(({style}) => {
    return <div className={S.showR0} style={{...style}}>
        <div className={S.triangle}>
            <span className={S.text}>What's R0?</span>
            <div className={S.background}></div>
        </div>
        <div className={S.triangle}>
            <div className={S.background}></div>
        </div>
        <div className={S.frame}>
            <div className={S.background}></div>
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect className={S.outline} height="100%" width="100%"/>
            </svg>
        </div>
        <div className={S.loading}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div className={S.radiusBox}>
            <div className={S.background}></div>
        </div>
        <div className={S.trapezoid + " " + S.gOctagon}>
            <div className={S.background}></div>
            <fieldset>
                <legend>Just</legend>
            </fieldset>
            <fieldset>
                <legend>R0</legend>
            </fieldset>
            <fieldset>
                <legend>in</legend>
            </fieldset>
            <fieldset>
                <legend>here</legend>
            </fieldset>
        </div>
        <div className={S.headShadow}>
            <img src={catr0} alt=""/>
        </div>
        <div className={S.head}>
            <img src={catr0} alt=""/>
        </div>
        <img src={signImg} alt="" style={{
            position: "absolute",
            width: "200%",
            left:"-20px",
            bottom: "30px",
            right: "0",
        }}/>
    </div>
});