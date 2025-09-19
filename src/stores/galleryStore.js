import { makeAutoObservable } from 'mobx';

/**
 * GalleryStore - 图集数据管理
 * 专门管理图集中项目的位置、大小等布局信息
 */
class GalleryStore {
    constructor() {
        makeAutoObservable(this);
    }

    // 存储所有图集项目的布局信息
    galleryItems = new Map();

    // 编辑模式状态
    editMode = false;

    // 当前激活的图集分类
    currentCategory = null;

    // 初始化图集项目
    initializeItems(categoryId, images, columns = 3) {
        this.currentCategory = categoryId;
        const items = new Map();

        images.forEach((image, index) => {
            const itemId = `${categoryId}-${image.id}`;
            const existingItem = this.galleryItems.get(itemId);

            // 如果已存在位置信息，保留原有位置，否则使用默认布局
            if (existingItem) {
                items.set(itemId, existingItem);
            } else {
                const gridX = (index % columns) * (100 / columns);
                const gridY = Math.floor(index / columns) * 300;

                items.set(itemId, {
                    id: itemId,
                    imageId: image.id,
                    categoryId: categoryId,
                    x: gridX,
                    y: gridY,
                    width: 100 / columns,
                    height: 300,
                    row: Math.floor(index / columns),
                    col: index % columns,
                    originalImage: image
                });
            }
        });

        this.galleryItems = items;
    }

    // 更新项目位置
    updateItemPosition(itemId, x, y) {
        const item = this.galleryItems.get(itemId);
        if (item) {
            this.galleryItems.set(itemId, {
                ...item,
                x: Math.round(x),
                y: Math.round(y)
            });
        }
    }

    // 更新项目尺寸
    updateItemSize(itemId, width, height) {
        const item = this.galleryItems.get(itemId);
        if (item) {
            this.galleryItems.set(itemId, {
                ...item,
                width: Math.round(width),
                height: Math.round(height)
            });
        }
    }

    // 批量更新项目
    updateItem(itemId, updates) {
        const item = this.galleryItems.get(itemId);
        if (item) {
            this.galleryItems.set(itemId, {
                ...item,
                ...updates
            });
        }
    }

    // 获取指定分类的项目
    getItemsByCategory(categoryId) {
        const result = [];
        this.galleryItems.forEach((item, key) => {
            if (item.categoryId === categoryId) {
                result.push(item);
            }
        });
        return result.sort((a, b) => a.row - b.row || a.col - b.col);
    }

    // 获取单个项目
    getItem(itemId) {
        return this.galleryItems.get(itemId);
    }

    // 切换编辑模式
    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    // 设置编辑模式
    setEditMode(mode) {
        this.editMode = mode;
    }

    // 重置指定分类的布局
    resetCategoryLayout(categoryId, columns = 3) {
        const items = this.getItemsByCategory(categoryId);
        items.forEach((item, index) => {
            const gridX = (index % columns) * (100 / columns);
            const gridY = Math.floor(index / columns) * 300;

            this.updateItem(item.id, {
                x: gridX,
                y: gridY,
                width: 100 / columns,
                height: 300,
                row: Math.floor(index / columns),
                col: index % columns
            });
        });
    }

    // 清除指定分类的数据
    clearCategory(categoryId) {
        const keysToDelete = [];
        this.galleryItems.forEach((item, key) => {
            if (item.categoryId === categoryId) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.galleryItems.delete(key));
    }

    // 清除所有数据
    clearAll() {
        this.galleryItems.clear();
        this.currentCategory = null;
        this.editMode = false;
    }
}

export default new GalleryStore();