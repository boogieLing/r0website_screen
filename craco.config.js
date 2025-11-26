const path = require("path");
const CracoLessPlugin = require("craco-less");
module.exports = {
    // webpack 配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            "@": path.resolve(__dirname, "src")
        }
    },
    jest: {
        configure: {
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1'
            }
        }
    },
    plugins: [{
        plugin: CracoLessPlugin,
        options: {
            cssLoaderOptions: {
                modules: {localIdentName: "[local]_[hash:base64:5]"},
            }
        }
    }]
};
