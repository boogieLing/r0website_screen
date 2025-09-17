import React from 'react';
import styles from './SkeletonImage.module.less';

/**
 * 优雅的图片骨架组件
 * 低饱和度渐变纹理，符合rinkokawauchi.com的极简美学
 */
const SkeletonImage = ({
    width = '100%',
    height = '100%',
    aspectRatio = '4:3',
    className = '',
    rounded = false,
    animated = true
}) => {
    const style = {
        width,
        height,
        aspectRatio: aspectRatio !== '4:3' ? aspectRatio : undefined,
    };

    const classes = [
        styles.skeletonContainer,
        animated ? styles.animated : '',
        rounded ? styles.rounded : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} style={style}>
            <div className={styles.skeletonBackground}>
                <div className={styles.gradientLayer} />
                <div className={styles.textureLayer} />
                {animated && <div className={styles.shimmerLayer} />}
            </div>
            <div className={styles.skeletonContent}>
                <div className={styles.iconPlaceholder}></div>
            </div>
        </div>
    );
};

export default SkeletonImage;