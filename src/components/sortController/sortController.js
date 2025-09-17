import S from "./sortController.module.less";
import React, {memo, useCallback, useEffect, useState} from "react";

export const SortController = memo(({style, params, setComputed}) => {
    const [checkedText, setCheckedText] = useState(params ? params[0].text : "");
    const [showTextOption, setShowTextOption] = useState(false);
    const [isDescending, setIsDescending] = useState(true);
    const [computedParams, setComputedParams] = useState(null);
    const toggleDescending = useCallback(() => {
        setIsDescending(!isDescending);
    }, [isDescending]);
    useEffect(() => {
        const tmp = {};
        const checkedElem = params.find(ele => ele.text === checkedText);
        if (!checkedElem) {
            return;
        }
        tmp[checkedElem.name] = isDescending ? checkedElem.descend : checkedElem.ascend;
        setComputedParams({
            ...computedParams,
            ...tmp
        });
    }, [isDescending]);
    useEffect(() => {
        if (setComputed && computedParams) {
            setComputed(computedParams);
        }
    }, [computedParams]);
    return <div style={{
        position: "relative",
        boxSizing: "border-box",
        ...style
    }}>
        <div className={S.main}>
            <div className={S.tips}>Sort</div>
            <i className={S.iconfont + " " + S.directionIcon + " " + (isDescending ? S.downDirectionIcon : "")}
               onClick={toggleDescending}
            >
                &#xeb05;
            </i>
            <div className={S.paramBox}>
                <div className={S.paramTexts + " " + S.option}>
                    <div className={S.checkedText}>
                        {checkedText} <i className={S.iconfont}>&#xe64b;</i>
                    </div>
                    <div className={S.select + " " + (showTextOption ? "" : S.selectHidden)}>
                        {
                            params.map((param, index) => {
                                return <div key={index + "params"}>
                                    {param.text}
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    </div>
});