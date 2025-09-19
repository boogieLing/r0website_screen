import React, { useState, useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GalleryItem from '../GalleryItem/GalleryItem';
import galleryStore from '@/stores/galleryStore';
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

    // 初始化项目数据 - 使用GalleryStore
    useEffect(() => {
        if (images.length > 0) {
            galleryStore.initializeItems(categoryId, images, columns);
        }
    }, [images, columns, categoryId]);

    // 切换编辑模式 - 使用GalleryStore
    const toggleEditMode = useCallback(() => {
        galleryStore.toggleEditMode();
    }, []);

    // 检查是否需要扩展容器边界 - 独立实现，避免循环引用
    const checkBoundaryExpansion = useCallback((item) => {
        const items = galleryStore.getItemsByCategory(categoryId);
        if (items.length === 0) return { needsUpdate: false, newHeight: '100vh' };

        // 重新计算当前边界
        let minY = 0;
        let maxY = 0;
        items.forEach(item => {
            minY = Math.min(minY, item.y);
            maxY = Math.max(maxY, item.y + item.height);
        });

        const currentContentHeight = maxY - minY;
        const itemBottom = item.y + item.height;
        const itemTop = item.y;

        // 如果item扩展了边界，需要更新容器
        const expansionThreshold = 100;
        let needsUpdate = false;
        let newHeight = Math.max(window.innerHeight, currentContentHeight + 200);

        // 检查是否需要扩展
        if (itemBottom > maxY - expansionThreshold || itemTop < minY + expansionThreshold) {
            const newContentHeight = Math.max(maxY, itemBottom) - Math.min(minY, itemTop);
            newHeight = Math.max(window.innerHeight, newContentHeight + expansionThreshold * 2);
            needsUpdate = true;
        }

        return { needsUpdate, newHeight };
    }, [categoryId, galleryStore]);

    // 更新项目 - 使用GalleryStore，并触发高度重新计算
    const updateItem = useCallback((itemId, updates) => {
        galleryStore.updateItem(itemId, updates);

        // 强制重新计算容器高度，确保实时同步，使用更小的缓冲区
        // 使用setTimeout确保DOM更新完成后再计算
        setTimeout(() => {
            const items = galleryStore.getItemsByCategory(categoryId);
            if (items.length === 0) return;

            // 重新计算边界
            let minY = 0;
            let maxY = 0;
            items.forEach(item => {
                minY = Math.min(minY, item.y);
                maxY = Math.max(maxY, item.y + item.height);
            });

            const contentHeight = maxY - minY;
            const bufferHeight = 50; // 减少缓冲区到50px
            const requiredHeight = contentHeight + bufferHeight;
            const minHeight = window.innerHeight;
            const newHeight = Math.max(requiredHeight, minHeight);

            // 更新容器高度
            const container = galleryRef.current?.querySelector(`.${styles.galleryContainer}`);
            if (container) {
                container.style.height = `${newHeight}px`;
            }
        }, 0);
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
                {galleryStore.getItemsByCategory(categoryId).map((item) => (
                    <GalleryItem
                        key={item.id}
                        item={item}
                        editMode={galleryStore.editMode}
                        onUpdate={updateItem}
                        onClick={onImageClick}
                        galleryRef={galleryRef}
                    />
                ))}
            </div>

            {/* 编辑模式切换按钮 - 右下角三角 */}
            <div
                className={styles.editToggle}
                onClick={toggleEditMode}
                title={galleryStore.editMode ? '切换到展示模式' : '切换到编辑模式'}
            >
                <div className={`${styles.triangle} ${galleryStore.editMode ? styles.active : ''}`} />
            </div>
        </div>
    );
});

export default GalleryFlex;