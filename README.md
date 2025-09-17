# R0 Website - Personal Portfolio & Blog

一个基于 React 的个人网站，包含博客、图片库和丰富的交互功能。

A React-based personal website featuring blog, image gallery, and rich interactive functionality.

## 🌟 项目特色 | Features

- **🎨 自定义光标系统 | Custom Cursor System**: 全局交互式光标效果
- **📝 博客系统 | Blog System**: 支持分类、标签、Markdown 渲染
- **🖼️ 图片库 | Image Gallery**: 分类图片管理和缩放查看
- **🎵 音效集成 | Sound Integration**: 丰富的交互音效
- **📱 响应式设计 | Responsive Design**: 适配各种设备尺寸
- **🎯 动态背景 | Dynamic Background**: 主页动态视觉效果

## 🚀 技术栈 | Tech Stack

### 核心技术 | Core Technologies
- **React 18.2.0** - 前端框架
- **MobX 6.6.2** - 状态管理
- **React Router DOM 6.4.2** - 路由管理
- **CRACO** - Create React App 配置重写

### 样式与交互 | Styling & Interaction
- **LESS** - CSS 预处理器
- **CSS Modules** - 模块化样式
- **Masonic** - 瀑布流布局
- **use-sound** - 音效管理

### 内容处理 | Content Processing
- **React Markdown** - Markdown 渲染
- **react-syntax-highlighter** - 代码语法高亮
- **react-image-zooom** - 图片缩放功能

## 📦 项目结构 | Project Structure

```
src/
├── components/          # 可复用组件
│   ├── cursor/         # 自定义光标系统
│   ├── r0List/         # 列表容器组件
│   ├── sideLogin/      # 侧边登录组件
│   ├── button/         # 按钮组件集合
│   ├── scrollBars/     # 自定义滚动条
│   ├── template/       # 模板组件
│   ├── sortController/ # 排序控制器
│   ├── filingInfo/     # 文件信息组件
│   └── win10GridBox/   # Win10风格网格
├── screens/            # 页面级组件
│   ├── Home/           # 主页
│   ├── Blog/           # 博客系统
│   ├── PicBed/         # 图片库
│   ├── More/           # 更多内容
│   └── Test/           # 测试页面
├── stores/             # MobX 状态管理
│   ├── globalStore.js  # 全局状态
│   ├── colorStore.js   # 颜色主题
│   ├── osuStore.js     # OSU相关
│   ├── picBedStore.js  # 图片库状态
│   ├── curPostStore.js # 当前文章
│   └── cursorTipsStore.js # 光标提示
├── hooks/              # 自定义钩子
│   ├── localStorage.js # 本地存储
│   ├── windowSize.js   # 窗口尺寸
│   └── useNodeBoundingRect.js # DOM定位
├── utils/              # 工具函数
├── static/             # 静态资源
└── request/            # API请求处理
```

## 🛠️ 开发指南 | Development Guide

### 环境要求 | Requirements
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖 | Install Dependencies
```bash
npm install
```

### 开发模式 | Development Mode
```bash
npm start
# 访问 http://localhost:3000
```

### 生产构建 | Production Build
```bash
npm run build
# 输出到 build/ 目录
```

### 运行测试 | Run Tests
```bash
npm test
```

## 🎯 核心组件详解 | Core Components Deep Dive

### 自定义光标系统 | Custom Cursor System
位于 `src/components/cursor/`，提供全局光标管理：
- 光标上下文提供程序
- 鼠标位置跟踪
- 触摸设备适配
- 自定义光标样式

### R0List 列表系统 | R0List Container System
位于 `src/components/r0List/`，高度可复用的列表容器：
- 动态项目渲染
- 悬停位置追踪
- 动态内容显示
- 子组件通信

### 侧边登录系统 | Side Login System
位于 `src/components/sideLogin/`，完整的认证UI：
- 表单输入组件
- 自定义按钮
- 选项选择器
- 验证逻辑

## 🎨 样式系统 | Styling System

### CSS Modules
所有组件使用 `.module.less` 文件，确保样式隔离：
```javascript
import styles from "./Component.module.less";
```

### LESS 预处理器
支持变量、混合、嵌套等高级特性：
```less
@primary-color: #1890ff;
.button { .primary-button(); }
```

### 路径别名 | Path Aliases
使用 `@` 别名指向 `src/` 目录：
```javascript
import Component from "@/components/Component";
```

## 🔊 音效系统 | Sound System

音效文件位于 `src/static/mp3/`，使用 `use-sound` 库实现：
- 组件级音效控制
- 播放状态管理
- 音效资源优化

## 📱 响应式设计 | Responsive Design

使用 `react-device-detect` 进行设备检测：
- 移动端适配
- 触摸设备优化
- Safari 特殊处理

## 🔄 状态管理 | State Management

使用 MobX 进行状态管理，所有组件使用 observer 模式：
```javascript
import { observer } from "mobx-react-lite";
export default observer(Component);
```

## 🚢 部署 | Deployment

### Docker 部署
```bash
# 构建镜像
docker build -t r0-website .

# 运行容器
docker run -p 3000:3000 r0-website
```

### 静态部署
构建后的文件可直接部署到任何静态文件服务器：
```bash
npm run build
# 部署 build/ 目录到服务器
```

## 🤝 贡献指南 | Contributing

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 更新日志 | Changelog

### v2.1.0 (当前版本)
- 新增自定义光标系统
- 重构组件架构
- 优化移动端体验
- 添加音效系统

## 📞 联系方式 | Contact

- 🌐 官网: [www.shyr0.com](http://www.shyr0.com)
- 📧 邮箱: boogieLing_o@qq.com
- 🐱 GitHub: [R0 Website](https://github.com/your-username/r0website)

## 📄 许可证 | License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

**⭐ If this project helps you, please give it a Star!**