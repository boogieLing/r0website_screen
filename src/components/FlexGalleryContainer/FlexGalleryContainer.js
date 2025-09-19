import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import GalleryItem from '@/components/GalleryItem/GalleryItem';
import flexGalleryStore from '@/stores/flexGalleryStore';
import styles from './FlexGalleryContainer.module.less';

/**
 * FlexGalleryContainer - 简单的flex布局容器
 * 从左到右、从上到下均摊排列galleryItem，所有item大小一致
 */
const FlexGalleryContainer = observer(({
    images = [],
    onImageClick,
    itemSize = 'medium', // small, medium, large
    gap = 8, // 间距
    className = '',
    categoryId = 'flex',
    columns = 'auto' // auto, 1, 2, 3, 4, 5 - 响应式列数
}) => {
    const containerRef = useRef(null);

    // 标准尺寸定义
    const sizeMap = {
        small: { width: 120, height: 160 },
        medium: { width: 160, height: 200 },
        large: { width: 200, height: 250 }
    };

    const standardSize = sizeMap[itemSize] || sizeMap.medium;

    // 响应式列数计算
    const [currentColumns, setCurrentColumns] = useState(() => {
        if (columns !== 'auto') return columns;
        // 默认响应式：根据容器宽度和标准尺寸计算最佳列数
        return 3; // 初始默认值
    });

    // 计算最佳列数 - 严格限制在1-5列，使用固定宽度逻辑
    const calculateOptimalColumns = useCallback(() => {
        if (columns !== 'auto') {
            // 确保手动指定的列数也在1-5范围内
            return Math.max(1, Math.min(5, columns));
        }

        // 基于固定宽度的响应式计算
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const containerPadding = 32; // 16px padding on each side
        const availableWidth = containerWidth - containerPadding;

        // 定义固定宽度断点 - 严格限制1-5列
        if (availableWidth >= 160 * 5 + gap * 4) {
            return 5; // 足够容纳5列固定宽度
        } else if (availableWidth >= 170 * 4 + gap * 3) {
            return 4; // 足够容纳4列固定宽度
        } else if (availableWidth >= 180 * 3 + gap * 2) {
            return 3; // 足够容纳3列固定宽度
        } else if (availableWidth >= 200 * 2 + gap) {
            return 2; // 足够容纳2列固定宽度
        } else {
            return 1; // 默认1列
        }
    }, [columns, standardSize.width, gap]);

    // 监听窗口大小变化，动态调整列数
    useEffect(() => {
        if (columns === 'auto') {
            const handleResize = () => {
                const newColumns = calculateOptimalColumns();
                setCurrentColumns(newColumns);
            };

            // 初始计算
            handleResize();

            // 监听resize事件（使用防抖）
            let resizeTimeout;
            const debouncedResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(handleResize, 100);
            };

            window.addEventListener('resize', debouncedResize);
            return () => {
                window.removeEventListener('resize', debouncedResize);
                clearTimeout(resizeTimeout);
            };
        }
    }, [columns, calculateOptimalColumns]);

    // 监控currentColumns，确保不会超过5列 - 强制限制
    useEffect(() => {
        if (currentColumns > 5) {
            setCurrentColumns(5);
        }
        if (currentColumns < 1) {
            setCurrentColumns(1);
        }
    }, [currentColumns]);

    // 强制限制渲染时的列数，防止任何可能的6列情况
    const safeColumns = Math.max(1, Math.min(5, currentColumns));

    // 初始化flex布局数据 - 传入当前列数
    useEffect(() => {
        if (images.length > 0) {
            flexGalleryStore.initializeItems(categoryId, images, standardSize, currentColumns);
        }
    }, [images.length, categoryId, currentColumns]); // 列数变化时重新初始化

    // 切换编辑模式
    const toggleEditMode = useCallback(() => {
        flexGalleryStore.toggleEditMode();
    }, []);

    // 更新项目（flex布局下只允许调整大小，简化逻辑）
    const updateItem = useCallback((itemId, updates) => {
        // flex布局下，只允许调整大小，位置由flex容器自动处理
        const { width, height } = updates;
        if (width !== undefined || height !== undefined) {
            // 直接应用更新，flex容器会处理布局
            flexGalleryStore.updateItem(itemId, updates);
        }
    }, [flexGalleryStore]);

    // 获取容器内的项目
    const items = flexGalleryStore.getItemsByCategory(categoryId);

    return (
        <div className={`${styles.flexGalleryContainer} ${className}`} ref={containerRef}>
            <div
                className={styles.flexContainer}
                style={{ gap: `${gap}px` }}
                data-columns={safeColumns}
            >
                {items.map((item) => (
                    <GalleryItem
                        key={item.id}
                        item={item}
                        editMode={flexGalleryStore.editMode}
                        onUpdate={updateItem}
                        onClick={onImageClick}
                        galleryRef={containerRef}
                        allItems={items} // 提供所有items给GalleryItem
                        flexMode={true} // 启用flex模式，使用相对定位
                    />
                ))}
            </div>

            {/* 编辑模式切换按钮 - 右下角 */}
            <div
                className={styles.editToggle}
                onClick={toggleEditMode}
                title={flexGalleryStore.editMode ? '切换到展示模式' : '切换到编辑模式'}
            >
                <div className={`${styles.triangle} ${flexGalleryStore.editMode ? styles.active : ''}`} />
            </div>
        </div>
    );
});

export default FlexGalleryContainer;