import S from "./pic_bed.module.less";
import {memo, useEffect, useState} from "react";
import globalStore from "@/stores/globalStore";
import ReactDocumentTitle from "@/utils/title";
import {TemplatePage} from "@/components/template/templatePage";
import {PicBedMain} from "@/screens/PicBed/bedMain";
import {PicDetail} from "@/screens/PicBed/picDetail";
import {useParams} from "react-router-dom";


export const PicBed = memo(() => {
    const params = useParams();
    const {categoryName} = params;
    return <ReactDocumentTitle title={globalStore.webSiteTitle + " - PicBeeeeeeeeed"}>
        <TemplatePage style={{
            //background: "#dfe6e9"
        }}>
            <PicDetail></PicDetail>
            <div className={S.picBed}>
                <PicBedMain category={categoryName?categoryName:"Fernweh"} ></PicBedMain>
            </div>
        </TemplatePage>
    </ReactDocumentTitle>
});