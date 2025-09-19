/**
 * 完全静默的控制台指令验证
 * 在浏览器控制台中运行 - 无任何输出
 */

// 完全静默的验证 - 不输出任何信息
(function() {
    // 等待系统初始化 - 完全静默
    setTimeout(function() {
        // 静默检查核心函数是否存在
        var commands = ['r0_t', 'r0_p', 'r0_status', 'r0_help'];
        var found = 0;

        commands.forEach(function(cmd) {
            if (typeof window[cmd] === 'function') {
                found++;
            }
        });

        // 完全静默 - 不输出任何检测结果
        // 只提供静默的测试函数，不主动提示
        if (found > 0) {
            // 系统已就绪，但不输出任何信息
            // 提供一个完全静默的快速测试函数
            window.r0test = function() {
                // 静默执行测试
                if (typeof window.r0_status === 'function') {
                    window.r0_status();
                }
            };
        }
        // 如果系统未加载，也不输出任何错误信息
    }, 1500); // 等待1.5秒确保系统初始化
})();

// 完全静默，不输出任何信息
// 不提供任何导出或提示
// 只有主动调用r0test()才会执行测试（如果系统已加载）