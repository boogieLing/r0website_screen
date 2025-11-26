# 仓库贡献指南

## 项目结构
- `src/` 为核心前端代码，包含 `components/`（通用组件）、`screens/`（页面级组件）、`stores/`（MobX 状态）、`hooks/`、`request/`（请求封装）、`utils/`、`static/` 和 `types/`。
- `public/` 存放 HTML 模板和公共静态资源；`build/` 为构建产物目录，请不要直接修改。
- `docs/` 存放行为说明、控制台指令说明（如 `docs/CONSOLE_COMMANDS.md`）及数据迁移文档。
- 根目录有 `craco.config.js`、`nginx.conf`、`Dockerfile` 与 `screen.Dockerfile` 等配置文件。

## 构建与本地开发
- `npm install` / `yarn`：安装依赖。
- `npm start`：启动开发服务器（CRACO + CRA），默认端口 `http://localhost:3000`。
- `npm run build`：构建生产版本到 `build/` 目录。
- `npm test`：通过 `craco test` 运行 Jest + React Testing Library 测试。
- `./docker-build.sh`：使用 `screen.Dockerfile` 构建屏幕相关 Docker 镜像。

## 代码风格与命名
- 使用 React 函数组件与 Hooks，状态管理使用 MobX；从 `src/` 导入时优先使用 `@/` 别名（例如 `@/components/...`）。
- 统一使用 4 空格缩进、单引号和分号；提交前确保通过默认 `react-app` ESLint 规则。
- 组件与文件名使用帕斯卡命名（例如 `InfiniteGallery/InfiniteGallery.js`、`InfiniteGallery.module.less`）；自定义 Hook 以 `useX` 命名，Store 以 `XStore` 命名。

## 测试规范
- 测试框架为 Jest 与 React Testing Library（`@testing-library/*`、`@testing-library/jest-dom`）。
- 测试文件放在被测代码附近，命名为 `*.test.js` 或 `*.test.tsx`。
- 提交合并请求前请运行 `npm test`；如暂时无法补充自动化测试，请在合并请求中写明手动测试方案。

## 提交与合并请求
- Commit 信息参考现有历史，采用「类型 + 简短描述」格式，例如：`feat: 新增项目创建功能`、`[Fix]: 修复 hover 边框颜色`、`[Style]: 调整操作 tab 样式`。
- 每次提交应聚焦单一变更，清晰说明目的；如有对应 Issue 或内部文档，请在描述中标注。
- 合并请求内容应包括：变更说明、UI 相关截图或短视频（如有）、数据迁移或控制台指令影响说明、以及简单测试说明。

## 语言与安全配置
- 本仓库相关文档、代码注释以及自动化助手回复应优先使用简体中文；确需英文时，请尽量附带简要中文说明。
- 禁止将密钥、Token 或其他敏感配置直接提交到仓库；使用 `.env` 与 `REACT_APP_*` 环境变量进行配置。
- 修改 `nginx.conf`、各类 Dockerfile 或 `request/` 下的 axios 配置时，请同步考虑部署环境与外部服务依赖，并在合并请求中明确说明影响范围。
