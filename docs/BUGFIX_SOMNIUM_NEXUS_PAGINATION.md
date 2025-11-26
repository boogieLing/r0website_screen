# Somnium/Nexus 滚动分页回归问题记录

## 问题 1：欢迎页首屏未使用 nexus 图源
- 现象：首次进入 `/somnium/nexus` 时，欢迎页依旧落回兜底图片，未呈现 nexus 分类的作品。
- 原因：分页改造后未在未选项目状态下强制预取 nexus 分类，SimpleWelcomeModule 也未对后续传入的预取图片响应刷新。
- 修复：
  - 未选分类时强制 `loadCategoryDetail('nexus', {force: true, reset: true})`，成功后将图片传入欢迎页并标记已预取，失败允许重试。
  - SimpleWelcomeModule 监听 `prefetchedImages` 变更，预取数据到达后优先使用，仍不足时再兜底。  
  - 相关文件：`src/screens/SomniumNexus/index.js`、`src/screens/SomniumNexus/SimpleWelcomeModule.js`。

## 问题 2：分类布局配置未生效（回归旧问题）
- 现象：选择分类后未按后端 `Settings.LayoutMode` 应用布局，回退到全局布局。
- 原因：分页加载路径未补全分类 settings；切换分类时未再次确保 layoutMode 已写入。
- 修复：
  - 在分页加载前若检测到缺失 layoutMode，先执行 `ensureCategorySettings` 补全 settings。
  - 分类切换后再次验证 layoutMode，缺失则补全，避免回退。
  - 相关文件：`src/stores/somniumNexusStore.js`、`src/screens/SomniumNexus/index.js`。

## 验证步骤
1. 访问 `/somnium/nexus`，不选项目时欢迎页展示 nexus 分类图片（网络正常时），无须手动刷新。
2. 切换到包含 LayoutMode 配置的分类（如后端返回 flex），确认画廊布局立即按分类配置渲染。
3. 滚动加载更多图片，检查无重复请求卡死，布局保持正确。
