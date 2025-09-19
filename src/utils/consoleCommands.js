/**
 * 控制台指令系统
 * 提供隐藏的控制台命令用于环境切换和系统控制
 * 只有开发者知道的特殊指令
 */

import { environmentManager } from "./environment";
import somniumNexusStore from "@/stores/somniumNexusStore";
import galleryStore from "@/stores/galleryStore";

/**
 * 控制台指令管理器
 */
class ConsoleCommandManager {
    constructor() {
        this.commands = new Map();
        this.commandHistory = [];
        this.isEnabled = true;
        this.secretPrefix = 'r0_'; // 所有指令都以r0_开头
        this.setupCommands();
        this.setupConsoleInterceptor();
    }

    /**
     * 设置所有可用的控制台指令
     */
    setupCommands() {
        // 环境切换指令
        this.registerCommand('r0_t', {
            description: '切换到测试环境 (Test Environment)',
            handler: () => {
                environmentManager.switchToTestEnvironment();
                this.log('✅ 已切换到测试环境');
                this.showCurrentEnvironment();
            },
            category: 'environment'
        });

        this.registerCommand('r0_p', {
            description: '切换到正式环境 (Production Environment)',
            handler: () => {
                environmentManager.switchToProductionEnvironment();
                this.log('✅ 已切换到正式环境');
                this.showCurrentEnvironment();
            },
            category: 'environment'
        });

        // 环境状态查询
        this.registerCommand('r0_status', {
            description: '显示当前环境状态',
            handler: () => {
                this.showCurrentEnvironment();
                this.showSystemStatus();
            },
            category: 'info'
        });

        // Store管理指令 - 使用延迟导入避免循环依赖
        this.registerCommand('r0_stores', {
            description: '显示所有store状态',
            handler: async () => {
                try {
                    const storeManagerModule = await import('@/stores/StoreManager');
                    const storeManager = storeManagerModule.default;
                    const status = storeManager.getStoreStatus();
                    this.log('📊 Store状态:');
                    Object.keys(status).forEach(storeName => {
                        this.log(`  ${storeName}: ${JSON.stringify(status[storeName], null, 2)}`);
                    });
                } catch (error) {
                    this.log(`❌ 获取store状态失败: ${error.message}`);
                }
            },
            category: 'debug'
        });

        this.registerCommand('r0_reset', {
            description: '重置所有store数据',
            handler: async () => {
                if (window.confirm('确定要重置所有store数据吗？此操作不可恢复。')) {
                    try {
                        const storeManagerModule = await import('@/stores/StoreManager');
                        const storeManager = storeManagerModule.default;
                        storeManager.resetAllStores();
                        this.log('🔄 所有store已重置');
                    } catch (error) {
                        this.log(`❌ 重置store失败: ${error.message}`);
                    }
                }
            },
            category: 'debug'
        });

        // Gallery相关指令
        this.registerCommand('r0_gallery', {
            description: '显示GalleryStore详细信息',
            handler: () => {
                const items = Array.from(galleryStore.galleryItems.entries());
                this.log(`🖼️ GalleryStore信息:`);
                this.log(`  项目数量: ${items.length}`);
                this.log(`  编辑模式: ${galleryStore.editMode ? '开启' : '关闭'}`);
                this.log(`  当前分类: ${galleryStore.currentCategory || '无'}`);

                if (items.length > 0) {
                    this.log(`  项目详情:`);
                    items.forEach(([id, item]) => {
                        this.log(`    ${id}: x=${item.x}, y=${item.y}, w=${item.width}, h=${item.height}`);
                    });
                }
            },
            category: 'debug'
        });

        this.registerCommand('r0_edit', {
            description: '切换编辑模式',
            handler: () => {
                galleryStore.toggleEditMode();
                this.log(`📝 编辑模式: ${galleryStore.editMode ? '开启' : '关闭'}`);
            },
            category: 'control'
        });

        // 数据迁移指令 - 使用延迟导入避免循环依赖
        this.registerCommand('r0_migrate', {
            description: '执行数据迁移（测试环境→正式环境）',
            handler: async () => {
                if (!somniumNexusStore.isUsingTestData) {
                    this.log('❌ 当前不在测试环境，无法执行迁移');
                    return;
                }

                try {
                    this.log('🚀 开始数据迁移...');

                    // 延迟导入避免循环依赖
                    const dataMigrationModule = await import('./dataMigration');
                    const dataMigrationManager = dataMigrationModule.dataMigrationManager;

                    const result = await dataMigrationManager.performFullMigration({
                        includeLayoutData: true,
                        backupTestData: true,
                        clearAfterMigration: false
                    });

                    if (result.success) {
                        this.log('✅ 数据迁移完成！');
                        this.log(`📊 迁移ID: ${result.migrationId}`);
                        this.log(`⏱️  耗时: ${result.duration}ms`);
                    } else {
                        this.log(`❌ 数据迁移失败: ${result.error}`);
                    }
                } catch (error) {
                    this.log(`❌ 迁移过程出错: ${error.message}`);
                }
            },
            category: 'migration'
        });

        // 帮助指令
        this.registerCommand('r0_help', {
            description: '显示所有可用指令',
            handler: () => {
                this.showHelp();
            },
            category: 'help'
        });

        this.registerCommand('r0_cmds', {
            description: '显示按分类组织的指令列表',
            handler: () => {
                this.showCommandsByCategory();
            },
            category: 'help'
        });

        // 系统信息
        this.registerCommand('r0_info', {
            description: '显示系统详细信息',
            handler: () => {
                this.showSystemInfo();
            },
            category: 'info'
        });

        // 隐藏彩蛋指令
        this.registerCommand('r0_secret', {
            description: '开发者彩蛋 🎉',
            handler: () => {
                this.showEasterEgg();
            },
            category: 'fun'
        });

        // 历史指令
        this.registerCommand('r0_history', {
            description: '显示指令执行历史',
            handler: () => {
                this.showCommandHistory();
            },
            category: 'history'
        });
    }

    /**
     * 注册控制台指令
     */
    registerCommand(name, config) {
        this.commands.set(name, {
            name,
            description: config.description,
            handler: config.handler,
            category: config.category || 'misc'
        });
    }

    /**
     * 设置控制台拦截器
     */
    setupConsoleInterceptor() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        // 重写console方法以捕获我们的特殊指令
        console.log = (...args) => {
            const message = args.join(' ');
            if (this.isEnabled && this.isSecretCommand(message)) {
                this.executeCommand(message.trim());
                return; // 不输出到控制台
            }
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            const message = args.join(' ');
            if (this.isEnabled && this.isSecretCommand(message)) {
                this.executeCommand(message.trim());
                return;
            }
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            const message = args.join(' ');
            if (this.isEnabled && this.isSecretCommand(message)) {
                this.executeCommand(message.trim());
                return;
            }
            originalWarn.apply(console, args);
        };
    }

    /**
     * 检查是否为秘密指令
     */
    isSecretCommand(message) {
        return message && message.startsWith(this.secretPrefix);
    }

    /**
     * 执行控制台指令
     */
    executeCommand(command) {
        const cmd = this.commands.get(command);

        if (!cmd) {
            this.log(`❌ 未知指令: ${command}`);
            this.log(`💡 输入 'r0-help' 查看所有可用指令`);
            return;
        }

        try {
            // 记录指令历史
            this.commandHistory.push({
                command,
                timestamp: Date.now(),
                category: cmd.category
            });

            // 限制历史记录数量
            if (this.commandHistory.length > 100) {
                this.commandHistory.shift();
            }

            // 执行指令
            cmd.handler();

        } catch (error) {
            this.log(`❌ 指令执行失败: ${error.message}`);
        }
    }

    /**
     * 显示当前环境状态
     */
    showCurrentEnvironment() {
        const envInfo = somniumNexusStore.getEnvironmentInfo();
        this.log('🌍 当前环境状态:');
        this.log(`  环境类型: ${envInfo.isTestEnvironment ? '测试环境' : '正式环境'}`);
        this.log(`  分类数量: ${envInfo.categoryCount}`);
        this.log(`  图片总数: ${envInfo.totalImageCount}`);
        this.log(`  测试数据: ${envInfo.testDataEnabled ? '启用' : '禁用'}`);
    }

    /**
     * 显示系统状态
     */
    async showSystemStatus() {
        try {
            const storeManagerModule = await import('@/stores/StoreManager');
            const storeManager = storeManagerModule.default;
            const status = storeManager.getStoreStatus();
            this.log('⚙️ 系统状态:');
            this.log(`  Gallery项目: ${status.gallery.itemCount}`);
            this.log(`  编辑模式: ${status.gallery.editMode ? '开启' : '关闭'}`);
            this.log(`  当前分类: ${status.somniumNexus.selectedCategory || '无'}`);
        } catch (error) {
            this.log(`❌ 获取系统状态失败: ${error.message}`);
        }
    }

    /**
     * 显示帮助信息
     */
    showHelp() {
        this.log('🔍 R0 控制台指令系统');
        this.log('━━━━━━━━━━━━━━━━━━━━━');
        this.log('');

        this.commands.forEach((cmd, name) => {
            this.log(`  ${name.padEnd(15)} - ${cmd.description}`);
        });

        this.log('');
        this.log('💡 提示: 在控制台直接输入指令即可执行');
    }

    /**
     * 按分类显示指令
     */
    showCommandsByCategory() {
        const categories = {};

        this.commands.forEach((cmd, name) => {
            if (!categories[cmd.category]) {
                categories[cmd.category] = [];
            }
            categories[cmd.category].push(cmd);
        });

        this.log('📚 指令分类列表');
        this.log('━━━━━━━━━━━━━━━━━━━━━');

        Object.keys(categories).sort().forEach(category => {
            this.log(`\n🔸 ${this.getCategoryName(category)}:`);
            categories[category].forEach(cmd => {
                this.log(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
            });
        });
    }

    /**
     * 获取分类中文名称
     */
    getCategoryName(category) {
        const names = {
            'environment': '环境管理',
            'info': '信息查询',
            'debug': '调试工具',
            'control': '控制指令',
            'migration': '数据迁移',
            'help': '帮助信息',
            'history': '历史记录',
            'fun': '趣味彩蛋'
        };
        return names[category] || category;
    }

    /**
     * 显示系统详细信息
     */
    async showSystemInfo() {
        try {
            const storeManagerModule = await import('@/stores/StoreManager');
            const storeManager = storeManagerModule.default;
            const report = storeManager.getSystemReport();
            this.log('📋 系统详细信息');
            this.log('━━━━━━━━━━━━━━━━━━━━━');
            this.log(`时间戳: ${report.timestamp}`);
            this.log(`环境: ${report.environment.isTestEnvironment ? '测试' : '正式'}`);
            this.log(`Store数量: ${Object.keys(report.stores).length}`);

            if (report.recommendations.length > 0) {
                this.log('\n💡 系统建议:');
                report.recommendations.forEach(rec => {
                    this.log(`  ${rec.message}`);
                });
            }
        } catch (error) {
            this.log(`❌ 获取系统信息失败: ${error.message}`);
        }
    }

    /**
     * 显示指令历史
     */
    showCommandHistory() {
        if (this.commandHistory.length === 0) {
            this.log('📜 暂无指令历史');
            return;
        }

        this.log('📜 指令执行历史');
        this.log('━━━━━━━━━━━━━━━━━━━━━');

        this.commandHistory.slice(-10).forEach((record, index) => {
            const time = new Date(record.timestamp).toLocaleTimeString();
            this.log(`${index + 1}. ${record.command.padEnd(15)} ${time}`);
        });
    }

    /**
     * 显示彩蛋
     */
    showEasterEgg() {
        const eggs = [
            '🎉 恭喜你发现了开发者彩蛋！',
            '🔮 Somnium Nexus - 梦境的纽带',
            '✨ 代码如诗，设计如画',
            '🎯 专注于细节，追求完美',
            '🌟 每一个像素都有它的意义'
        ];

        const randomEgg = eggs[Math.floor(Math.random() * eggs.length)];
        this.log(randomEgg);
    }

    /**
     * 日志输出（带标识）
     */
    log(message) {
        console.log(`[R0] ${message}`);
    }

    /**
     * 启用控制台指令系统
     */
    enable() {
        this.isEnabled = true;
        this.log('🚀 R0控制台指令系统已启用');
        this.log('💡 输入 "r0-help" 查看可用指令');
    }

    /**
     * 禁用控制台指令系统
     */
    disable() {
        this.isEnabled = false;
        this.log('🔒 R0控制台指令系统已禁用');
    }

    /**
     * 获取指令统计
     */
    async getStats() {
        const stats = {
            totalCommands: this.commands.size,
            executedCommands: this.commandHistory.length,
            categories: new Set(),
            mostUsed: {}
        };

        this.commands.forEach(cmd => stats.categories.add(cmd.category));

        // 统计最常用的指令
        const usageCount = {};
        this.commandHistory.forEach(record => {
            usageCount[record.command] = (usageCount[record.command] || 0) + 1;
        });

        const sorted = Object.entries(usageCount).sort((a, b) => b[1] - a[1]);
        stats.mostUsed = sorted.slice(0, 5);

        return stats;
    }
}

// 创建全局控制台指令管理器实例
const consoleCommandManager = new ConsoleCommandManager();

// 将测试函数暴露到全局作用域
if (typeof window !== 'undefined') {
    window.r0Commands = {
        test: () => {
            console.log('🧪 R0控制台指令系统测试');
            console.log('━━━━━━━━━━━━━━━━━━━━━');
            console.log('✅ 控制台指令系统已就绪');
            console.log('💡 试试这些指令:');
            console.log('  r0-t      - 切换到测试环境');
            console.log('  r0-p      - 切换到正式环境');
            console.log('  r0-status - 查看环境状态');
            console.log('  r0-help   - 显示所有指令');
        },
        stats: async () => {
            try {
                const stats = await consoleCommandManager.getStats();
                console.log('📊 R0指令统计:');
                console.log(`总指令数: ${stats.totalCommands}`);
                console.log(`已执行: ${stats.executedCommands}`);
                console.log(`指令分类: ${Array.from(stats.categories).join(', ')}`);
            } catch (error) {
                console.log(`❌ 获取统计信息失败: ${error.message}`);
            }
        }
    };
}

/**
 * 初始化控制台指令系统
 */
export function initConsoleCommands() {
    consoleCommandManager.enable();
    // 完全静默初始化，不输出任何提示信息
}

/**
 * 手动执行控制台指令（用于调试）
 */
export function executeConsoleCommand(command) {
    return consoleCommandManager.executeCommand(command);
}

/**
 * 获取控制台指令统计
 */
export async function getConsoleCommandStats() {
    return await consoleCommandManager.getStats();
}

export default consoleCommandManager;