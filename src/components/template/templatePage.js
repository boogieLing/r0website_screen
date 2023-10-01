import S from  "./templatePage.module.less";
import {memo} from "react";
import {TButtom} from "@/components/template/buttom";

export const TemplatePage  = memo(({children})=>{
    return <div className={S.templatePage}>
        <div className={S.mainContent}>{children}</div>
        <TButtom/>
    </div>
});