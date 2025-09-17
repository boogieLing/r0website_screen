import S from "./picDetail.module.less";
import {observer} from "mobx-react-lite";
import picBedStore from "@/stores/picBedStore";
import React, {useCallback, useState} from "react";
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

export const PicDetail = observer(() => {
    const uninstallPicDetail = useCallback(() => {
        picBedStore.setCurPicInfo(null);
    }, []);
    const rightPic = useCallback(() => {
        picBedStore.setCurPicIndex(picBedStore.curPicIndex + 1);
    }, [picBedStore.curPicIndex]);
    const leftPic = useCallback(() => {
        if (picBedStore.curPicIndex > 0) {
            picBedStore.setCurPicIndex(picBedStore.curPicIndex - 1);
        }
    }, [picBedStore.curPicIndex]);
    const [isVertical, setIsVertical] = useState(false);
    const toggleIsVertical = useCallback(()=>{
        setIsVertical(!isVertical);
    }, [isVertical]);
    return (
        picBedStore.curPicInfo && <div className={S.picDetail}>
            <div className={S.picDetailBgMask} onClick={uninstallPicDetail}></div>
            <div className={S.picDetailMainBox + (isVertical ? " " + S.picDetailMainBoxVertical : "")}>
                <div className={S.optBox}>
                    <div className={S.optItem} onClick={leftPic}>
                        <i className={S.iconfont}>&#xe76e;</i>
                    </div>
                    <div className={S.optItem} onClick={toggleIsVertical}>
                        <i className={S.iconfont + " " + S.iconfontRotate90}>&#xe741;</i>
                    </div>
                    <div className={S.optItem} onClick={rightPic}>
                        <i className={S.iconfont}>&#xe76f;</i>
                    </div>
                </div>
                <div className={S.imgBox}>
                    <PinchZoomPan maxScale={10} zoomButtons={false}>
                        <img
                            src={picBedStore.curPicInfo.url.replace("compressed", "primitive")}
                            alt="cool image"
                        />
                    </PinchZoomPan>
                </div>
                <div className={S.infoBox}>
                    <span className={S.modifiedTimeBox}>
                        💡 {picBedStore.curPicInfo["last_modified"]}
                        <i className={S.iconfont}> &#xe734; </i>
                        <span>{picBedStore.curPicIndex}</span>
                    </span>
                    <span className={S.nameBox}>
                        {picBedStore.curPicInfo.name}
                    </span>
                </div>
            </div>
        </div>
    )
});
