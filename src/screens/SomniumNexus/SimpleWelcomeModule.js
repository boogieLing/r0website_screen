import React, {useEffect, useState} from 'react';
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

const SimpleWelcomeModule = ({prefetchedImages = []}) => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [overlayIndex, setOverlayIndex] = useState(null);
    const [isFading, setIsFading] = useState(false);

    // 从 nexus 分类（全部图片）接口加载图片
    useEffect(() => {
        let isMounted = true;

        const useImages = (list) => {
            if (!isMounted || !list || list.length === 0) return false;
            setImages(list);
            const initialIndex = Math.floor(Math.random() * list.length);
            setCurrentIndex(initialIndex);
            return true;
        };

        const loadImages = async () => {
            try {
                // 如果父组件已传入预取的图片，直接使用
                if (prefetchedImages && prefetchedImages.length > 0) {
                    const normalizedPrefetch = prefetchedImages
                        .map((img) => {
                            if (!img) return null;
                            const fullSrc =
                                img.fullSrc ||
                                img.src ||
                                img.CosURL ||
                                img.ThumbURL ||
                                '';
                            if (!fullSrc) return null;
                            return {
                                id: img.id || img.ID || fullSrc,
                                src: fullSrc
                            };
                        })
                        .filter(Boolean);

                    if (useImages(normalizedPrefetch)) {
                        return;
                    }
                }

                // 使用 SomniumNexusStore 的分类图片加载逻辑，请求 nexus 分类的图片列表
                await somniumNexusStore.loadCategoryDetail('nexus', {force: true});

                const storeImages = somniumNexusStore.getImagesByCategory('nexus') || [];

                const normalized = storeImages
                    .map((img) => {
                        if (!img) return null;
                        const fullSrc =
                            img.fullSrc ||
                            img.src ||
                            img.CosURL ||
                            img.ThumbURL ||
                            '';
                        if (!fullSrc) return null;
                        return {
                            id: img.id || img.ID || fullSrc,
                            src: fullSrc
                        };
                    })
                    .filter(Boolean);

                const finalImages =
                    normalized && normalized.length > 0
                        ? normalized
                        : FALLBACK_IMAGES;

                useImages(finalImages);
            } catch (error) {
                console.error('加载 nexus 图片失败，将使用兜底图片:', error);
                useImages(FALLBACK_IMAGES);
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, [prefetchedImages]);

    // 随机播放：定时准备下一张图片（仅选择索引，不直接切换）
    useEffect(() => {
        if (!images || images.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            if (!images || images.length <= 1) {
                return;
            }

            setOverlayIndex((prevOverlay) => {
                let next = Math.floor(Math.random() * images.length);

                // 避免和当前或者上一次预备的相同
                if (next === currentIndex || next === prevOverlay) {
                    next = (next + 1) % images.length;
                }

                return next;
            });
        }, 12000); // 每 12 秒切换一次，避免变动过快

        return () => {
            clearInterval(interval);
        };
    }, [images, currentIndex]);

    // 预加载 overlayIndex 对应图片，并在加载完成后触发淡入淡出动画
    useEffect(() => {
        if (overlayIndex === null || !images || !images[overlayIndex]) {
            return;
        }

        let canceled = false;
        const target = images[overlayIndex];
        const preloadImg = new Image();
        preloadImg.src = target.src;

        const startFade = () => {
            if (canceled) return;

            // 确保从透明开始
            setIsFading(false);

            // 下一帧再开启淡入，确保浏览器能捕捉到 opacity 的变更
            requestAnimationFrame(() => {
                if (canceled) return;
                setIsFading(true);

                // 等动画结束后，切换当前图片，并移除覆盖层
                setTimeout(() => {
                    if (canceled) return;
                    setCurrentIndex(overlayIndex);
                    setOverlayIndex(null);
                    setIsFading(false);
                }, 800);
            });
        };

        if (preloadImg.complete) {
            startFade();
        } else {
            preloadImg.onload = startFade;
            preloadImg.onerror = startFade;
        }

        return () => {
            canceled = true;
            preloadImg.onload = null;
            preloadImg.onerror = null;
        };
    }, [overlayIndex, images]);

    const currentImage =
        images && images.length > 0 ? images[currentIndex] : null;
    const overlayImage =
        overlayIndex !== null && images && images.length > 0
            ? images[overlayIndex]
            : null;

    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.backgroundImageWrapper}>
                {currentImage && (
                    <img
                        key={`current-${currentImage.id}`}
                        src={currentImage.src}
                        alt="Somnium Nexus"
                        className={`${styles.backgroundImageBase} ${
                            isFading ? styles.backgroundImageBaseFadingOut : ''
                        }`}
                    />
                )}
                {overlayImage && (
                    <img
                        key={`overlay-${overlayImage.id}`}
                        src={overlayImage.src}
                        alt="Somnium Nexus"
                        className={`${styles.backgroundImage} ${
                            isFading ? styles.backgroundImageOverlayVisible : styles.backgroundImageOverlay
                        }`}
                    />
                )}
            </div>
        </div>
    );
};

export default SimpleWelcomeModule;
