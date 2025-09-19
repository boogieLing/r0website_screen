import React, { useState, useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GracefulImage from '@/components/SkeletonImage/GracefulImage';
import styles from './GalleryItem.module.less';

/**
 * GalleryItem - 可编辑的图集项目组件
 * 支持拖拽移动和尺寸调整
 */
const GalleryItem = observer(({
    item,
    editMode,
    onUpdate,
    onClick,
    galleryRef
}) => {
    const itemRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

    // 处理鼠标按下开始拖拽
    const handleMouseDown = useCallback((e) => {
        if (!editMode) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = itemRef.current.getBoundingClientRect();

        setIsDragging(true);
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }, [editMode, galleryRef]);

    // 处理调整大小
    const handleResizeMouseDown = useCallback((e) => {
        if (!editMode) return;

        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        setResizeStart({
            width: item.width,
            height: item.height,
            x: e.clientX,
            y: e.clientY
        });
    }, [editMode, item.width, item.height]);

    // 处理鼠标移动
    const handleMouseMove = useCallback((e) => {
        if (!galleryRef.current) return;

        const galleryRect = galleryRef.current.getBoundingClientRect();

        if (isDragging) {
            // 计算新位置
            let newX = e.clientX - galleryRect.left - dragStart.x;
            let newY = e.clientY - galleryRect.top - dragStart.y;

            // 边界约束
            newX = Math.max(0, Math.min(newX, galleryRect.width - item.width));
            newY = Math.max(0, newY);

            // 水平对齐（网格对齐）
            const gridSize = 10;
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;

            onUpdate(item.id, { x: newX, y: newY });
        }

        if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;

            let newWidth = resizeStart.width + deltaX;
            let newHeight = resizeStart.height + deltaY;

            // 最小尺寸约束
            newWidth = Math.max(100, newWidth);
            newHeight = Math.max(100, newHeight);

            // 网格对齐
            const gridSize = 10;
            newWidth = Math.round(newWidth / gridSize) * gridSize;
            newHeight = Math.round(newHeight / gridSize) * gridSize;

            onUpdate(item.id, { width: newWidth, height: newHeight });
        }
    }, [isDragging, isResizing, dragStart, resizeStart, item, onUpdate, galleryRef]);

    // 处理鼠标释放
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
    }, []);

    // 添加全局事件监听
    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = isDragging ? 'move' : 'nw-resize';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    // 处理点击
    const handleClick = useCallback(() => {
        if (!editMode && onClick) {
            onClick(item.originalImage);
        }
    }, [editMode, onClick, item.originalImage]);

    return (
        <div
            ref={itemRef}
            className={`${styles.galleryItem} ${editMode ? styles.editMode : styles.exhibitMode} ${
                isDragging ? styles.dragging : ''
            } ${isResizing ? styles.resizing : ''}`}
            style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                zIndex: isDragging || isResizing ? 1000 : item.id
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <div className={styles.imageWrapper}>
                <GracefulImage
                    src={item.originalImage.src}
                    alt={item.originalImage.title}
                    className={styles.galleryImage}
                    aspectRatio="4:3"
                    skeletonSize="none"
                    showRetry={false}
                />

                {/* 信息覆盖层 */}
                <div className={styles.imageOverlay}>
                    <h3 className={styles.imageTitle}>{item.originalImage.title}</h3>
                    <p className={styles.imageYear}>{item.originalImage.year}</p>
                </div>

                {/* 编辑模式下的控制点 */}
                {editMode && (
                    <>
                        {/* 拖拽手柄 */}
                        <div className={styles.dragHandle} title="拖拽移动">
                            <div className={styles.dragIcon} />
                        </div>

                        {/* 调整大小手柄 */}
                        <div
                            className={styles.resizeHandle}
                            onMouseDown={handleResizeMouseDown}
                            title="调整大小"
                        >
                            <div className={styles.resizeIcon} />
                        </div>

                        {/* 编辑状态指示器 */}
                        <div className={styles.editIndicator}>
                            <span className={styles.editText}>EDIT</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

export default GalleryItem;