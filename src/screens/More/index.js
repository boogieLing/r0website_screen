import S from "./more.module.less";
import {memo, useState} from "react";
import globalStore from "@/stores/globalStore";
import ReactDocumentTitle from "@/utils/title";
import Cursor from "@/components/cursor/cursor";
import {TemplatePage} from "@/components/template/templatePage";
import {Win10GridBox} from "@/components/win10GridBox/win10GridBox";

export const More = memo(() => {
    const [displayCustomCursor, _] = useState(false);
    return <ReactDocumentTitle title={globalStore.webSiteTitle + " - More"}>
        <TemplatePage>
            <div className={S.more + " " + (displayCustomCursor ? S.hiddenCursor : S.staticCursor)}>
                <Cursor display={displayCustomCursor}/>
                <div className={S.main}>
                    <div className={S.headBox}>
                        <h1>MORE ABOUT www.shyr0.com</h1>
                    </div>
                    <div className={S.toolsBox}>
                        <Win10GridBox/>
                    </div>
                </div>
            </div>
        </TemplatePage>
    </ReactDocumentTitle>
});