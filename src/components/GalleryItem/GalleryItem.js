import React, { useState, useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GracefulImage from '@/components/SkeletonImage/GracefulImage';
import { calculateNonOverlappingPosition } from '@/utils/magneticLayout';
import { createRatioSelectorOptions, applyAspectRatio, flipAspectRatio } from '@/utils/aspectRatios';
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
    galleryRef,
    allItems, // 添加所有items的prop用于磁吸计算
    flexMode = false, // 新增：flex模式，使用相对定位而非绝对定位
    className = '' // 新增：允许外部传入额外的CSS类名
}) => {
    const itemRef = useRef(null);
    const galleryRect = useRef(null); // 缓存gallery的边界信息
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isMagnetic, setIsMagnetic] = useState(false); // 磁吸状态
    const [showRatioMenu, setShowRatioMenu] = useState(false); // 比例菜单显示状态
    const [currentRatio, setCurrentRatio] = useState('5:7'); // 当前比例
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

    // 优化：使用解构获取数据，避免重复访问
    const { id, x, y, width, height, originalImage } = item;

    // 实时计算宽高比 - 处理auto宽度和数值宽度
    const calculateAspectRatio = useCallback((w, h) => {
        // 处理auto宽度或其他无效值
        if (!w || !h || w === 0 || h === 0 || w === 'auto' || isNaN(w) || isNaN(h)) {
            return '1:1';
        }

        // 确保是数值类型
        const width = Math.round(Number(w));
        const height = Math.round(Number(h));

        // 验证数值有效性
        if (width <= 0 || height <= 0) {
            return '1:1';
        }

        // 计算最大公约数
        const gcd = (a, b) => {
            a = Math.abs(a);
            b = Math.abs(b);
            return b === 0 ? a : gcd(b, a % b);
        };

        const divisor = gcd(width, height);
        const ratioW = Math.round(width / divisor);
        const ratioH = Math.round(height / divisor);

        return `${ratioW}:${ratioH}`;
    }, []);

    // 实时计算当前比例
    const realTimeRatio = calculateAspectRatio(width, height);

    // 当尺寸变化时的动画效果
    useEffect(() => {
        // 可以在这里添加动画逻辑，比如短暂高亮指示器
        const indicator = itemRef.current?.querySelector(`.${styles.editIndicator}`);
        if (indicator) {
            indicator.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (indicator) indicator.style.transform = 'scale(1)';
            }, 150);
        }
    }, [width, height, styles.editIndicator]);

    // 处理鼠标按下开始拖拽
    const handleMouseDown = useCallback((e) => {
        if (!editMode || flexMode) return; // flex模式下禁用拖拽

        e.preventDefault();
        e.stopPropagation();

        const rect = itemRef.current.getBoundingClientRect();

        setIsDragging(true);
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }, [editMode, flexMode, galleryRef]);

    // 处理调整大小
    const handleResizeMouseDown = useCallback((e) => {
        if (!editMode) return;

        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        setResizeStart({
            width: width === 'auto' ? 160 : width, // 如果宽度是auto，使用默认值
            height,
            x: e.clientX,
            y: e.clientY
        });
    }, [editMode, width, height]);

    // 处理鼠标移动 - 磁吸和防重叠版本
    const handleMouseMove = useCallback((e) => {
        if (!galleryRef.current) return;

        // 缓存galleryRect，避免重复调用
        if (!galleryRect.current) {
            galleryRect.current = galleryRef.current.getBoundingClientRect();
        }

        if (isDragging) {
            // 计算原始新位置
            let newX = e.clientX - galleryRect.current.left - dragStart.x;
            let newY = e.clientY - galleryRect.current.top - dragStart.y;

            // 智能边界约束：允许拖出边界，但容器会动态扩展
            // 确保不会完全消失，保持最小50px可见区域
            const minVisible = 50;

            // 左侧边界：允许负坐标，但保持部分可见
            if (newX < -width + minVisible) {
                newX = -width + minVisible;
            }

            // 顶部边界：允许负坐标，但保持部分可见
            if (newY < -height + minVisible) {
                newY = -height + minVisible;
            }

            // 水平对齐（网格对齐）
            const gridSize = 10;
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;

            // 创建临时item对象用于磁吸计算
            const tempItem = { ...item, x: newX, y: newY };

            // 如果有其他items，计算磁吸和防重叠位置
            if (allItems && allItems.length > 1) {
                const otherItems = allItems.filter(item => item.id !== id);
                const magneticPosition = calculateNonOverlappingPosition(tempItem, otherItems);

                // 检查是否发生了磁吸（位置有显著变化）
                const magneticDeltaX = Math.abs(magneticPosition.x - newX);
                const magneticDeltaY = Math.abs(magneticPosition.y - newY);
                const isMagneticActive = magneticDeltaX > 2 || magneticDeltaY > 2;

                // 更新磁吸状态
                if (isMagneticActive !== isMagnetic) {
                    setIsMagnetic(isMagneticActive);
                }

                newX = magneticPosition.x;
                newY = magneticPosition.y;
            } else {
                // 没有磁吸时重置状态
                if (isMagnetic) setIsMagnetic(false);
            }

            // 使用更智能的节流机制 - 只在位置显著变化时更新
            const deltaX = Math.abs(newX - item.x);
            const deltaY = Math.abs(newY - item.y);

            if (deltaX > 2 || deltaY > 2) { // 减少阈值到2px，提高磁吸精度
                onUpdate(id, { x: newX, y: newY });
            }
        }

        if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;

            let newWidth = resizeStart.width + deltaX;
            let newHeight = resizeStart.height + deltaY;

            // 最小尺寸约束
            newWidth = Math.max(100, newWidth);
            newHeight = Math.max(100, newHeight);

            // 如果当前宽度是auto（flex模式），使用一个合理的默认值
            if (width === 'auto') {
                newWidth = Math.max(160, newWidth); // flex模式的默认宽度
            }

            // 网格对齐
            const gridSize = 10;
            newWidth = Math.round(newWidth / gridSize) * gridSize;
            newHeight = Math.round(newHeight / gridSize) * gridSize;

            // 使用节流机制 - 只在尺寸显著变化时更新
            const deltaWidth = Math.abs(newWidth - width);
            const deltaHeight = Math.abs(newHeight - height);

            if (deltaWidth > 2 || deltaHeight > 2) { // 降低阈值提高响应性
                console.log('调整大小更新:', { id, newWidth, newHeight }); // 调试日志
                onUpdate(id, { width: newWidth, height: newHeight });
            }
        }
    }, [isDragging, isResizing, dragStart, resizeStart, x, y, width, height, onUpdate, galleryRef, allItems, id, isMagnetic]);

    // 处理鼠标释放
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setIsMagnetic(false); // 清除磁吸状态
        // 清除galleryRect缓存
        galleryRect.current = null;
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

    // 处理比例选择
    const handleRatioSelect = useCallback((ratio) => {
        const newSize = applyAspectRatio(item, ratio);
        onUpdate(id, newSize);
        setCurrentRatio(ratio);
        setShowRatioMenu(false);
    }, [item, id, onUpdate]);

    // 处理长宽调转
    const handleFlipRatio = useCallback(() => {
        const flippedSize = flipAspectRatio(width, height);
        onUpdate(id, flippedSize);
    }, [width, height, id, onUpdate]);

    // 切换比例菜单
    const toggleRatioMenu = useCallback((e) => {
        e.stopPropagation();
        setShowRatioMenu(!showRatioMenu);
    }, [showRatioMenu]);

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showRatioMenu && !event.target.closest(`.${styles.ratioMenu}`) && !event.target.closest(`.${styles.ratioButton}`)) {
                setShowRatioMenu(false);
            }
        };

        if (showRatioMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showRatioMenu]);

    // 处理点击
    const handleClick = useCallback(() => {
        if (!editMode && onClick) {
            onClick(originalImage);
        }
    }, [editMode, onClick, originalImage]);

    return (
        <div
            ref={itemRef}
            className={`${styles.galleryItem} ${editMode ? styles.editMode : styles.exhibitMode} ${
                isDragging ? styles.dragging : ''
            } ${isResizing ? styles.resizing : ''} ${isMagnetic ? styles.magneticActive : ''} ${
                flexMode ? styles.flexMode : ''
            } ${className}`}
            style={{
                position: flexMode ? 'relative' : 'absolute',
                left: flexMode ? 'auto' : `${x}px`,
                top: flexMode ? 'auto' : `${y}px`,
                width: flexMode ? undefined : `${width}px`, // flex模式下不设置width，让CSS控制
                height: `${height}px`,
                zIndex: isDragging || isResizing ? 1000 : id
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <div className={styles.imageWrapper}>
                <GracefulImage
                    src={originalImage.src}
                    alt={originalImage.title}
                    className={styles.galleryImage}
                    aspectRatio="4:3"
                    skeletonSize="none"
                    showRetry={false}
                />

                {/* 信息覆盖层 */}
                <div className={styles.imageOverlay}>
                    <h3 className={styles.imageTitle}>{originalImage.title}</h3>
                    <p className={styles.imageYear}>{originalImage.year}</p>
                </div>

                {/* 编辑模式下的控制点 */}
                {editMode && (
                    <>
                        {/* 比例控制按钮组 - 使用div替代button */}
                        <div className={styles.ratioControls}>
                            <div
                                className={styles.ratioButton}
                                onClick={toggleRatioMenu}
                                title="选择比例"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleRatioMenu();
                                    }
                                }}
                            >
                                {currentRatio}
                            </div>
                            <div
                                className={styles.flipButton}
                                onClick={handleFlipRatio}
                                title="调转长宽"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleFlipRatio();
                                    }
                                }}
                            >
                                ↻
                            </div>
                        </div>

                        {/* 比例选择菜单 */}
                        {showRatioMenu && (
                            <div className={styles.ratioMenu}>
                                {createRatioSelectorOptions().map((option) => (
                                    <div
                                        key={option.key}
                                        className={`${styles.ratioOption} ${
                                            currentRatio === option.key ? styles.active : ''
                                        }`}
                                        onClick={() => handleRatioSelect(option.key)}
                                    >
                                        {option.ratio} - {option.name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 调整大小手柄 */}
                        <div
                            className={styles.resizeHandle}
                            onMouseDown={handleResizeMouseDown}
                            title="调整大小"
                        >
                            <div className={styles.resizeIcon} />
                        </div>

                        {/* 编辑状态指示器 - 显示有价值的信息 */}
                        <div className={styles.editIndicator}>
                            <span className={styles.editText}>
                                {width === 'auto' ? 'auto' : Math.round(width)}×{Math.round(height)} | {realTimeRatio}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

export default GalleryItem;