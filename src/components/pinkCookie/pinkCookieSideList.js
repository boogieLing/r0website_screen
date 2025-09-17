import React, {useCallback, useState} from "react";
import listStyle from "./pinkCookieSideList.module.less";
import PinkCookieSideListItem from "@/components/pinkCookie/pinkCookieSideListItem";

function PinkCookieSideList({width, height, show, optionList, style}) {
    const [itemBackColor,] = useState("rgb(133, 100, 232)");
    const [isEnter, setIsEnter] = useState(false);
    const mouseEnterHandler = useCallback(() => {
        setIsEnter(true);
    }, []);
    const mouseLeaveHandler = useCallback(() => {
        setIsEnter(false);
    }, []);

    return <>
        <div className={listStyle.PinkCookieSideList}
             style={{
                 ...style,
                 borderRadius: `0 26% 26% 0 / 0 100% 100% 0`,
                 overflow: "hidden",
                 transform: show ? "scaleX(1)" : "scaleX(0)",
                 opacity: show ? "1" : "0",
                 width: `${width}px`,
                 height: `${height}px`,
             }} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
            {
                optionList.map(function (value) {
                    const key = value.key;
                    return <PinkCookieSideListItem
                        itemBackColor={itemBackColor} isEnter={isEnter} height={height} width={width}
                        value={value} key={key} id={key} navigatePath={value.navigatePath}
                    />;
                })
            }
        </div>
    </>;

}

export default PinkCookieSideList;