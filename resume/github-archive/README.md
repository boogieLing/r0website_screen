# GitHub 项目本地归档说明

本目录用于沉淀 `boogieLing` GitHub 仓库分析结果，便于后续多次复用。

## 文件说明

- `github_projects_raw_latest.json`
  - 最新的结构化原始归档（包含每个仓库的基础信息、作用、技术栈、优化点推断）。
- `github_projects_analysis_latest.md`
  - 最新的人类可读分析文档（逐仓库列出作用、技术栈、优化点）。
- `github_projects_raw_YYYYMMDD_HHMMSS.json`
  - 历史快照。
- `github_projects_analysis_YYYYMMDD_HHMMSS.md`
  - 历史分析快照。

## 归档口径

- 统计范围：`https://github.com/boogieLing?tab=repositories` 可见公开仓库。
- 目前快照：共 51 个仓库（自建 15，Fork 36）。
- 分析字段：`作用`、`技术栈`、`可优化点`。

## 更新方式

需要重新抓取时，可复用本次执行逻辑：

1. 调 GitHub API 拉仓库列表。
2. 对自建仓库补充 README 与语言分布信息。
3. 生成最新 `latest` 文件并保留时间戳历史快照。
