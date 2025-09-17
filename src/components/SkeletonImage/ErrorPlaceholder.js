import React from 'react';
import styles from './ErrorPlaceholder.module.less';

/**
 * 错误占位符组件
 * 当图片加载失败时显示的优雅占位符
 */
const ErrorPlaceholder = ({
    width = '100%',
    height = '100%',
    aspectRatio = '4:3',
    className = '',
    onRetry,
    message = 'Image not available'
}) => {
    const style = {
        width,
        height,
        aspectRatio: aspectRatio !== '4:3' ? aspectRatio : undefined,
    };

    const classes = [
        styles.errorContainer,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} style={style}>
            <div className={styles.errorBackground}>
                <div className={styles.errorTexture} />
            </div>
            <div className={styles.errorContent}>
                <div className={styles.errorIcon}>
                    <div className={styles.iconLine} />
                    <div className={styles.iconLine} />
                </div>
                <p className={styles.errorMessage}>{message}</p>
                {onRetry && (
                    <button className={styles.retryButton} onClick={onRetry}>
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorPlaceholder;