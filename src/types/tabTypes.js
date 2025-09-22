/**
 * Tab类型枚举定义
 * 用于区分不同类型的Tab组件
 */

export const TabType = {
  // 项目分类Tab - 用于内容导航和展示
  PROJECT_CATEGORY: 'project-category',

  // 操作分类Tab - 用于系统操作和功能执行
  ACTION_CATEGORY: 'action-category',

  // 子菜单Tab - 用于二级菜单项
  SUB_MENU: 'sub-menu'
};

/**
 * TabWrapper类型枚举 - 用于样式区分
 */
export const TabWrapperType = {
  // 项目分类Tab的包装器
  PROJECT_WRAPPER: 'project-wrapper',

  // 操作分类Tab的包装器
  ACTION_WRAPPER: 'action-wrapper',

  // 子菜单Tab的包装器
  SUBMENU_WRAPPER: 'submenu-wrapper'
};

/**
 * Tab组件类型枚举 - 用于组件行为区分
 */
export const TabComponentType = {
  // 简单Tab - 无子菜单
  SIMPLE: 'simple',

  // 可展开Tab - 有子菜单
  EXPANDABLE: 'expandable',

  // 带次级菜单Tab
  WITH_SUBMENU: 'with-submenu'
};

/**
 * 获取Tab类型的显示名称
 * @param {string} tabType - Tab类型
 * @returns {string} 显示名称
 */
export function getTabTypeDisplayName(tabType) {
  const displayNames = {
    [TabType.PROJECT_CATEGORY]: '项目分类',
    [TabType.ACTION_CATEGORY]: '操作分类',
    [TabType.SUB_MENU]: '子菜单'
  };

  return displayNames[tabType] || '未知类型';
}

/**
 * 判断是否为操作类型的Tab
 * @param {string} tabType - Tab类型
 * @returns {boolean} 是否为操作类型
 */
export function isActionTab(tabType) {
  return tabType === TabType.ACTION_CATEGORY;
}

/**
 * 判断是否为项目类型的Tab
 * @param {string} tabType - Tab类型
 * @returns {boolean} 是否为项目类型
 */
export function isProjectTab(tabType) {
  return tabType === TabType.PROJECT_CATEGORY;
}