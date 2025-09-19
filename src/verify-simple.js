/**
 * 简化版控制台指令验证
 * 在浏览器控制台中运行 - 完全静默模式
 */

(function() {
    // 等待系统初始化 - 完全静默，不输出任何信息
    setTimeout(function() {
        // 检查核心函数是否存在（静默检查）
        var commands = ['r0_t', 'r0_p', 'r0_status', 'r0_help'];
        var found = [];
        var missing = [];

        commands.forEach(function(cmd) {
            if (typeof window[cmd] === 'function') {
                found.push(cmd);
            } else {
                missing.push(cmd);
            }
        });

        // 静默模式下不输出检测结果
        // 只提供测试函数，不主动提示

        if (found.length > 0) {
            // 系统已就绪，但不输出任何信息
            // 提供一个静默的快速测试函数
            window.quickTest = function() {
                // 静默执行测试，只输出结果
                if (typeof window.r0_status === 'function') {
                    window.r0_status();
                }
            };
        }
        // 如果系统未加载，也不输出任何错误信息
    }, 1500); // 等待1.5秒确保系统初始化
})();

// 完全静默，不输出任何信息