import S from "./sortController.module.less";
import React, {memo, useState} from "react";

export const SortController = memo(({style, params, setComputed}) => {
    const [checkedText, setCheckedText] = useState(params ? params[0].text : "");
    const [showTextOption, setShowTextOption] = useState(false);
    return <div style={{
        position: "relative",
        boxSizing: "border-box",
        ...style
    }}>
        <div className={S.main}>
            <div className={S.tips}>Sort</div>
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