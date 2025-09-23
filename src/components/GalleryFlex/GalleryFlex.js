import React, { useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GalleryItem from '../GalleryItem/GalleryItem';
import galleryStore from '@/stores/galleryStore';
import { calculateNonOverlappingPosition } from '@/utils/magneticLayout';
import styles from './GalleryFlex.module.less';

/**
 * GalleryFlex - 统一管理的大组件
 * 支持编辑和展示两种状态
 */
const GalleryFlex = observer(({
    images = [],
    onImageClick,
    columns = 3,
    className = '',
    categoryId = 'default'
}) => {
    const galleryRef = useRef(null);
    const updateTimeout = useRef(null); // 用于存储防抖定时器

    // 初始化项目数据 - 使用GalleryStore
    useEffect(() => {
        if (images.length > 0) {
            galleryStore.initializeItems(categoryId, images, columns);
        }
    }, [images, columns, categoryId]);

    // 更新项目 - 使用GalleryStore，添加磁吸和防重叠功能
    const updateItem = useCallback((itemId, updates) => {
        // 获取当前分类的所有items
        const allItems = galleryStore.getItemsByCategory(categoryId);
        const currentItem = allItems.find(item => item.id === itemId);

        if (!currentItem) {
            galleryStore.updateItem(itemId, updates);
            return;
        }

        // 判断是位置更新还是尺寸更新
        const isPositionUpdate = updates.x !== undefined || updates.y !== undefined;
        const isSizeUpdate = updates.width !== undefined || updates.height !== undefined;

        if (isPositionUpdate) {
            // 位置更新：应用磁吸和防重叠
            const updatedItem = { ...currentItem, ...updates };
            const otherItems = allItems.filter(item => item.id !== itemId);
            const finalPosition = calculateNonOverlappingPosition(updatedItem, otherItems);
            galleryStore.updateItem(itemId, finalPosition);
        } else if (isSizeUpdate) {
            // 尺寸更新：直接应用，不进行磁吸
            console.log('尺寸更新:', { itemId, updates }); // 调试日志
            galleryStore.updateItem(itemId, updates);
        } else {
            // 其他更新：直接应用
            galleryStore.updateItem(itemId, updates);
        }

        // 使用requestAnimationFrame优化高度更新
        if (updateTimeout.current) {
            cancelAnimationFrame(updateTimeout.current);
        }

        updateTimeout.current = requestAnimationFrame(() => {
            const items = galleryStore.getItemsByCategory(categoryId);
            if (items.length === 0) return;

            // 快速计算边界 - 只计算必要的值
            let minY = 0;
            let maxY = 0;

            // 使用高效的for循环
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                minY = Math.min(minY, item.y);
                maxY = Math.max(maxY, item.y + item.height);
            }

            const contentHeight = maxY - minY;
            // 使用更小的缓冲区，gap=10px实现紧凑效果
            const bufferHeight = 0;
            const requiredHeight = contentHeight + bufferHeight;
            const newHeight = Math.max(requiredHeight, window.innerHeight);

            // 直接更新容器高度，避免DOM查询
            if (galleryRef.current) {
                const container = galleryRef.current.firstElementChild;
                if (container) {
                    container.style.height = `${newHeight}px`;
                }
            }
        });
    }, [categoryId, galleryStore]);

    // 计算容器高度 - 智能高度计算，确保实时同步
    const getContainerHeight = useCallback(() => {
        const items = galleryStore.getItemsByCategory(categoryId);
        if (items.length === 0) return '100vh';

        // 计算所有项目的边界，考虑负坐标情况
        let minY = 0; // 从0开始作为基准
        let maxY = 0; // 从0开始作为基准

        items.forEach(item => {
            minY = Math.min(minY, item.y); // 可能为负值
            maxY = Math.max(maxY, item.y + item.height);
        });

        // 计算内容总高度，包括负坐标区域
        const contentHeight = maxY - minY;

        // 添加最小缓冲区：保持紧凑间距
        const baseBuffer = 50; // 基础缓冲区减少到50px
        const dynamicBuffer = Math.max(0, (maxY - 800) * 0.05); // 超过800px后增加5%缓冲，更保守
        const totalBuffer = baseBuffer + dynamicBuffer;

        // 确保容器高度能容纳所有内容，包括负坐标区域
        const requiredHeight = contentHeight + totalBuffer;

        // 最小高度保持100vh，但会根据内容智能扩展
        const minHeight = window.innerHeight;

        // 返回最终高度，确保item永远不会超出容器
        return `${Math.max(requiredHeight, minHeight)}px`;
    }, [categoryId]);

    return (
        <div className={`${styles.galleryFlex} ${className}`} ref={galleryRef}>
            <div
                className={styles.galleryContainer}
                style={{ height: getContainerHeight() }}
            >
                {galleryStore.getItemsByCategory(categoryId).map((item) => {
                    const allItems = galleryStore.getItemsByCategory(categoryId);
                    return (
                        <GalleryItem
                            key={item.id}
                            item={item}
                            editMode={galleryStore.editMode}
                            onUpdate={updateItem}
                            onClick={onImageClick}
                            galleryRef={galleryRef}
                            allItems={allItems}
                        />
                    );
                })}
            </div>

        </div>
    );
});

export default GalleryFlex;