import markdownStyle from "./blogMarkdown.module.less";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {coldarkDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import copy from 'copy-to-clipboard';
import {Children, cloneElement, isValidElement, memo, useCallback, useEffect, useMemo, useState} from "react";
import cursorTipsStore from "@/stores/cursorTipsStore";
import curPostStore from "@/stores/curPostStore";
import PlainLeftScrollBars from "@/components/scrollBars/PlainLeftScrollBars";
import 'katex/dist/katex.min.css';

const MOBILE_FONT_STORAGE_KEY = 'blog_mobile_markdown_font_size';
const MOBILE_FONT_MIN = 12;
const MOBILE_FONT_MAX = 18;
const MOBILE_FONT_STEP = 0.5;
const MOBILE_FONT_DEFAULT = 13;
const HIGHLIGHT_MARK_PATTERN = /==([^=\n][^=\n]*?)==/g;
const CALLOUT_PREFIX_PATTERN = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;
const CALLOUT_CLASS_MAP = {
    note: markdownStyle.markdownCalloutNote,
    tip: markdownStyle.markdownCalloutTip,
    important: markdownStyle.markdownCalloutImportant,
    warning: markdownStyle.markdownCalloutWarning,
    caution: markdownStyle.markdownCalloutCaution,
};

// 仅在非代码块区域把 ==高亮== 语法转换成 <mark>，避免污染 fenced code 内容。
const normalizeMarkdownForRender = (markdown = '') => {
    const lines = markdown.split('\n');
    let codeFenceTag = '';

    return lines.map((line) => {
        const trimmed = line.trim();
        if (/^(```|~~~)/.test(trimmed)) {
            const fenceTag = trimmed.slice(0, 3);
            if (!codeFenceTag) {
                codeFenceTag = fenceTag;
            } else if (codeFenceTag === fenceTag) {
                codeFenceTag = '';
            }
            return line;
        }
        if (codeFenceTag) {
            return line;
        }
        return line.replace(HIGHLIGHT_MARK_PATTERN, '<mark>$1</mark>');
    }).join('\n');
};

// 递归提取 React 子节点中的纯文本，供标题锚点和提示文案复用。
const extractTextFromChildren = (children) => {
    return Children.toArray(children).map((child) => {
        if (typeof child === 'string' || typeof child === 'number') {
            return String(child);
        }
        if (isValidElement(child) && child.props && child.props.children) {
            return extractTextFromChildren(child.props.children);
        }
        return '';
    }).join('');
};

// 将标题文本去除 Markdown/HTML 装饰符，得到稳定可用的锚点 id。
const normalizeHeadingTitle = (title = '') => {
    return title
        .replace(/<[^>]*>/g, '')
        .replace(/[`*_~]/g, '')
        .trim();
};

// 解析 GitHub 风格 [!NOTE] 提示块前缀，并返回清洗后的内容结构。
const parseCalloutChildren = (children) => {
    const childArray = Children.toArray(children);
    if (childArray.length === 0) {
        return null;
    }

    const firstChild = childArray[0];
    if (!isValidElement(firstChild) || !firstChild.props || !firstChild.props.children) {
        return null;
    }

    const firstParagraphChildren = Children.toArray(firstChild.props.children);
    if (firstParagraphChildren.length === 0 || typeof firstParagraphChildren[0] !== 'string') {
        return null;
    }

    const match = firstParagraphChildren[0].match(CALLOUT_PREFIX_PATTERN);
    if (!match) {
        return null;
    }

    const type = match[1].toLowerCase();
    const cleanedParagraphChildren = [...firstParagraphChildren];
    cleanedParagraphChildren[0] = firstParagraphChildren[0].replace(CALLOUT_PREFIX_PATTERN, '').trimStart();
    const cleanedBlockChildren = [...childArray];
    cleanedBlockChildren[0] = cloneElement(firstChild, {}, cleanedParagraphChildren);

    return {
        type,
        children: cleanedBlockChildren,
    };
};

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
    const markdownContent = useMemo(() => {
        return normalizeMarkdownForRender(post?.markdown || '');
    }, [post?.markdown]);

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
        if (markdownContent) {
            const h2Titles = [];
            const matcher = /^##\s+(.+)$/gm;
            let item = matcher.exec(markdownContent);

            while (item) {
                const normalized = normalizeHeadingTitle(item[1]);
                if (normalized) {
                    h2Titles.push(normalized);
                }
                item = matcher.exec(markdownContent);
            }
            curPostStore.setHead(h2Titles);
            return;
        }
        curPostStore.setHead([]);
    }, [markdownContent]);

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
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                disallowedElements={['script']}
                components={{
                    code({inline, className, children, ...props}) {
                        const match = /language-([\w-]+)/.exec(className || '');
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
                                    wrapLongLines
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
                    a({children, href}) {
                        const finalHref = typeof href === 'string' ? href.trim() : '';
                        const tipsText = finalHref || extractTextFromChildren(children);
                        const isHashLink = finalHref.startsWith('#');
                        if (!finalHref) {
                            return <span>{children}</span>;
                        }
                        if (isHashLink) {
                            return <a
                                href={finalHref}
                                onMouseEnter={() => addATips(tipsText)}
                                onMouseLeave={cursorTipsStore.popTips}>
                                {children}
                            </a>;
                        }
                        return <a
                            href={finalHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => addATips(tipsText)}
                            onMouseLeave={cursorTipsStore.popTips}>
                            {children}
                        </a>
                    },
                    del({children}) {
                        return <del
                            onMouseEnter={addDelTips}
                            onMouseLeave={cursorTipsStore.popTips}>
                            {children}
                        </del>
                    },
                    h2({children}) {
                        const headingTitle = normalizeHeadingTitle(extractTextFromChildren(children));
                        return <h2 id={headingTitle} data-name={headingTitle}>{children}</h2>
                    },
                    img({src, alt, ...props}) {
                        const resolvedSrc = typeof src === 'string' ? src.trim() : '';
                        if (!resolvedSrc) {
                            return null;
                        }
                        return <img
                            src={resolvedSrc}
                            alt={alt || ''}
                            loading="lazy"
                            decoding="async"
                            {...props}
                            onClick={(e) => {
                                if (!isMobile) {
                                    return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                setMobilePreviewImage(resolvedSrc);
                            }}
                        />
                    },
                    blockquote({children, ...props}) {
                        const calloutInfo = parseCalloutChildren(children);
                        if (!calloutInfo) {
                            return <blockquote {...props}>{children}</blockquote>;
                        }
                        const calloutType = calloutInfo.type;
                        const calloutClassName = CALLOUT_CLASS_MAP[calloutType] || markdownStyle.markdownCalloutNote;
                        return <blockquote className={`${markdownStyle.markdownCallout} ${calloutClassName}`} {...props}>
                            <div className={markdownStyle.markdownCalloutTitle}>{calloutType.toUpperCase()}</div>
                            <div className={markdownStyle.markdownCalloutBody}>{calloutInfo.children}</div>
                        </blockquote>;
                    },
                }}>
                {markdownContent}
            </ReactMarkdown>
        </div>
    </PlainLeftScrollBars>
});
