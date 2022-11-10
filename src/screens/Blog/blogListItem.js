import blogListStyle from "./blogList.module.less";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import cursorTipsStore from "@/stores/cursorTipsStore";
import {useNavigate} from "react-router-dom";
import curPostStore from "@/stores/curPostStore";
import {observer} from "mobx-react-lite";

export const BlogListItem = observer(({post}) => {
    const navigate = useNavigate();
    const addTinyTips = useCallback((tips) => {
        cursorTipsStore.addTips({
            spanText: tips,
            iconText: "?",
        });
    }, []);
    const addAuthorTips = useCallback((author) => {
        cursorTipsStore.addTips({
            spanText: `${author} 留下的线索...`,
            iconText: "!!",
        });
    }, []);
    const setCurPost = useCallback(() => goTo(post._id), []);
    const goTo = useCallback((_id) => {
        if (curPostStore.id !== _id) {
            curPostStore.setId(_id);
            curPostStore.clearHead();
            navigate("/blog/" + _id);
        }
    }, []);
    const goToHead = useCallback((anchorName) => {
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) {
                anchorElement.scrollIntoView({behavior: 'smooth'});
            }
        }
    }, [])

    return <div className={blogListStyle.itemBox}>
        <div
            className={blogListStyle.item + " " + (curPostStore.id === post._id ? blogListStyle.itemHover : "")}
            onClick={setCurPost}
            onMouseEnter={() => addAuthorTips(post.author)}
            onMouseLeave={cursorTipsStore.popTips}
        >
            <div className={blogListStyle.thumbnailBox}>
                <img src={post.pic_url} alt=""/>
            </div>
            <div className={blogListStyle.normalTextBox + " " + blogListStyle.titleBox}>
                <span className={blogListStyle.textSpan}>{post.title}</span>
            </div>
            <div className={blogListStyle.normalTextBox}>
                <i className={blogListStyle.iconfont}>&#xe842;</i>
                <span className={blogListStyle.textSpan}>{post.author}</span>
            </div>
            <ul className={blogListStyle.ulBox}>
                <div className={blogListStyle.liBox}>
                    Categories:
                </div>
                {React.Children.map(post.categories, (category, index) => {
                    return <div key={index} className={blogListStyle.liBox}>
                        <a href="" onMouseEnter={() => addTinyTips(category)}
                           onMouseLeave={cursorTipsStore.popTips}
                        > {category}</a>
                    </div>
                })}
                {
                    !post.categories || post.categories.length === 0 ? <div className={blogListStyle.liBox}>
                        Monster...
                    </div> : <div/>
                }
            </ul>
            <ul className={blogListStyle.ulBox}>
                <div className={blogListStyle.liBox}>
                    Tags:
                </div>
                {React.Children.map(post.tags, (tag, index) => {
                    return <div key={index} className={blogListStyle.liBox}>
                        <a href=""
                           onMouseEnter={() => addTinyTips(tag)}
                           onMouseLeave={cursorTipsStore.popTips}
                        >{tag}
                        </a>
                    </div>
                })}
            </ul>
            <ul className={blogListStyle.ulBox}>
                <div className={blogListStyle.liBox}>
                    <i className={blogListStyle.iconfont}>&#xe641;</i>
                    <span>{post.praise_number}</span>
                </div>
                <div className={blogListStyle.liBox}>
                    <i className={blogListStyle.iconfont}>&#xe667;</i>
                    <span>{post.reads_number}</span>
                </div>
            </ul>
        </div>
        {curPostStore.id === post._id && curPostStore.heads.map && <div className={blogListStyle.headBox}>
            {curPostStore.heads.map((id, index) => {
                return <div key={id + index} onClick={() => goToHead(id)} className={blogListStyle.head}>
                    <i className={blogListStyle.iconfont}>&#xe6b1;</i>
                    {id}
                </div>;
            })}
        </div>}
    </div>
});