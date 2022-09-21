import sideLoginStyle from "./sideLogin.module.less";
import {useState} from "react";

const OptionItem = ({optionTips, onClick, check}) => {
    const [isClick, setIsClick] = useState(check?check:false);
    const onClickHandler = () => {
        setIsClick(!isClick);
        if (onClick) {
            onClick();
        }
    };
    return <div className={sideLoginStyle.optionItem} onClick={onClickHandler}>
        <button className={sideLoginStyle.optionCheck} style={{
            background: isClick ? "rgb(235, 116, 139)": "transparent"
        }}/>
        <div className={sideLoginStyle.optionTips}>{optionTips}</div>
    </div>;
};
export default OptionItem;