import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import AbstractTab from '@/components/AbstractTab/AbstractTab';
import sidebarStore from '@/stores/sidebarStore';
import somniumNexusStore from '@/stores/somniumNexusStore';
import styles from './SubMenuSidebar.module.less';

/**
 * 二级菜单侧边栏组件 | Submenu Sidebar Component
 * 当主tab展开时显示二级菜单，放在主侧栏右边
 */
const SubMenuSidebar = observer(({ className = '' }) => {
    const sidebarRef = useRef(null);
    const subMenuData = sidebarStore.getExpandedTabData();
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    useEffect(() => {
        // 添加点击外部关闭功能 | Add click outside to close functionality
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                // 检查是否点击的是主tab | Check if clicking main tab
                const clickedTab = event.target.closest('[data-tab-id]');
                if (!clickedTab || clickedTab.dataset.tabId !== sidebarStore.expandedTabId) {
                    sidebarStore.closeSubMenu();
                }
            }
        };

        // 添加ESC键关闭功能 | Add ESC key to close functionality
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                sidebarStore.closeSubMenu();
            }
        };

        if (sidebarStore.isSubMenuVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [sidebarStore.isSubMenuVisible]);

    // 处理子菜单项点击 | Handle submenu item click
    const handleSubMenuItemClick = (tabId, subMenuId, subMenuItem) => {
        // AbstractTab的onSubMenuClick会传递三个参数：tabId, subMenuId, subMenuItem
        // 我们需要的是subMenuId来设置选中状态
        const actualSubMenuId = subMenuId || tabId;
        setSelectedSubCategory(actualSubMenuId);

        // 执行相应的操作 | Perform corresponding action
        if (subMenuItem && subMenuItem.action) {
            subMenuItem.action();
        }

        console.log('Submenu item clicked:', actualSubMenuId, subMenuItem);

        // 可以在这里添加导航或其他逻辑 | Can add navigation or other logic here
    };

    // 渲染子菜单内容 | Render submenu content
    const renderSubMenuContent = () => {
        if (!subMenuData || !subMenuData.items) return null;

        return (
            <div className={styles.subMenuContent}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.mainTitle}>
                        {subMenuData.title || somniumNexusStore.galleryCategories[subMenuData.id]?.title || '子菜单'}
                    </h1>
                    <p className={styles.subtitle}>子分类 | Sub Categories</p>
                </div>

                <div className={styles.projectTabs}>
                    <div className={styles.tabsFlow}>
                        {subMenuData.items.map((item, index) => {
                            const isSelected = selectedSubCategory === (item.id || index);
                            const hasSubSubmenu = item.subMenuItems && item.subMenuItems.length > 0;

                            return (
                                <React.Fragment key={item.id || index}>
                                    <AbstractTab
                                        id={item.id || index}
                                        title={item.title}
                                        type={hasSubSubmenu ? 'expandable' : 'simple'}
                                        isSelected={isSelected}
                                        hasSubmenu={hasSubSubmenu}
                                        subMenuItems={item.subMenuItems || []}
                                        onClick={(tabId, tabData) => {
                                            const { hasSubmenu, subMenuItems } = tabData;
                                            if (hasSubmenu && subMenuItems && subMenuItems.length > 0) {
                                                // 如果有三级菜单，可以在这里处理
                                                console.log('三级菜单展开:', subMenuItems);
                                            } else {
                                                // 直接点击tab项，使用tabId作为选中标识
                                                handleSubMenuItemClick(tabId, tabId, item);
                                            }
                                        }}
                                        onSubMenuClick={handleSubMenuItemClick}
                                        className={styles.projectTab}
                                    />
                                    {index < subMenuData.items.length - 1 && (
                                        <span className={styles.tabSeparator}> / </span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    if (!sidebarStore.isSubMenuVisible) {
        return null;
    }

    return (
        <aside
            ref={sidebarRef}
            className={`${styles.subMenuSidebar} ${sidebarStore.isSubMenuVisible ? styles.visible : ''} ${className}`}
            style={{
                left: sidebarStore.sidebarWidth, // 放在主侧栏右边
                width: 280 // 固定宽度
            }}
        >
            <div className={styles.subMenuContainer}>
                {renderSubMenuContent()}
            </div>

            {/* 关闭按钮 | Close button */}
            <button
                className={styles.closeButton}
                onClick={() => sidebarStore.closeSubMenu()}
                aria-label="关闭子菜单"
            >
                ×
            </button>
        </aside>
    );
});

export default SubMenuSidebar;