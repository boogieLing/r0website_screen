import sideLoginStyle from "./sideLogin.module.less";
import backIconImg from "./backIcon.png";
import useSound from "use-sound";

import buiu from "@/static/mp3/bu-iu.wav";
import bunnnnn from "@/static/mp3/bunnnnn.wav";
import {useEffect, useRef, useState} from "react";
import SayMyPosition from "@/components/sideLogin/sayMyPosition";

const SideLogin = ({show, hiddenLoginHandle}) => {
    const [playBuiu] = useSound(buiu, {volume: 0.3});
    const [playBunnnnn] = useSound(bunnnnn, {volume: 0.3});
    const fatherRef = useRef();
    const [fatherPosition, setFatherPosition] = useState({left: 0, top: 0});
    const [currentCheckPosition, setCurrentCheckPosition] = useState({left: 0, top: 0, width: 0, height: 0});
    const [checkSize, setCheckSize] = useState({top: 0, height: 0});
    useEffect(() => {
        if (fatherRef && fatherRef.current) {
            setFatherPosition({
                left: fatherRef.current.getBoundingClientRect().left,
                top: fatherRef.current.getBoundingClientRect().top,
            })
        }
    }, [fatherRef]);
    useEffect(() => {
        const topOffset = currentCheckPosition.top - fatherPosition.top;
        setCheckSize({
            top: topOffset,
            height: currentCheckPosition.height
        })
    }, [currentCheckPosition]);
    return <div className={sideLoginStyle.main + (show ? "" : " " + sideLoginStyle.mainHidden)}>
        <div onMouseEnter={() => playBuiu()}
             className={sideLoginStyle.backBtn} onClick={() => {
            hiddenLoginHandle();
            playBunnnnn();
        }}>
            <div className={sideLoginStyle.backIcon}>
                <img src={backIconImg} alt=""/>
            </div>
            <div className={sideLoginStyle.backText}/>
        </div>
        <div className={sideLoginStyle.mainPage}>
            <h1>今日天气不错！</h1>
            <span className={sideLoginStyle.sentence}>Life is a bear, we must learn to support ourselves.</span>
            <div className={sideLoginStyle.signInBox}>
                <div className={sideLoginStyle.tips}><span>WELCOME</span></div>
                <div className={sideLoginStyle.signInItems} ref={fatherRef}>
                    <div className={sideLoginStyle.checkBackground} style={{
                        top:`${checkSize.top}px`,
                        height:`${checkSize.height}px`,
                    }}/>
                    <span className={sideLoginStyle.signInSpan}>SIGN IN</span>
                    <SayMyPosition setCurrentCheckPosition={setCurrentCheckPosition}>
                        <div className={sideLoginStyle.inputItem}>
                            <span className={sideLoginStyle.inputTips}>Username</span>
                            <input id="InputUsername"/>
                        </div>
                    </SayMyPosition>
                    <SayMyPosition setCurrentCheckPosition={setCurrentCheckPosition}>
                        <div className={sideLoginStyle.inputItem}>
                            <span className={sideLoginStyle.inputTips}>Password</span>
                            <input id="InputPassword"/>
                        </div>
                    </SayMyPosition>
                    <div className={sideLoginStyle.optionItem}>
                        <button className={sideLoginStyle.optionCheck}/>
                        <div className={sideLoginStyle.optionTips}>Remember Username</div>
                    </div>
                    <div className={sideLoginStyle.optionItem}>
                        <button className={sideLoginStyle.optionCheck}/>
                        <div className={sideLoginStyle.optionTips}>Remember Password</div>
                    </div>
                    <div className={sideLoginStyle.buttonItem}>
                        <span className={sideLoginStyle.buttonTips}>Sign in</span>
                    </div>
                    <div className={sideLoginStyle.buttonItem}>
                        <span className={sideLoginStyle.buttonTips}>Create an account</span>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};
export default SideLogin;