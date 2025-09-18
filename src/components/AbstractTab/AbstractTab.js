import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './AbstractTab.module.less';

/**
 * 抽象Tab组件 - 支持不同类型和二级菜单
 * Abstract Tab Component - Supports different types and sub-menus
 */
const AbstractTab = observer(({
    id,
    title,
    type = 'simple', // simple, expandable, with-submenu
    isSelected = false,
    hasSubmenu = false,
    subMenuItems = [],
    onClick,
    onSubMenuClick,
    className = '',
    children
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // 处理点击事件
    const handleClick = useCallback((e) => {
        e.preventDefault();

        if (type === 'expandable' && hasSubmenu) {
            setIsExpanded(!isExpanded);
        }

        if (onClick) {
            onClick(id, { hasSubmenu, subMenuItems });
        }
    }, [id, type, hasSubmenu, subMenuItems, isExpanded, onClick]);

    // 处理子菜单点击
    const handleSubMenuClick = useCallback((subMenuId, subMenuItem) => {
        if (onSubMenuClick) {
            onSubMenuClick(id, subMenuId, subMenuItem);
        }
        // 选中子菜单后关闭展开状态
        setIsExpanded(false);
    }, [id, onSubMenuClick]);

    // 根据类型确定组件类名
    const getTabClassName = () => {
        let classNames = [styles.abstractTab];

        if (isSelected) {
            classNames.push(styles.active);
        }

        switch (type) {
            case 'expandable':
                classNames.push(styles.expandable);
                break;
            case 'with-submenu':
                classNames.push(styles.withSubmenu);
                break;
            default:
                classNames.push(styles.simple);
        }

        if (isExpanded) {
            classNames.push(styles.expanded);
        }

        if (hasSubmenu) {
            classNames.push(styles.hasSubmenu);
        }

        if (className) {
            classNames.push(className);
        }

        return classNames.join(' ');
    };

    return (
        <div
            className={getTabClassName()}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e);
                }
            }}
        >
            {/* 主标签内容 */}
            <div className={styles.tabContent}>
                <span className={styles.tabText} data-active={isSelected}>
                    {title}
                </span>
                {hasSubmenu && (
                    <span className={styles.submenuIndicator}>
                        {isExpanded ? '▲' : '▼'}
                    </span>
                )}
                {children}
            </div>

            {/* 子菜单内容 */}
            {hasSubmenu && isExpanded && (
                <div className={styles.subMenu}>
                    {subMenuItems.map((item, index) => (
                        <div
                            key={`${id}-submenu-${item.id || index}`}
                            className={styles.subMenuItem}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSubMenuClick(item.id || index, item);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSubMenuClick(item.id || index, item);
                                }
                            }}
                        >
                            <span className={styles.subMenuText}>
                                {item.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default AbstractTab;