/**
 * 控制台指令测试脚本
 * 在浏览器控制台中运行以验证系统功能
 */

// 等待系统初始化完成
setTimeout(() => {
    console.log('🧪 开始测试R0控制台指令系统...');

    // 检查全局函数是否存在
    const commands = ['r0_t', 'r0_p', 'r0_status', 'r0_help', 'r0_info'];
    let foundCount = 0;

    commands.forEach(cmd => {
        if (typeof window[cmd] === 'function') {
            console.log(`✅ ${cmd} 已定义`);
            foundCount++;
        } else {
            console.log(`❌ ${cmd} 未定义`);
        }
    });

    console.log(`\n📊 找到 ${foundCount}/${commands.length} 个指令函数`);

    if (foundCount > 0) {
        console.log('\n🎉 控制台指令系统已就绪！');
        console.log('💡 试试这些指令:');
        console.log('  r0_t()      - 切换到测试环境');
        console.log('  r0_p()      - 切换到正式环境');
        console.log('  r0_status() - 查看环境状态');
        console.log('  r0_help()   - 显示帮助信息');
        console.log('');
        console.log('🔍 输入指令时记得添加括号: r0_t()');
    } else {
        console.log('\n❌ 控制台指令系统未正确加载');
        console.log('🔧 请检查开发环境是否正常运行');
    }
}, 2000); // 等待2秒确保系统初始化完成

// 提供一个快速测试函数
window.testR0Commands = function() {
    console.log('🚀 开始R0指令系统测试...');

    // 测试基础指令
    if (typeof r0_status === 'function') {
        console.log('🧪 测试 r0_status():');
        r0_status();
    } else {
        console.log('❌ r0_status 函数未定义');
    }

    // 测试帮助指令
    setTimeout(() => {
        if (typeof r0_help === 'function') {
            console.log('\n🧪 测试 r0_help():');
            r0_help();
        } else {
            console.log('❌ r0_help 函数未定义');
        }
    }, 500);
};

console.log('📝 输入 testR0Commands() 运行完整测试');

export default {
    testR0Commands: window.testR0Commands
};