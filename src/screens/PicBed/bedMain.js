import S from "./bec_main.module.less";
import {useInfiniteLoader, useMasonry, usePositioner, useResizeObserver} from "masonic";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {GetMainPicAllCategory, GetMainPicListByCategory} from "@/request/osuApi";
import {observer} from "mobx-react-lite";
import picBedStore from "@/stores/picBedStore";
import {useScroller, useSize} from "mini-virtual-list";
import {useNavigate} from "react-router-dom";

const size = 30;
export const PicBedMain = observer(({category}) => {
    const containerRef = useRef(null);
    const {width, height} = useSize(containerRef);
    const {scrollTop, isScrolling} = useScroller(containerRef);
    const positioner = usePositioner({
        width,
        columnWidth: 244,
        columnGutter: 15
    });
    const resizeObserver = useResizeObserver(positioner);

    const [picList, setPicList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [positionMarker, setPositionMarker] = useState(null);
    const loadMorePicList = useInfiniteLoader(
        async () => {
            if (positionMarker === null) {
                return;
            }
            GetMainPicListByCategory((r) => {
                setPicList((current) => [...current, ...r.data.data.data]);
                setPositionMarker(r.data.data.marker);
            }, category, size, positionMarker);
        }, {
            isItemLoaded: (index, items) => !!items[index],
            minimumBatchSize: size,
            threshold: 1
        }
    );
    const getCategoryList = useCallback(() => {
        GetMainPicAllCategory((r) => {
            setCategories(r.data.data);
        })
    }, []);
    const getPicList = useCallback(() => {
        if (picList.length === 0) {
            GetMainPicListByCategory((r) => {
                setPicList(r.data.data.data);
                setPositionMarker(r.data.data.marker);
            }, category, size);
        } else {
            GetMainPicListByCategory((r) => {
                setPicList((current) => [...current, ...r.data.data.data]);
                setPositionMarker(r.data.data.marker);
            }, category, size);
        }
    }, [category]);
    useEffect(() => {
        getPicList();
        getCategoryList();
    }, []);
    useEffect(() => {
        let curPicIndex = picBedStore.curPicIndex;
        if (curPicIndex !== -1) {
            const total = picList.length;
            if (curPicIndex >= total) {
                curPicIndex = total - 1;
            }
            if (curPicIndex < 0) {
                curPicIndex = 0;
            }
            const curPicInfo = picList[curPicIndex];
            picBedStore.setCurPicInfo(curPicInfo);
            picBedStore.setCurPicIndex(curPicIndex);
        }
    }, [picBedStore.curPicIndex]);

    const [showCategories, setShowCategories] = useState(false);
    const toggleCategories = useCallback(() => {
        setShowCategories(!showCategories);
    }, [showCategories]);
    const closeCategoriesBox = useCallback(() => {
        setShowCategories(false);
    }, []);
    const setCurCategory = useCallback((d) => {
        //navigate(`/colorful/${d}`, {});
        if (d === category) {
            return;
        }
        window.open(`/colorful/${d}`, "_blank");
        setShowCategories(false);
    }, []);
    return (
        <main className={S.bedMain + (picBedStore.curPicInfo ? " " + S.bedMainBlur : "")}>
            <div className={S.headBox}>
                <span className={S.normalSpan}>💭 SOME</span>
                <div
                    className={S.cateGoryBox + (showCategories ? " " + S.cateGoryBoxShowCategoryList : "")}
                >
                    {
                        showCategories && <div className={S.cateGoryBoxMask} onClick={closeCategoriesBox}/>
                    }
                    {<div className={S.categoriesList}>{
                        categories.map((categoryInfo, index) => {
                            const info = categoryInfo;
                            const isPick = info === category;
                            return (
                                <div
                                    key={info} className={
                                    S.categoriesItem + (isPick ? " " + S.categoriesItemPick : "")
                                }
                                    style={{
                                        "transitionDuration": isPick ? "0s" : "0.2s",
                                        "transitionDelay": (showCategories && !isPick) ? (index * 0.2) + "s" : "0s"
                                    }}
                                    onClick={() => setCurCategory(info)}
                                >
                                    <i className={S.arrow}></i>
                                    {info}
                                </div>)
                        })
                    }</div>}
                    <div className={S.nameBox} onClick={toggleCategories}>
                        <div className={S.cateGoryName}>{category}</div>
                    </div>
                    <div className={S.topLight}></div>
                    <div className={S.bottomLight}></div>
                </div>
                <span className={S.normalSpan}>&nbsp;COLORFUL BY R0</span>
            </div>
            <div className={S.Masonry} ref={containerRef}>
                {useMasonry({
                    positioner,
                    resizeObserver,
                    items: picList,
                    height,
                    scrollTop,
                    isScrolling,
                    overscanBy: 1.25,
                    render: renderCard,
                    onRender: loadMorePicList
                })}
            </div>
        </main>
    );
});

const renderCard = memo(({index, data: {last_modified, name, url}}) => {
    const cardClick = useCallback(() => {
        picBedStore.setCurPicIndex(index);
    }, [index]);
    return (
        <div className={S.card} onClick={cardClick}>
            <div className={S.infoBox}>
                <span className={S.description}>🧻 {name}</span>
            </div>
            <img className={S.imgItem} alt="kitty" src={url}/>
        </div>
    );
});
