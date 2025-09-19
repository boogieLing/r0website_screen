/**
 * 磁吸布局工具函数
 * 提供磁吸对齐和防重叠检测功能
 */

// 磁吸阈值（像素）
const MAGNETIC_THRESHOLD = 15;

// 检测两个矩形是否重叠
export function isOverlapping(rect1, rect2) {
    return !(
        rect1.x + rect1.width <= rect2.x ||
        rect2.x + rect2.width <= rect1.x ||
        rect1.y + rect1.height <= rect2.y ||
        rect2.y + rect2.height <= rect1.y
    );
}

// 获取所有与当前矩形重叠的矩形
export function getOverlappingItems(currentItem, allItems) {
    const currentRect = {
        x: currentItem.x,
        y: currentItem.y,
        width: currentItem.width,
        height: currentItem.height
    };

    return allItems.filter(item => {
        if (item.id === currentItem.id) return false;

        const itemRect = {
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height
        };

        return isOverlapping(currentRect, itemRect);
    });
}

// 计算磁吸位置
export function calculateMagneticPosition(currentItem, allItems, threshold = MAGNETIC_THRESHOLD) {
    const { x, y, width, height } = currentItem;
    let newX = x;
    let newY = y;

    const currentRight = x + width;
    const currentBottom = y + height;

    // 存储所有可能的磁吸位置
    const magneticPositions = {
        x: [],
        y: []
    };

    allItems.forEach(item => {
        if (item.id === currentItem.id) return;

        const itemRight = item.x + item.width;
        const itemBottom = item.y + item.height;

        // X轴磁吸位置
        magneticPositions.x.push(
            item.x,                    // 左对齐
            item.x - width,           // 右对齐到item左边
            itemRight,                // 左对齐到item右边
            itemRight - width,        // 右对齐
            item.x + item.width / 2 - width / 2  // 居中对齐
        );

        // Y轴磁吸位置
        magneticPositions.y.push(
            item.y,                    // 上对齐
            item.y - height,          // 下对齐到item上边
            itemBottom,               // 上对齐到item下边
            itemBottom - height,      // 下对齐
            item.y + item.height / 2 - height / 2  // 居中对齐
        );
    });

    // 找到最接近的磁吸位置
    let closestX = null;
    let minXDistance = threshold;

    magneticPositions.x.forEach(magX => {
        const distance = Math.abs(magX - x);
        if (distance < minXDistance) {
            minXDistance = distance;
            closestX = magX;
        }
    });

    let closestY = null;
    let minYDistance = threshold;

    magneticPositions.y.forEach(magY => {
        const distance = Math.abs(magY - y);
        if (distance < minYDistance) {
            minYDistance = distance;
            closestY = magY;
        }
    });

    if (closestX !== null) newX = closestX;
    if (closestY !== null) newY = closestY;

    return { x: newX, y: newY };
}

// 计算防重叠位置
export function calculateNonOverlappingPosition(currentItem, allItems, step = 1) {
    const { x, y, width, height } = currentItem;

    // 首先尝试磁吸位置
    const magneticPos = calculateMagneticPosition(currentItem, allItems);

    // 检查磁吸位置是否重叠
    const testRect = {
        x: magneticPos.x,
        y: magneticPos.y,
        width: width,
        height: height
    };

    const hasOverlapAtMagnetic = allItems.some(item => {
        if (item.id === currentItem.id) return false;

        const itemRect = {
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height
        };

        return isOverlapping(testRect, itemRect);
    });

    if (!hasOverlapAtMagnetic) {
        return magneticPos;
    }

    // 如果磁吸位置重叠，寻找最近的非重叠位置
    const directions = [
        { dx: 0, dy: -step },   // 上
        { dx: step, dy: 0 },    // 右
        { dx: 0, dy: step },    // 下
        { dx: -step, dy: 0 },   // 左
        { dx: step, dy: -step }, // 右上
        { dx: step, dy: step },  // 右下
        { dx: -step, dy: -step }, // 左上
        { dx: -step, dy: step }  // 左下
    ];

    let bestPosition = { x, y };
    let minDistance = Infinity;

    // 螺旋搜索非重叠位置
    for (let radius = 1; radius <= 50; radius++) {
        for (const dir of directions) {
            const testX = magneticPos.x + dir.dx * radius;
            const testY = magneticPos.y + dir.dy * radius;

            const testRect = {
                x: testX,
                y: testY,
                width: width,
                height: height
            };

            const hasOverlap = allItems.some(item => {
                if (item.id === currentItem.id) return false;

                const itemRect = {
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height
                };

                return isOverlapping(testRect, itemRect);
            });

            if (!hasOverlap) {
                const distance = Math.sqrt(
                    Math.pow(testX - magneticPos.x, 2) +
                    Math.pow(testY - magneticPos.y, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    bestPosition = { x: testX, y: testY };
                }
            }
        }

        // 如果找到合适的位置，提前退出
        if (minDistance < Infinity) {
            break;
        }
    }

    return bestPosition;
}

// 获取item的四个边缘位置（用于磁吸显示）
export function getItemEdgePositions(item) {
    return {
        left: item.x,
        right: item.x + item.width,
        top: item.y,
        bottom: item.y + item.height,
        centerX: item.x + item.width / 2,
        centerY: item.y + item.height / 2
    };
}

// 检查两个边缘是否对齐（用于显示磁吸提示）
export function areEdgesAligned(edge1, edge2, threshold = MAGNETIC_THRESHOLD) {
    return Math.abs(edge1 - edge2) <= threshold;
}