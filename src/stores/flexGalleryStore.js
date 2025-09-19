import { makeAutoObservable } from 'mobx';

/**
 * FlexGalleryStore - 简约flex布局状态管理
 * 所有item大小一致，位置自动计算
 */
class FlexGalleryStore {
    constructor() {
        makeAutoObservable(this);
    }

    // 分类存储项目数据
    categoryItems = new Map();

    // 编辑模式
    editMode = false;

    // 获取指定分类的项目
    getItemsByCategory(categoryId) {
        return this.categoryItems.get(categoryId) || [];
    }

    // 初始化分类项目 - 支持响应式列数
    initializeItems(categoryId, images, standardSize, columns = 3) {
        const items = images.map((image, index) => ({
            id: image.id || `flex-${index}`,
            x: 0, // flex布局下位置自动计算
            y: 0, // flex布局下位置自动计算
            width: standardSize.width,
            height: standardSize.height,
            originalImage: image,
            categoryId: categoryId,
            columns: columns // 保存当前列数，用于响应式布局
        }));

        this.categoryItems.set(categoryId, items);
    }

    // 更新项目（flex布局下只允许调整大小）
    updateItem(categoryId, itemId, updates) {
        const items = this.getItemsByCategory(categoryId);
        const itemIndex = items.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            // 只更新实际变化的属性
            const oldItem = items[itemIndex];
            const hasChanges = Object.keys(updates).some(key => oldItem[key] !== updates[key]);

            if (hasChanges) {
                items[itemIndex] = { ...oldItem, ...updates };
                // 使用原数组引用避免不必要的重新渲染
                this.categoryItems.set(categoryId, items);
            }
        }
    }

    // 切换编辑模式
    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    // 清空指定分类
    clearCategory(categoryId) {
        this.categoryItems.delete(categoryId);
    }

    // 清空所有分类
    clearAll() {
        this.categoryItems.clear();
        this.editMode = false;
    }
}

// 创建单例实例
const flexGalleryStore = new FlexGalleryStore();
export default flexGalleryStore;