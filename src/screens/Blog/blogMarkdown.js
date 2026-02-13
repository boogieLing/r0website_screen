import markdownStyle from "./blogMarkdown.module.less";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {coldarkDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import copy from 'copy-to-clipboard';
import {memo, useCallback, useEffect, useMemo, useState} from "react";
import cursorTipsStore from "@/stores/cursorTipsStore";
import curPostStore from "@/stores/curPostStore";
import PlainLeftScrollBars from "@/components/scrollBars/PlainLeftScrollBars";

const MOBILE_FONT_STORAGE_KEY = 'blog_mobile_markdown_font_size';
const MOBILE_FONT_MIN = 12;
const MOBILE_FONT_MAX = 18;
const MOBILE_FONT_STEP = 0.5;
const MOBILE_FONT_DEFAULT = 13;

export const BlogMarkdown = memo(({post, isMobile = false, isImmersive = false, hideMobileFontController = false}) => {
    const panelWidth = 'clamp(360px, 34vw, 500px)';
    const panelGap = '30px';
    const rightOffset = `calc(${panelWidth} + ${panelGap})`;
    const contentTop = 'clamp(82px, 10vh, 100px)';
    const contentReservedHeight = 'clamp(180px, 25vh, 220px)';
    const mobileTop = isImmersive ? '72px' : '158px';
    const mobileBottomDockHeight = '0px';
    const mobileBodyHeight = `calc(100% - ${mobileTop} - ${mobileBottomDockHeight})`;
    const [mobileFontSize, setMobileFontSize] = useState(MOBILE_FONT_DEFAULT);
    const [mobilePreviewImage, setMobilePreviewImage] = useState('');

    useEffect(() => {
        if (!isMobile || typeof window === "undefined") {
            return;
        }
        const savedValue = Number(window.localStorage.getItem(MOBILE_FONT_STORAGE_KEY));
        if (Number.isFinite(savedValue)) {
            const normalized = Math.max(MOBILE_FONT_MIN, Math.min(MOBILE_FONT_MAX, savedValue));
            setMobileFontSize(normalized);
        } else {
            setMobileFontSize(MOBILE_FONT_DEFAULT);
        }
    }, [isMobile]);

    useEffect(() => {
        if (!isMobile || typeof window === "undefined") {
            return;
        }
        window.localStorage.setItem(MOBILE_FONT_STORAGE_KEY, String(mobileFontSize));
    }, [isMobile, mobileFontSize]);

    const mobileLineHeight = useMemo(() => {
        return Number((mobileFontSize * 1.56).toFixed(2));
    }, [mobileFontSize]);

    const mobileCodeFontSize = useMemo(() => {
        return Number((mobileFontSize * 0.8).toFixed(2));
    }, [mobileFontSize]);

    const copyCode = useCallback((code) => {
        cursorTipsStore.addTips({
            spanText: "Copy successfully！",
            iconText: "√",
        });
        copy(code);
    }, []);
    const addCodeTips = useCallback(() => {
        cursorTipsStore.addTips({
            spanText: "Get the code",
            iconText: "{ }",
        });
    }, []);
    const addATips = useCallback((tips) => {
        cursorTipsStore.addTips({
            spanText: "Go to: " + tips,
            iconText: "↑",
        });
    }, []);
    const addDelTips = useCallback(() => {
        cursorTipsStore.addTips({
            spanText: "...不为人知的",
            iconText: "**",
        });
    }, []);
    useEffect(() => {
        if (post.markdown && post.markdown !== "") {
            // 只匹配二级标题
            let h2Titles = post.markdown.match(/\n## ([\s\S]*?)\n/g);
            if (!h2Titles) {
                h2Titles = [];
            }
            curPostStore.setHead(h2Titles.map((str) => {
                return str.toString()
                    .replace(/\n## /g, '')
                    .replace(/\n/g, '');
            }));
        }
    }, [post.markdown]);

    return <PlainLeftScrollBars
        style={isMobile ? {
            position: "absolute",
            top: mobileTop,
            left: 0,
            right: 0,
            width: "100%",
            maxWidth: "none",
            height: mobileBodyHeight,
            minHeight: "180px",
            overflow: "clip",
            boxSizing: "border-box"
        } : {
            ...(isImmersive ? {
                position: "absolute",
                top: "10px",
                left: 0,
                right: 0,
                width: "100%",
                maxWidth: "none",
                height: "calc(100% - 20px)",
                overflow: "clip",
                boxSizing: "border-box",
            } : {
                position: "absolute",
                top: contentTop,
                right: rightOffset,
                // left: "450px",
                width: `calc(100% - ${rightOffset})`,
                maxWidth: "1370px",
                height: `calc(100% - ${contentReservedHeight})`, // 顶栏+底栏预留空间：小屏时自动缩减
                overflow: "clip",
                boxSizing: "border-box",
            })
        }}>
        <div
            className={`${markdownStyle.blogMarkdownBox} ${(!isMobile && isImmersive) ? markdownStyle.blogMarkdownImmersive : ''}`}
            style={isMobile ? {
                '--mobile-md-font-size': `${mobileFontSize}px`,
                '--mobile-md-line-height': `${mobileLineHeight}px`,
                '--mobile-md-code-font-size': `${mobileCodeFontSize}px`,
            } : undefined}
        >
            {mobilePreviewImage && (
                <div
                    className={markdownStyle.mobileImagePreviewMask}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMobilePreviewImage('');
                    }}
                >
                    <img
                        className={markdownStyle.mobileImagePreviewImg}
                        src={mobilePreviewImage}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            {isMobile && !hideMobileFontController && (
                <div className={markdownStyle.mobileFontController}>
                    <span className={markdownStyle.mobileFontLabel}>A</span>
                    <input
                        className={markdownStyle.mobileFontRange}
                        type="range"
                        min={MOBILE_FONT_MIN}
                        max={MOBILE_FONT_MAX}
                        step={MOBILE_FONT_STEP}
                        value={mobileFontSize}
                        onChange={(e) => setMobileFontSize(Number(e.target.value))}
                        aria-label="Adjust article font size"
                    />
                </div>
            )}
            <ReactMarkdown
                children={post.markdown}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeStr = String(children).replace(/\n$/, '');
                        if (!inline) {
                            const lang = match ? match[1] : 'text';
                            return <div className={markdownStyle.codeBox}>
                                <div className={markdownStyle.infoBox}>
                                    <div
                                        className={markdownStyle.copyBtn} onClick={() => copyCode(codeStr)}
                                        onMouseEnter={addCodeTips}
                                        onMouseLeave={cursorTipsStore.clearTips}>
                                        <i className={markdownStyle.iconfont}>&#xe6f3;</i>
                                    </div>
                                    <div className={markdownStyle.lang}>{lang}</div>
                                </div>

                                <SyntaxHighlighter
                                    children={codeStr}
                                    style={coldarkDark}
                                    language={lang}
                                    showLineNumbers
                                    showInlineLineNumbers
                                    {...props}
                                />
                            </div>;
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    a({node, inline, className, children, ...props}) {
                        return <a
                            href={children + ""} target="_blank"
                            onMouseEnter={() => addATips(children)}
                            onMouseLeave={cursorTipsStore.popTips}>
                            {children}
                        </a>
                    },
                    del({node, inline, className, children, ...props}) {
                        return <del
                            onMouseEnter={addDelTips}
                            onMouseLeave={cursorTipsStore.popTips}>
                            {children}
                        </del>
                    },
                    h2({node, inline, className, children, ...props}) {
                        return <h2 id={children} data-name={children}>{children}</h2>
                    },
                    img({node, src, alt, ...props}) {
                        return <img
                            src={src}
                            alt={alt || ''}
                            {...props}
                            onClick={(e) => {
                                if (!src) {
                                    return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                setMobilePreviewImage(src);
                            }}
                        />
                    },
                }}/>
        </div>
    </PlainLeftScrollBars>
});
