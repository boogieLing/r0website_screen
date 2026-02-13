import blogListStyle from "./blogList.module.less";
import {BlogListItem} from "@/screens/Blog/blogListItem";
import ColoredScrollbars from "@/components/scrollBars/ColorScrollBars";
import {Bubbling} from "@/components/button/bubbling";
import {useCallback, useEffect, useState} from "react";

export const BlogList = ({posts, clickHandler, nextPage, isMobile = false, isImmersive = false, onMobileSidebarOpenChange}) => {
    const panelWidth = 'clamp(360px, 34vw, 500px)';
    const contentTop = 'clamp(82px, 10vh, 100px)';
    const contentReservedHeight = 'clamp(180px, 25vh, 220px)';
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) {
            setMobileSidebarOpen(false);
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile && isImmersive) {
            setMobileSidebarOpen(false);
        }
    }, [isImmersive, isMobile]);

    useEffect(() => {
        if (onMobileSidebarOpenChange) {
            onMobileSidebarOpenChange(isMobile && mobileSidebarOpen);
        }
    }, [isMobile, mobileSidebarOpen, onMobileSidebarOpenChange]);

    const handleItemClick = useCallback((postId) => {
        clickHandler(postId);
        if (isMobile) {
            setMobileSidebarOpen(false);
        }
    }, [clickHandler, isMobile]);

    if (isMobile) {
        return <>
            {mobileSidebarOpen && (
                <div
                    className={blogListStyle.mobileBackdrop}
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}
            {!isImmersive && (
                <button
                    type="button"
                    className={`${blogListStyle.mobileToggleBtn} ${mobileSidebarOpen ? blogListStyle.mobileToggleBtnOpen : ''}`}
                    onClick={() => setMobileSidebarOpen((prev) => !prev)}
                    aria-expanded={mobileSidebarOpen}
                    aria-label={mobileSidebarOpen ? 'close post sidebar' : 'open post sidebar'}
                >
                    <span className={blogListStyle.mobileToggleIcon}>{mobileSidebarOpen ? '✕' : '☰'}</span>
                </button>
            )}
            <aside className={`${blogListStyle.mobileSidebar} ${mobileSidebarOpen ? blogListStyle.mobileSidebarOpen : ''}`}>
                <div className={blogListStyle.mobileSidebarHeader}>
                    <span>POSTS</span>
                </div>
                <ColoredScrollbars style={{
                    position: "relative",
                    width: "100%",
                    height: "calc(100% - var(--mobile-sidebar-header-height, 56px))"
                }}>
                    <div className={`${blogListStyle.blogListBox} ${blogListStyle.mobileListBox}`}>
                        {posts.map((post) => {
                            return <BlogListItem
                                post={post}
                                key={post._id}
                                clickHandler={handleItemClick}
                            />
                        })}
                        <Bubbling text="MORE" nextPage={nextPage}/>
                    </div>
                </ColoredScrollbars>
            </aside>
        </>;
    }

    return <ColoredScrollbars
        style={{
            position: "absolute",
            top: contentTop,
            right: 0,
            width: panelWidth,
            height: `calc(100% - ${contentReservedHeight})`, // 顶栏+底栏预留空间：小屏时自动缩减
        }}>
        <div className={blogListStyle.blogListBox}>
            {posts.map((post) => {
                return <BlogListItem
                    post={post} key={post._id} clickHandler={handleItemClick}
                />
            })}
            <Bubbling text="MORE" nextPage={nextPage}/>
        </div>
    </ColoredScrollbars>
};
