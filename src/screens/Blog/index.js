import blogStyle from "./index.module.less";

import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useLayoutEffect, useState} from "react";

import {getPostListByR0, postDetailById} from "@/request/blogApi";
import {BlogBackground} from "@/screens/Blog/blogBackground";
import {BlogTop} from "@/screens/Blog/blogTop";
import osuStore from "@/stores/osuStore";
import {BlogBottom} from "@/screens/Blog/blogBottom";
import {TinyPinkCookie} from "@/components/pinkCookie/tinyPinkCookie";
import {BlogList} from "@/screens/Blog/blogList";
import {BlogMarkdown} from "@/screens/Blog/blogMarkdown";
import {useNavigate, useParams} from "react-router-dom";
import curPostStore from "@/stores/curPostStore";
import {FilingInfo} from "@/components/filingInfo/filingInfo";

const Blog = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const {id} = params;
    const [pageParams, setPageParams] = useState({
        number: 1,
        size: 20
    });
    const [posts, setPosts] = useState({
        data: []
    });
    const [blogBackground, setBlogBackground] = useState("");
    const [curPostDetail, setCurPostDetail] = useState("");
    useEffect(() => {
        if (id && id !== "") {
            postDetailById(id, (r) => {
                if (r.data.data.articles.length > 0) {
                    // 减少页面抖动
                    setTimeout(() => setCurPostDetail(r.data.data.articles[0]), 100);
                    setTimeout(() => setBlogBackground(r.data.data.articles[0].pic_url), 100);
                }
            });
        }
    }, [id])
    const getPostIds = useCallback(() => {
        getPostListByR0(pageParams, (r) => {
            const {data} = r.data;
            const {total_count, page_number, page_size, articles} = data;
            if (Number(page_number) * Number(page_size) < Number(total_count)) {
                // 如果还有剩余的数据，推进页码
                setPageParams({
                    ...pageParams,
                    number: Number(page_number) + 1
                });
            }
            setPosts({
                data: [...posts.data, ...articles]
            });
            if (id) {
                curPostStore.setId(id);
            }
            if (curPostStore.id === "" && articles.length > 0) {
                curPostStore.setId(articles[0]._id);
                navigate("/blog/" + articles[0]._id);
            }
        });
    }, [])
    useLayoutEffect(() => {
        if (id === "") {
            getPostIds();
        } else {
            setTimeout(getPostIds, 10);
        }
        osuStore.getRandomBeatmap().then(_ => {
            setBlogBackground(osuStore.curImageUrl);
        });
    }, [])
    return <div className={blogStyle.blogMain}>
        <BlogBackground backImg={blogBackground}/>
        <BlogMarkdown post={curPostDetail}/>
        <BlogTop post={curPostDetail}/>
        <BlogBottom><TinyPinkCookie/></BlogBottom>
        <BlogList posts={posts.data}/>
        <FilingInfo/>
    </div>;
};
export default observer(Blog);