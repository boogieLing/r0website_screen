import listStyle from "./r0List.module.less";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import SayMyPosition from "@/components/r0List/sayMyPosition";
import {useNodeBoundingPositionSize} from "@/hooks/useNodeBoundingPositionSize";

const R0List = ({children, style, classNameO, option}) => {
    const [currentCheck, setCurrentCheck] = useState({left: 0, top: 0, width: 0, height: 0});
    const [fatherPosition, fatherPositionRef] = useNodeBoundingPositionSize();
    const [backPosition, setBackPosition] = useState({left: 0, top: 0, width: 0, height: 0});
    const [isLeave, setIsLeave] = useState(false);
    const _option = useMemo(() => {
        const _option = option ? option : {};
        _option.widthOffset = _option.widthOffset ? _option.widthOffset : 15;
        _option.lights = _option.lights ? _option.lights : [];
        return _option;
    }, []);

    useEffect(() => {
        setBackPosition({
            width: currentCheck.width + _option.widthOffset,
            height: currentCheck.height,
            top: currentCheck.top - fatherPosition.top,
            left: currentCheck.left - fatherPosition.left
        });
    }, [currentCheck, isLeave]);
    const onMouseEnterHandler = useCallback(() => {
        setIsLeave(false);
    }, []);
    const onMouseLeaveHandler = useCallback(() => {
        setIsLeave(true);
    }, []);
    return <div
        style={style ? style : {}} className={listStyle.r0List + (classNameO ? "" + classNameO : "")}
        ref={fatherPositionRef}
        onMouseLeave={onMouseLeaveHandler} onMouseEnter={onMouseEnterHandler}>
        <div className={listStyle.checkBack} style={{
            top: `${isLeave ? 0 : backPosition.top}px`,
            height: `${backPosition.height}px`,
            width: `${backPosition.width + _option.widthOffset}px`,
            transition: `${isLeave ? 0 : 0.26}s cubic-bezier(0.235, -0.410, 0.410, 1.600)`,
            opacity: isLeave ? 0 : 1,
        }}/>
        <div className={listStyle.leftBorder}/>
        {React.Children.map(children, (child, index) => {
            let clickLight;
            if (_option.lights[index] && _option.lights[index] !== 0) {
                clickLight = _option.lights[index];
            } else {
                clickLight = false;
            }
            return <SayMyPosition setCurrentCheckPosition={setCurrentCheck} clickLight={clickLight}>
                {child}
            </SayMyPosition>;
        })}
    </div>;
};
export default R0List;