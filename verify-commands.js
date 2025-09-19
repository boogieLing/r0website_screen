/**
 * 控制台指令验证脚本
 * 在浏览器控制台中运行以验证系统功能
 */

// 验证指令系统是否加载
console.log('🔍 验证R0控制台指令系统...');

// 检查全局函数是否存在
if (typeof window !== 'undefined') {
    console.log('✅ 浏览器环境检测');

    // 检查控制台指令管理器
    if (window.console && typeof console.log === 'function') {
        console.log('✅ Console对象可用');

        // 测试基本指令拦截
        console.log('🧪 测试指令拦截功能...');

        // 执行测试指令
        setTimeout(() => {
            console.log('执行: r0-status');
            console.log('r0-status'); // 这应该被拦截并执行
        }, 1000);

        setTimeout(() => {
            console.log('执行: r0-help');
            console.log('r0-help'); // 这应该被拦截并执行
        }, 2000);

        setTimeout(() => {
            console.log('🎉 控制台指令系统验证完成！');
            console.log('');
            console.log('📋 可用指令:');
            console.log('  r0-t      - 切换到测试环境');
            console.log('  r0-p      - 切换到正式环境');
            console.log('  r0-status - 查看环境状态');
            console.log('  r0-help   - 显示所有指令');
            console.log('');
            console.log('💡 直接输入指令即可执行');
        }, 3000);

    } else {
        console.log('❌ Console对象不可用');
    }
} else {
    console.log('❌ 非浏览器环境');
}

// 提供一个快速测试函数
window.testR0Commands = function() {
    console.log('🚀 开始R0指令系统测试...');

    const commands = ['r0-status', 'r0-help', 'r0-info'];
    let index = 0;

    function executeNext() {
        if (index < commands.length) {
            const cmd = commands[index];
            console.log(`\n🧪 测试指令: ${cmd}`);
            console.log(cmd);
            index++;
            setTimeout(executeNext, 1500);
        } else {
            console.log('\n✅ R0指令系统测试完成！');
        }
    }

    executeNext();
};

console.log('📝 输入 testR0Commands() 运行完整测试');

export default {
    testR0Commands: window.testR0Commands
};