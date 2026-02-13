import blogStyle from "./index.module.less";

import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import {getPostListByR0, getDetailById, getArticleInCategory, createTimeDescend, addPv} from "@/request/blogApi";
import {BlogBackground} from "@/screens/Blog/blogBackground";
import {BlogTop} from "@/screens/Blog/blogTop";
import {BlogBottom} from "@/screens/Blog/blogBottom";
import {TinyPinkCookie} from "@/components/pinkCookie/tinyPinkCookie";
import {BlogList} from "@/screens/Blog/blogList";
import {BlogMarkdown} from "@/screens/Blog/blogMarkdown";
import {useNavigate, useParams} from "react-router-dom";
import curPostStore from "@/stores/curPostStore";
import {FilingInfo} from "@/components/filingInfo/filingInfo";
import {CategoryList} from "@/screens/Blog/categoryList";
import Cursor from "@/components/cursor/cursor";

const MOBILE_BREAKPOINT = 820;

const getIsMobileLayout = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return window.innerWidth <= MOBILE_BREAKPOINT;
};

const Blog = () => {
    const navigate = useNavigate();
    const params = useParams();
    const {id, categoryName} = params;
    const [pageParams, setPageParams] = useState(null);
    const [posts, setPosts] = useState({
        data: []
    });
    const [blogBackground, setBlogBackground] = useState("");
    const [curPostDetail, setCurPostDetail] = useState("");
    const [sortParam, setSortParam] = useState(null);
    const [isMobileLayout, setIsMobileLayout] = useState(() => getIsMobileLayout());
    const [isMobileRightSidebarOpen, setIsMobileRightSidebarOpen] = useState(false);
    const [isImmersive, setIsImmersive] = useState(false);
    const mobileTapRef = useRef({
        time: 0,
        x: 0,
        y: 0,
    });
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
                // setPageParams({
                //     ...pageParams, number: Number(page_number) + 1
                // });
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
    const nextPage = useCallback(() => {
        if (!pageParams) {
            // 默认就是1，从空转移来应该直接到2
            setPageParams({
                number: 2,
                size: 5,
            })
        } else {
            setPageParams({
                ...pageParams, number: pageParams.number + 1
            });
        }
    }, [pageParams]);
    const getCategoryPostIds = useCallback(() => {
        getArticleInCategory(categoryName, pageParams, sortParam, (r) => {
            setPostDetail(r);
        })
    }, [categoryName, pageParams, sortParam]);
    const getBlogPostIds = useCallback(() => {
        getPostListByR0(pageParams, sortParam, (r) => {
            setPostDetail(r);
        });
    }, [pageParams, sortParam]);
    const resetCategoryPostIds = useCallback(() => {
        getArticleInCategory(categoryName, null, sortParam, (r) => {
            setPostDetail(r, true);
        })
    }, [sortParam]);
    const resetBlogPostIds = useCallback(() => {
        getPostListByR0(null, sortParam, (r) => {
            setPostDetail(r, true);
        }); // 没有依赖pageParams，即只使用默认的State值
    }, [sortParam]);
    useEffect(() => {
        if (sortParam) {
            setPageParams(null);
            if (categoryName && categoryName !== "") {
                setTimeout(resetCategoryPostIds, 10);
            } else {
                setTimeout(resetBlogPostIds, 10);
            } // 排序条件变动时需要reset
        }
    }, [sortParam]);
    useEffect(() => {
        if (pageParams) {
            if (categoryName && categoryName !== "") {
                setTimeout(getCategoryPostIds, 10);
            } else {
                setTimeout(getBlogPostIds, 10);
            } // 排序条件变动时需要reset
        }
    }, [pageParams]);
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
            addPv(id, () => {
            });
            // console.log(id);
        }
    }, [id])
    useEffect(() => {
        const handleResize = () => {
            setIsMobileLayout(getIsMobileLayout());
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);
    useLayoutEffect(() => {
        // osuStore.getRandomPicFromTCloud().then(_ => {
        //     setBlogBackground(osuStore.curImageUrl);
        // });
        if (categoryName && categoryName !== "") {
            getCategoryPostIds();
        }
        // if (id === "") {
        //     getBlogPostIds();
        // } else {
        //     setTimeout(getBlogPostIds, 10);
        // }
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
    const toggleImmersive = useCallback(() => {
        setIsImmersive((prev) => !prev);
    }, []);
    const handleRootTouchEnd = useCallback((e) => {
        if (!isMobileLayout) {
            return;
        }
        const target = e.target;
        if (target instanceof Element && target.closest('input, textarea, select, button')) {
            return;
        }
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) {
            return;
        }
        const now = Date.now();
        const {time, x, y} = mobileTapRef.current;
        const gap = now - time;
        const dx = Math.abs(touch.clientX - x);
        const dy = Math.abs(touch.clientY - y);
        mobileTapRef.current = {
            time: now,
            x: touch.clientX,
            y: touch.clientY,
        };
        if (gap > 0 && gap < 320 && dx < 24 && dy < 24) {
            setIsImmersive((prev) => !prev);
            mobileTapRef.current.time = 0;
        }
    }, [isMobileLayout]);
    const hidePeripheralOnPcImmersive = isImmersive && !isMobileLayout;

    const [displayCustomCursor, setDisplayCustomCursor] = useState(false);
    return <div
        className={blogStyle.blogMain + " " + (displayCustomCursor ? blogStyle.hiddenCursor : blogStyle.staticCursor)}
        onDoubleClick={toggleImmersive}
        onTouchEndCapture={handleRootTouchEnd}
    >
        <Cursor display={displayCustomCursor}/>
        <BlogBackground backImg={blogBackground}/>
        <BlogMarkdown
            post={curPostDetail}
            isMobile={isMobileLayout}
            isImmersive={isImmersive}
            hideMobileFontController={isImmersive}
        />
        {!hidePeripheralOnPcImmersive && (
            <BlogTop post={curPostDetail} setComputed={setSortParam} isImmersive={isImmersive}/>
        )}
        {!hidePeripheralOnPcImmersive && (
            <BlogBottom
                isMobile={isMobileLayout}
                isRightSidebarOpen={isMobileRightSidebarOpen}
                isImmersive={isImmersive}
            >
                <CategoryList style={{
                    ...(isMobileLayout ? {} : {
                        position: "absolute",
                        bottom: "0",
                        left: "auto",
                        right: "auto"
                    })
                }} isSidebar={isMobileLayout}/>
            </BlogBottom>
        )}
        {!isImmersive && <TinyPinkCookie isMobile={isMobileLayout}/>}
        {!hidePeripheralOnPcImmersive && (
            <BlogList
                posts={posts.data}
                clickHandler={blogPostItemClickHandler}
                nextPage={nextPage}
                isMobile={isMobileLayout}
                isImmersive={isImmersive}
                onMobileSidebarOpenChange={setIsMobileRightSidebarOpen}
            />
        )}
        {!hidePeripheralOnPcImmersive && (
            <FilingInfo style={{
                position: "fixed",
                right: isMobileLayout ? "10px" : "200px",
                bottom: "0",
                transform: isMobileLayout ? "scale(0.85)" : "none",
                transformOrigin: "right bottom"
            }}/>
        )}
    </div>;
};
export default observer(Blog);
