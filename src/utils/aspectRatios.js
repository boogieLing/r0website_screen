/**
 * 预设比例工具函数
 * 提供常用的图片比例和长宽调转功能
 */

// 预设比例列表
export const ASPECT_RATIOS = {
    '1:1': { width: 1, height: 1, name: '正方形' },
    '16:9': { width: 16, height: 9, name: '宽屏' },
    '9:16': { width: 9, height: 16, name: '竖屏' },
    '3:4': { width: 3, height: 4, name: '标准竖版' },
    '4:3': { width: 4, height: 3, name: '标准横版' },
    '4:5': { width: 4, height: 5, name: '竖版' },
    '5:4': { width: 5, height: 4, name: '横版' },
    '5:7': { width: 5, height: 7, name: '照片竖版' },
    '7:5': { width: 7, height: 5, name: '照片横版' },
    'A4': { width: 210, height: 297, name: 'A4纸张' },
    'A4-L': { width: 297, height: 210, name: 'A4横向' }
};

// 获取所有可用的比例选项
export function getAspectRatioOptions() {
    return Object.entries(ASPECT_RATIOS).map(([key, ratio]) => ({
        key,
        name: ratio.name,
        ratio: `${ratio.width}:${ratio.height}`,
        width: ratio.width,
        height: ratio.height
    }));
}

// 根据比例计算尺寸
export function calculateSizeFromRatio(currentWidth, currentHeight, targetRatio) {
    const ratio = ASPECT_RATIOS[targetRatio];
    if (!ratio) return { width: currentWidth, height: currentHeight };

    const ratioValue = ratio.width / ratio.height;
    const currentRatio = currentWidth / currentHeight;

    if (Math.abs(currentRatio - ratioValue) < 0.01) {
        // 已经很接近目标比例，保持不变
        return { width: currentWidth, height: currentHeight };
    }

    // 根据当前宽度计算高度，保持比例
    const newHeight = Math.round(currentWidth / ratioValue);

    return { width: currentWidth, height: newHeight };
}

// 调转长宽比例
export function flipAspectRatio(currentWidth, currentHeight) {
    return { width: currentHeight, height: currentWidth };
}

// 获取当前item的比例
export function getCurrentAspectRatio(item) {
    return item.width / item.height;
}

// 找到最接近当前尺寸的比例
export function findClosestAspectRatio(currentWidth, currentHeight) {
    const currentRatio = currentWidth / currentHeight;
    let closestRatio = '1:1';
    let minDifference = Infinity;

    Object.entries(ASPECT_RATIOS).forEach(([key, ratio]) => {
        const ratioValue = ratio.width / ratio.height;
        const difference = Math.abs(currentRatio - ratioValue);

        if (difference < minDifference) {
            minDifference = difference;
            closestRatio = key;
        }
    });

    return closestRatio;
}

// 应用比例到item，考虑网格对齐
export function applyAspectRatio(item, targetRatio, gridSize = 10) {
    const newSize = calculateSizeFromRatio(item.width, item.height, targetRatio);

    // 网格对齐
    const alignedWidth = Math.round(newSize.width / gridSize) * gridSize;
    const alignedHeight = Math.round(newSize.height / gridSize) * gridSize;

    return {
        width: Math.max(100, alignedWidth),  // 最小宽度100px
        height: Math.max(100, alignedHeight) // 最小高度100px
    };
}

// 创建比例选择器的选项
export function createRatioSelectorOptions() {
    const options = [];
    const ratios = getAspectRatioOptions();

    // 添加常用比例
    const commonRatios = ['1:1', '16:9', '9:16', '3:4', '4:3', '5:7', '7:5'];
    commonRatios.forEach(ratioKey => {
        const ratio = ratios.find(r => r.key === ratioKey);
        if (ratio) options.push(ratio);
    });

    return options;
}