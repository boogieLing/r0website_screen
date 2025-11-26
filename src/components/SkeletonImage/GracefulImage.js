import React from 'react';
import SkeletonImage from './SkeletonImage';
import ErrorPlaceholder from './ErrorPlaceholder';
import { useImageLoader } from '@/hooks/useImageLoader';
import styles from './GracefulImage.module.less';

/**
 * 优雅图片组件
 * 自动处理加载状态、错误状态和骨架显示
 *
 * @param {Object} props
 * @param {string} props.src - 图片源地址
 * @param {string} props.alt - 替代文本
 * @param {string} props.className - 自定义样式类
 * @param {Object} props.style - 自定义样式
 * @param {string} props.aspectRatio - 宽高比
 * @param {boolean} props.rounded - 是否圆角
 * @param {boolean} props.enabled - 是否启用懒加载
 * @param {number} props.skeletonDelay - 骨架显示延迟
 * @param {Function} props.onLoad - 加载完成回调
 * @param {Function} props.onError - 加载错误回调
 * @param {string} props.skeletonSize - 骨架尺寸 (small|medium|large)
 * @param {boolean} props.showRetry - 是否显示重试按钮
 * @param {string} props.errorMessage - 错误提示信息
 */
const GracefulImage = ({
    src,
    alt = '',
    className = '',
    style = {},
    aspectRatio = '4:3',
    rounded = false,
    enabled = true,
    skeletonDelay = 300,
    onLoad,
    onError,
    skeletonSize = 'medium',
    showRetry = true,
    errorMessage = 'Image not available',
    objectFit = 'contain'
}) => {
    const {
        isLoading,
        isError,
        isSkeletonVisible,
        imageSrc,
        retry
    } = useImageLoader(src, { enabled, delay: skeletonDelay });

    const handleImageLoad = () => {
        if (onLoad) onLoad();
    };

    const handleImageError = () => {
        if (onError) onError();
    };

    const handleRetry = () => {
        retry();
    };

    const containerClasses = [
        styles.gracefulImageContainer,
        styles[`size-${skeletonSize}`],
        className
    ].filter(Boolean).join(' ');

    const imageStyle = {
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.4s ease',
        objectFit
    };

    return (
        <div className={containerClasses} style={style}>
            {/* 骨架占位符 */}
            {isSkeletonVisible && (
                <div className={styles.skeletonWrapper}>
                    <SkeletonImage
                        aspectRatio={aspectRatio}
                        rounded={rounded}
                        animated={true}
                    />
                </div>
            )}

            {/* 错误占位符 */}
            {isError && (
                <div className={styles.errorWrapper}>
                    <ErrorPlaceholder
                        aspectRatio={aspectRatio}
                        onRetry={showRetry ? handleRetry : undefined}
                        message={errorMessage}
                    />
                </div>
            )}

            {/* 实际图片 */}
            {!isError && imageSrc && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={styles.actualImage}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                    style={imageStyle}
                />
            )}

            {/* 加载状态指示器 */}
            {isLoading && !isSkeletonVisible && (
                <div className={styles.loadingIndicator}>
                    <div className={styles.loadingSpinner} />
                </div>
            )}
        </div>
    );
};

export default GracefulImage;
