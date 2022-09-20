import {useNodeBoundingPositionSize} from "@/hooks/useNodeBoundingPositionSize";
import {useEffect, useState} from "react";
import sideLoginStyle from "./sideLogin.module.less";

const SayMyPosition = ({children, setCurrentCheckPosition}) => {
    const [position, positionRef] = useNodeBoundingPositionSize();
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (position && check) {
            setCurrentCheckPosition(position);
        }
    }, [position, check])
    const onMouseEnterHandler = () => {
        setCheck(true);
    };
    const onMouseLeaveHandler = () => {
        setCheck(false);
    };
    return <div
        ref={positionRef} className={sideLoginStyle.sayPosition}
        onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
        {children}
    </div>
}
export default SayMyPosition;