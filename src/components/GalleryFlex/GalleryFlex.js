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

    // 更新项目 - 使用GalleryStore
    const updateItem = useCallback((itemId, updates) => {
        galleryStore.updateItem(itemId, updates);
    }, []);

    // 计算容器高度 - 支持无限滚动
    const getContainerHeight = useCallback(() => {
        const items = galleryStore.getItemsByCategory(categoryId);
        if (items.length === 0) return '100vh';

        // 计算所有项目的边界
        let minY = Infinity;
        let maxY = -Infinity;
        let minX = Infinity;
        let maxX = -Infinity;

        items.forEach(item => {
            minY = Math.min(minY, item.y);
            maxY = Math.max(maxY, item.y + item.height);
            minX = Math.min(minX, item.x);
            maxX = Math.max(maxX, item.x + item.width);
        });

        // 考虑负坐标的情况，计算总高度
        const totalHeight = maxY - Math.min(0, minY) + 100; // 添加额外空间
        const totalWidth = maxX - Math.min(0, minX) + 100; // 添加额外空间

        // 返回足够大的尺寸以容纳所有内容，包括拖出边界的项目
        // 基础高度100vh，加上超出部分，确保无限滚动
        const baseHeight = 100 * 16; // 100vh转换为像素（假设1vh=16px）
        return `${Math.max(totalHeight, baseHeight)}px`;
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