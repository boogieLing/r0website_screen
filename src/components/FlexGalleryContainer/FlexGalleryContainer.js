import React, { useState, useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GalleryItem from '@/components/GalleryItem/GalleryItem';
import flexGalleryStore from '@/stores/flexGalleryStore';
import styles from './FlexGalleryContainer.module.less';

/**
 * FlexGalleryContainer - 简易瀑布流布局容器（保留 flex 名称以兼容现有逻辑）
 * 等宽多列排布，图片高度依据纵横比自适应
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
    const layoutCacheRef = useRef(new Map()); // 记录每个分类下的列分配，避免追加时重排

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
    const [containerWidth, setContainerWidth] = useState(0); // 记录容器宽度，用于估算列高
    const [columnItems, setColumnItems] = useState([]); // 分列后的数据，避免浏览器自动平衡导致重排

    // 计算最佳列数 - 基于容器宽度的精确计算，严格1-5列
    const calculateOptimalColumns = useCallback(() => {
        const measuredWidth = containerRef.current?.clientWidth || window.innerWidth;
        setContainerWidth(measuredWidth);

        if (columns !== 'auto') {
            // 确保手动指定的列数也在1-5范围内
            return Math.max(1, Math.min(5, columns));
        }

        // 基于容器宽度的精确计算，考虑实际item尺寸需求
        const offsetWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const containerPadding = 32; // 16px padding on each side
        const availableWidth = offsetWidth - containerPadding;

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

    // 获取图片唯一键，用于列分配缓存
    const getImageKey = useCallback((image, index) => {
        if (!image) return `unknown-${index}`;
        return image.id || image.remoteId || image.src || image.thumbSrc || `flex-${index}`;
    }, []);

    // 初始化flex布局数据 - 传入当前列数
    useEffect(() => {
        if (images.length > 0) {
            flexGalleryStore.initializeItems(categoryId, images, { height: standardSize.height }, currentColumns);
        }
    }, [images, categoryId, currentColumns, standardSize.height]); // 列数或图片变化时重新初始化

    // 当前分类的项目数据
    const items = flexGalleryStore.getItemsByCategory(categoryId);

    // 根据列数与容器宽度，计算每个图片所属的列，避免浏览器列平衡导致已有布局被打乱
    useEffect(() => {
        const layoutKey = categoryId || 'flex';

        if (!items || items.length === 0) {
            setColumnItems(Array.from({ length: safeColumns }, () => []));
            layoutCacheRef.current.delete(layoutKey);
            return;
        }

        const cache = layoutCacheRef.current.get(layoutKey) || { assignments: new Map(), columns: safeColumns };
        // 列数变化时清空分配，重新计算
        if (cache.columns !== safeColumns) {
            cache.assignments = new Map();
            cache.columns = safeColumns;
        }

        const assignments = cache.assignments;
        const validKeys = new Set();
        const columnsData = Array.from({ length: safeColumns }, () => []);
        const columnHeights = Array.from({ length: safeColumns }, () => 0);

        const availableWidth = (containerRef.current?.clientWidth || containerWidth || window.innerWidth) - gap * (safeColumns - 1);
        const columnWidth = Math.max(0, availableWidth) / safeColumns || 0;

        const pickShortestColumn = () => {
            let minIndex = 0;
            for (let i = 1; i < columnHeights.length; i += 1) {
                if (columnHeights[i] < columnHeights[minIndex]) {
                    minIndex = i;
                }
            }
            return minIndex;
        };

        items.forEach((item, index) => {
            const key = getImageKey(item.originalImage, index);
            validKeys.add(key);

            const ratio = Number(item.aspectRatio) > 0
                ? Number(item.aspectRatio)
                : (() => {
                    const rawW = Number(item.width);
                    const rawH = Number(item.height);
                    if (Number.isFinite(rawW) && Number.isFinite(rawH) && rawW > 0 && rawH > 0) {
                        return rawW / rawH;
                    }
                    return 4 / 3;
                })();

            const estimatedHeight = ratio > 0 && columnWidth > 0 ? columnWidth / ratio : standardSize.height;

            let columnIndex = assignments.get(key);
            if (columnIndex === undefined) {
                columnIndex = pickShortestColumn();
                assignments.set(key, columnIndex);
            }

            columnsData[columnIndex].push(item);
            columnHeights[columnIndex] += estimatedHeight + gap;
        });

        // 清理已不存在的图片分配，防止缓存膨胀
        assignments.forEach((_, key) => {
            if (!validKeys.has(key)) {
                assignments.delete(key);
            }
        });

        layoutCacheRef.current.set(layoutKey, cache);
        setColumnItems(columnsData);
    }, [categoryId, containerWidth, gap, getImageKey, images, items, safeColumns, standardSize.height]);

    // 更新项目（flex布局下只允许调整大小，简化逻辑）
    const updateItem = useCallback((itemId, updates) => {
        // flex布局下，只允许调整大小，位置由flex容器自动处理
        const { width, height } = updates;
        if (width !== undefined || height !== undefined) {
            // 直接应用更新，flex容器会处理布局
            flexGalleryStore.updateItem(categoryId, itemId, updates);
        }
    }, [categoryId]);

    const columnsToRender = columnItems.length === safeColumns
        ? columnItems
        : Array.from({ length: safeColumns }, () => []);

    return (
        <div className={`${styles.flexGalleryContainer} ${className}`} ref={containerRef}>
            <div
                className={styles.flexContainer}
                style={{
                    '--columns': safeColumns,
                    '--flex-gap': `${gap}px`
                }}
                data-columns={safeColumns}
                title={`当前列数: ${safeColumns}`}
            >
                <div className={styles.columns} style={{ gap: `${gap}px` }}>
                    {columnsToRender.map((column, columnIndex) => (
                        <div
                            key={`flex-column-${columnIndex}`}
                            className={styles.column}
                            style={{ gap: `${gap}px` }}
                            data-column-index={columnIndex}
                        >
                            {column.map((item) => (
                                <GalleryItem
                                    key={item.id}
                                    item={item}
                                    editMode={flexGalleryStore.editMode}
                                    onUpdate={updateItem}
                                    onClick={onImageClick}
                                    galleryRef={containerRef}
                                    allItems={items} // 提供所有items给GalleryItem
                                    flexMode={true} // 启用flex模式，使用相对定位
                                    className={styles.masonryItem}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default FlexGalleryContainer;
