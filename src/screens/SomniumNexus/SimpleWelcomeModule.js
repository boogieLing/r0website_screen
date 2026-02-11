import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import somniumNexusStore from '@/stores/somniumNexusStore';
import styles from './SimpleWelcomeModule.module.less';

// 当后端接口不可用或暂无数据时的兜底图片
const FALLBACK_IMAGES = [
    {
        id: 'fallback-1',
        src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&h=900&fit=crop'
    },
    {
        id: 'fallback-2',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop'
    },
    {
        id: 'fallback-3',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=900&fit=crop'
    }
];

const randomImageUrl = () => `https://www.shyr0.com/server/api/base/picbed/image/cache/random?ts=${Date.now()}`;

const SimpleWelcomeModule = observer(({prefetchedImages = []}) => {
    const isMountedRef = useRef(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slots, setSlots] = useState(() => ([
        {src: FALLBACK_IMAGES[0].src, ready: true, key: 'slot-0'},
        {src: FALLBACK_IMAGES[1]?.src || FALLBACK_IMAGES[0].src, ready: true, key: 'slot-1'}
    ]));

    const loadSlot = useCallback((slotIndex, usePrefetch = false) => {
        if (!isMountedRef.current) return;

        // 测试环境直接使用兜底图，避免多余请求
        if (somniumNexusStore.isUsingTestData) {
            const fallbackSrc = FALLBACK_IMAGES[slotIndex % FALLBACK_IMAGES.length]?.src || FALLBACK_IMAGES[0].src;
            setSlots((prev) => {
                const next = [...prev];
                next[slotIndex] = {
                    ...next[slotIndex],
                    src: fallbackSrc,
                    ready: true,
                    key: `fallback-${slotIndex}-${Date.now()}`
                };
                return next;
            });
            return;
        }

        // 可选使用预取图作为初始缓冲
        if (usePrefetch && prefetchedImages && prefetchedImages[slotIndex]) {
            const candidate = prefetchedImages[slotIndex];
            const prefetchSrc = candidate &&
                (candidate.fullSrc || candidate.src || candidate.CosURL || candidate.ThumbURL);
            if (prefetchSrc) {
                setSlots((prev) => {
                    const next = [...prev];
                    next[slotIndex] = {
                        ...next[slotIndex],
                        src: prefetchSrc,
                        ready: true,
                        key: `prefetch-${slotIndex}-${Date.now()}`
                    };
                    return next;
                });
                return;
            }
        }

        const url = randomImageUrl();
        const loader = new Image();

        loader.onload = () => {
            if (!isMountedRef.current) return;
            setSlots((prev) => {
                const next = [...prev];
                next[slotIndex] = {
                    ...next[slotIndex],
                    src: url,
                    ready: true,
                    key: `random-${slotIndex}-${Date.now()}`
                };
                return next;
            });
        };

        loader.onerror = () => {
            if (!isMountedRef.current) return;
            const fallbackSrc = FALLBACK_IMAGES[slotIndex % FALLBACK_IMAGES.length]?.src || FALLBACK_IMAGES[0].src;
            setSlots((prev) => {
                const next = [...prev];
                next[slotIndex] = {
                    ...next[slotIndex],
                    src: fallbackSrc,
                    ready: true,
                    key: `fallback-${slotIndex}-${Date.now()}`
                };
                return next;
            });
        };

        loader.src = url;
    }, [prefetchedImages, somniumNexusStore.isUsingTestData]);

    // 初始化两张图 + 轮播定时器
    useEffect(() => {
        isMountedRef.current = true;
        loadSlot(0, true);
        loadSlot(1, true);

        const timer = setInterval(() => {
            setActiveIndex((prev) => {
                const next = prev === 0 ? 1 : 0;
                // 预加载下一个槽位（当前将要隐藏的槽位）
                loadSlot(prev);
                return next;
            });
        }, 13000);

        return () => {
            isMountedRef.current = false;
            clearInterval(timer);
        };
    }, [loadSlot]);

    const poeticLines = useMemo(() => {
        const data = somniumNexusStore.galleryCategories || {};
        const validKeys = somniumNexusStore.categories || [];
        const lines = validKeys
            .map((key) => {
                const cat = data[key] || {};
                return cat.title || cat.name || key;
            })
            .filter(Boolean);

        // 去重后仅取前若干条，保持克制
        const seen = new Set();
        const unique = [];
        lines.forEach((line) => {
            const trimmed = String(line).trim();
            if (!trimmed) return;
            const normalized = trimmed.toLowerCase();
            if (seen.has(normalized)) return;
            seen.add(normalized);
            unique.push(trimmed);
        });

        return unique.slice(0, 9);
    }, [somniumNexusStore.categories, somniumNexusStore.galleryCategories]);

    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.backgroundImageWrapper}>
                {slots.map((slot, idx) => {
                    const src = slot.src || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length].src;
                    const isActive = idx === activeIndex && slot.ready;
                    return (
                        <img
                            key={slot.key || `${idx}-${src}`}
                            src={src}
                            alt="Somnium Nexus"
                            className={`${styles.backgroundImageLayer} ${isActive ? styles.active : styles.inactive}`}
                        />
                    );
                })}
            </div>
            {poeticLines.length > 0 && (
                <div className={styles.poeticOverlay}>
                    {poeticLines.map((line, index) => (
                        <div
                            key={`${line}-${index}`}
                            className={styles.poeticLine}
                            style={{
                                animationDelay: `${index * 0.85}s`
                            }}
                        >
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default SimpleWelcomeModule;
