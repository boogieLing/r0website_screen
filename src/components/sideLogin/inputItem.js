import sideLoginStyle from "./sideLogin.module.less";
import {useEffect, useRef, useState} from "react";

const InputItem = ({type, inputTips, id, sendData}) => {
    const [isClick, setIsClick] = useState(false);
    const focusRef = useRef();
    const onMouseEnterHandler = () => {
        setIsClick(!isClick);
    };
    useEffect(() => {
        if (focusRef && focusRef.current && isClick) {
            focusRef.current.focus();
        }
    }, [isClick]);
    let inputBorderColor = "white";
    if (isClick) {
        inputBorderColor = "#fdcb6e";
    }
    const onChangeHandler = (event) => {
        if (sendData) {
            sendData(event.target.value);
        }
    };
    const onMouseLeaveHandler = () => {
        setIsClick(false);
    };
    return <div className={sideLoginStyle.inputItem} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
        <span className={sideLoginStyle.inputTips}>{inputTips}</span>
        <input id={id} style={{
            borderBottom: ` solid 2px ${inputBorderColor}`
        }} onChange={(e) => onChangeHandler(e)} type={type} ref={focusRef}/>
    </div>;
};
export default InputItem;