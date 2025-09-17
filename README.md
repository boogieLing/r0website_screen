# R0 Website - Personal Portfolio & Blog

A React-based personal website featuring blog, image gallery, and interactive functionality.
基于 React 的个人网站，包含博客、图片库和交互功能。

---

## Technical Overview | 技术概览

### Core Architecture | 核心架构
- **React 18.2.0** - Modern functional components with hooks
- **MobX 6.6.2** - Efficient state management with observable pattern
- **React Router DOM 6.4.2** - Declarative routing with dynamic parameters
- **CRACO** - Enhanced Create React App configuration with LESS support

### Development Stack | 开发栈
- **LESS** - CSS preprocessor with variables and mixins
- **CSS Modules** - Scoped styling with hash-based class names
- **Masonic** - High-performance masonry layout for image galleries
- **use-sound** - Interactive audio feedback system

### Content Processing | 内容处理
- **React Markdown** - Markdown rendering with custom components
- **react-syntax-highlighter** - Code syntax highlighting with themes
- **react-image-zooom** - Smooth image zoom and pan functionality

---

## Project Structure | 项目结构

```
src/
├── components/          # Reusable UI components | 可复用UI组件
│   ├── cursor/         # Custom cursor system | 自定义光标系统
│   ├── r0List/         # Advanced list container | 高级列表容器
│   ├── sideLogin/      # Authentication interface | 认证界面
│   ├── button/         # Button component collection | 按钮组件集
│   ├── scrollBars/     # Custom scrollbar implementations | 自定义滚动条
│   ├── template/       # Layout templates | 布局模板
│   ├── sortController/ # Data sorting controls | 数据排序控制
│   ├── filingInfo/     # File metadata display | 文件元信息展示
│   ├── win10GridBox/   # Windows-style grid layout | Win10风格网格
│   ├── InfiniteGallery/ # Masonry image gallery | 瀑布流图集
│   └── SkeletonImage/  # Elegant loading placeholders | 优雅加载占位
├── screens/            # Page-level components | 页面级组件
│   ├── Home/           # Homepage with dynamic background | 动态背景主页
│   ├── Blog/           # Blog system with categories | 分类博客系统
│   ├── PicBed/         # Image management interface | 图片管理界面
│   ├── SomniumNexus/   # Minimalist photography portfolio | 极简摄影集
│   ├── More/           # Additional content pages | 附加内容页面
│   └── Test/           # Development testing | 开发测试
├── stores/             # MobX state management | MobX状态管理
│   ├── globalStore.js  # Application-wide state | 应用级状态
│   ├── colorStore.js   # Theme management | 主题管理
│   ├── osuStore.js     # OSU integration | OSU集成
│   ├── picBedStore.js  # Image gallery state | 图片库状态
│   ├── curPostStore.js # Current post management | 当前文章管理
│   ├── cursorTipsStore.js # Cursor tooltip state | 光标提示状态
│   └── somniumNexusStore.js # Photography portfolio state | 摄影集状态
├── hooks/              # Custom React hooks | 自定义React钩子
│   ├── localStorage.js # Persistent storage | 持久化存储
│   ├── windowSize.js   # Viewport dimensions | 视口尺寸
│   ├── useNodeBoundingRect.js # DOM positioning | DOM定位
│   └── useImageLoader.js # Progressive image loading | 渐进式图片加载
├── utils/              # Utility functions | 工具函数
├── static/             # Static assets | 静态资源
└── request/            # API request handling | API请求处理
```

---

## Development Guide | 开发指南

### Prerequisites | 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### Installation | 安装依赖
```bash
npm install
```

### Development | 开发模式
```bash
npm start
# Access at http://localhost:3000 | 访问 http://localhost:3000
```

### Production Build | 生产构建
```bash
npm run build
# Output to build/ directory | 输出到 build/ 目录
```

### Testing | 测试
```bash
npm test
```

---

## Core Systems | 核心系统

### Custom Cursor Architecture | 自定义光标架构
Located in `src/components/cursor/`. Global cursor management with:
- Context-based state distribution
- Mouse position tracking with throttling
- Touch device detection and fallbacks
- Custom cursor styling and animations

### R0List Container System | R0List容器系统
Located in `src/components/r0List/`. High-performance list container featuring:
- Dynamic item rendering with virtualization
- Hover-based position tracking
- Dynamic content display
- Child component communication patterns

### Side Login System | 侧边登录系统
Located in `src/components/sideLogin/`. Complete authentication interface:
- Form input components with validation
- Custom button implementations
- Option selection controls
- Integrated validation logic

### Somnium Nexus Photography Portfolio | Somnium Nexus摄影集
Located in `src/screens/SomniumNexus/`. Minimalist photography portfolio inspired by rinkokawauchi.com:
- Two-column layout with fixed sidebar
- Borderless tab navigation
- Sophisticated color logic (low-key unselected, gradient hover, animated selected)
- True left-to-right flexbox gallery layout
- Elegant skeleton loading with graceful error handling

---

## Styling Architecture | 样式架构

### CSS Modules Implementation
All components utilize `.module.less` files for scoped styling:
```javascript
import styles from "./Component.module.less";
```

### LESS Preprocessor Features
Advanced CSS capabilities including:
```less
@primary-color: #1890ff;
@spacing-unit: 8px;

.button {
  .primary-button();
  margin: @spacing-unit * 2;
}
```

### Path Resolution
Standardized import aliases using `@` for src directory:
```javascript
import Component from "@/components/Component";
import Store from "@/stores/store";
```

---

## State Management | 状态管理

### MobX Integration
All components implement observer pattern for reactive updates:
```javascript
import { observer } from "mobx-react-lite";
export default observer(Component);
```

### Store Architecture
Modular state management with clear separation of concerns:
- **Global Store**: Application-wide state and configuration
- **Feature Stores**: Domain-specific state (blog, gallery, authentication)
- **UI Stores**: Interface state (cursors, themes, notifications)

---

## Deployment | 部署

### Docker Deployment | Docker部署
```bash
# Build image | 构建镜像
docker build -t r0-website .

# Run container | 运行容器
docker run -p 3000:3000 r0-website
```

### Static Deployment | 静态部署
Build artifacts suitable for any static file server:
```bash
npm run build
# Deploy build/ directory | 部署 build/ 目录
```

---

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