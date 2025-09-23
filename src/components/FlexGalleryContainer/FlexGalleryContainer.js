import React, { useState, useRef, useCallback, useEffect } from 'react';
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

    // 计算最佳列数 - 基于容器宽度的精确计算，严格1-5列
    const calculateOptimalColumns = useCallback(() => {
        if (columns !== 'auto') {
            // 确保手动指定的列数也在1-5范围内
            return Math.max(1, Math.min(5, columns));
        }

        // 基于容器宽度的精确计算，考虑实际item尺寸需求
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const containerPadding = 32; // 16px padding on each side
        const availableWidth = containerWidth - containerPadding;

        // 定义标准item尺寸（基于常见图片比例和可读性）
        const minItemSizes = {
            1: 300, // 1列时最小300px宽度
            2: 220, // 2列时最小220px宽度
            3: 180, // 3列时最小180px宽度
            4: 150, // 4列时最小150px宽度
            5: 120  // 5列时最小120px宽度
        };

        // 从最多列数开始测试，找到最适合的列数
        for (let cols = 5; cols >= 1; cols--) {
            const requiredWidth = minItemSizes[cols] * cols + gap * (cols - 1);
            if (availableWidth >= requiredWidth) {
                return cols;
            }
        }

        return 1; // 默认1列
    }, [columns, gap]);

    // 监听窗口大小变化，动态调整列数
    useEffect(() => {
        if (columns === 'auto') {
            const handleResize = () => {
                const newColumns = calculateOptimalColumns();
                console.log(`窗口大小变化: ${containerRef.current?.offsetWidth || window.innerWidth}px -> ${newColumns}列`);
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

    // 简化列数获取 - 直接信任calculateOptimalColumns的结果
    const safeColumns = Math.max(1, Math.min(5, currentColumns));

    // 调试信息
    useEffect(() => {
        console.log(`当前列数设置: ${safeColumns}, data-columns: ${columns}, currentColumns: ${currentColumns}`);
    }, [safeColumns, columns, currentColumns]);

    // 初始化flex布局数据 - 传入当前列数
    useEffect(() => {
        if (images.length > 0) {
            flexGalleryStore.initializeItems(categoryId, images, { height: standardSize.height }, currentColumns);
        }
    }, [images.length, categoryId, currentColumns]); // 列数变化时重新初始化

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
                title={`当前列数: ${safeColumns}`}
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
        </div>
    );
});

export default FlexGalleryContainer;