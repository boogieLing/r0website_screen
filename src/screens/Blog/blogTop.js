import S from "./blogTop.module.less";
import React, {useCallback, useEffect, useState} from "react";
import cursorTipsStore from "@/stores/cursorTipsStore";
import {SortController} from "@/components/sortController/sortController";
import {addPraise} from "@/request/blogApi";

export const BlogTop = ({post, setComputed, isImmersive = false}) => {
    const [curPraise, setCurPraise] = useState(0);
    const getDate = useCallback((dateStr) => {
        if (!dateStr) {
            return "";
        }
        return dateStr.slice(0, 10);
    }, []);
    const addTinyTips = useCallback(() => {
        cursorTipsStore.addTips({
            spanText: "WoW",
            iconText: "!!!",
        });
    }, []);
    const clickPraise = useCallback(() => {
        addPraise(post._id, () => {
        });
        setCurPraise(curPraise + 1);
    }, [post, curPraise]);
    useEffect(() => {
        if (post.praise_number !== undefined) {
            setCurPraise(post.praise_number);
        }
    }, [post]);
    return <div className={`${S.blogTopBox} ${isImmersive ? S.blogTopImmersive : ''}`}>
        <div className={S.borderLeftBottom + " " + S.borderClone}/>
        <div className={S.borderRight + " " + S.borderClone}/>
        <div className={S.borderLeftBottom}/>
        <div className={S.borderRightBack}/>
        <div className={S.borderRight}/>
        <div className={S.backLeft}/>
        <div className={S.backRight}>
            <SortController params={sortParams} style={{
                position: "absolute",
                right: "0",
                bottom: "0",
            }} setComputed={setComputed}/>
        </div>
        <div className={S.contentLeft}>
            <div className={S.normalTips + " " + S.titleBox}>
                {post.title}
                <div className={S.normalTips + " " + S.tinyTips + " " + S.inlineTips}>
                    <i className={S.iconfont + " " + S.tinyIconfont}>&#xe628;</i>
                    <span className={S.tipsBox}>{getDate(post.create_time)}</span>
                    <i className={S.iconfont + " " + S.tinyIconfont}>&#xea15;</i>
                    <span className={S.tipsBox}>{getDate(post.update_time)}</span>
                </div>
            </div>

            <div className={S.tinyUl}>{
                React.Children.map(post.categories, (category, index) => {
                    return <div key={index + "category"} className={S.tinyLi}>
                        {category}
                    </div>
                })
            }{React.Children.map(post.tags, (tags, index) => {
                return <div key={index + "tag"} className={S.tinyLi}>
                    {tags}
                </div>
            })}</div>
            <div className={S.normalTips}>
                <i className={S.iconfont}>&#xe604;</i>
                <span className={S.tipsBox}>
                    <span className={S.keyTips}>{post.author}</span> created it.
                </span>
                <span className={S.tipsBox}>
                    About <span className={S.keyTips}>{post.art_length}</span> words.
                </span>
            </div>
            <div className={S.normalTips + " " + S.tinyTips + " " + S.praiseBox}>
                <i className={S.iconfont + " " + S.tinyIconfont}>&#xe65f;</i>
                <span className={S.tipsBox}>{post.reads_number} footprints,</span>
                <span className={S.tipsBox}>
                    {curPraise} people say <span className={S.keyTips}>WoW</span>
                </span>
                <div
                    className={S.praiseIcon}
                    onMouseEnter={addTinyTips}
                    onMouseLeave={cursorTipsStore.popTips}
                    onClick={clickPraise}
                >
                    <i className={S.iconfont}>&#xe641;</i>
                </div>
            </div>
        </div>
    </div>
};
const sortParams = [
    {
        name: "create_time_sort",
        text: "Created time",
        descend: {
            sort_direction: -1,
            sort_flag: true
        },
        ascend: {
            sort_direction: 1,
            sort_flag: true
        }
    },
    {
        name: "update_time_sort",
        text: "Updated time",
        descend: {
            sort_direction: -1,
            sort_flag: true
        },
        ascend: {
            sort_direction: 1,
            sort_flag: true
        }
    },
];
