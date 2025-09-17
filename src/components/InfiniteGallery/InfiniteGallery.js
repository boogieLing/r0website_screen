import React, { useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import GracefulImage from '@/components/SkeletonImage/GracefulImage';
import styles from './InfiniteGallery.module.less';

/**
 * 无限滚动图集组件
 * 从左到右、从上到下无限长度展示
 */
const InfiniteGallery = observer(({
    images = [],
    onImageClick,
    columns = 3,
    gap = 60
}) => {
    const [displayImages, setDisplayImages] = useState([]);
    const [loadedCount, setLoadedCount] = useState(12); // 初始加载数量
    const [isLoading, setIsLoading] = useState(false);
    const galleryRef = useRef(null);
    const observerRef = useRef(null);

    // 处理图片网格布局
    const getGridItems = useCallback(() => {
        if (!displayImages.length) return [];

        const items = [];
        const rows = Math.ceil(displayImages.length / columns);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const index = row * columns + col;
                if (index < displayImages.length) {
                    items.push({
                        image: displayImages[index],
                        row,
                        col,
                        index
                    });
                }
            }
        }
        return items;
    }, [displayImages, columns]);

    // 加载更多图片
    const loadMoreImages = useCallback(() => {
        if (isLoading || displayImages.length >= images.length) return;

        setIsLoading(true);
        setTimeout(() => {
            const newCount = Math.min(loadedCount + 6, images.length);
            setDisplayImages(images.slice(0, newCount));
            setLoadedCount(newCount);
            setIsLoading(false);
        }, 300);
    }, [isLoading, displayImages.length, images.length, loadedCount, images]);

    // 设置Intersection Observer
    useEffect(() => {
        if (!galleryRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.target.dataset.loadmore) {
                        loadMoreImages();
                    }
                });
            },
            {
                root: galleryRef.current,
                rootMargin: '100px 0px',
                threshold: 0.1
            }
        );

        const loadMoreElement = galleryRef.current.querySelector('[data-loadmore]');
        if (loadMoreElement) {
            observerRef.current.observe(loadMoreElement);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMoreImages]);

    // 初始化图片数据
    useEffect(() => {
        setDisplayImages(images.slice(0, Math.min(12, images.length)));
        setLoadedCount(Math.min(12, images.length));
    }, [images]);

    const gridItems = getGridItems();
    const hasMore = displayImages.length < images.length;

    return (
        <div
            className={styles.galleryContainer}
            ref={galleryRef}
            style={{ gap: `${gap}px` }}
        >
            <div className={styles.galleryFlex} style={{ gap: `${gap}px` }}>
                {gridItems.map(({ image, index }) => (
                    <div
                        key={image.id}
                        className={styles.galleryItem}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            flex: `0 0 ${100 / columns}%`,
                            maxWidth: `${100 / columns}%`,
                            '--aspect-ratio': '4:3'
                        }}
                        onClick={() => onImageClick?.(image)}
                    >
                        <div className={styles.imageWrapper}>
                            <GracefulImage
                                src={image.src}
                                alt={image.title}
                                className={styles.galleryImage}
                                aspectRatio="4:3"
                                skeletonSize="medium"
                                showRetry={true}
                                errorMessage="图片加载失败"
                            />
                            <div className={styles.imageOverlay}>
                                <h3 className={styles.imageTitle}>{image.title}</h3>
                                <p className={styles.imageYear}>{image.year}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className={styles.loadMoreTrigger} data-loadmore="true">
                    {isLoading ? (
                        <div className={styles.loadingSpinner} />
                    ) : (
                        <div className={styles.loadMoreHint}>
                            <span className={styles.hintText}>继续浏览</span>
                            <span className={styles.hintSubtext}>Scroll for more</span>
                        </div>
                    )}
                </div>
            )}

            {displayImages.length === 0 && (
                <div className={styles.emptyGallery}>
                    <div className={styles.emptyPlaceholder}>
                        <div className={styles.emptyIcon} />
                        <p className={styles.emptyText}>暂无作品</p>
                        <p className={styles.emptySubtext}>No works available</p>
                    </div>
                </div>
            )}
        </div>
    );
});

export default InfiniteGallery;