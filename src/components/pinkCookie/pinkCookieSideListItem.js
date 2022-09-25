import listStyle from "./pinkCookieSideList.module.less";
import {useState} from "react";

function PinkCookieSideListItem({isEnter, height, value}) {
    const [isCheck, setIsCheck] = useState(false);
    const mouseEnterHandler = () => {
        setIsCheck(true);
    };
    const mouseLeaveHandler = () => {
        setIsCheck(false);
    };
    return <div className={listStyle.PinkCookieSideListItem} key={value.key} style={{
        height: `${height * 0.17}px`,
    }} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
        <div className={listStyle.placeHolder} style={{
            width: `${height * 0.55}px`
        }}/>
        <div className={listStyle.infoBox} style={{
            width: `${height * 0.42}px`
        }}>
            <span className={listStyle.title} style={{
                fontSize: `${height / 17}px`
            }}>
                {value.title}
            </span>
            <span className={listStyle.tips} style={{
                fontSize: `${height / 50}px`
            }}>
                {value.tips}
            </span>
        </div>
        <div style={{
            background: `url(${value.icon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: `${height * 0.13}px`,
            height: `${height * 0.13}px`,
        }}/>
    </div>;
}

export default PinkCookieSideListItem;