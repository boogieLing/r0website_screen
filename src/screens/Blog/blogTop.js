import blogTopStyle from "./blogTop.module.less";
import React, {useCallback} from "react";
import cursorTipsStore from "@/stores/cursorTipsStore";

export const BlogTop = ({post}) => {
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
    return <div className={blogTopStyle.blogTopBox}>
        <div className={blogTopStyle.borderLeftBottom + " " + blogTopStyle.borderClone}/>
        <div className={blogTopStyle.borderRight + " " + blogTopStyle.borderClone}/>
        <div className={blogTopStyle.borderLeftBottom}/>
        <div className={blogTopStyle.borderRightBack}/>
        <div className={blogTopStyle.borderRight}/>
        <div className={blogTopStyle.backLeft}/>
        <div className={blogTopStyle.backRight}/>
        <div className={blogTopStyle.contentLeft}>
            <div className={blogTopStyle.normalTips + " " + blogTopStyle.titleBox}>
                {post.title}
                <div className={blogTopStyle.normalTips + " " + blogTopStyle.tinyTips + " " + blogTopStyle.inlineTips}>
                    <i className={blogTopStyle.iconfont + " " + blogTopStyle.tinyIconfont}>&#xe628;</i>
                    <span className={blogTopStyle.tipsBox}>{getDate(post.create_time)}</span>
                    <i className={blogTopStyle.iconfont + " " + blogTopStyle.tinyIconfont}>&#xea15;</i>
                    <span className={blogTopStyle.tipsBox}>{getDate(post.update_time)}</span>
                </div>
            </div>

            <div className={blogTopStyle.tinyUl}>{
                React.Children.map(post.categories, (category, index) => {
                    return <div key={index + "category"} className={blogTopStyle.tinyLi}>
                        {category}
                    </div>
                })
            }{React.Children.map(post.tags, (tags, index) => {
                return <div key={index + "tag"} className={blogTopStyle.tinyLi}>
                    {tags}
                </div>
            })}</div>
            <div className={blogTopStyle.normalTips}>
                <i className={blogTopStyle.iconfont}>&#xe604;</i>
                <span className={blogTopStyle.tipsBox}>
                    <span className={blogTopStyle.keyTips}>{post.author}</span> created it.
                </span>
                <span className={blogTopStyle.tipsBox}>
                    About <span className={blogTopStyle.keyTips}>{post.art_length}</span> words.
                </span>
            </div>
            <div className={blogTopStyle.normalTips + " " + blogTopStyle.tinyTips + " " + blogTopStyle.praiseBox}>
                <i className={blogTopStyle.iconfont + " " + blogTopStyle.tinyIconfont}>&#xe65f;</i>
                <span className={blogTopStyle.tipsBox}>{post.reads_number} footprints,</span>
                <span className={blogTopStyle.tipsBox}>
                    {post.praise_number} people say <span className={blogTopStyle.keyTips}>WoW</span>
                </span>
                <div
                    className={blogTopStyle.praiseIcon}
                    onMouseEnter={addTinyTips}
                    onMouseLeave={cursorTipsStore.popTips}
                >
                    <i className={blogTopStyle.iconfont}>&#xe641;</i>
                </div>
            </div>
        </div>
    </div>
};