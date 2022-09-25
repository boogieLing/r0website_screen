import React, {useEffect, useState} from "react";
import listStyle from "./pinkCookieSideList.module.less";
import colorStore from "@/stores/colorStore";
import R0n from "@/static/pic/R0n.png";
import PinkCookieSideListItem from "@/components/pinkCookie/pinkCookieSideListItem";

function PinkCookieSideList({height, color, show, optionList, style}) {
    const [itemBackColor, setItemBackColor] = useState("rgb(133, 100, 232)");
    const [isEnter, setIsEnter] = useState(false);
    const mouseEnterHandler = () => {
        setIsEnter(true);
    };
    const mouseLeaveHandler = () => {
        setIsEnter(false);
    };

    return <>
        <div className={listStyle.PinkCookieSideList }
             style={{
                 ...style,
                 borderRadius: `0 26% 26% 0 / 0 100% 100% 0`,
                 overflow: "hidden"
             }} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
            {
                optionList.map(function (value, index, arr) {
                    const key = value.key;
                    return <PinkCookieSideListItem
                        itemBackColor={itemBackColor} isEnter={isEnter} height={height}
                        value={value} key={key}
                    />;
                })
            }
        </div>


    </>;

}

export default PinkCookieSideList;