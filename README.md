# R0 Website 个人网站与博客

基于 React 和 MobX 的个人网站，包含博客、图片库与多种交互体验模块（Somnium Nexus 摄影集、自定义光标、侧边登录等）。

---

## 技术栈概览

- 前端框架：`React 18`（函数组件 + Hooks）
- 状态管理：`MobX` / `mobx-react-lite`
- 路由：`react-router-dom 6`
- 构建工具：`Create React App` + `CRACO`，支持 `LESS` 与 CSS Modules
- 内容与媒体：`react-markdown`、`react-syntax-highlighter`、多种图片查看与缩放组件

---

## 目录结构（简要）

```bash
src/
├── components/      # 通用组件（光标、列表、登录、按钮、图集等）
├── screens/         # 页面级组件（Home、Blog、PicBed、SomniumNexus 等）
├── stores/          # MobX Store（全局状态、主题、图片库、SomniumNexus 等）
├── hooks/           # 自定义 Hooks（窗口尺寸、本地存储、图片加载等）
├── request/         # 请求与接口封装
├── utils/           # 工具函数
└── static/          # 静态资源
```

更多架构细节可在 `docs/system/` 中查看相关设计文档。

---

## 开发与构建

### 环境要求
- Node.js >= 14
- npm >= 6（或使用 `yarn`）

### 常用命令
```bash
# 安装依赖
npm install

# 本地开发，默认 http://localhost:3000
npm start

# 生产构建，输出到 build/
npm run build

# 运行测试（Jest + React Testing Library）
npm test
```

---

## 核心功能模块

- 自定义光标系统：位于 `src/components/cursor/`，包含全局光标状态管理与多种光标样式。
- R0List 容器系统：位于 `src/components/r0List/`，用于高性能列表与交互容器。
- 侧边登录系统：位于 `src/components/sideLogin/`，提供登录表单、按钮与选项控制。
- Somnium Nexus 摄影集：位于 `src/screens/SomniumNexus/`，支持两列布局、Tab 导航、渐进式图片加载与骨架屏。

---

## 部署

### Docker 部署
```bash
# 构建镜像
docker build -t r0-website .

# 运行容器
docker run -p 3000:3000 r0-website
```

### 静态部署
```bash
npm run build
# 部署 build/ 目录到任意静态资源服务器
```

---

## 文档与贡献

- 所有文档统一存放在 `docs/` 目录：
  - `docs/README.md`：文档总览与索引入口。
  - `docs/system/`：系统设计与 Somnium Nexus 相关说明。
  - `docs/tests/`：交互与样式相关的测试记录。
  - `docs/agents/`：智能助手与协作说明。
- 贡献者请先阅读根目录 `AGENTS.md`，了解代码风格、提交流程与中文优先等要求。

## Performance Considerations | 性能考量

### Bundle Optimization | 包优化
- **Route-based code splitting** with React.lazy() and Suspense
- **Tree shaking** eliminates unused modules during production builds
- **Dynamic imports** for non-critical components reduce initial payload
- **Vendor chunk separation** for optimal caching strategies

### Runtime Performance | 运行时性能
- **Virtual scrolling** in list components handles 10k+ items efficiently
- **Intersection Observer API** for viewport-based lazy loading
- **Debounced resize handlers** prevent layout thrashing
- **Memoized computations** with useMemo and useCallback hooks

### Image Optimization Pipeline | 图片优化管道
- **Progressive JPEG loading** with blur-up technique
- **WebP format detection** with automatic fallbacks
- **Responsive image sets** with srcset and sizes attributes
- **Skeleton placeholders** eliminate layout shift during loading

### Animation Performance | 动画性能
- **GPU-accelerated transforms** using translate3d() and will-change
- **RequestAnimationFrame** for smooth 60fps animations
- **CSS containment** isolates paint boundaries
- **Transform compositing** avoids triggering reflows

### Memory Management | 内存管理
- **Event listener cleanup** in useEffect return functions
- **Observer disconnection** for Intersection and Resize observers
- **Store unsubscribe patterns** prevent memory leaks
- **Component unmount optimization** clears timers and async operations

### Network Optimization | 网络优化
- **HTTP/2 multiplexing** for parallel resource loading
- **Resource preloading** with rel="preload" hints
- **Service Worker caching** strategies for offline functionality
- **Compression algorithms** (gzip/brotli) reduce transfer sizes by 70%+

### Rendering Performance | 渲染性能
- **React.memo** prevents unnecessary re-renders
- **Virtual DOM optimization** through key prop strategies
- **Batch state updates** minimize render cycles
- **PureComponent implementation** where applicable

---

## Browser Support | 浏览器支持

### Modern Browsers
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

### Progressive Enhancement
Core functionality maintained across all supported browsers with graceful degradation for advanced features.

---

## Contact | 联系方式

- **Website**: [www.shyr0.com](http://www.shyr0.com)
- **Email**: ushouldknowr0@gmail.com
- **GitHub**: [R0 Website](https://github.com/boogieLing/r0website_screen)

---

## License | 许可证

MIT License - see [LICENSE](LICENSE) file for details.

---

*Engineered for performance, designed for elegance.*
*为性能而生，为优雅而设计。*
