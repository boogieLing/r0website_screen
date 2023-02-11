import blogStyle from "./index.module.less";

import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useLayoutEffect, useState} from "react";

import {getPostListByR0, getDetailById, getArticleInCategory, createTimeDescend, addPv} from "@/request/blogApi";
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
import {CategoryList} from "@/screens/Blog/categoryList";

const Blog = () => {
    const navigate = useNavigate();
    const params = useParams();
    const {id, categoryName} = params;
    const [pageParams, setPageParams] = useState({
        number: 1, size: 20
    });
    const [posts, setPosts] = useState({
        data: []
    });
    const [blogBackground, setBlogBackground] = useState("");
    const [curPostDetail, setCurPostDetail] = useState("");
    const [sortParam, setSortParam] = useState({create_time_sort: createTimeDescend});
    const setPostDetail = useCallback((r, reset = false) => {
        const {data} = r.data;
        const {total_count, page_number, page_size, articles} = data;
        if (reset) {
            setPosts({
                data: [...articles]
            });
        } else {
            if (Number(page_number) * Number(page_size) < Number(total_count)) {
                // 如果还有剩余的数据，推进页码
                setPageParams({
                    ...pageParams, number: Number(page_number) + 1
                });
            }
            setPosts({
                data: [...posts.data, ...articles]
            });
        }
        if (id && id !== "") {
            curPostStore.setId(id);
        } else {
            if (articles.length > 0) {
                curPostStore.setId(articles[0]._id);
                if (categoryName && categoryName !== "") {
                    navigate(`/category/${categoryName}/${articles[0]._id}`);
                } else {
                    navigate("/blog/" + articles[0]._id);
                }
            }
        }
    }, [posts]);
    const getCategoryPostIds = useCallback(() => {
        getArticleInCategory(categoryName, (r) => {
            setPostDetail(r);
        })
    }, [categoryName]);
    const getBlogPostIds = useCallback(() => {
        getPostListByR0(pageParams, sortParam, (r) => {
            setPostDetail(r);
        });
        // 没有依赖sortParam，即只使用默认的State值
    }, [pageParams]);
    const resetCategoryPostIds = useCallback(() => {
        getArticleInCategory(categoryName, sortParam, (r) => {
            setPostDetail(r, true);
        })
    }, [sortParam]);
    const resetBlogPostIds = useCallback(() => {
        getPostListByR0(pageParams, sortParam, (r) => {
            setPostDetail(r, true);
        });
        // 没有依赖pageParams，即只使用默认的State值
    }, [sortParam]);
    useEffect(() => {
        if (categoryName && categoryName !== "") {
            setTimeout(resetCategoryPostIds, 10);
        } else {
            setTimeout(resetBlogPostIds, 10);
        }
        // 排序条件变动时需要reset
    }, [sortParam]);
    useEffect(() => {
        if (id && id !== "") {
            getDetailById(id, (r) => {
                if (r.data.data.articles.length > 0) {
                    // 减少页面抖动
                    setTimeout(() => setCurPostDetail(r.data.data.articles[0]), 100);
                    if (r.data.data.articles[0].pic_url !== "") {
                        setTimeout(() => setBlogBackground(r.data.data.articles[0].pic_url), 100);
                    }
                }
            });
            addPv(id, ()=>{});
            // console.log(id);
        }
    }, [id])
    useLayoutEffect(() => {
        osuStore.getRandomBeatmap().then(_ => {
            setBlogBackground(osuStore.curImageUrl);
        });
        if (categoryName && categoryName !== "") {
            getCategoryPostIds();
            return;
        }
        if (id === "") {
            getBlogPostIds();
        } else {
            setTimeout(getBlogPostIds, 10);
        }
    }, [])
    const blogPostItemClickHandler = useCallback((id) => {
        if (curPostStore.id !== id) {
            curPostStore.setId(id);
            curPostStore.clearHead();
            if (categoryName && categoryName !== "") {
                navigate(`/category/${categoryName}/${id}`);
            } else {
                navigate("/blog/" + id);
            }
        }
    }, [])
    return <div className={blogStyle.blogMain}>
        <BlogBackground backImg={blogBackground}/>
        <BlogMarkdown post={curPostDetail}/>
        <BlogTop post={curPostDetail} setComputed={setSortParam}/>
        <BlogBottom>
            <CategoryList style={{
                position: "absolute", bottom: "0"
            }}/>
            <TinyPinkCookie/>
        </BlogBottom>
        <BlogList posts={posts.data} clickHandler={blogPostItemClickHandler}/>
        <FilingInfo style={{
            position: "fixed", right: "200px", bottom: "0"
        }}/>
    </div>;
};
export default observer(Blog);