import home from "./index.module.less";
import PinkCookie from "./pinkCookie";
import {useEffect, useState} from "react";
import constants from "./const.js";
import useNodeBoundingRect from "@/hooks/useNodeBoundingRect";
import osuStore from "@/stores/osuStore";
import {observer} from "mobx-react-lite";

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
    const handleMouseMove = (event) => {
        if (!offsetFlag) {
            const _x = event.clientX > topActionsWidth / 2;
            const _y = event.clientY > topActionsHeight / 2;
            if (_x !== enterPos.x && _y !== enterPos.y) {
                setOffsetFlag(true);
            }
        }
        if (offsetFlag) {
            setMidOffset({
                x: event.clientX - topActionsWidth / 2,
                y: event.clientY - topActionsHeight / 2,
            });
        }

    };
    const handleMouseEnter = (event) => {
        setEnterPos({
            x: event.clientX > topActionsWidth / 2,
            y: event.clientY > topActionsHeight / 2,
        });
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
    return <div
        className={home.homePage} id={constants.homeId} ref={topActions}
        onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove}>
        <PinkCookie width={topActionsWidth} height={topActionsHeight} midOffset={midOffset}/>
        <div className={home.backGroundImgBox}>
            <div className={home.backGroundImgMask}/>
            <img src={osuStore.curImageUrl} className={home.backGroundImg} alt=""/>
        </div>
    </div>;
};
// 包裹组件让视图响应数据变化
export default observer(Home);