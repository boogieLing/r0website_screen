/**
 * Store 统一导出文件
 * 集中管理所有store的导出
 */

// 核心store
export { default as globalStore } from './globalStore';
export { default as colorStore } from './colorStore';
export { default as osuStore } from './osuStore';
export { default as picBedStore } from './picBedStore';
export { default as curPostStore } from './curPostStore';
export { default as cursorTipsStore } from './cursorTipsStore';
export { default as sidebarStore } from './sidebarStore';

// 图集相关store
export { default as galleryStore } from './galleryStore';
export { default as somniumNexusStore } from './somniumNexusStore';

// 测试数据store
export { default as testDataStore } from './testDataStore';

// Store工具类
export { default as StoreManager } from './StoreManager';