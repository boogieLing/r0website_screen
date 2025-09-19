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

    // 计算容器高度 - 使用GalleryStore数据
    const getContainerHeight = useCallback(() => {
        const items = galleryStore.getItemsByCategory(categoryId);
        if (items.length === 0) return 'auto';
        const maxY = Math.max(...items.map(item => item.y + item.height));
        return `${maxY + 50}px`;
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