# CLAUDE.md

必须遵循的原则，Claude Code 的回复、生成的注释、文档，全部使用中文。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

此文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## Project Overview

这是一个基于 React 的个人网站 (r0website_screen v2.1.0)，包含博客、图片库和交互功能。项目使用 CRACO 进行构建配置，使用 MobX 进行状态管理。

This is a React-based personal website (r0website_screen v2.1.0) with blog, image gallery, and interactive features. The project uses CRACO for build configuration and MobX for state management.

## Development Commands

### 主项目 (React + CRACO)
- **开发**: `npm start` - 启动开发服务器，访问 http://localhost:3000
- **构建**: `npm run build` - 在 `build/` 目录创建生产构建
- **测试**: `npm test` - 运行测试套件

### Main Project (React + CRACO)
- **Development**: `npm start` - Starts development server on http://localhost:3000
- **Build**: `npm run build` - Creates production build in `build/` directory
- **Test**: `npm test` - Runs test suite

### 次要项目 (React + Vite，位于 react-mobx/)
- **开发**: `cd react-mobx && npm run dev`
- **构建**: `cd react-mobx && npm run build`

### Secondary Project (React + Vite in react-mobx/)
- **Development**: `cd react-mobx && npm run dev`
- **Build**: `cd react-mobx && npm run build`

## Architecture

### 状态管理
- **MobX** 存储位于 `src/stores/`：
  - `globalStore.js` - 全局应用状态、光标管理、画布处理
  - `colorStore.js` - 颜色/主题状态
  - `osuStore.js` - OSU 相关功能
  - `picBedStore.js` - 图片库状态
  - `curPostStore.js` - 当前博客文章状态
  - `cursorTipsStore.js` - 光标提示状态

### State Management
- **MobX** stores in `src/stores/`:
  - `globalStore.js` - Global app state, cursor management, canvas handling
  - `colorStore.js` - Color/theme state
  - `osuStore.js` - OSU-related functionality
  - `picBedStore.js` - Image gallery state
  - `curPostStore.js` - Current blog post state
  - `cursorTipsStore.js` - Cursor tooltip state

### 路由结构
主路由定义在 `src/App.js` 中：
- `/` - 带动态背景的主页
- `/blog` - 博客主页
- `/blog/:id` - 单个博客文章
- `/category/:categoryName` - 博客分类
- `/category/:categoryName/:id` - 分类文章
- `/more` - 额外内容/关于页面
- `/colorful` - 图片库 (PicBed)
- `/colorful/:categoryName` - 图片分类
- `/test` - 测试页面

### Routing Structure
Main routes defined in `src/App.js`:
- `/` - Homepage with dynamic background
- `/blog` - Blog main page
- `/blog/:id` - Individual blog post
- `/category/:categoryName` - Blog category
- `/category/:categoryName/:id` - Category post
- `/more` - Additional content/about
- `/colorful` - Image gallery (PicBed)
- `/colorful/:categoryName` - Image category
- `/test` - Test page

### 关键组件
- **自定义光标系统** (`src/components/cursor/`) - 带上下文提供程序的交互式光标
- **r0List** (`src/components/r0List/`) - 带悬停定位的自定义列表实现
- **侧边登录** (`src/components/sideLogin/`) - 身份验证 UI 组件
- **动态背景** (`src/screens/Home/dynamicBackground.js`) - 主页背景效果

### Key Components
- **Custom Cursor System** (`src/components/cursor/`) - Interactive cursor with context provider
- **r0List** (`src/components/r0List/`) - Custom list implementation with hover positioning
- **Side Login** (`src/components/sideLogin/`) - Authentication UI components
- **Dynamic Background** (`src/screens/Home/dynamicBackground.js`) - Homepage background effects

### 样式
- **LESS** 预处理器与 CSS 模块
- 路径别名：`@` 映射到 `src/` 目录
- CSS 模块生成带哈希的类名：`[local]_[hash:base64:5]`

### Styling
- **LESS** preprocessor with CSS modules
- Path alias: `@` maps to `src/` directory
- CSS modules generate class names with hash: `[local]_[hash:base64:5]`

### 构建配置
- **CRACO** 配置在 `craco.config.js` 中，支持 LESS
- **jsconfig.json** 为 IDE 提供路径映射支持
- 使用 `react-scripts` 5.0.1 作为基础

### Build Configuration
- **CRACO** configuration in `craco.config.js` with LESS support
- **jsconfig.json** provides path mapping for IDE support
- Uses `react-scripts` 5.0.1 as base

## 开发注意事项

### 路径解析
始终使用 `@` 别名从 src 目录导入：
```javascript
import Component from "@/components/Component";
import Store from "@/stores/store";
```

### 状态管理模式
组件使用 `mobx-react-lite` 观察者模式：
```javascript
import { observer } from "mobx-react-lite";
export default observer(Component);
```

### 设备检测
使用 `react-device-detect` 进行移动设备/Safari 检测，带自定义光标回退。

### 自定义钩子
位于 `src/hooks/`：
- `useWindowSize()` - 窗口尺寸跟踪
- `useLocalStorage()` - 本地存储管理
- `useNodeBoundingRect()` - DOM 元素定位

### Docker 支持
- `Dockerfile` - 使用 serve 的生产构建
- `screen.Dockerfile` - 替代配置

## Development Notes

### Path Resolution
Always use `@` alias for imports from src directory:
```javascript
import Component from "@/components/Component";
import Store from "@/stores/store";
```

### State Management Pattern
Components use `mobx-react-lite` observer pattern:
```javascript
import { observer } from "mobx-react-lite";
export default observer(Component);
```

### Device Detection
Uses `react-device-detect` for mobile/safari detection with custom cursor fallback.

### Custom Hooks
Located in `src/hooks/`:
- `useWindowSize()` - Window dimensions tracking
- `useLocalStorage()` - Local storage management
- `useNodeBoundingRect()` - DOM element positioning

### Docker Support
- `Dockerfile` - Production build with serve
- `screen.Dockerfile` - Alternative configuration

## 详细组件架构分析

### 核心组件系统

#### 1. 自定义光标系统 (`src/components/cursor/`)
这是一个完整的光标管理系统，包含：
- **CursorContextProvider**: 全局光标状态管理
- **Cursor**: 可视化光标组件，支持自定义样式和动画
- **useCursorHandlers**: 光标事件处理钩子
- **useMousePosition**: 鼠标位置跟踪
- **isTouchDevice**: 触摸设备检测

#### 2. R0List 容器系统 (`src/components/r0List/`)
高度可复用的列表容器组件：
- **R0List**: 主容器，支持动态项目和悬停效果
- **SayMyPosition**: 子组件，用于显示位置信息
- 实现悬停时的位置追踪和动态内容显示

#### 3. 侧边登录系统 (`src/components/sideLogin/`)
完整的身份验证UI组件集：
- **SideLogin**: 主登录容器
- **InputItem**: 表单输入组件
- **ButtonItem**: 自定义按钮组件
- **OptionItem**: 选项选择组件

### 辅助组件系统

#### 4. 按钮组件 (`src/components/button/`)
可复用的按钮组件集合，包含多种样式和状态。

#### 5. 滚动条系统 (`src/components/scrollBars/`)
自定义滚动条实现，提供更美观的滚动体验。

#### 6. 模板组件 (`src/components/template/`)
通用模板组件，用于快速构建标准布局。

#### 7. 排序控制器 (`src/components/sortController/`)
数据排序和筛选的控制组件。

#### 8. 文件信息组件 (`src/components/filingInfo/`)
文件元信息展示组件。

#### 9. Win10 网格框 (`src/components/win10GridBox/`)
Windows 10 风格的网格布局组件。

### 屏幕级组件 (Screens)

#### 主页组件 (`src/screens/Home/`)
- **index.js**: 主页主组件
- **dynamicBackground.js**: 动态背景系统

#### 博客系统 (`src/screens/Blog/`)
完整的博客功能实现，支持文章列表、分类、详情页。

#### 图片库 (`src/screens/PicBed/`)
图片管理和展示系统，支持分类和缩放功能。

### 组件关系与数据流

#### 状态管理集成
组件通过 `mobx-react-lite` 的 `observer` 模式与 MobX 存储集成：
```javascript
import { observer } from "mobx-react-lite";
export default observer(Component);
```

#### 上下文系统
- **CursorContext**: 全局光标状态共享
- **组件间通信**: 通过 MobX stores 进行状态共享

####  Props 传递模式
- **R0List**: 通过 children 传递子组件
- **SideLogin**: 通过 props 传递配置和回调函数
- **模板组件**: 通过 props 传递内容和样式配置

### 样式系统架构

#### CSS Modules 使用
- 所有组件使用 `.module.less` 文件
- 类名自动生成格式：`[local]_[hash:base64:5]`
- 避免样式冲突，实现组件隔离

#### 动态样式
- 内联样式用于动画和动态效果
- CSS 变量用于主题切换
- 计算属性用于响应式样式

### 音效集成架构

#### 音效系统
- 使用 `use-sound` 库
- 音效文件存储在 `src/static/mp3/`
- 组件级音效控制，支持播放状态管理

### 组件复用性评估

#### 高复用性组件
- **R0List**: 通用列表容器，可用于任何列表展示
- **Cursor System**: 全局光标管理，适用于整个应用
- **Button Components**: 标准按钮集合，多种样式可选
- **Template Components**: 布局模板，快速构建页面

#### 中等复用性组件
- **SideLogin**: 认证专用，但可配置不同模式
- **ScrollBars**: 滚动优化，适用于需要自定义滚动的区域
- **SortController**: 数据处理，适用于需要排序功能的列表

#### 特定功能组件
- **Win10GridBox**: 特定风格布局
- **FilingInfo**: 元信息展示，特定场景使用

### 架构优势

1. **模块化设计**: 组件职责单一，易于维护和测试
2. **高内聚低耦合**: 组件间依赖关系清晰
3. **可扩展性**: 易于添加新组件和功能
4. **类型安全**: 使用 PropTypes 进行运行时类型检查
5. **性能优化**: 使用 React.memo 和 useMemo 进行性能优化

### 开发建议

1. **新组件开发**: 遵循现有模式，使用 CSS Modules 和 observer 模式
2. **状态管理**: 优先考虑使用现有 MobX stores，必要时创建新 store
3. **组件复用**: 优先使用现有高复用性组件，避免重复开发
4. **样式规范**: 使用 LESS 变量和混合，保持样式一致性

## Detailed Component Architecture Analysis

### Core Component Systems

#### 1. Custom Cursor System (`src/components/cursor/`)
A comprehensive cursor management system featuring:
- **CursorContextProvider**: Global cursor state management
- **Cursor**: Visual cursor component with custom styling and animations
- **useCursorHandlers**: Cursor event handling hooks
- **useMousePosition**: Mouse position tracking
- **isTouchDevice**: Touch device detection

#### 2. R0List Container System (`src/components/r0List/`)
Highly reusable list container components:
- **R0List**: Main container with dynamic items and hover effects
- **SayMyPosition**: Child component for displaying position information
- Implements hover-based position tracking and dynamic content display

#### 3. Side Login System (`src/components/sideLogin/`)
Complete authentication UI component set:
- **SideLogin**: Main login container
- **InputItem**: Form input components
- **ButtonItem**: Custom button components
- **OptionItem**: Option selection components

### Auxiliary Component Systems

#### 4. Button Components (`src/components/button/`)
Reusable button component collection with multiple styles and states.

#### 5. Scrollbar System (`src/components/scrollBars/`)
Custom scrollbar implementation for enhanced visual scrolling experience.

#### 6. Template Components (`src/components/template/`)
Generic template components for rapid standard layout construction.

#### 7. Sort Controller (`src/components/sortController/`)
Data sorting and filtering control components.

#### 8. Filing Info (`src/components/filingInfo/`)
File metadata display components.

#### 9. Win10 Grid Box (`src/components/win10GridBox/`)
Windows 10-style grid layout components.

### Screen-Level Components (Screens)

#### Home Components (`src/screens/Home/`)
- **index.js**: Main homepage component
- **dynamicBackground.js**: Dynamic background system

#### Blog System (`src/screens/Blog/`)
Complete blog functionality with article lists, categories, and detail pages.

#### Image Gallery (`src/screens/PicBed/`)
Image management and display system with categorization and zoom features.

### Component Relationships and Data Flow

#### State Management Integration
Components integrate with MobX stores through `mobx-react-lite` observer pattern:
```javascript
import { observer } from "mobx-react-lite";
export default observer(Component);
```

#### Context System
- **CursorContext**: Global cursor state sharing
- **Component Communication**: State sharing through MobX stores

#### Props Passing Patterns
- **R0List**: Child components passed through children
- **SideLogin**: Configuration and callbacks passed through props
- **Template Components**: Content and style configuration through props

### Styling System Architecture

#### CSS Modules Usage
- All components use `.module.less` files
- Class names auto-generated format: `[local]_[hash:base64:5]`
- Prevents style conflicts, achieves component isolation

#### Dynamic Styles
- Inline styles for animations and dynamic effects
- CSS variables for theme switching
- Computed properties for responsive styles

### Sound Integration Architecture

#### Sound System
- Uses `use-sound` library
- Sound files stored in `src/static/mp3/`
- Component-level sound control with playback state management

### Component Reusability Assessment

#### High Reusability Components
- **R0List**: Universal list container for any list display
- **Cursor System**: Global cursor management for entire application
- **Button Components**: Standard button collection with multiple styles
- **Template Components**: Layout templates for rapid page construction

#### Medium Reusability Components
- **SideLogin**: Authentication-specific but configurable for different modes
- **ScrollBars**: Scroll optimization for areas requiring custom scrolling
- **SortController**: Data processing for lists requiring sorting functionality

#### Specific Function Components
- **Win10GridBox**: Specific style layout
- **FilingInfo**: Metadata display for specific scenarios

### Architecture Advantages

1. **Modular Design**: Single component responsibility, easy maintenance and testing
2. **High Cohesion Low Coupling**: Clear component dependency relationships
3. **Extensibility**: Easy to add new components and features
4. **Type Safety**: Runtime type checking using PropTypes
5. **Performance Optimization**: Performance optimization using React.memo and useMemo

### Development Recommendations

1. **New Component Development**: Follow existing patterns, use CSS Modules and observer pattern
2. **State Management**: Prioritize existing MobX stores, create new stores when necessary
3. **Component Reuse**: Prioritize existing high-reusability components, avoid duplicate development
4. **Styling Standards**: Use LESS variables and mixins, maintain style consistency