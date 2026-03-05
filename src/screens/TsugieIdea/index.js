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
import {PROMO_CODES} from '@/static/data/promocodes';

const languageOptions = [
    {code: 'ja', label: '日本語'},
    {code: 'zh', label: '中文'},
    {code: 'en', label: 'English'}
];

const TSUGIE_PROMO_STATE_API = '/api/tsugie/promo/state';
const TSUGIE_PROMO_CLAIM_API = '/api/tsugie/promo/claim';

const promoCopy = {
    zh: {
        title: '限定促销码',
        placeholder: '点击按钮领取',
        claimButton: '你好，我吃一下',
        exhausted: '促销码已经发完了',
        unavailable: '没有可领取的促销码',
        ipClaimedPrefix: '该IP已领取：',
        serverUnavailable: '促销服务暂时不可用',
        copiedPrefix: '已复制 ',
        copyFailed: '复制失败，请手动复制',
    },
    en: {
        title: 'Promo Codes',
        placeholder: 'Tap the button to claim',
        claimButton: 'Claim',
        exhausted: 'All promo codes are gone',
        unavailable: 'No code available now',
        ipClaimedPrefix: 'This IP already claimed: ',
        serverUnavailable: 'Promo service is unavailable now',
        copiedPrefix: 'Copied ',
        copyFailed: 'Copy failed, please copy manually',
    },
    ja: {
        title: 'プロモコード',
        placeholder: 'ボタンを押して受け取る',
        claimButton: '受け取る',
        exhausted: 'プロモコードは配布完了です',
        unavailable: '受け取れるコードがありません',
        ipClaimedPrefix: 'このIPは受取済み: ',
        serverUnavailable: 'プロモ配布サービスは現在利用できません',
        copiedPrefix: 'コピー完了 ',
        copyFailed: 'コピー失敗、手動でコピーしてください',
    }
};

const isBrowser = typeof window !== 'undefined';

const readResponseJsonSafe = async (response) => {
    try {
        return await response.json();
    } catch (error) {
        return {};
    }
};

const normalizePromoState = (raw) => {
    const total = Number.isFinite(raw?.total) ? Math.max(0, Math.floor(raw.total)) : PROMO_CODES.length;
    const remaining = Number.isFinite(raw?.remaining)
        ? Math.max(0, Math.min(total, Math.floor(raw.remaining)))
        : total;
    const code = typeof raw?.code === 'string' ? raw.code : '';
    return {total, remaining, code};
};

const fetchPromoStateFromServer = async () => {
    if (!isBrowser) {
        return normalizePromoState({});
    }
    const response = await fetch(TSUGIE_PROMO_STATE_API, {cache: 'no-store'});
    const data = await readResponseJsonSafe(response);
    if (!response.ok) {
        throw new Error('promo-state-request-failed');
    }
    return normalizePromoState(data);
};

const copyTextToClipboard = async (text) => {
    if (!isBrowser) {
        return;
    }
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
};

const detectInitialLanguage = () => {
    if (typeof navigator === 'undefined') {
        return 'en';
    }
    const raw = (navigator.language || '').toLowerCase();
    if (raw.startsWith('ja')) {
        return 'ja';
    }
    if (raw.startsWith('zh')) {
        return 'zh';
    }
    return 'en';
};

const ideaCopy = {
    zh: {
        documentTitle: 'Tsugie Idea',
        topLinkLabel: 'R0 Website',
        splashAlt: 'Tsugie 启动页',
        sections: [
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
                lines: [
                    'Tsugie 起于一个很小的问题：此刻，往哪里去。',
                    '操作被削到很薄，决定便有了更轻的重量。',
                    '首屏先把推荐放到眼前，时间留给脚步本身。',
                    '情绪先行，计划随后；顺序改变，体验也改变。',
                    '想去、去过、还想再去，被安静写进同一条轨迹。',
                    '每一次轻触，都应当换来真实的下一步。',
                ],
            },
            {
                id: 'capability',
                kicker: '体验',
                title: '让“想去”这件事，顺势发生。',
                lead: '信息被折成最短路径，页面把空间让给行动。',
                lines: [
                    '打开那一秒，地图先亮起来，quick card 轻轻递上今夜的方向。',
                    '时间、位置与城市热度在后台汇流，前台只留下一个可去的答案。',
                    '周边、收藏、打卡排成一条顺滑的线，手指向前，心也向前。',
                    '日历把此刻拉长成之后，让临时起意有了温柔的延续。',
                    '导航键始终近在眼前，犹豫会在按下之前悄悄变薄。',
                    '每次回到 Tsugie，推荐都会更懂当天的节奏与心情。',
                ],
            },
            {
                id: 'tech',
                kicker: '引擎',
                title: '复杂沉入底层，轻盈留在指尖。',
                lead: '地图、推荐与渲染在幕后并行，前台只保留可行动的方向。',
                lines: [
                    '地图引擎在看不见的地方重写附近语义，画面始终轻快。',
                    '推荐并行衡量距离、时间窗、热度与惊喜值，像在水下对齐刻度。',
                    '候选会向“正在发生”与“现在可达”缓缓倾斜。',
                    '卡片分阶段抵达，先把方向交出，再把细节补齐。',
                    '长会话里，重资源会被自动回收，流畅感被稳稳守住。',
                    '即使是高密度城市，滑动与缩放仍保持呼吸般的节奏。',
                    '技术退到幕后，行动停在前景。',
                ],
            },
            {
                id: 'naming',
                kicker: '词语',
                title: '名字很短，余韵很长。',
                lead: '状态被写成词语，也被写成心情。',
                lines: [
                    'つぎへ，把「一緒に」留在空白里，像一句没说完的话。',
                    'いつか，给“已收藏、未抵达”的未来留一个温柔入口。',
                    'かつて，为“已经去过”写下带余温的回声。',
                    '词语很短，方向却很长。',
                    '命名在分类之外，也在悄悄塑造旅途的情绪。',
                ],
            },
            {
                id: 'future',
                kicker: '之后',
                title: '把今天的出发，留给明天回望。',
                lead: '照片、图章与线下连接，会让轨迹慢慢长出温度。',
                lines: [
                    '收藏会长出照片存档，记忆可导出为拍立得质感。',
                    '图章落在影像上，抵达有了可分享的证据。',
                    '线下相遇可触发互相打卡，让偶然被看见。',
                    '推荐会继续学习季节、节日与城市的脉搏。',
                    '一次次出发，终会沉淀成个人的移动年鉴。',
                ],
                ending: 'Tsugie 点亮下一站，\n也收藏每一次抵达后的余光。',
            },
        ]
    },
    en: {
        documentTitle: 'Tsugie Idea',
        topLinkLabel: 'R0 Website',
        splashAlt: 'Tsugie splash screen',
        sections: [
            {
                id: 'hero',
                kicker: 'Tsugie',
                brandName: 'Tsugie',
                brandKana: '',
                title: 'Again, and once more.',
                lead: 'We keep moving toward\nthe place where heartbeat feels real.',
                lines: [
                    'Open it, and you instantly know.',
                    'Three seconds are enough to depart.',
                    'Again, to the night when fireworks break the sky.',
                    'Again, to food stalls where smiles overflow.',
                ],
            },
            {
                id: 'origin',
                kicker: 'Origin',
                title: 'Catch the impulse, then hold the plan.',
                lead: 'Tsugie is built so every launch starts with one clear destination.',
                lines: [
                    'Tsugie began with one tiny question: where should I go now?',
                    'The flow is shaved down, so decisions feel lighter.',
                    'Recommendations come first on the first screen. Time belongs to your steps.',
                    'Emotion first, planning next. Change the order, change the experience.',
                    'Want to go, been there, want to return: all on one quiet path.',
                    'Every tap should lead to a real next move.',
                ],
            },
            {
                id: 'capability',
                kicker: 'Experience',
                title: 'Let “want to go” become action.',
                lead: 'Information is folded into the shortest path, leaving space for motion.',
                lines: [
                    'The map lights up first, and a quick card gently points to tonight’s direction.',
                    'Time, place, and city heat merge in the background; one actionable answer remains.',
                    'Nearby, favorites, and check-ins line up smoothly. Finger forward, heart forward.',
                    'The calendar stretches this moment into what comes next.',
                    'Navigation is always within reach; hesitation fades before the tap.',
                    'Each return to Tsugie feels more in tune with today’s rhythm.',
                ],
            },
            {
                id: 'tech',
                kicker: 'Engine',
                title: 'Complexity below, lightness on your fingertips.',
                lead: 'Map, ranking, and rendering run in parallel backstage. You only see where to go.',
                lines: [
                    'The map engine rewrites nearby semantics where no one sees it.',
                    'Ranking weighs distance, time windows, heat, and surprise in parallel.',
                    'Candidates lean toward “happening now” and “reachable now”.',
                    'Cards arrive in phases: direction first, detail next.',
                    'In long sessions, heavy resources are reclaimed to keep motion smooth.',
                    'Even in dense cities, drag and zoom keep breathing naturally.',
                    'Technology steps back, action stays in front.',
                ],
            },
            {
                id: 'naming',
                kicker: 'Words',
                title: 'Short names, long echoes.',
                lead: 'States are written as words, and also as moods.',
                lines: [
                    'tsugihe leaves “together” in blank space, like an unfinished sentence.',
                    'itsuka opens a gentle gate for places saved but not yet reached.',
                    'katsute keeps the warm echo of places already visited.',
                    'Words are short, but direction is long.',
                    'Naming does more than categorize; it shapes travel emotion quietly.',
                ],
            },
            {
                id: 'future',
                kicker: 'Future',
                title: 'Keep today’s departure for tomorrow’s glance back.',
                lead: 'Photos, stamps, and offline connections will warm your trail over time.',
                lines: [
                    'Favorites will grow into photo archives with instant-film texture exports.',
                    'Stamps on photos make each arrival visibly yours.',
                    'Offline encounters can trigger mutual check-ins, so chance gets seen.',
                    'Recommendations will keep learning seasons, festivals, and city pulse.',
                    'Many departures will settle into your own movement yearbook.',
                ],
                ending: 'Tsugie lights your next stop,\nand keeps the afterglow of every arrival.',
            },
        ]
    },
    ja: {
        documentTitle: 'Tsugie コンセプト',
        topLinkLabel: 'R0 Website',
        splashAlt: 'Tsugie スプラッシュ',
        sections: [
            {
                id: 'hero',
                kicker: 'Tsugie',
                brandName: '「つぎへ」',
                brandKana: '',
                title: '次も、また。',
                lead: '私たちはいつも\n鼓動が本物になる場所へ向かっていく。',
                lines: [
                    '開けば、すぐわかる。',
                    '3秒で、出発は決まる。',
                    '次も、また、花火が夜をひらく場所へ。',
                    '次も、また、笑顔がにじむ屋台へ。',
                ],
            },
            {
                id: 'origin',
                kicker: '起点',
                title: '衝動を受け止め、計画を支える。',
                lead: 'Tsugie は、開いた瞬間に行き先が見える体験を目指しています。',
                lines: [
                    'Tsugie は小さな問いから始まりました。今、どこへ行くか。',
                    '操作は薄く削り、決断は軽くする。',
                    '最初の画面でまず提案を届け、時間を足取りに返す。',
                    '感情が先、計画はあと。順序が変わると体験も変わる。',
                    '行きたい・行った・また行きたいを、同じ軌道に静かに並べる。',
                    'ひとつのタップが、次の一歩に変わるべきだ。',
                ],
            },
            {
                id: 'capability',
                kicker: '体験',
                title: '「行きたい」を、そのまま行動へ。',
                lead: '情報は最短経路に折りたたみ、画面は行動のために空ける。',
                lines: [
                    '開いた瞬間、地図が先に灯り、quick card が今夜の方向を差し出す。',
                    '時間・場所・街の熱量は裏で合流し、前面には行ける答えだけが残る。',
                    '周辺・お気に入り・チェックインが滑らかにつながり、指も心も前へ進む。',
                    'カレンダーは「いま」を「この先」へ伸ばし、思いつきをやさしく継続させる。',
                    'ナビボタンはいつも手前にあり、迷いは押す前に薄くなる。',
                    'Tsugie に戻るたび、その日のリズムをより理解する。',
                ],
            },
            {
                id: 'tech',
                kicker: 'エンジン',
                title: '複雑さは下層へ、軽さは指先へ。',
                lead: '地図・推薦・描画は舞台裏で並走し、前面には動ける方向だけを残す。',
                lines: [
                    '地図エンジンは見えない場所で近傍の意味を組み直し続ける。',
                    '推薦は距離・時間窓・熱量・驚きを並列に測り、尺度をそろえる。',
                    '候補は「いま起きている」「いま行ける」へ自然に傾く。',
                    'カードは段階的に届く。まず方向、次に細部。',
                    '長いセッションでは重い資源を自動回収し、滑らかさを守る。',
                    '高密度な都市でも、ドラッグとズームは呼吸のように保たれる。',
                    '技術は後ろへ、行動は前へ。',
                ],
            },
            {
                id: 'naming',
                kicker: 'ことば',
                title: '短い名に、長い余韻。',
                lead: '状態はことばで記され、気分として残る。',
                lines: [
                    'つぎへ は「一緒に」を余白に残し、言い切らない一文のように響く。',
                    'いつか は、保存したまま未到達の未来へやさしい入口を作る。',
                    'かつて は、訪れた場所の余熱を静かに残す。',
                    'ことばは短く、方向は長い。',
                    '命名は分類だけでなく、旅の気分をそっと形づくる。',
                ],
            },
            {
                id: 'future',
                kicker: 'これから',
                title: '今日の出発を、明日の振り返りへ。',
                lead: '写真・スタンプ・オフライン接続が、軌跡に少しずつ温度を足す。',
                lines: [
                    'お気に入りは写真アーカイブへ育ち、インスタント風に書き出せる。',
                    '写真に重なるスタンプが、到着の証拠を残す。',
                    'オフラインでの出会いは相互チェックインにつながり、偶然を見える化する。',
                    '推薦は季節・祭り・街の脈動を学び続ける。',
                    '出発の積み重ねは、やがて自分だけの移動年鑑になる。',
                ],
                ending: 'Tsugie は次の一歩を灯し、\n到着後の余光までそっと残す。',
            },
        ]
    }
};

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
    const [languageCode, setLanguageCode] = useState(detectInitialLanguage);
    const copy = useMemo(() => ideaCopy[languageCode] || ideaCopy.en, [languageCode]);
    const promoText = useMemo(() => promoCopy[languageCode] || promoCopy.en, [languageCode]);
    const sections = copy.sections;
    const [activePage, setActivePage] = useState(0);
    const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth <= 760);
    const splashTimeline = useMemo(() => buildSplashTimeline(6), []);
    const claimingPromoRef = useRef(false);
    const [promoState, setPromoState] = useState(() => normalizePromoState({}));
    const [promoTips, setPromoTips] = useState('');

    useEffect(() => {
        setActivePage((prev) => Math.max(0, Math.min(prev, sections.length - 1)));
    }, [sections.length]);

    useEffect(() => {
        setPromoTips('');
    }, [languageCode]);

    const activePromoCode = promoState.code;
    const remainingPromoCount = promoState.remaining;
    const promoTotalCount = promoState.total;

    const loadPromoState = useCallback(async () => {
        try {
            const nextState = await fetchPromoStateFromServer();
            setPromoState(nextState);
        } catch (error) {
            void error;
        }
    }, []);

    useEffect(() => {
        loadPromoState();
    }, [loadPromoState]);

    const copyPromoCode = useCallback(async () => {
        if (claimingPromoRef.current) {
            return;
        }

        claimingPromoRef.current = true;
        try {
            const response = await fetch(TSUGIE_PROMO_CLAIM_API, {
                method: 'POST',
                cache: 'no-store',
            });
            const data = await readResponseJsonSafe(response);
            const nextState = normalizePromoState(data);
            setPromoState(nextState);

            if (!response.ok) {
                if ((response.status === 409 || data?.exhausted) && nextState.remaining <= 0) {
                    setPromoTips(promoText.unavailable);
                    return;
                }
                setPromoTips(promoText.serverUnavailable);
                return;
            }

            const code = nextState.code;
            if (!code) {
                if (nextState.remaining <= 0) {
                    setPromoTips(promoText.unavailable);
                } else {
                    setPromoTips(promoText.serverUnavailable);
                }
                return;
            }

            try {
                await copyTextToClipboard(code);
                if (data?.alreadyClaimed) {
                    setPromoTips(`${promoText.ipClaimedPrefix}${code}`);
                } else {
                    setPromoTips(`${promoText.copiedPrefix}${code}`);
                }
            } catch (error) {
                setPromoTips(`${promoText.copyFailed} ${code}`);
            }
        } catch (error) {
            setPromoTips(promoText.serverUnavailable);
        } finally {
            claimingPromoRef.current = false;
        }
    }, [
        promoText.copiedPrefix,
        promoText.copyFailed,
        promoText.ipClaimedPrefix,
        promoText.serverUnavailable,
        promoText.unavailable,
    ]);

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

    useEffect(() => {
        const rootNode = rootRef.current;
        if (!rootNode) {
            return undefined;
        }

        const applyBottomInset = () => {
            const viewport = window.visualViewport;
            if (!viewport) {
                rootNode.style.setProperty('--mobile-browser-bottom-inset', '0px');
                return;
            }
            const occludedBottom = Math.max(0, window.innerHeight - (viewport.height + viewport.offsetTop));
            const safeInset = Math.min(120, Math.round(occludedBottom));
            rootNode.style.setProperty('--mobile-browser-bottom-inset', `${safeInset}px`);
        };

        applyBottomInset();
        const viewport = window.visualViewport;
        window.addEventListener('resize', applyBottomInset);
        if (viewport) {
            viewport.addEventListener('resize', applyBottomInset);
            viewport.addEventListener('scroll', applyBottomInset);
        }

        return () => {
            window.removeEventListener('resize', applyBottomInset);
            if (viewport) {
                viewport.removeEventListener('resize', applyBottomInset);
                viewport.removeEventListener('scroll', applyBottomInset);
            }
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
    }, [sections.length]);

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

    const renderPromoPanel = (extraClassName = '') => (
        <section className={`${s.promoPanel} ${extraClassName}`} aria-label={promoText.title}>
            <div className={s.promoPanelHead}>
                <p className={s.promoPanelTitle}>{promoText.title}</p>
                <p className={s.promoPanelCount}>{remainingPromoCount} / {promoTotalCount}</p>
            </div>
            <div className={s.promoPanelMain}>
                <p className={s.promoPanelCode}>{activePromoCode || promoText.placeholder}</p>
                <div className={s.promoPanelActions}>
                    <button type='button' className={s.promoPanelButton} onClick={copyPromoCode}>
                        {promoText.claimButton}
                    </button>
                </div>
            </div>
            {!!promoTips && <p className={s.promoPanelTips}>{promoTips}</p>}
        </section>
    );

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
                        <p className={s.brandName}>{item.brandName || 'Tsugie'}</p>
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
    ), [
    ]);

    useEffect(() => {
        if (!isMobileViewport) {
            setSwipingClass(false);
            setSwipeOffset(0);
        }
    }, [isMobileViewport, setSwipeOffset, setSwipingClass]);

    const activeSplash = isMobileViewport ? splashTimeline[0] : splashTimeline[activePage];

    return (
        <ReactDocumentTitle title={globalStore.webSiteTitle + ' - ' + copy.documentTitle}>
            <div className={s.page} ref={rootRef}>
                <header className={s.topLine}>
                    <div className={s.languageSwitcher} role='tablist' aria-label='Tsugie language switcher'>
                        {languageOptions.map((option) => (
                            <button
                                key={option.code}
                                type='button'
                                role='tab'
                                className={`${s.languageButton} ${languageCode === option.code ? s.languageButtonActive : ''}`}
                                onClick={() => setLanguageCode(option.code)}
                                aria-selected={languageCode === option.code}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </header>

                <div className={s.layout}>
                    <aside className={s.leftPanel}>
                        <div className={s.leftImageWrap}>
                            <img
                                src={activeSplash}
                                alt={copy.splashAlt}
                                className={s.leftImageBg}
                            />
                            <div className={s.leftGlass}/>
                            <div className={s.leftImageFrame}>
                                <img
                                    src={activeSplash}
                                    alt={copy.splashAlt}
                                    className={s.leftImageFront}
                                />
                                {!isMobileViewport && renderPromoPanel(s.promoPanelOverlay)}
                            </div>
                        </div>
                    </aside>

                    <main className={s.rightPanel}>
                        {isMobileViewport && (
                            <div className={s.mobilePromoSlot}>
                                {renderPromoPanel(s.promoPanelMobile)}
                            </div>
                        )}
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
