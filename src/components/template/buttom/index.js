import S from "./buttom.module.less";
import {memo} from "react";
import {FilingInfo} from "@/components/filingInfo/filingInfo";
import {ShowR0} from "@/components/r0/showR0";
import {TinyPinkCookie} from "@/components/pinkCookie/tinyPinkCookie";

export const TButtom = memo(({}) => {
    return <div className={S.TButtom}>
        <ShowR0 style={{
            position: "absolute",
            right: "300px",
            bottom: "3px",
            // transform:"translateX(50%)"
        }}/>
        <FilingInfo style={{
            position: "fixed", right: "200px", bottom: "0"
        }}/>
        <TinyPinkCookie/>
    </div>
});