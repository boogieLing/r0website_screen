# R0 控制台指令系统

## 🔒 安全说明

控制台指令系统仅在开发环境（`NODE_ENV === 'development'`）下启用，生产环境不会加载此功能。

## ⚡ 快速指令

### 环境切换
- `r0_t` - 切换到测试环境 (Test Environment)
- `r0_p` - 切换到正式环境 (Production Environment)

### 状态查询
- `r0_status` - 显示当前环境状态
- `r0_info` - 显示系统详细信息

## 🎯 完整指令列表

### 环境管理
```
r0_t      切换到测试环境
r0_p      切换到正式环境
r0_status 显示当前环境状态
```

### 调试工具
```
r0_stores 显示所有store状态
r0_gallery 显示GalleryStore详细信息
r0_edit   切换编辑模式
r0_reset  重置所有store数据
```

### 数据迁移
```
r0_migrate 执行数据迁移（测试→正式）
```

### 信息查询
```
r0_info   显示系统详细信息
r0_help   显示所有可用指令
r0_cmds   显示按分类组织的指令
r0_history 显示指令执行历史
```

### 趣味彩蛋
```
r0_secret 开发者彩蛋 🎉
```

## 📋 使用说明

### 基本用法
在浏览器控制台中直接输入指令即可：

```javascript
r0_t
r0_status
r0_help
```

### 环境切换示例
```javascript
// 切换到测试环境
r0_t

// 查看当前状态
r0_status

// 切换到正式环境
r0_p

// 再次确认状态
r0_status
```

### 调试示例
```javascript
// 查看所有store状态
r0-stores

// 查看gallery详细信息
r0-gallery

// 切换编辑模式
r0-edit
```

### 数据迁移示例
```javascript
// 执行完整数据迁移
r0_migrate

// 迁移前建议查看状态
r0-status
```

## 🔍 输出格式

所有指令都会以 `[R0]` 前缀输出，便于识别：

```
[R0] ✅ 已切换到测试环境
[R0] 🌍 当前环境状态:
[R0]   环境类型: 测试环境
[R0]   分类数量: 6
[R0]   图片总数: 36
```

## ⚠️ 注意事项

1. **开发环境限定**: 控制台指令只在开发环境下有效
2. **安全考虑**: 不要在生产环境中暴露这些功能
3. **指令前缀**: 所有指令必须以 `r0_` 开头
4. **错误处理**: 未知指令会提示可用指令列表

## 🛠️ 技术实现

控制台指令通过重写 `console.log`、`console.error` 和 `console.warn` 方法来拦截特殊格式的消息实现。

### 初始化
```javascript
// 在应用入口自动初始化
import { initConsoleCommands } from './utils/consoleCommands';

if (process.env.NODE_ENV === 'development') {
    initConsoleCommands();
}
```

## 🎯 推荐工作流程

### 开发阶段
```javascript
r0_t      // 切换到测试环境
r0_status // 确认状态
r0_edit   // 开启编辑模式（如需要）
```

### 测试阶段
```javascript
r0_p      // 切换到正式环境
r0_status // 确认状态
r0_info   // 查看详细信息
```

### 调试阶段
```javascript
r0_stores // 查看store状态
r0_gallery // 查看gallery详情
r0_reset  // 重置数据（如需要）
```

### 迁移阶段
```javascript
r0_t      // 确保在测试环境
r0_migrate // 执行数据迁移
r0_p      // 切换到正式环境
r0-status // 确认迁移结果
```

## 🔧 故障排除

### 指令无响应
- 确认在开发环境下运行
- 检查浏览器控制台是否打开
- 确保输入格式正确（包含 `r0_` 前缀）

### 环境切换失败
- 使用 `r0_status` 查看当前状态
- 检查是否有错误信息输出
- 确认store状态正常

### 数据异常
- 使用 `r0-stores` 查看store状态
- 考虑使用 `r0-reset` 重置数据
- 查看控制台错误信息

---

**版本**: 1.0.0
**最后更新**: 2024年
**安全等级**: 🔒 开发环境专用