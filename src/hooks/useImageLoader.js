import { useState, useEffect } from 'react';

/**
 * 图片加载Hook
 * 处理图片加载状态、错误状态和骨架显示
 *
 * @param {string} src - 图片源地址
 * @param {Object} options - 配置选项
 * @param {boolean} options.enabled - 是否启用加载（用于懒加载）
 * @param {number} options.delay - 骨架显示最小延迟时间（ms）
 * @returns {Object} 加载状态和相关处理方法
 */
export const useImageLoader = (src, options = {}) => {
    const { enabled = true, delay = 300 } = options;

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        if (!src || !enabled) {
            setIsLoading(false);
            setIsSkeletonVisible(false);
            return;
        }

        setIsLoading(true);
        setIsError(false);
        setIsSkeletonVisible(true);

        const skeletonTimer = setTimeout(() => {
            if (isLoading) {
                setIsSkeletonVisible(true);
            }
        }, delay);

        const img = new Image();

        img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
            clearTimeout(skeletonTimer);
            setTimeout(() => setIsSkeletonVisible(false), 150);
        };

        img.onerror = () => {
            setIsError(true);
            setIsLoading(false);
            clearTimeout(skeletonTimer);
            setIsSkeletonVisible(false);
        };

        img.src = src;

        return () => {
            clearTimeout(skeletonTimer);
            img.onload = null;
            img.onerror = null;
        };
    }, [src, enabled, delay]);

    const retry = () => {
        setIsError(false);
        setIsLoading(true);
        setIsSkeletonVisible(true);

        const img = new Image();
        img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
            setIsSkeletonVisible(false);
        };
        img.onerror = () => {
            setIsError(true);
            setIsLoading(false);
            setIsSkeletonVisible(false);
        };
        img.src = src;
    };

    return {
        isLoading,
        isError,
        isSkeletonVisible,
        imageSrc,
        retry
    };
};

/**
 * 批量图片预加载Hook
 *
 * @param {string[]} srcList - 图片源地址数组
 * @returns {Object} 批量加载状态和进度
 */
export const useBatchImageLoader = (srcList = []) => {
    const [loadedCount, setLoadedCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [isAllLoaded, setIsAllLoaded] = useState(false);

    useEffect(() => {
        if (!srcList || srcList.length === 0) {
            setIsAllLoaded(true);
            return;
        }

        setLoadedCount(0);
        setErrorCount(0);
        setIsAllLoaded(false);

        let loaded = 0;
        let errors = 0;
        const total = srcList.length;

        srcList.forEach(src => {
            const img = new Image();

            img.onload = () => {
                loaded++;
                setLoadedCount(loaded);
                if (loaded + errors === total) {
                    setIsAllLoaded(true);
                }
            };

            img.onerror = () => {
                errors++;
                setErrorCount(errors);
                if (loaded + errors === total) {
                    setIsAllLoaded(true);
                }
            };

            img.src = src;
        });
    }, [srcList]);

    const progress = srcList.length > 0 ? (loadedCount / srcList.length) * 100 : 100;

    return {
        loadedCount,
        errorCount,
        totalCount: srcList.length,
        progress,
        isAllLoaded
    };
};