import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ReactDocumentTitle from '@/utils/title';
import globalStore from '@/stores/globalStore';
import s from './index.module.less';

import splashEight from '@/static/pic/tsugie/splash-8.png';
import splashNine from '@/static/pic/tsugie/splash-9.png';
import splashTen from '@/static/pic/tsugie/splash-10.png';
import splashEleven from '@/static/pic/tsugie/splash-11.png';
import splashTwelve from '@/static/pic/tsugie/splash-12.png';
import tsugieLogo from '@/static/pic/tsugie/tsugie-logo-anime-0.png';

const capabilityLines = [
    '打开那一秒，地图先亮起来，quick card 轻轻递上今夜的方向。',
    '时间、位置与城市热度在后台汇流，前台只留下一个可去的答案。',
    '周边、收藏、打卡排成一条顺滑的线，手指向前，心也向前。',
    '日历把此刻拉长成之后，让临时起意有了温柔的延续。',
    '导航键始终近在眼前，犹豫会在按下之前悄悄变薄。',
    '每次回到 Tsugie，推荐都会更懂当天的节奏与心情。',
];

const originLines = [
    'Tsugie 起于一个很小的问题：此刻，往哪里去。',
    '操作被削到很薄，决定便有了更轻的重量。',
    '首屏先把推荐放到眼前，时间留给脚步本身。',
    '情绪先行，计划随后；顺序改变，体验也改变。',
    '想去、去过、还想再去，被安静写进同一条轨迹。',
    '每一次轻触，都应当换来真实的下一步。',
];

const techLines = [
    '地图引擎在看不见的地方重写附近语义，画面始终轻快。',
    '推荐并行衡量距离、时间窗、热度与惊喜值，像在水下对齐刻度。',
    '候选会向“正在发生”与“现在可达”缓缓倾斜。',
    '卡片分阶段抵达，先把方向交出，再把细节补齐。',
    '长会话里，重资源会被自动回收，流畅感被稳稳守住。',
    '即使是高密度城市，滑动与缩放仍保持呼吸般的节奏。',
    '技术退到幕后，行动停在前景。',
];

const namingLines = [
    'つぎへ，把「一緒に」留在空白里，像一句没说完的话。',
    'いつか，给“已收藏、未抵达”的未来留一个温柔入口。',
    'かつて，为“已经去过”写下带余温的回声。',
    '词语很短，方向却很长。',
    '命名在分类之外，也在悄悄塑造旅途的情绪。',
];

const futureLines = [
    '收藏会长出照片存档，记忆可导出为拍立得质感。',
    '图章落在影像上，抵达有了可分享的证据。',
    '线下相遇可触发互相打卡，让偶然被看见。',
    '推荐会继续学习季节、节日与城市的脉搏。',
    '一次次出发，终会沉淀成个人的移动年鉴。',
];

const sections = [
    {
        id: 'hero',
        kicker: 'Tsugie',
        brandName: '「つぎへ」',
        brandKana: '',
        title: '下一次，再一次。',
        lead: '我们总会走向\n那个让心跳变得真实的地方。',
        lines: [
            '打开，就会明白。',
            '三秒，足够决定出发。',
            '下一次，再次，听着花火打响的夜晚。',
            '下一次，再次，回到笑颜翻涌的屋台。',
        ],
    },
    {
        id: 'origin',
        kicker: '起点',
        title: '先接住冲动，再托住计划。',
        lead: 'Tsugie 想让每次打开，都先出现一个清晰的去处。',
        lines: originLines,
    },
    {
        id: 'capability',
        kicker: '体验',
        title: '让“想去”这件事，顺势发生。',
        lead: '信息被折成最短路径，页面把空间让给行动。',
        lines: capabilityLines,
    },
    {
        id: 'tech',
        kicker: '引擎',
        title: '复杂沉入底层，轻盈留在指尖。',
        lead: '地图、推荐与渲染在幕后并行，前台只保留可行动的方向。',
        lines: techLines,
    },
    {
        id: 'naming',
        kicker: '词语',
        title: '名字很短，余韵很长。',
        lead: '状态被写成词语，也被写成心情。',
        lines: namingLines,
    },
    {
        id: 'future',
        kicker: '之后',
        title: '把今天的出发，留给明天回望。',
        lead: '照片、图章与线下连接，会让轨迹慢慢长出温度。',
        lines: futureLines,
        ending: 'Tsugie 点亮下一站，\n也收藏每一次抵达后的余光。',
    },
];

const splashPool = [splashEight, splashNine, splashTen, splashEleven, splashTwelve];

function buildSplashTimeline(count) {
    let last = -1;
    return Array.from({length: count}).map(() => {
        let next = Math.floor(Math.random() * splashPool.length);
        if (splashPool.length > 1 && next === last) {
            next = (next + 1 + Math.floor(Math.random() * (splashPool.length - 1))) % splashPool.length;
        }
        last = next;
        return splashPool[next];
    });
}

const TsugieIdea = memo(() => {
    const rootRef = useRef(null);
    const wheelLockRef = useRef(false);
    const wheelAccRef = useRef(0);
    const touchStartRef = useRef({x: 0, y: 0});
    const touchDeltaRef = useRef({x: 0, y: 0});
    const swipeRafRef = useRef(null);
    const pendingSwipeXRef = useRef(0);
    const [activePage, setActivePage] = useState(0);
    const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth <= 760);
    const splashTimeline = useMemo(() => buildSplashTimeline(sections.length), []);

    const setSwipeOffset = useCallback((offsetX) => {
        const rootNode = rootRef.current;
        if (!rootNode) {
            return;
        }
        const swipeRange = Math.max(120, window.innerWidth * 0.45);
        const leftProgress = Math.max(0, Math.min(1, -offsetX / swipeRange));
        const rightProgress = Math.max(0, Math.min(1, offsetX / swipeRange));
        rootNode.style.setProperty('--swipe-dx', `${offsetX}px`);
        rootNode.style.setProperty('--swipe-left-progress', leftProgress.toFixed(3));
        rootNode.style.setProperty('--swipe-right-progress', rightProgress.toFixed(3));
    }, []);

    const setSwipingClass = useCallback((isSwiping) => {
        const rootNode = rootRef.current;
        if (!rootNode) {
            return;
        }
        rootNode.classList.toggle(s.pageSwiping, isSwiping);
    }, []);

    const scheduleSwipeOffset = useCallback((offsetX) => {
        pendingSwipeXRef.current = offsetX;
        if (swipeRafRef.current !== null) {
            return;
        }
        swipeRafRef.current = window.requestAnimationFrame(() => {
            swipeRafRef.current = null;
            setSwipeOffset(pendingSwipeXRef.current);
        });
    }, [setSwipeOffset]);

    useEffect(() => {
        // 预热启动页资源，避免翻页切换时首次解码导致卡顿
        splashPool.forEach((src) => {
            const img = new Image();
            img.src = src;
            if (typeof img.decode === 'function') {
                img.decode().catch(() => {});
            }
        });
    }, []);

    useEffect(() => {
        const onResize = () => {
            setIsMobileViewport(window.innerWidth <= 760);
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => () => {
        if (swipeRafRef.current !== null) {
            window.cancelAnimationFrame(swipeRafRef.current);
            swipeRafRef.current = null;
        }
    }, []);

    const changePage = useCallback((nextIndex) => {
        setActivePage((prev) => {
            const clamped = Math.max(0, Math.min(nextIndex, sections.length - 1));
            return clamped === prev ? prev : clamped;
        });
    }, []);

    const goNext = useCallback(() => {
        changePage(activePage + 1);
    }, [activePage, changePage]);

    const goPrev = useCallback(() => {
        changePage(activePage - 1);
    }, [activePage, changePage]);

    useEffect(() => {
        const rootNode = rootRef.current;
        if (!rootNode) {
            return undefined;
        }

        const onWheel = (event) => {
            if (window.innerWidth <= 760) {
                return;
            }
            event.preventDefault();
            if (wheelLockRef.current) {
                return;
            }

            const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
            wheelAccRef.current += delta;

            if (Math.abs(wheelAccRef.current) < 34) {
                return;
            }

            wheelLockRef.current = true;
            const direction = wheelAccRef.current > 0 ? 1 : -1;
            wheelAccRef.current = 0;
            changePage(activePage + direction);

            window.setTimeout(() => {
                wheelLockRef.current = false;
            }, 560);
        };

        const onKeyDown = (event) => {
            if (event.key === 'ArrowRight' || event.key === 'PageDown') {
                event.preventDefault();
                goNext();
            }
            if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
                event.preventDefault();
                goPrev();
            }
        };

        const onTouchStart = (event) => {
            if (window.innerWidth > 760) {
                return;
            }
            const point = event.touches && event.touches[0];
            if (!point) {
                return;
            }
            setSwipingClass(true);
            touchStartRef.current = {x: point.clientX, y: point.clientY};
            touchDeltaRef.current = {x: 0, y: 0};
            setSwipeOffset(0);
        };

        const onTouchMove = (event) => {
            if (window.innerWidth > 760) {
                return;
            }
            const point = event.touches && event.touches[0];
            if (!point) {
                return;
            }

            const deltaX = point.clientX - touchStartRef.current.x;
            const deltaY = point.clientY - touchStartRef.current.y;
            const maxSwipe = Math.max(92, window.innerWidth * 0.42);
            const clampedX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
            touchDeltaRef.current = {x: clampedX, y: deltaY};
            scheduleSwipeOffset(clampedX);

            if (Math.abs(deltaX) > Math.abs(deltaY) && event.cancelable) {
                event.preventDefault();
            }
        };

        const onTouchEnd = () => {
            if (window.innerWidth > 760) {
                return;
            }
            if (wheelLockRef.current) {
                setSwipingClass(false);
                setSwipeOffset(0);
                return;
            }

            const {x, y} = touchDeltaRef.current;
            const threshold = Math.max(46, window.innerWidth * 0.14);
            const isHorizontal = Math.abs(x) >= Math.abs(y) * 1.1;

            if (!isHorizontal || Math.abs(x) < threshold) {
                setSwipingClass(false);
                setSwipeOffset(0);
                touchDeltaRef.current = {x: 0, y: 0};
                return;
            }

            wheelLockRef.current = true;
            setSwipingClass(false);
            changePage(activePage + (x < 0 ? 1 : -1));
            touchDeltaRef.current = {x: 0, y: 0};
            window.requestAnimationFrame(() => {
                setSwipeOffset(0);
            });

            window.setTimeout(() => {
                wheelLockRef.current = false;
            }, 500);
        };

        const onTouchCancel = () => {
            setSwipingClass(false);
            touchDeltaRef.current = {x: 0, y: 0};
            setSwipeOffset(0);
        };

        rootNode.addEventListener('wheel', onWheel, {passive: false});
        rootNode.addEventListener('touchstart', onTouchStart, {passive: true});
        rootNode.addEventListener('touchmove', onTouchMove, {passive: false});
        rootNode.addEventListener('touchend', onTouchEnd, {passive: true});
        rootNode.addEventListener('touchcancel', onTouchCancel, {passive: true});
        window.addEventListener('keydown', onKeyDown);

        return () => {
            rootNode.removeEventListener('wheel', onWheel);
            rootNode.removeEventListener('touchstart', onTouchStart);
            rootNode.removeEventListener('touchmove', onTouchMove);
            rootNode.removeEventListener('touchend', onTouchEnd);
            rootNode.removeEventListener('touchcancel', onTouchCancel);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [activePage, changePage, goNext, goPrev, scheduleSwipeOffset, setSwipeOffset, setSwipingClass]);

    const pageClassName = useCallback((index) => {
        if (index === activePage) {
            return s.pageCurrent;
        }
        if (index === activePage - 1) {
            return s.pagePrev;
        }
        if (index === activePage + 1) {
            return s.pageNext;
        }
        return index < activePage ? s.pageFarPrev : s.pageFarNext;
    }, [activePage]);

    const renderPageInner = useCallback((item, index) => (
        <div className={s.pageInner}>
            {item.id !== 'hero' && (
                <div className={s.pageBrand}>
                    <img src={tsugieLogo} alt='Tsugie logo' className={s.brandLogo}/>
                    <div className={s.brandText}>
                        <p className={s.brandName}>{item.brandName || 'Tsugie'}</p>
                        {!!item.brandKana && <p className={s.brandKana}>{item.brandKana}</p>}
                    </div>
                </div>
            )}
            <div className={s.pageHead}>
                <span className={s.kicker}>{item.kicker}</span>
                <span className={s.pageNo}>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className={s.titleRow}>
                <h2 className={s.pageTitle}>{item.title}</h2>
            </div>
            <p className={s.pageLead}>{item.lead}</p>
            {item.id === 'hero' && (
                <div className={`${s.pageBrand} ${s.heroMidBrand}`}>
                    <img src={tsugieLogo} alt='Tsugie logo' className={s.brandLogo}/>
                    <div className={s.brandText}>
                        <p className={s.brandName}>{item.brandName || '「つぎへ」'}</p>
                        {!!item.brandKana && <p className={s.brandKana}>{item.brandKana}</p>}
                    </div>
                </div>
            )}

            <div className={s.lineStream}>
                {item.lines.map((line) => (
                    <p key={item.id + line} className={s.lineItem}>{line}</p>
                ))}
            </div>

            {item.ending && <p className={s.ending}>{item.ending}</p>}
        </div>
    ), []);

    useEffect(() => {
        if (!isMobileViewport) {
            setSwipingClass(false);
            setSwipeOffset(0);
        }
    }, [isMobileViewport, setSwipeOffset, setSwipingClass]);

    const activeSplash = isMobileViewport ? splashTimeline[0] : splashTimeline[activePage];

    return (
        <ReactDocumentTitle title={globalStore.webSiteTitle + ' - Tsugie Idea'}>
            <div className={s.page} ref={rootRef}>
                <header className={s.topLine}>
                    <a href='/' className={s.topLink}>R0 Website</a>
                </header>

                <div className={s.layout}>
                    <aside className={s.leftPanel}>
                        <div className={s.leftImageWrap}>
                            <img
                                src={activeSplash}
                                alt='Tsugie 启动页'
                                className={s.leftImageBg}
                            />
                            <div className={s.leftGlass}/>
                            <div className={s.leftImageFrame}>
                                <img
                                    src={activeSplash}
                                    alt='Tsugie 启动页'
                                    className={s.leftImageFront}
                                />
                            </div>
                        </div>
                    </aside>

                    <main className={s.rightPanel}>
                        {isMobileViewport ? (
                            <div className={s.mobileStage}>
                                {sections.map((item, index) => {
                                    const offset = index - activePage;
                                    if (Math.abs(offset) > 1) {
                                        return null;
                                    }

                                    let relationClass = s.mobileCardCurrent;
                                    if (offset === -1) {
                                        relationClass = s.mobileCardPrev;
                                    } else if (offset === 1) {
                                        relationClass = s.mobileCardNext;
                                    }

                                    return (
                                        <article key={`mobile-${item.id}`} className={`${s.mobileCard} ${relationClass}`}>
                                            {renderPageInner(item, index)}
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={s.stage}>
                                {sections.map((item, index) => (
                                    <article key={item.id} className={`${s.contentPage} ${pageClassName(index)}`}>
                                        <div className={s.pageAura}/>
                                        {renderPageInner(item, index)}
                                    </article>
                                ))}
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </ReactDocumentTitle>
    );
});

export default TsugieIdea;
