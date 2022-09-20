import {useNodeBoundingPositionSize} from "@/hooks/useNodeBoundingPositionSize";
import {useEffect, useState} from "react";

const SayMyPosition = ({children, setCurrentCheckPosition}) => {
    const [position, positionRef] = useNodeBoundingPositionSize();
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (position && check) {
            setCurrentCheckPosition(position);
        }
    }, [position, check]);
    const onMouseEnterHandler = () => {
        setCheck(true);
    };
    const onMouseLeaveHandler = () => {
        setCheck(false);
    };
    return <div
        ref={positionRef}
        onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} style={{
        position: "relative",
        width: "100%",
        height: "auto",
        boxSizing: "border-box",
    }}>
        {children}
    </div>;
};
export default SayMyPosition;