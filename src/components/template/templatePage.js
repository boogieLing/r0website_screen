import S from  "./templatePage.module.less";
import {memo} from "react";
import {TButtom} from "@/components/template/buttom";

export const TemplatePage  = memo(({children, style})=>{
    return <div className={S.templatePage} style={style}>
        <div className={S.mainContent}>{children}</div>
        <TButtom/>
    </div>
});