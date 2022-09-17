import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import home from "./index.module.less";
import PinkCookie from "./pinkCookie";
import useNodeBoundingRect from "@/hooks/useNodeBoundingRect";
import osuStore from "@/stores/osuStore";
import globalStore from "@/stores/globalStore";
import DynamicBackground from "@/screens/Home/dynamicBackground";
import ReactDocumentTitle from "@/utils/title";

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
    return <ReactDocumentTitle title={globalStore.webSiteTitle + " - Home"}>
        <div
            className={home.homePage} id={globalStore.homeId} ref={topActions}
            onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove}>
            <PinkCookie width={topActionsWidth} height={topActionsHeight} midOffset={midOffset}/>
            <DynamicBackground
                curImageUrl={osuStore.curImageUrl}
                width={topActionsWidth} height={topActionsHeight} midOffset={midOffset}
            />
        </div>
    </ReactDocumentTitle>;
};
// 包裹组件让视图响应数据变化
export default observer(Home);