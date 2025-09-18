import React, { useState, useEffect } from 'react';
import styles from './SimpleWelcomeModule.module.less';

// 预设的展示图片数据 - 模拟图集
const DEFAULT_IMAGES = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
        title: '静物之美',
        description: '发现日常物品的诗意瞬间'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        title: '光影交響',
        description: '捕捉光与影的和谐舞蹈'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        title: '自然之美',
        description: '探索大自然的宁静力量'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
        title: '城市印象',
        description: '记录都市生活的诗意瞬间'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=600&fit=crop',
        title: '时光印记',
        description: '时间在影像中留下的痕迹'
    }
];

const SimpleWelcomeModule = ({ onGetStarted }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // 随机选择初始图片
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
        setCurrentImageIndex(randomIndex);
    }, []);

    // 自动切换图片
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) =>
                    (prevIndex + 1) % DEFAULT_IMAGES.length
                );
                setIsTransitioning(false);
            }, 500); // 过渡动画时间
        }, 4000); // 每4秒切换一次

        return () => clearInterval(interval);
    }, []);

    const currentImage = DEFAULT_IMAGES[currentImageIndex];

    return (
        <div className={styles.welcomeContainer}>
            {/* 背景图片轮播 */}
            <div className={styles.backgroundImageWrapper}>
                <img
                    src={currentImage.src}
                    alt={currentImage.title}
                    className={`${styles.backgroundImage} ${isTransitioning ? styles.transitioning : ''}`}
                />
                <div className={styles.imageOverlay}></div>
            </div>

            {/* 日系文字介绍层 */}
            <div className={styles.textOverlay}>
                <div className={styles.mainTitleContainer}>
                    <h1 className={styles.mainTitle}>
                        夢幻結界
                        <span className={styles.titleSub}>Somnium Nexus</span>
                    </h1>
                </div>

                <div className={styles.descriptionContainer}>
                    <p className={styles.description}>
                        这是一个视觉图集项目
                        <br />
                        展示摄影作品的静谧之美
                    </p>
                    <p className={styles.subDescription}>
                        通过左侧导航选择项目开始探索
                    </p>
                </div>

                <div className={styles.currentImageInfo}>
                    <h3 className={styles.imageTitle}>{currentImage.title}</h3>
                    <p className={styles.imageDesc}>{currentImage.description}</p>
                </div>

                <button className={styles.exploreButton} onClick={onGetStarted}>
                    探索作品
                </button>
            </div>

            {/* 图片指示器 */}
            <div className={styles.imageIndicators}>
                {DEFAULT_IMAGES.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimpleWelcomeModule;