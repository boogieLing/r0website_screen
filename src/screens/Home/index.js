import home from "./index.module.less";
import PinkCookie from "./pinkCookie";
import {useEffect, useState} from "react";
import constants from "./const.js";
import useNodeBoundingRect from "@/hooks/useNodeBoundingRect";
import yard from "@/static/pic/yard.jpg";
import osuStore from '@/stores/osuStore'
import {observer} from 'mobx-react-lite'

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
    const handleMouseMove = (event) => {
        setMidOffset({
            x: event.clientX - topActionsWidth / 2,
            y: event.clientY - topActionsHeight / 2,
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
    const [background, setBackground] = useState(yard + "");
    useEffect(() => {
        setBackground(osuStore.getCurImageUrl());
    }, [])
    return <div
        className={home.homePage} id={constants.homeId} ref={topActions}
        onMouseMove={handleMouseMove}>
        <PinkCookie width={topActionsWidth} height={topActionsHeight} midOffset={midOffset}/>
        <div>
            <img src={background} className={home.backGroundImg} alt=""/>
        </div>

    </div>;
};
// 包裹组件让视图响应数据变化
export default observer(Home);