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

    // 标准尺寸定义 - 仅用于高度，宽度由CSS flex布局控制
    const sizeMap = {
        small: { width: 'auto', height: 160 },  // width: auto 让CSS控制宽度
        medium: { width: 'auto', height: 200 },
        large: { width: 'auto', height: 250 }
    };

    const standardSize = sizeMap[itemSize] || sizeMap.medium;

    // 响应式列数计算
    const [currentColumns, setCurrentColumns] = useState(() => {
        if (columns !== 'auto') return columns;
        // 默认响应式：根据容器宽度和标准尺寸计算最佳列数
        return 3; // 初始默认值
    });

    // 计算最佳列数 - 基于容器宽度的保守计算，严格1-5列
    const calculateOptimalColumns = useCallback(() => {
        if (columns !== 'auto') {
            // 确保手动指定的列数也在1-5范围内
            return Math.max(1, Math.min(5, columns));
        }

        // 基于容器宽度的保守计算，考虑间距和padding
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const containerPadding = 32; // 16px padding on each side
        const availableWidth = containerWidth - containerPadding;

        // 保守的断点计算 - 确保不会超过5列
        // 基于百分比宽度的最小需求：5列=20%, 4列=25%, 3列=33.33%, 2列=50%, 1列=100%
        // 每个item需要的最小宽度（包含间距）
        const minItemWidth = availableWidth / 5 + gap; // 5列时每个item的平均宽度需求

        if (availableWidth >= minItemWidth * 5) {
            return 5; // 足够保守地容纳5列
        } else if (availableWidth >= minItemWidth * 4) {
            return 4; // 足够容纳4列
        } else if (availableWidth >= minItemWidth * 3) {
            return 3; // 足够容纳3列
        } else if (availableWidth >= minItemWidth * 2) {
            return 2; // 足够容纳2列
        } else {
            return 1; // 默认1列
        }
    }, [columns, gap]);

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

    // 智能列数限制 - 基于实际容器宽度的动态计算
    const getSafeColumns = useCallback(() => {
        let result = Math.max(1, Math.min(5, currentColumns));

        // 如果有容器引用，进行额外的安全检查
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerPadding = 32;
            const availableWidth = containerWidth - containerPadding;

            // 计算每列所需的最小宽度（基于百分比和间距）
            const requiredWidths = {
                1: availableWidth, // 100%
                2: availableWidth / 2 + gap, // 50% + gap
                3: availableWidth / 3 + gap, // 33.33% + gap
                4: availableWidth / 4 + gap, // 25% + gap
                5: availableWidth / 5 + gap  // 20% + gap
            };

            // 从期望的列数开始，逐步减少直到找到合适的列数
            for (let cols = result; cols >= 1; cols--) {
                if (availableWidth >= requiredWidths[cols]) {
                    result = cols;
                    break;
                }
            }
        }

        return Math.max(1, Math.min(5, result));
    }, [currentColumns, gap]);

    const safeColumns = getSafeColumns();

    // 初始化flex布局数据 - 传入当前列数
    useEffect(() => {
        if (images.length > 0) {
            flexGalleryStore.initializeItems(categoryId, images, { height: standardSize.height }, currentColumns);
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
                        className={styles[`galleryItem-${safeColumns}col`]} // 传入列数相关的CSS类名
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