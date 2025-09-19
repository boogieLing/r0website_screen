/**
 * Store 管理器
 * 统一管理所有store的状态和操作
 */

import {
    globalStore,
    colorStore,
    osuStore,
    picBedStore,
    curPostStore,
    cursorTipsStore,
    sidebarStore,
    galleryStore,
    somniumNexusStore,
    testDataStore
} from './index';

class StoreManager {
    constructor() {
        this.stores = {
            global: globalStore,
            color: colorStore,
            osu: osuStore,
            picBed: picBedStore,
            curPost: curPostStore,
            cursorTips: cursorTipsStore,
            sidebar: sidebarStore,
            gallery: galleryStore,
            somniumNexus: somniumNexusStore,
            testData: testDataStore
        };

        this.storeStatus = {};
        this.listeners = [];
        this.debugMode = process.env.NODE_ENV === 'development';
    }

    /**
     * 获取指定store
     */
    getStore(storeName) {
        return this.stores[storeName];
    }

    /**
     * 获取所有store
     */
    getAllStores() {
        return { ...this.stores };
    }

    /**
     * 重置指定store
     */
    resetStore(storeName) {
        const store = this.stores[storeName];
        if (store && typeof store.clearAll === 'function') {
            store.clearAll();
            this.log(`Store ${storeName} 已重置`);
        } else {
            console.warn(`Store ${storeName} 不存在或没有 clearAll 方法`);
        }
    }

    /**
     * 重置所有store
     */
    resetAllStores() {
        Object.keys(this.stores).forEach(storeName => {
            this.resetStore(storeName);
        });
        this.log('所有store已重置');
    }

    /**
     * 获取store状态概览
     */
    getStoreStatus() {
        const status = {};

        // Gallery相关store状态
        status.gallery = {
            hasData: galleryStore.galleryItems.size > 0,
            itemCount: galleryStore.galleryItems.size,
            editMode: galleryStore.editMode,
            currentCategory: galleryStore.currentCategory
        };

        // SomniumNexus相关store状态
        status.somniumNexus = {
            isUsingTestData: somniumNexusStore.isUsingTestData,
            isProductionEnvironment: somniumNexusStore.isProductionEnvironment,
            selectedCategory: somniumNexusStore.selectedCategory,
            totalImages: somniumNexusStore.getTotalImageCount(),
            categories: somniumNexusStore.categories
        };

        // TestData相关store状态
        status.testData = {
            isTestEnvironment: testDataStore.isTestEnvironment,
            backupCount: testDataStore.testLayoutData.size,
            galleryCategories: Object.keys(testDataStore.testGalleryData)
        };

        // 全局store状态
        status.global = {
            cursorType: globalStore.cursorType,
            isDarkMode: globalStore.isDarkMode,
            hasCustomCursor: globalStore.hasCustomCursor
        };

        this.storeStatus = status;
        return status;
    }

    /**
     * 获取完整的系统状态报告
     */
    getSystemReport() {
        const storeStatus = this.getStoreStatus();
        const environmentInfo = somniumNexusStore.getEnvironmentInfo();

        return {
            timestamp: new Date().toISOString(),
            environment: environmentInfo,
            stores: storeStatus,
            recommendations: this.generateRecommendations(storeStatus, environmentInfo)
        };
    }

    /**
     * 生成系统建议
     */
    generateRecommendations(storeStatus, environmentInfo) {
        const recommendations = [];

        // 测试环境相关建议
        if (environmentInfo.isTestEnvironment) {
            recommendations.push({
                type: 'warning',
                category: 'environment',
                message: '当前处于测试环境，建议切换到正式环境进行生产部署'
            });
        }

        // Gallery数据相关建议
        if (storeStatus.gallery.itemCount === 0) {
            recommendations.push({
                type: 'info',
                category: 'gallery',
                message: 'GalleryStore中没有数据，建议初始化图片数据'
            });
        }

        // 测试数据备份建议
        if (storeStatus.testData.backupCount === 0 && environmentInfo.isTestEnvironment) {
            recommendations.push({
                type: 'info',
                category: 'testData',
                message: '测试环境中没有布局数据备份，建议保存当前布局'
            });
        }

        return recommendations;
    }

    /**
     * 添加状态变化监听器
     */
    addStatusListener(listener) {
        this.listeners.push(listener);
    }

    /**
     * 移除状态变化监听器
     */
    removeStatusListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * 通知状态变化
     */
    notifyStatusChange() {
        const status = this.getStoreStatus();
        this.listeners.forEach(listener => {
            try {
                listener(status);
            } catch (error) {
                console.error('监听器执行失败:', error);
            }
        });
    }

    /**
     * 日志记录
     */
    log(message, data = null) {
        if (this.debugMode) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[StoreManager ${timestamp}] ${message}`, data || '');
        }
    }

    /**
     * 导出store数据（用于备份）
     */
    exportStoreData(storeName) {
        const store = this.stores[storeName];
        if (!store) {
            console.error(`Store ${storeName} 不存在`);
            return null;
        }

        try {
            let data = null;

            switch (storeName) {
                case 'gallery':
                    data = {
                        galleryItems: Array.from(store.galleryItems.entries()),
                        editMode: store.editMode,
                        currentCategory: store.currentCategory
                    };
                    break;
                case 'somniumNexus':
                    data = {
                        selectedCategory: store.selectedCategory,
                        selectedSubCategory: store.selectedSubCategory,
                        galleryCategories: store.galleryCategories,
                        isUsingTestData: store.isUsingTestData
                    };
                    break;
                case 'testData':
                    data = {
                        isTestEnvironment: store.isTestEnvironment,
                        testGalleryData: store.testGalleryData,
                        testLayoutData: Array.from(store.testLayoutData.entries())
                    };
                    break;
                default:
                    data = { ...store };
            }

            this.log(`导出 ${storeName} 数据成功`);
            return {
                storeName,
                timestamp: Date.now(),
                data,
                version: '1.0'
            };

        } catch (error) {
            console.error(`导出 ${storeName} 数据失败:`, error);
            return null;
        }
    }

    /**
     * 导入store数据（用于恢复）
     */
    importStoreData(backupData) {
        const { storeName, data, timestamp } = backupData;
        const store = this.stores[storeName];

        if (!store) {
            console.error(`Store ${storeName} 不存在`);
            return false;
        }

        try {
            switch (storeName) {
                case 'gallery':
                    if (data.galleryItems) {
                        store.galleryItems = new Map(data.galleryItems);
                    }
                    if (data.editMode !== undefined) {
                        store.editMode = data.editMode;
                    }
                    break;
                case 'somniumNexus':
                    if (data.galleryCategories) {
                        store.setProductionData(data.galleryCategories);
                    }
                    break;
                case 'testData':
                    if (data.testGalleryData) {
                        store.testGalleryData = data.testGalleryData;
                    }
                    if (data.testLayoutData) {
                        store.testLayoutData = new Map(data.testLayoutData);
                    }
                    if (data.isTestEnvironment !== undefined) {
                        store.isTestEnvironment = data.isTestEnvironment;
                    }
                    break;
            }

            this.log(`导入 ${storeName} 数据成功，备份时间: ${new Date(timestamp).toLocaleString()}`);
            this.notifyStatusChange();
            return true;

        } catch (error) {
            console.error(`导入 ${storeName} 数据失败:`, error);
            return false;
        }
    }

    /**
     * 获取调试信息
     */
    getDebugInfo() {
        return {
            stores: Object.keys(this.stores),
            status: this.storeStatus,
            listenerCount: this.listeners.length,
            debugMode: this.debugMode,
            timestamp: new Date().toISOString()
        };
    }
}

// 创建全局store管理器实例
const storeManager = new StoreManager();

/**
 * 快速访问函数
 */
export const getStore = (storeName) => storeManager.getStore(storeName);
export const getAllStores = () => storeManager.getAllStores();
export const getStoreStatus = () => storeManager.getStoreStatus();
export const getSystemReport = () => storeManager.getSystemReport();
export const resetStore = (storeName) => storeManager.resetStore(storeName);
export const resetAllStores = () => storeManager.resetAllStores();

export default storeManager;