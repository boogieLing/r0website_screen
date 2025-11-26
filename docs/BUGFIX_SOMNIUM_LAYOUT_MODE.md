# Somnium/Nexus 布局模式加载异常问题记录

## 问题
- 通过路由直接进入某分类（例如 `nexus`）时，后端返回 `Settings.LayoutMode = flex`，但页面仍显示为自由布局。
- 控制台日志显示：`categoryLayoutMode: null`、`computedLayout: freeform`，说明分类的布局配置在首次选中时缺失。

## 原因
- 分类列表未就绪时就选中了分类并开始渲染，`currentCategory.settings` 为空，未能从服务端配置中获取 `layoutMode`，导致布局逻辑回退到全局默认的自由布局。

## 解决方案
- 在 `somniumNexusStore` 中新增 `ensureCategorySettings`：如当前分类缺少 `settings.layoutMode`，重新请求分类列表并补全 `settings/Settings` 字段。
- 在 `setSelectedCategory` 调用 `ensureCategorySettings` 优先补全配置，再加载图片详情。
- 对分类设置标准化时增加 `trim()`，防止空格或大小写导致的识别失败。
- 在 `SomniumNexus` 布局计算的 `useEffect` 中增加日志输出，记录选中分类、布局配置及计算结果，便于诊断。

## 影响文件
- `src/stores/somniumNexusStore.js`
- `src/screens/SomniumNexus/index.js`

## 复现与验证
1. 路由直达 `.../somnium/nexus/nexus`。
2. 打开控制台，查看 `[SomniumNexus] 布局更新` 日志，确认 `categoryLayoutMode` 与 `computedLayout` 为 `flex`。
3. 页面应呈现网格（Flex）布局。

## 后续建议
- 若后端返回格式调整，需同步更新 `normalizeSettings` 的兼容逻辑。
- 发布前可在正式接口环境下回归：切换不同分类，确认布局随 `Settings.LayoutMode` 变更。
