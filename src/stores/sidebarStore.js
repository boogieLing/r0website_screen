import { makeAutoObservable } from 'mobx';

/**
 * 侧边栏状态管理 | Sidebar State Management
 * 处理动态侧边栏宽度和二级菜单展开逻辑
 */
class SidebarStore {
    constructor() {
        makeAutoObservable(this);
    }

    // 侧边栏状态 | Sidebar state
    sidebarWidth = 360; // 默认宽度 | Default width
    isCollapsed = false; // 是否折叠 | Whether collapsed
    expandedTabId = null; // 当前展开的tab ID | Currently expanded tab ID

    // 二级菜单状态 | Submenu state
    subMenuData = null; // 子菜单数据 | Submenu data
    subMenuPosition = { x: 0, y: 0 }; // 子菜单位置 | Submenu position
    isSubMenuVisible = false; // 子菜单是否可见 | Whether submenu is visible

    // 响应式断点 | Responsive breakpoints
    breakpoints = {
        desktop: 360,
        tablet: 280,
        mobileCollapsed: 60, // 折叠状态下的最小宽度
        mobile: '100%'
    };

    /**
     * 设置侧边栏宽度 | Set sidebar width
     */
    setSidebarWidth(width) {
        this.sidebarWidth = width;
    }

    /**
     * 折叠/展开侧边栏 | Collapse/expand sidebar
     */
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
            this.sidebarWidth = this.breakpoints.mobileCollapsed;
        } else {
            this.resetSidebarWidth();
        }
    }

    /**
     * 重置侧边栏宽度 | Reset sidebar width
     */
    resetSidebarWidth() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            this.sidebarWidth = this.breakpoints.mobile;
        } else if (screenWidth <= 768) {
            this.sidebarWidth = this.breakpoints.tablet;
        } else {
            this.sidebarWidth = this.breakpoints.desktop;
        }
    }

    /**
     * 展开tab的二级菜单 | Expand tab's submenu
     */
    expandTabSubMenu(tabId, subMenuItems, triggerElement) {
        this.expandedTabId = tabId;

        if (triggerElement) {
            const rect = triggerElement.getBoundingClientRect();
            this.subMenuPosition = {
                x: rect.right + 10,
                y: rect.top
            };
        }

        this.subMenuData = {
            id: tabId,
            items: subMenuItems
        };

        this.isSubMenuVisible = true;
        // 不再折叠主侧边栏 | No longer collapse main sidebar
    }

    /**
     * 关闭二级菜单 | Close submenu
     */
    closeSubMenu() {
        this.isSubMenuVisible = false;
        this.subMenuData = null;
        this.expandedTabId = null;
        // 不再恢复侧边栏宽度 | No longer restore sidebar width
    }

    /**
     * 切换tab展开状态 | Toggle tab expansion
     */
    toggleTabExpansion(tabId, subMenuItems, triggerElement) {
        if (this.expandedTabId === tabId) {
            this.closeSubMenu();
        } else {
            this.expandTabSubMenu(tabId, subMenuItems, triggerElement);
        }
    }

    /**
     * 处理子菜单项点击 | Handle submenu item click
     */
    handleSubMenuItemClick(subMenuId, subMenuItem) {
        // 关闭子菜单 | Close submenu
        this.closeSubMenu();

        // 可以在这里添加全局状态更新逻辑
        // Global state update logic can be added here
        console.log('Submenu item clicked:', subMenuId, subMenuItem);
    }

    /**
     * 检查指定tab是否展开 | Check if specific tab is expanded
     */
    isTabExpanded(tabId) {
        return this.expandedTabId === tabId;
    }

    /**
     * 获取当前展开的tab数据 | Get current expanded tab data
     */
    getExpandedTabData() {
        return this.subMenuData;
    }

    /**
     * 处理窗口大小变化 | Handle window resize
     */
    handleWindowResize() {
        if (!this.isCollapsed) {
            this.resetSidebarWidth();
        }
    }

    /**
     * 获取响应式侧边栏样式 | Get responsive sidebar styles
     */
    getSidebarStyles() {
        const baseStyles = {
            width: this.sidebarWidth,
            transition: 'width 0.3s ease',
            overflow: 'hidden'
        };

        if (this.isCollapsed) {
            return {
                ...baseStyles,
                width: this.breakpoints.mobileCollapsed
            };
        }

        return baseStyles;
    }

    /**
     * 获取子菜单样式 | Get submenu styles
     */
    getSubMenuStyles() {
        return {
            position: 'fixed',
            left: this.subMenuPosition.x,
            top: this.subMenuPosition.y,
            zIndex: 1000,
            transform: this.isSubMenuVisible ? 'translateX(0)' : 'translateX(-20px)',
            opacity: this.isSubMenuVisible ? 1 : 0,
            transition: 'all 0.3s ease',
            pointerEvents: this.isSubMenuVisible ? 'auto' : 'none'
        };
    }

    /**
     * 清理状态 | Cleanup state
     */
    cleanup() {
        this.closeSubMenu();
        this.isCollapsed = false;
        this.resetSidebarWidth();
    }
}

const sidebarStore = new SidebarStore();
export default sidebarStore;