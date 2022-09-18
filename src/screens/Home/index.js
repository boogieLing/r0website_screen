import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import home from "./index.module.less";

import PinkCookie from "./pinkCookie";
import useNodeBoundingRect from "@/hooks/useNodeBoundingRect";
import osuStore from "@/stores/osuStore";
import globalStore from "@/stores/globalStore";
import DynamicBackground from "@/screens/Home/dynamicBackground";
import ReactDocumentTitle from "@/utils/title";
import signImg from "@/static/pic/sign_line.png" ;
import SideLogin from "@/components/sideLogin/sideLogin";
import useSound from "use-sound";
import biui from "@/static/mp3/bi-ui-bi-ui.wav";
import buiun from "@/static/mp3/bu-iun.wav";

const Home = () => {
    const [rect, topActions] = useNodeBoundingRect();
    // 实时页面大小
    const [topActionsWidth, setTopActionsWidth] = useState(
        0
    );
    const [topActionsHeight, setTopActionsHeight] = useState(
        0
    );
    useEffect(() => {
        if (rect && rect.width) {
            // 实际上的高度为：react.width + padding + border-width
            setTopActionsWidth(rect.width);
            setTopActionsHeight(rect.height);
        }
    }, [rect]);
    // 实时中线偏移量
    const [midOffset, setMidOffset] = useState({x: 0, y: 0});
    // 鼠标进入的位置相对于中线是正还是负
    const [enterPos, setEnterPos] = useState({x: false, y: false});
    // 鼠标是否经过一次以上的中线
    const [offsetFlag, setOffsetFlag] = useState(false);
    const [isLeave, setIsLeave] = useState(false);
    const handleMouseMove = (event) => {
        const offsetX = event.clientX - topActionsWidth / 2;
        const offsetY = event.clientY - topActionsHeight / 2;
        if (!offsetFlag) {
            const _x = offsetX > 0;
            const _y = offsetY > 0;
            if (_x !== enterPos.x || _y !== enterPos.y) {
                setOffsetFlag(true);
            }
        }
        if (offsetFlag) {
            setMidOffset({
                x: offsetX,
                y: offsetY,
            });
        }
    };
    const handleMouseEnter = (event) => {
        setEnterPos({
            x: event.clientX > topActionsWidth / 2,
            y: event.clientY > topActionsHeight / 2,
        });
        setIsLeave(false);
    };
    const handleMouseLeave = () => {
        setMidOffset({
            x: 0,
            y: 0,
        });
        setOffsetFlag(false);
        setEnterPos({
            x: false,
            y: false
        });
        setIsLeave(true);
    };
    useEffect(() => {
        window.addEventListener("focus", () => {
            setMidOffset({
                x: 0,
                y: 0,
            });
        });
        window.addEventListener("blur", () => {
            setMidOffset({
                x: 0,
                y: 0,
            });
        });
    }, []);
    const [personalInfoHover, setPersonalInfoHover] = useState(false);
    const personalInfoEnter = () => {
        setPersonalInfoHover(true);
    };
    const personalInfoLeave = () => {
        setPersonalInfoHover(false);
    };
    const [showLogin, setShowLogin] = useState(false);
    const [playBuiun] = useSound(buiun, {volume: 0.5});

    const showLoginHandle = () => {
        playBuiun();
        setShowLogin(true);
    };
    const hiddenLoginHandle = () => {
        setShowLogin(false);
    };
    const textSize = topActionsWidth / 140;
    const [playBiui] = useSound(biui, {volume: 0.5});
    return <ReactDocumentTitle title={globalStore.webSiteTitle + " - Home"}>
        <div
            className={home.homePage} id={globalStore.homeId} ref={topActions}
            onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove}>
            <PinkCookie
                width={topActionsWidth} height={topActionsHeight}
                midOffset={midOffset}
            />
            <DynamicBackground
                curImageUrl={osuStore.curImageUrl}
                width={topActionsWidth} height={topActionsHeight} midOffset={midOffset}
            />
            <div className={home.bottomInfo} style={{opacity: isLeave ? 0.15: 1,}}>
                <div className={home.personalInfo}
                     onMouseLeave={personalInfoLeave} onMouseEnter={personalInfoEnter}>
                    <img src={signImg} alt="" className={home.sign}/>
                    <div className={home.description + " " + (personalInfoHover ? home.descriptionRunning: "")}>
                        <div
                            className={home.descriptionItem + " " + home.descriptionItemEmp}
                            style={{
                                fontSize: `${textSize}px`,
                            }}
                        >
                            Powered 2019-2022 by R0
                        </div>
                        <div
                            className={home.descriptionItem}
                            style={{
                                fontSize: `${textSize}px`,
                            }}
                        >
                            www.r0r0.pink
                        </div>
                    </div>
                </div>
            </div>
            <div className={home.topInfo} style={{opacity: isLeave ? 0.15: 1,}}>
                <div className={home.loginBox} onClick={showLoginHandle} onMouseEnter={() => playBiui()}>
                    <div className={home.loginHead}><img src="" alt=""/></div>
                    <div className={home.loginInfo}>
                        <div className={home.loginInfoName}>Guest</div>
                        <div className={home.loginTips}>Click to sign in!</div>
                    </div>
                </div>
            </div>
            <SideLogin show={showLogin} hiddenLoginHandle={hiddenLoginHandle}/>
        </div>
    </ReactDocumentTitle>;
};
// 包裹组件让视图响应数据变化
export default observer(Home);