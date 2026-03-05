import sideLoginStyle from "./sideLogin.module.less";
import {useState} from "react";

const InputItem = ({type, inputTips, id, sendData, value}) => {
    const [isClick, setIsClick] = useState(false);
    const onMouseEnterHandler = () => {
        setIsClick(true);
    };
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
        }} onChange={(e) => onChangeHandler(e)} type={type} value={value ?? ""}/>
    </div>;
};
export default InputItem;
