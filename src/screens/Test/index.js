import {observer} from "mobx-react-lite";
import PinkCookie from "@/components/pinkCookie/pinkCookie";
import useNodeBoundingRect from "@/hooks/useNodeBoundingRect";
import {useEffect, useState} from "react";

const Test = () => {
    console.log("render");
    const [rect, rectRef] = useNodeBoundingRect();
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
    return <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.6)",
        padding: "30px",
    }} ref={rectRef}>
        <PinkCookie
            width={topActionsWidth} height={topActionsHeight}
            midOffset={0}
        />
    </div>;
};
export default observer(Test);