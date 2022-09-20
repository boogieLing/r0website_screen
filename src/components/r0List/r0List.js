import React, {useEffect, useState} from "react";
import SayMyPosition from "@/components/r0List/sayMyPosition";
import listsStyle from "./r0List.module.less";
import {useNodeBoundingPositionSize} from "@/hooks/useNodeBoundingPositionSize";

const R0List = ({children, a, style}) => {
    const [currentCheck, setCurrentCheck] = useState({left: 0, top: 0, width: 0, height: 0});
    const [fatherPosition, fatherPositionRef] = useNodeBoundingPositionSize();
    const [backPosition, setBackPosition] = useState({left: 0, top: 0, width: 0, height: 0});
    useEffect(() => {
        setBackPosition({
            width: currentCheck.width * 1.01,
            height: currentCheck.height,
            top: currentCheck.top - fatherPosition.top,
            left: currentCheck.left - fatherPosition.left
        });
    }, [currentCheck]);
    const onMouseLeaveHandler = () => {
        setBackPosition({
            width: 0,
            height: 0,
            top: 0,
            left: 0
        });
    };
    return <div style={{...style}} className={listsStyle.r0List} ref={fatherPositionRef}
                onMouseLeave={onMouseLeaveHandler}>
        <div className={listsStyle.checkBack} style={{
            top: `${backPosition.top}px`,
            width: `${backPosition.width}px`,
            height: `${backPosition.height}px`
        }}/>
        {React.Children.map(children, (child, index) => {
            return <SayMyPosition setCurrentCheckPosition={setCurrentCheck}>
                {child}
            </SayMyPosition>;
        })}
    </div>;
};
export default R0List;