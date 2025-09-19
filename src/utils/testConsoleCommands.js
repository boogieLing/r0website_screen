/**
 * 控制台指令测试脚本
 * 用于验证控制台指令系统是否正常工作
 */

import { executeConsoleCommand, getConsoleCommandStats } from './consoleCommands';
import { environmentManager } from './environment';

/**
 * 测试控制台指令系统
 */
export function testConsoleCommands() {
    console.log('🧪 开始测试控制台指令系统...');

    // 测试基本环境指令
    console.log('\n📋 测试环境切换指令:');

    // 切换到测试环境
    console.log('执行: r0-t');
    executeConsoleCommand('r0-t');

    // 检查环境状态
    setTimeout(() => {
        console.log('执行: r0-status');
        executeConsoleCommand('r0-status');

        // 切换到正式环境
        setTimeout(() => {
            console.log('执行: r0-p');
            executeConsoleCommand('r0-p');

            // 再次检查状态
            setTimeout(() => {
                console.log('执行: r0-status');
                executeConsoleCommand('r0-status');

                // 测试帮助指令
                setTimeout(() => {
                    console.log('执行: r0-help');
                    executeConsoleCommand('r0-help');

                    // 显示统计信息
                    setTimeout(() => {
                        const stats = getConsoleCommandStats();
                        console.log('\n📊 指令执行统计:');
                        console.log(`总指令数: ${stats.totalCommands}`);
                        console.log(`已执行: ${stats.executedCommands}`);
                        console.log(`指令分类: ${stats.categories.size}`);

                        console.log('\n✅ 控制台指令测试完成！');
                        console.log('💡 现在你可以在浏览器控制台中直接输入指令使用');
                        console.log('🔍 试试输入: r0-help');
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

/**
 * 手动测试特定指令
 */
export function testSpecificCommand(command) {
    console.log(`🧪 测试指令: ${command}`);
    executeConsoleCommand(command);
}

/**
 * 显示可用的控制台指令
 */
export function showAvailableCommands() {
    console.log('🎯 可用的控制台指令:');
    console.log('━━━━━━━━━━━━━━━━━━━━━');
    console.log('环境切换:');
    console.log('  r0-t      - 切换到测试环境');
    console.log('  r0-p      - 切换到正式环境');
    console.log('  r0-status - 显示当前环境状态');
    console.log('');
    console.log('调试工具:');
    console.log('  r0-help   - 显示所有可用指令');
    console.log('  r0-stores - 显示所有store状态');
    console.log('  r0-gallery- 显示GalleryStore详细信息');
    console.log('');
    console.log('💡 在浏览器控制台中直接输入指令即可执行');
}

/**
 * 验证环境切换功能
 */
export function verifyEnvironmentSwitching() {
    console.log('🔍 验证环境切换功能...');

    const initialEnv = environmentManager.getCurrentEnvironment();
    console.log(`初始环境: ${initialEnv}`);

    // 测试切换到测试环境
    executeConsoleCommand('r0-t');

    setTimeout(() => {
        const testEnv = environmentManager.getCurrentEnvironment();
        console.log(`切换到测试环境后: ${testEnv}`);

        // 测试切换到正式环境
        executeConsoleCommand('r0-p');

        setTimeout(() => {
            const prodEnv = environmentManager.getCurrentEnvironment();
            console.log(`切换到正式环境后: ${prodEnv}`);

            if (testEnv === 'test' && prodEnv === 'production') {
                console.log('✅ 环境切换功能验证成功！');
            } else {
                console.log('❌ 环境切换功能验证失败');
            }
        }, 500);
    }, 500);
}

// 自动执行的测试（如果直接引用此文件）
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🚀 控制台指令系统已加载');
    console.log('💡 输入 showAvailableCommands() 查看可用指令');
    console.log('🧪 输入 testConsoleCommands() 运行完整测试');

    // 将测试函数暴露到全局
    window.showAvailableCommands = showAvailableCommands;
    window.testConsoleCommands = testConsoleCommands;
    window.testSpecificCommand = testSpecificCommand;
    window.verifyEnvironmentSwitching = verifyEnvironmentSwitching;
}

export default {
    testConsoleCommands,
    testSpecificCommand,
    showAvailableCommands,
    verifyEnvironmentSwitching
};