import React, { useState, useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GalleryItem from '../GalleryItem/GalleryItem';
import styles from './GalleryFlex.module.less';

/**
 * GalleryFlex - 统一管理的大组件
 * 支持编辑和展示两种状态
 */
const GalleryFlex = observer(({
    images = [],
    onImageClick,
    columns = 3,
    className = ''
}) => {
    const [editMode, setEditMode] = useState(false);
    const [items, setItems] = useState([]);
    const galleryRef = useRef(null);

    // 初始化项目数据
    useEffect(() => {
        const initializedItems = images.map((image, index) => ({
            id: image.id,
            originalImage: image,
            x: (index % columns) * (100 / columns),
            y: Math.floor(index / columns) * 300,
            width: 100 / columns,
            height: 300,
            row: Math.floor(index / columns),
            col: index % columns
        }));
        setItems(initializedItems);
    }, [images, columns]);

    // 切换编辑模式
    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev);
    }, []);

    // 更新项目位置和大小
    const updateItem = useCallback((itemId, updates) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        ));
    }, []);

    // 计算容器高度
    const getContainerHeight = useCallback(() => {
        if (items.length === 0) return 'auto';
        const maxY = Math.max(...items.map(item => item.y + item.height));
        return `${maxY + 50}px`;
    }, [items]);

    return (
        <div className={`${styles.galleryFlex} ${className}`} ref={galleryRef}>
            <div
                className={styles.galleryContainer}
                style={{ height: getContainerHeight() }}
            >
                {items.map((item) => (
                    <GalleryItem
                        key={item.id}
                        item={item}
                        editMode={editMode}
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
                title={editMode ? '切换到展示模式' : '切换到编辑模式'}
            >
                <div className={`${styles.triangle} ${editMode ? styles.active : ''}`} />
            </div>
        </div>
    );
});

export default GalleryFlex;