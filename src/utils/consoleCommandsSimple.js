/**
 * 简化版控制台指令系统
 * 使用全局函数方式，避免复杂的console拦截
 * 完全静默模式 - 不输出任何信息
 */

import { environmentManager, LAYOUT_TYPES } from "./environment";
import somniumNexusStore from "@/stores/somniumNexusStore";
import galleryStore from "@/stores/galleryStore";

/**
 * 日志输出（带标识）
 */
function log(message) {
    console.log(`[R0] ${message}`);
}

/**
 * 显示当前环境状态（正常输出模式）
 */
function showCurrentEnvironment() {
    const envInfo = somniumNexusStore.getEnvironmentInfo();
    log('🌍 当前环境状态:');
    log(`  环境类型: ${envInfo.isTestEnvironment ? '测试环境' : '正式环境'}`);
    log(`  分类数量: ${envInfo.categoryCount}`);
    log(`  图片总数: ${envInfo.totalImageCount}`);
    log(`  测试数据: ${envInfo.testDataEnabled ? '启用' : '禁用'}`);
}

/**
 * 显示系统状态（正常输出模式）
 */
async function showSystemStatus() {
    try {
        const storeManagerModule = await import('@/stores/StoreManager');
        const storeManager = storeManagerModule.default;
        const status = storeManager.getStoreStatus();
        log('⚙️ 系统状态:');
        log(`  Gallery项目: ${status.gallery.itemCount}`);
        log(`  编辑模式: ${status.gallery.editMode ? '开启' : '关闭'}`);
        log(`  当前分类: ${status.somniumNexus.selectedCategory || '无'}`);
    } catch (error) {
        log(`❌ 获取系统状态失败: ${error.message}`);
    }
}

/**
 * 切换到测试环境
 */
function r0_t() {
    environmentManager.switchToTestEnvironment();
    log('✅ 已切换到测试环境');
    showCurrentEnvironment();
}

/**
 * 切换到正式环境
 */
function r0_p() {
    environmentManager.switchToProductionEnvironment();
    log('✅ 已切换到正式环境');
    showCurrentEnvironment();
}

/**
 * 显示当前环境状态
 */
function r0_status() {
    showCurrentEnvironment();
    showSystemStatus();
}

/**
 * 显示所有可用指令
 */
function r0_help() {
    log('🔍 R0 控制台指令系统');
    log('━━━━━━━━━━━━━━━━━━━━━');
    log('');
    log('核心指令:');
    log('  r0_t      - 切换到测试环境');
    log('  r0_p      - 切换到正式环境');
    log('  r0_status - 显示当前环境状态');
    log('');
    log('其他指令:');
    log('  r0_help      - 显示此帮助信息');
    log('  r0_info      - 显示系统详细信息');
    log('  r0_flex      - 切换到Flex布局');
    log('  r0_freeform  - 切换到自由布局');
    log('');
    log('💡 提示: 直接在控制台输入指令即可执行');
}

/**
 * 显示系统详细信息
 */
async function r0_info() {
    try {
        const storeManagerModule = await import('@/stores/StoreManager');
        const storeManager = storeManagerModule.default;
        const report = storeManager.getSystemReport();
        log('📋 系统详细信息');
        log('━━━━━━━━━━━━━━━━━━━━━');
        log(`时间戳: ${report.timestamp}`);
        log(`环境: ${report.environment.isTestEnvironment ? '测试' : '正式'}`);
        log(`Store数量: ${Object.keys(report.stores).length}`);

        if (report.recommendations.length > 0) {
            log('\n💡 系统建议:');
            report.recommendations.forEach(rec => {
                log(`  ${rec.message}`);
            });
        }
    } catch (error) {
        log(`❌ 获取系统信息失败: ${error.message}`);
    }
}

/**
 * 显示GalleryStore详细信息
 */
async function r0_gallery() {
    const items = Array.from(galleryStore.galleryItems.entries());
    log('🖼️ GalleryStore信息:');
    log(`  项目数量: ${items.length}`);
    log(`  编辑模式: ${galleryStore.editMode ? '开启' : '关闭'}`);
    log(`  当前分类: ${galleryStore.currentCategory || '无'}`);

    if (items.length > 0) {
        log(`  项目详情:`);
        items.forEach(([id, item]) => {
            log(`    ${id}: x=${item.x}, y=${item.y}, w=${item.width}, h=${item.height}`);
        });
    }
}

/**
 * 切换编辑模式
 */
function r0_edit() {
    galleryStore.toggleEditMode();
    log(`📝 编辑模式: ${galleryStore.editMode ? '开启' : '关闭'}`);
}

/**
 * 执行数据迁移
 */
async function r0_migrate() {
    if (!somniumNexusStore.isUsingTestData) {
        log('❌ 当前不在测试环境，无法执行迁移');
        return;
    }

    try {
        log('🚀 开始数据迁移...');

        // 延迟导入避免循环依赖
        const dataMigrationModule = await import('./dataMigration');
        const dataMigrationManager = dataMigrationModule.dataMigrationManager;

        const result = await dataMigrationManager.performFullMigration({
            includeLayoutData: true,
            backupTestData: true,
            clearAfterMigration: false
        });

        if (result.success) {
            log('✅ 数据迁移完成！');
            log(`📊 迁移ID: ${result.migrationId}`);
            log(`⏱️  耗时: ${result.duration}ms`);
        } else {
            log(`❌ 数据迁移失败: ${result.error}`);
        }
    } catch (error) {
        log(`❌ 迁移过程出错: ${error.message}`);
    }
}

/**
 * 显示彩蛋
 */
function r0_secret() {
    const eggs = [
        '🎉 恭喜你发现了开发者彩蛋！',
        '🔮 Somnium Nexus - 梦境的纽带',
        '✨ 代码如诗，设计如画',
        '🎯 专注于细节，追求完美',
        '🌟 每一个像素都有它的意义'
    ];

    const randomEgg = eggs[Math.floor(Math.random() * eggs.length)];
    log(randomEgg);
}

/**
 * 初始化控制台指令系统
 * 将指令函数挂载到全局window对象
 */
export function initConsoleCommands() {
    if (typeof window === 'undefined') return;

    // 挂载所有指令函数到全局对象
    window.r0_t = r0_t;
    window.r0_p = r0_p;
    window.r0_status = r0_status;
    window.r0_help = r0_help;
    window.r0_info = r0_info;
    window.r0_gallery = r0_gallery;
    window.r0_edit = r0_edit;
    window.r0_migrate = r0_migrate;
    window.r0_secret = r0_secret;
    window.r0_flex = r0_flex;
    window.r0_freeform = r0_freeform;

    // 静默初始化，不输出任何信息
}

/**
 * 切换到Flex布局
 */
function r0_flex() {
    environmentManager.switchToFlexLayout();
    log('已切换到Flex布局');
    showCurrentEnvironment();
}

/**
 * 切换到自由布局
 */
function r0_freeform() {
    environmentManager.switchToFreeformLayout();
    log('已切换到自由布局');
    showCurrentEnvironment();
}

/**
 * 手动执行控制台指令（用于调试）
 */
export function executeConsoleCommand(command) {
    const handler = window[command];
    if (typeof handler === 'function') {
        return handler();
    } else {
        console.log(`[R0] ❌ 未知指令: ${command}`);
        console.log(`[R0] 💡 输入 'r0_help()' 查看可用指令`);
    }
}

export default {
    initConsoleCommands,
    executeConsoleCommand
};