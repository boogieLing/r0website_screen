import markdownStyle from "./blogMarkdown.module.less";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {coldarkDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import copy from 'copy-to-clipboard';
import {memo, useCallback, useEffect} from "react";
import cursorTipsStore from "@/stores/cursorTipsStore";
import curPostStore from "@/stores/curPostStore";
import PlainLeftScrollBars from "@/components/scrollBars/PlainLeftScrollBars";

export const BlogMarkdown = memo(({post}) => {
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
        style={{
            position: "absolute",
            top: "100px",
            right: "530px",
            // left: "450px",
            width: "calc(100% - 530px)",
            maxWidth: "1370px",
            height: "calc(100% - 220px)", //TODO 丑陋的写法，实际上高度需要根据less变量计算得出
            overflow: "clip",
            boxSizing: "border-box",
        }}>
        <div
            className={markdownStyle.blogMarkdownBox}>
            <ReactMarkdown
                children={post.markdown}
                rehypePlugins={[rehypeRaw, remarkGfm]}
                components={{
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeStr = String(children).replace(/\n$/, '');
                        return !inline && match ? (
                            <div className={markdownStyle.codeBox}>
                                <div className={markdownStyle.infoBox}>
                                    <div
                                        className={markdownStyle.copyBtn} onClick={() => copyCode(codeStr)}
                                        onMouseEnter={addCodeTips}
                                        onMouseLeave={cursorTipsStore.clearTips}>
                                        <i className={markdownStyle.iconfont}>&#xe6f3;</i>
                                    </div>
                                    <div className={markdownStyle.lang}>{match[1]}</div>
                                </div>

                                <SyntaxHighlighter
                                    children={codeStr}
                                    style={coldarkDark}
                                    language={match[1]}
                                    showLineNumbers
                                    showInlineLineNumbers
                                    {...props}
                                />
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
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
                }}/>
        </div>
    </PlainLeftScrollBars>
});